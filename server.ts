import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Initial political data simulation
interface MarketMetric {
  name: string;
  value: number;
  change: number;
  desc: string;
  sparkline: number[];
}

const metrics: Record<string, MarketMetric> = {
  electionMomentum: {
    name: "Election Momentum Index",
    value: 72.4,
    change: 3.2,
    desc: "vs last week",
    sparkline: [62, 64, 63, 67, 69, 71, 72.4],
  },
  nationalSentiment: {
    name: "National Sentiment Score",
    value: 64.8,
    change: -1.4,
    desc: "24h change",
    sparkline: [68, 67, 69, 65, 66, 64, 64.8],
  },
  economicPressure: {
    name: "Economic Pressure Index",
    value: 58.2,
    change: 5.7,
    desc: "this month",
    sparkline: [51, 52, 54, 55, 56, 57, 58.2],
  },
  politicalStability: {
    name: "Political Stability Meter",
    value: 81.3,
    change: 0.8,
    desc: "weekly avg",
    sparkline: [79, 80, 80.5, 81, 80.8, 81.2, 81.3],
  },
  forecastConfidence: {
    name: "Forecast Confidence",
    value: 89.7,
    change: 2.1,
    desc: "model accuracy",
    sparkline: [85, 86, 86.4, 88, 88.5, 89, 89.7],
  },
};

// Mock parties and probabilities
const parties = [
  { id: "lp", name: "Labour Party (LP)", short: "Labour", prob: 34.2, change: +3.1, color: "#e36414", leader: "Peter Obi" },
  { id: "pdp", name: "People's Democratic Party", short: "PDP", prob: 33.5, change: +1.8, color: "#0077b6", leader: "Atiku Abubakar" },
  { id: "apc", name: "All Progressives Congress", short: "APC", prob: 30.5, change: -2.4, color: "#00b4d8", leader: "Bola Ahmed Tinubu" },
  { id: "nnpp", name: "New Nigeria People's Party", short: "NNPP", prob: 5.4, change: -0.7, color: "#ffd166", leader: "Rabiu Kwankwaso" },
  { id: "coalition", name: "Emerging Coalition", short: "Coalition", prob: 4.8, change: +1.2, color: "#9b5de5", leader: "Combined opposition alliance" },
  { id: "sdp", name: "Social Democratic Party", short: "SDP", prob: 2.8, change: -0.1, color: "#f15bb5", leader: "Adewole Adebayo" },
  { id: "adp", name: "Action Democratic Party", short: "ADP", prob: 1.7, change: +0.2, color: "#00f5d4", leader: "Yabagi Sani" },
  { id: "adc", name: "African Democratic Congress", short: "ADC", prob: 1.0, change: 0.0, color: "#3a86c8", leader: "Dumebi Kachikwu" },
];

// Simulated event feeds
const eventsList = [
  {
    id: "evt-1",
    type: "ECONOMIC",
    severity: "CRITICAL",
    category: "Negative",
    title: "Fuel price increase detected in Lagos and Abuja metropolitan areas",
    impact: 87,
    aiConfidence: 94,
    time: "2 min ago",
    details: "Gasoline retail prices spike by 15% across several retail outlets causing transportation concerns and public discussions on social media networks. This might affect dissatisfaction ratings with incumbent administrations.",
  },
  {
    id: "evt-2",
    type: "POLITICAL",
    severity: "HIGH",
    category: "Neutral",
    title: "Opposition rally engagement rising in Southwest region",
    impact: 72,
    aiConfidence: 88,
    time: "5 min ago",
    details: "High voter turnout observed at opposition coalition town halls in Ibadan, Osogbo, and Abeokuta. Regional analytical weighting shifts points to LP and PDP candidates.",
  },
  {
    id: "evt-3",
    type: "COALITION",
    severity: "MEDIUM",
    category: "Neutral",
    title: "Northern coalition discussions ongoing - new alliance forming",
    impact: 65,
    aiConfidence: 76,
    time: "8 min ago",
    details: "Key regional chieftains meet in Kaduna and Kano to deliberate on strategic endorsements. Volatility matrix indicating early swings for NNPP and APC coalitions.",
  },
  {
    id: "evt-4",
    type: "SOCIAL",
    severity: "HIGH",
    category: "Negative",
    title: "Youth protest sentiment increasing on social media platforms",
    impact: 78,
    aiConfidence: 91,
    time: "12 min ago",
    details: "Trending hashtags #ReformNEIMS and #VoterPower indicate high youth turnout interest and intense digital mobilization for election integrity, especially in southern states.",
  },
  {
    id: "evt-5",
    type: "GOVERNMENT",
    severity: "MEDIUM",
    category: "Positive",
    title: "INEC releases updated voter registration dataset and PVC distribution logs",
    impact: 60,
    aiConfidence: 95,
    time: "30 min ago",
    details: "92.4% permanent voter card (PVC) retrieval rate logged, showing unprecedented public awareness and high readiness indexes across the Northeast and South-South regions.",
  },
];

// Knowledge Graph Nodes and Edges
const knowledgeGraph = {
  nodes: [
    { id: "LP", label: "Labour Party (LP)", type: "party", size: 30, color: "#e36414", x: 250, y: 180 },
    { id: "APC", label: "All Progressives Congress (APC)", type: "party", size: 30, color: "#00b4d8", x: 450, y: 180 },
    { id: "PDP", label: "People's Democratic Party (PDP)", type: "party", size: 30, color: "#0077b6", x: 350, y: 350 },
    { id: "Obi", label: "Peter Obi", type: "candidate", size: 20, color: "#ff823b", x: 180, y: 100 },
    { id: "Tinubu", label: "Bola Tinubu", type: "candidate", size: 20, color: "#4cc9f0", x: 520, y: 100 },
    { id: "Atiku", label: "Atiku Abubakar", type: "candidate", size: 20, color: "#023e8a", x: 350, y: 440 },
    { id: "Lagos", label: "Lagos (Southwest)", type: "region", size: 25, color: "#ffffff", x: 160, y: 280 },
    { id: "Kano", label: "Kano (Northwest)", type: "region", size: 25, color: "#ffffff", x: 540, y: 280 },
    { id: "FuelSpike", label: "Fuel Subsidy Spikes", type: "event", size: 18, color: "#f72585", x: 350, y: 240 },
    { id: "YouthVoter", label: "Youth voter surge", type: "event", size: 18, color: "#7209b7", x: 220, y: 380 },
  ],
  edges: [
    { source: "LP", target: "Obi", label: "Nominee" },
    { source: "APC", target: "Tinubu", label: "Nominee" },
    { source: "PDP", target: "Atiku", label: "Nominee" },
    { source: "Obi", target: "Lagos", label: "Strong Sentiment" },
    { source: "Tinubu", target: "Lagos", label: "Power Base" },
    { source: "LP", target: "YouthVoter", label: "Influenced By" },
    { source: "FuelSpike", target: "APC", label: "Incumbent Pressure" },
    { source: "FuelSpike", target: "PDP", label: "Opposition Leverage" },
    { source: "FuelSpike", target: "LP", label: "Opposition Leverage" },
    { source: "Atiku", target: "Kano", label: "Target Swing" },
    { source: "YouthVoter", target: "Lagos", label: "High Concentration" },
  ],
};

// API: Server configuration health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    aiIntegrated: !!ai,
  });
});

// API: Get initial simulation data
app.get("/api/data", (req, res) => {
  res.json({
    metrics,
    parties,
    events: eventsList,
    knowledgeGraph,
  });
});

// API: Get Explainable AI forecast breakdown
// Utilizing Gemini 3.5-flash to write real, live summaries dynamically if key exists!
app.post("/api/explain-forecast", async (req, res) => {
  const { currentLeader, changes, economyIndex, recentEvent } = req.body;

  if (!ai) {
    // Fallback if no API key is specified, provide standard high-fidelity analytical rationale
    return res.json({
      summary: `Based on automated NEIMS spatial regression models, the current **Labour Party** polling leadership surge to **34.2%** is heavily heavily driven by economic discontent (Economic Pressure Index at **58.2 pts**, up **5.7%** due to fuel price adjustments). Underrepresented youth demographic trends demonstrate a strong alignment with third-tier movements in Southern and North-Central regions.

The **APC** experienced a **-2.4%** negative correction following urban transportation fuel price logistics spikes in Southwest hubs like Lagos and Abuja. 

**PDP** retains robust organizational structures, registering a steady **+1.8%** consolidation mainly in North-Central and South-South geopolitical regions.`,
      drivers: [
        { name: "Economic Pressure Impact", score: 87, desc: "Rising inflation and currency devaluation increasing voter dissatisfaction with incumbent" },
        { name: "Public Sentiment Shift", score: 72, desc: "Social media analysis shows 12% decrease in positive mentions of ruling party" },
        { name: "Regional Political Movement", score: 65, desc: "North-Central and Southwest regions showing increased opposition activity" }
      ],
      attribution: "NEIMS Rule-based Local Analyser (Set GEMINI_API_KEY for dynamic generative analysis)",
    });
  }

  try {
    const prompt = `You are the lead electoral analyst AI for NEIMS (National Election Intelligence Monitoring System) in Nigeria.
Analyze the current state of the Nigerian election based on these parameters:
- Leading Party: ${currentLeader || "Labour Party (34.2%)"}
- Economic index pressure: ${economyIndex || "58.2 points (+5.7% spike)"}
- Recent Critical Event: ${recentEvent || "Fuel price spikes in Lagos & Abuja (Impact: 87%)"}
- Core party shifts: APC (-2.4%), PDP (+1.8%), Labour (+3.1%), NNPP (-0.7%).

Write a sophisticated, professional intelligence report answering: "Why Did the Forecast Change?"
Keep the output highly informative, objective, realistic of Nigerian regional geopolitics (Southwest, Northwest, South-South, North-Central etc.) and omit markdown symbols other than bold markers. Do not repeat greeting messages. Write exactly 2-3 concise paragraphs. Use professional electoral intelligence tone.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    const aiText = response.text || "Unable to extract text from generative model.";

    res.json({
      summary: aiText,
      drivers: [
        { name: "Economic Pressure Impact", score: 87, desc: "Inflationary pressures and fuel costs spiking urban unrest metrics, leading to voter fatigue with the status-quo." },
        { name: "Public Sentiment Shift", score: 72, desc: "Digital media analytics track a significant 12% rise in voter engagement across oppositional platforms." },
        { name: "Regional Political Movement", score: 65, desc: "Emergences in Kaduna, Kano, and Lagos suggesting voters are splitting traditional key safe havens." }
      ],
      attribution: "NEIMS Generative AI Insights powered by Gemini 3.5 Flash",
    });
  } catch (err: any) {
    console.error("Gemini API Error in explain-forecast:", err);
    res.status(500).json({ error: "Failed to generate AI insights.", details: err.message });
  }
});

// API: Live intelligence Chatbot using Gemini
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request. messages array is required." });
  }

  if (!ai) {
    return res.json({
      reply: "Hello Ella, I am NEIMS intelligence companion. Since the GEMINI_API_KEY secret is not set in your environments list, I am speaking from the regional database: Peter Obi leads LP with 34.2%, and APC is registering declining momentum due to inflation. Set the API secret to let me analyze live events across all 36 states!",
    });
  }

  try {
    // Format conversation history for Gemini API
    const formattedContents = messages.map((m) => {
      const role = m.sender === "user" ? "user" : "model";
      return `${role === "user" ? "Analyst Ella" : "NEIMS AI Control"}: ${m.text}`;
    }).join("\n");

    const systemInstruction = `You are NEIMS (National Election Intelligence Monitoring System) AI, a high-level electoral operations assistant developed for Nigeria's political climate.
The user is "Ella", an expert election intelligence analyst. Always address her respectfully as Ella, paying attention to her name style.
Speak with extreme professionalism, referencing Nigerian geopolitical regions (e.g., FCT, Lagos, Kano, South-South, Southwest, Northwest, Southeast) and using realistic election factors (PVC retrieval, swing coalition voter bases, inflation, regional stability).
Be supportive, analytical, and highly structured.`;

    const fullPrompt = `${systemInstruction}\n\nConversation History:\n${formattedContents}\n\nNEIMS AI Control: `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
      config: {
        temperature: 0.75,
      },
    });

    const replyText = response.text || "Unable to extract response from Gemini.";

    res.json({ reply: replyText });
  } catch (err: any) {
    console.error("Gemini API Error in chat:", err);
    res.status(500).json({ error: "Failed to fetch response.", details: err.message });
  }
});


async function startServer() {
  // Vite middleware integration for live browser preview
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Listen to port 3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[NEIMS Server] Active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start NEIMS control server:", err);
});
