import React, { useState, useEffect, useRef } from "react";
import { 
  Cpu, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  TrendingUp, 
  Send,
  Loader,
  Brain,
  MessageSquare,
  Lock,
  User,
  ShieldCheck
} from "lucide-react";
import { Party, ChatMessage } from "../types";
import { useFirebase } from "./FirebaseContext";

export default function ExplainableSection() {
  const { user, realTimeChat, addChatMessageToCloud } = useFirebase();
  const [aiReport, setAiReport] = useState<string>("");
  const [loadingReport, setLoadingReport] = useState<boolean>(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "ai", text: "Hello Ella. I am your NEIMS Senior Political Analyst. I have processed 2.4 million data points and current economic pressure spikes. How can I help you query the state-by-state forecasting indices today?", time: "11:45 AM" }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [sendingChat, setSendingChat] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const activeChat = (user && realTimeChat && realTimeChat.length > 0)
    ? realTimeChat
    : (user 
        ? [{ id: "welcome-back", sender: "ai", text: `Welcome back, ${user.displayName || "Ella"}. I am your NEIMS Senior Political Advisor. Your workspace session is fully synchronized under our ABAC protection rules. Ask me any queries regarding state forecasting indices or current event alerts.`, time: "ACTIVE SESSION" }]
        : chatMessages
      );

  // Fetch the dynamic Gemini AI report on mount
  useEffect(() => {
    fetchExplainableReport();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat]);

  const fetchExplainableReport = async () => {
    setLoadingReport(true);
    try {
      const response = await fetch("/api/explain-forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentLeader: "Labour Party (34.2%)",
          economyIndex: "58.2 pts (+5.7%)",
          recentEvent: "Fuel price surge in Lagos and Abuja urban areas"
        })
      });
      const resData = await response.json();
      setAiReport(resData.summary || "Unable to acquire analytical report.");
    } catch (err) {
      console.error(err);
      setAiReport("Rule-based simulation fallback: Labour Party holds 34.2% based on severe economic voter exhaustion matrices following recent fuel subsidies removals.");
    } finally {
      setLoadingReport(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: chatInput,
      time: timeStr
    };

    const promptToSend = chatInput;
    setChatInput("");
    setSendingChat(true);

    if (user && addChatMessageToCloud) {
      await addChatMessageToCloud(promptToSend, "user");
    } else {
      setChatMessages(prev => [...prev, userMsg]);
    }

    try {
      const currentConversation = user ? realTimeChat : chatMessages;
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...currentConversation, userMsg]
        })
      });
      const data = await response.json();
      const aiReplyText = data.reply || "I encountered an issue connecting to the tactical analysis backend.";
      
      if (user && addChatMessageToCloud) {
        await addChatMessageToCloud(aiReplyText, "ai");
      } else {
        const aiReply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: aiReplyText,
          time: timeStr
        };
        setChatMessages(prev => [...prev, aiReply]);
      }
    } catch (err) {
      console.error(err);
      const errorText = "Ella, I couldn't connect to the server's Gemini gateway. Please make sure the backend is fully booted and your GEMINI_API_KEY is defined in the Secrets panel.";
      if (user && addChatMessageToCloud) {
        await addChatMessageToCloud(errorText, "ai");
      } else {
        setChatMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: "ai",
          text: errorText,
          time: timeStr
        }]);
      }
    } finally {
      setSendingChat(false);
    }
  };

  return (
    <div className="flex flex-col gap-6" id="com-explainable-ai-dashboard">
      
      {/* SECTION TITLE */}
      <div className="border-b border-[#142240] pb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#00f5d4] animate-pulse" />
          <h2 className="text-xl font-bold font-sans text-gray-100 tracking-tight">Why Did the Forecast Change?</h2>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          AI-driven explanation of political probability shifts based on real-world signals, sentiment changes, and economic indicators.
        </p>
      </div>

      {/* CORE 3-ROW CARD MATRIX (MATCHING SCREEN 3) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* CARD 1: KEY DRIVERS OF CHANGE */}
        <div className="bg-[#090e1a]/8 overlay-gradient border border-[#1a294d] rounded-2xl p-5 flex flex-col justify-between h-[450px] shadow-2xl backdrop-blur-md">
          <div className="border-b border-[#131f3b] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00f5d4]" />
              <h3 className="text-sm font-bold font-sans text-gray-200 tracking-wider uppercase">Key Drivers of Change</h3>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Top critical factors affecting probability shifts</p>
          </div>

          <div className="space-y-5 flex-1">
            <div className="bg-[#0c1424] border border-[#1c2e54]/30 rounded-xl p-3.5">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs font-semibold text-gray-100">Economic Pressure Impact</span>
                <span className="text-red-400 font-bold text-sm">87%</span>
              </div>
              <div className="w-full bg-[#050b14] h-1 rounded-full overflow-hidden mb-1.5">
                <div className="bg-red-500 h-full rounded-full" style={{ width: "87%" }} />
              </div>
              <p className="text-[10px] text-gray-400 leading-snug">
                Rising inflation and legacy fuel subsidies logistics spike voter dissatisfaction matrices targeting the incumbent blocks.
              </p>
            </div>

            <div className="bg-[#0c1424] border border-[#1c2e54]/30 rounded-xl p-3.5">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs font-semibold text-gray-100">Public Sentiment Shift</span>
                <span className="text-orange-400 font-bold text-sm">72%</span>
              </div>
              <div className="w-full bg-[#050b14] h-1 rounded-full overflow-hidden mb-1.5">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: "72%" }} />
              </div>
              <p className="text-[10px] text-gray-400 leading-snug">
                Social media analytical models log a sustained 12% drop in favorable tags for incumbent candidates.
              </p>
            </div>

            <div className="bg-[#0c1424] border border-[#1c2e54]/30 rounded-xl p-3.5">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs font-semibold text-gray-100">Regional Movement Swings</span>
                <span className="text-teal-400 font-bold text-sm">65%</span>
              </div>
              <div className="w-full bg-[#050b14] h-1 rounded-full overflow-hidden mb-1.5">
                <div className="bg-[#00f5d4] h-full rounded-full" style={{ width: "65%" }} />
              </div>
              <p className="text-[10px] text-gray-400 leading-snug">
                Sustained opposition rally turnouts across North-Central and Southwest geopolitical units trigger swing point distributions.
              </p>
            </div>
          </div>
        </div>

        {/* CARD 2: AI REASONING PIPELINE (STEPS FLOW) */}
        <div className="bg-[#090e1a]/8 border border-[#1a294d] rounded-2xl p-5 flex flex-col justify-between h-[450px] shadow-2xl backdrop-blur-md">
          <div className="border-b border-[#131f3b] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#00f5d4]" />
              <h3 className="text-sm font-bold font-sans text-gray-200 tracking-wider uppercase">AI Reasoning Pipeline</h3>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Step-by-step intelligence reasoning structure</p>
          </div>

          <div className="flex-1 flex flex-col justify-between text-xs py-1">
            <div className="flex items-center gap-3 bg-[#0c1424]/90 border border-[#1a294d]/40 rounded-xl p-3 relative">
              <div className="w-6 h-6 rounded-full bg-teal-950 border border-teal-500/40 flex items-center justify-center font-mono font-bold text-[#00f5d4] shrink-0 text-[10px]">
                01
              </div>
              <div>
                <div className="flex justify-between w-full font-sans font-medium text-gray-200">
                  <span>Event Detection Stage</span>
                  <span className="text-[#00f5d4] font-bold">98%</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">Scanning 847 national news sources and social media feeds.</p>
              </div>
            </div>

            <div className="flex justify-center my-0.5">
              <ArrowRight className="w-3.5 h-3.5 text-gray-600 rotate-90" />
            </div>

            <div className="flex items-center gap-3 bg-[#0c1424]/90 border border-[#1a294d]/40 rounded-xl p-3">
              <div className="w-6 h-6 rounded-full bg-teal-950 border border-teal-500/40 flex items-center justify-center font-mono font-bold text-[#00f5d4] shrink-0 text-[10px]">
                02
              </div>
              <div>
                <div className="flex justify-between w-full font-sans font-medium text-gray-200">
                  <span>Sentiment Analysis Matrix</span>
                  <span className="text-[#00f5d4] font-bold">94%</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">Processing 2.4 million distinct data points for public sentiment.</p>
              </div>
            </div>

            <div className="flex justify-center my-0.5">
              <ArrowRight className="w-3.5 h-3.5 text-gray-600 rotate-90" />
            </div>

            <div className="flex items-center gap-3 bg-[#0c1424]/90 border border-[#1a294d]/40 rounded-xl p-3">
              <div className="w-6 h-6 rounded-full bg-teal-950 border border-teal-500/40 flex items-center justify-center font-mono font-bold text-[#00f5d4] shrink-0 text-[10px]">
                03
              </div>
              <div>
                <div className="flex justify-between w-full font-sans font-medium text-gray-200">
                  <span>Historical Deep Comparison</span>
                  <span className="text-[#00f5d4] font-bold">89%</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">Matching current parameters with 12 previous electoral cycles.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: FORECAST CHANGE SUMMARY */}
        <div className="bg-[#090e1a]/8 border border-[#1a294d] rounded-2xl p-5 flex flex-col h-[450px] shadow-2xl backdrop-blur-md">
          <div className="border-b border-[#131f3b] pb-3 mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold font-sans text-gray-200 tracking-wider uppercase">Forecast Change Summary</h3>
            <span className="text-[10px] text-gray-400 font-mono">CALIBRATIONS</span>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-between">
            {/* Shifts */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#060b14] p-2.5 rounded-xl border border-[#13203c] flex justify-between items-center">
                <span className="text-gray-300 font-medium font-sans">APC</span>
                <span className="text-rose-400 font-bold font-mono">-2.4%</span>
              </div>
              <div className="bg-[#060b14] p-2.5 rounded-xl border border-[#13203c] flex justify-between items-center">
                <span className="text-gray-300 font-medium font-sans">PDP</span>
                <span className="text-emerald-400 font-bold font-mono">+1.8%</span>
              </div>
              <div className="bg-[#060b14] p-2.5 rounded-xl border border-[#13203c] flex justify-between items-center">
                <span className="text-gray-300 font-medium font-sans">Labour</span>
                <span className="text-emerald-400 font-bold font-mono">+3.1%</span>
              </div>
              <div className="bg-[#060b14] p-2.5 rounded-xl border border-[#13203c] flex justify-between items-center">
                <span className="text-gray-300 font-medium font-sans">NNPP</span>
                <span className="text-rose-400 font-bold font-mono">-0.7%</span>
              </div>
            </div>

            {/* Influencing parameters */}
            <div className="bg-[#050912] p-4 rounded-xl border border-[#142340] space-y-2.5 text-xs">
              <span className="text-[10px] text-gray-500 font-mono tracking-widest font-semibold block uppercase">Influencing Factors</span>
              <div className="flex justify-between">
                <span className="text-gray-400">Strongest Driver:</span>
                <span className="text-red-400 font-bold font-sans">Economic Pressure</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Weakest Factor:</span>
                <span className="text-sky-300 font-medium">Security Situation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Volatility Direction:</span>
                <span className="text-yellow-400 font-bold">Increased Volatility</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* GENERATIVE AI REPORT HUB */}
      <div className="bg-[#090e1a]/85 border border-[#1a294d] rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md" id="ai-intelligence-reports">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 blur-3xl rounded" />
        <div className="flex items-center gap-2 border-b border-[#131f3b] pb-3 mb-4">
          <Sparkles className="w-5 h-5 text-[#00f5d4] animate-pulse" />
          <h3 className="text-sm font-bold font-sans text-gray-200 tracking-wider uppercase">Generative Electoral Strategy Analysis</h3>
        </div>

        {loadingReport ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-xs text-gray-400">
            <Loader className="w-6 h-6 text-[#00f5d4] animate-spin" />
            <span>Analyzing tactical dynamics across federal safe-havens...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-200 font-serif leading-relaxed italic whitespace-pre-line" id="ai-report-text">
              {aiReport}
            </div>
            
            <div className="flex items-center gap-2 justify-end pt-3 text-[10px] font-mono text-gray-500 border-t border-[#131f3b]/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Attribution: Automated Intelligence Report Node</span>
            </div>
          </div>
        )}
      </div>

      {/* INTERACTIVE COMPANION CHAT: ASK NEIMS AI */}
      <div className="bg-[#090e1a]/85 border border-[#1a294d] rounded-2xl p-5 shadow-2xl flex flex-col h-[500px] backdrop-blur-md" id="interactive-chat-hub">
        <div className="flex items-center justify-between border-b border-[#131f3b] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4.5 h-4.5 text-[#00f5d4]" />
            <h3 className="text-sm font-bold font-sans text-gray-200 tracking-wider uppercase">Ask NEIMS AI Assistant</h3>
          </div>
          <span className="text-[10px] text-gray-400 bg-[#0c1424] px-2 py-0.5 rounded border border-[#1a294d] font-mono">
            {user ? `Logged as ${user.displayName || user.email?.split("@")[0]} | Level 5 Clearance` : "Guest Analyst | Sandbox Access"}
          </span>
        </div>

        {/* Chat Logs */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 custom-scrollbar">
          {activeChat.map(msg => (
            <div 
              key={msg.id}
              className={`flex gap-3 max-w-4xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              {/* Avatar indicator */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold ${
                msg.sender === "user" 
                  ? "bg-[#00f5d4]/10 border-[#00f5d4]/30 text-[#00f5d4]" 
                  : "bg-teal-950 border-teal-500/30 text-teal-300"
              }`}>
                {msg.sender === "user" 
                  ? (user?.displayName ? user.displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2) : "EL")
                  : "AI"
                }
              </div>

              {/* Text Bubble */}
              <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-[#00f5d4] text-[#050b14] font-medium rounded-tr-none"
                  : "bg-[#0c1424] border border-[#1a294d]/80 text-gray-200 rounded-tl-none whitespace-pre-wrap"
              }`}>
                {msg.text}
                <span className={`block text-[9px] mt-2 font-mono ${msg.sender === "user" ? "text-slate-800" : "text-gray-500"}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          {sendingChat && (
            <div className="flex gap-3 max-w-lg mr-auto">
              <div className="w-8 h-8 rounded-full bg-teal-950 border border-teal-500/30 flex items-center justify-center shrink-0 text-xs text-teal-300">
                AI
              </div>
              <div className="p-3.5 bg-[#0c1424] border border-[#1a294d] text-gray-400 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader className="w-4.5 h-4.5 animate-spin text-[#00f5d4]" />
                <span className="text-xs">Triangulating feedback...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Chat Input form */}
        <form onSubmit={handleSendChat} className="flex gap-2.5">
          <input
            type="text"
            id="chat-input-field"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a tactical query (e.g. 'How does Peter Obi lead LP in South-South?') or candidate information..."
            className="flex-1 bg-[#050a14] border border-[#1a294d] rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-[#00f5d4] transition-all placeholder:text-gray-600 font-sans"
            disabled={sendingChat}
          />
          <button
            type="submit"
            id="btn-send-chat"
            className="bg-[#00f5d4] text-[#050b14] hover:bg-[#00d6b9] active:scale-95 transition-all p-3 rounded-xl flex items-center justify-center disabled:opacity-50 shrink-0 font-bold"
            disabled={sendingChat || !chatInput.trim()}
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
