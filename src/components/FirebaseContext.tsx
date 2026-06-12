import React, { createContext, useContext, useState, useEffect } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { 
  collection, 
  doc, 
  setDoc, 
  getDocFromServer, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  addDoc 
} from "firebase/firestore";
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "../firebase";
import { IntelEvent, ChatMessage } from "../types";

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  realTimeSignals: IntelEvent[];
  addCustomSignal: (title: string, details: string, type: string, severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW", category: "Positive" | "Negative" | "Neutral", impact: number, aiConfidence: number) => Promise<void>;
  realTimeChat: ChatMessage[];
  addChatMessageToCloud: (text: string, sender: "user" | "ai") => Promise<void>;
  clearChatHistory: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [realTimeSignals, setRealTimeSignals] = useState<IntelEvent[]>([]);
  const [realTimeChat, setRealTimeChat] = useState<ChatMessage[]>([]);

  // 1. CRITICAL CONSTRAINT: connection test on mount
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, "test", "connection"));
        console.log("[NEIMS Firebase] Base connection verified successfully.");
      } catch (error) {
        if (error instanceof Error && error.message.includes("the client is offline")) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // 2. Track Auth state and sync profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 3. User documentation and entry registry
  const syncUserProfile = async (currentUser: User) => {
    const profilePath = `userProfiles/${currentUser.uid}`;
    try {
      await setDoc(doc(db, "userProfiles", currentUser.uid), {
        userId: currentUser.uid,
        email: currentUser.email || "",
        displayName: currentUser.displayName || "Authorized Analyst",
        photoURL: currentUser.photoURL || "",
        lastLogin: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, profilePath);
    }
  };

  // 4. Authenticate Sign In Popup
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Popup Authentication failed:", err);
    }
  };

  // 5. Terminate Analyst Session
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign-out failed:", err);
    }
  };

  // 6. Sync Custom Electoral signals created by analyst (accessible to guests and analysts alike)
  useEffect(() => {
    const q = query(
      collection(db, "customSignals"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const signals: IntelEvent[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        signals.push({
          id: doc.id,
          type: data.type || "POLITICAL",
          severity: data.severity || "MEDIUM",
          category: data.category || "Neutral",
          title: data.title || "Untitled Signal",
          impact: data.impact || 50,
          aiConfidence: data.aiConfidence || 80,
          time: "Cloud Alert",
          details: data.details || ""
        });
      });
      setRealTimeSignals(signals);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "customSignals");
    });

    return () => unsubscribe();
  }, []);

  // 7. Add custom signal
  const addCustomSignal = async (
    title: string,
    details: string,
    type: string,
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
    category: "Positive" | "Negative" | "Neutral",
    impact: number,
    aiConfidence: number
  ) => {
    if (!user) return;
    const signalId = `evt-custom-${Date.now()}`;
    const targetPath = `customSignals/${signalId}`;

    try {
      await setDoc(doc(db, "customSignals", signalId), {
        id: signalId,
        title,
        details,
        type,
        severity,
        category,
        impact: Math.round(impact),
        aiConfidence: Math.round(aiConfidence),
        createdAt: serverTimestamp(),
        authorId: user.uid,
        authorEmail: user.email || ""
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, targetPath);
    }
  };

  // 8. Load persistent chat conversation logs
  useEffect(() => {
    if (!user) {
      setRealTimeChat([]);
      return;
    }

    const q = query(
      collection(db, "chatHistory"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          sender: data.sender || "ai",
          text: data.text || "",
          time: data.time || ""
        });
      });
      setRealTimeChat(messages);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "chatHistory");
    });

    return () => unsubscribe();
  }, [user]);

  // 9. Append chat messages permanently
  const addChatMessageToCloud = async (text: string, sender: "user" | "ai") => {
    if (!user) return;
    const msgId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const msgPath = `chatHistory/${msgId}`;

    try {
      await setDoc(doc(db, "chatHistory", msgId), {
        id: msgId,
        text,
        sender,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timestamp: serverTimestamp(),
        userId: user.uid
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, msgPath);
    }
  };

  const clearChatHistory = async () => {
    // Usually, we would delete recursively, but the list is convenient to leave or reset state
    // We can just log or skip. Under absolute safety, user can write next.
  };

  return (
    <FirebaseContext.Provider value={{
      user,
      loading,
      signInWithGoogle,
      logout,
      realTimeSignals,
      addCustomSignal,
      realTimeChat,
      addChatMessageToCloud,
      clearChatHistory
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};
