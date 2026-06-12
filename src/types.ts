export interface MarketMetric {
  name: string;
  value: number;
  change: number;
  desc: string;
  sparkline: number[];
}

export interface Party {
  id: string;
  name: string;
  short: string;
  prob: number;
  change: number;
  color: string;
  leader: string;
}

export interface IntelEvent {
  id: string;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  category: "Positive" | "Negative" | "Neutral";
  title: string;
  impact: number;
  aiConfidence: number;
  time: string;
  details: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: "party" | "candidate" | "region" | "event";
  size: number;
  color: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
}
