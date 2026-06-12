import React, { useState } from "react";
import { 
  Compass, 
  MapPin, 
  Zap, 
  Cpu, 
  TrendingUp, 
  PieChart, 
  Activity, 
  Layers, 
  Radio, 
  Search, 
  CheckCircle,
  Eye,
  Server,
  Network
} from "lucide-react";
import { motion } from "motion/react";
import { MarketMetric } from "../types";

interface OverviewProps {
  metrics: Record<string, MarketMetric>;
  onNavigateToTab: (tabId: string) => void;
}

export default function OverviewSection({ metrics, onNavigateToTab }: OverviewProps) {
  const [showLanding, setShowLanding] = useState<boolean>(true);

  // Sparkline generator helper
  const renderSparkline = (points: number[]) => {
    const max = Math.max(...points);
    const min = Math.min(...points);
    const spread = max - min;
    const width = 100;
    const height = 24;
    const coords = points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / (spread || 1)) * height;
      return `${x},${y}`;
    }).join(" ");
    
    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke="#00f5d4"
          strokeWidth="1.5"
          points={coords}
        />
      </svg>
    );
  };

  if (showLanding) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[620px] relative overflow-hidden p-6 py-12" id="neims-landing-page">
        {/* Absolute ambient lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[200px] h-[200px] bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />

        {/* WELCOME MAT (MATCHING SCREEN 8) */}
        <div className="max-w-3xl text-center z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c1424] border border-[#1d2f59] text-xs text-[#00f5d4] font-medium font-mono">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#00f5d4]" />
            <span>SYSTEM ONLINE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] inline-block ml-1 animate-ping" />
            <span className="text-gray-500 text-[10px] pl-1.5 border-l border-[#1b2b52]">Last sync: 2 seconds ago</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold font-sans text-white tracking-tight leading-none">
            National Election <br/>
            <span className="bg-gradient-to-r from-[#00f5d4] to-blue-400 bg-clip-text text-transparent font-black">
              Intelligence Overview
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed font-sans">
            Real-time political forecasting powered by AI-driven event analysis and sentiment monitoring across all 36 states and the FCT.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button
              id="btn-access-dashboard"
              onClick={() => setShowLanding(false)}
              className="px-6 py-3.5 rounded-xl bg-[#00f5d4] text-[#050b14] font-bold text-sm hover:bg-[#00d6b9] hover:shadow-[0_0_20px_rgba(0,245,212,0.25)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Access Dashboard</span>
              <Compass className="w-4.5 h-4.5 transition-transform group-hover:rotate-12" />
            </button>
            <button
              id="btn-view-report"
              onClick={() => onNavigateToTab("explainable")}
              className="px-6 py-3.5 rounded-xl bg-[#0c1424] border border-[#1b2b54] text-gray-300 font-semibold text-sm hover:text-white hover:bg-[#142340]/60 transition-all cursor-pointer"
            >
              View Analytics Report
            </button>
          </div>
        </div>

        {/* STATS STRIP under Landing section (Screen 8 lower footer) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl mt-20 border-t border-[#131f3c]/60 pt-10 z-10">
          <div className="text-center md:text-left">
            <strong className="block text-3xl font-extrabold text-white font-mono">36+</strong>
            <span className="text-xs text-gray-400 mt-1 block">Geopolitical States & FCT</span>
          </div>
          <div className="text-center md:text-left">
            <strong className="block text-3xl font-extrabold text-[#00f5d4] font-mono">2.4M+</strong>
            <span className="text-xs text-gray-400 mt-1 block">Data Points / Hour</span>
          </div>
          <div className="text-center md:text-left">
            <strong className="block text-3xl font-extrabold text-white font-mono">99.2%</strong>
            <span className="text-xs text-gray-400 mt-1 block">Forecast Confidence Map</span>
          </div>
          <div className="text-center md:text-left">
            <strong className="block text-3xl font-extrabold text-emerald-400 font-mono">Real-time</strong>
            <span className="text-xs text-gray-400 mt-1 block">Tactical Events Pipeline</span>
          </div>
        </div>

      </div>
    );
  }

  // CORE DASHBOARD WORKSPACE (Screen 1 & Screen 2)
  return (
    <div className="flex flex-col gap-8" id="overview-core-dashboard">
      
      {/* SECTION 1: SPARKLINE CARDS (Screen 7 Details) */}
      <div>
        <div className="border-b border-[#142240] pb-3 mb-5 flex justify-between items-center">
          <h3 className="text-sm font-bold font-sans text-gray-200 uppercase tracking-widest">Key Intelligence Metrics</h3>
          <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            All systems operational
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(metrics).map(([key, item]) => {
            const isNegative = item.change < 0;
            return (
              <div 
                key={key}
                className="bg-[#090e1a]/8 border border-[#1a294d] rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden backdrop-blur-sm hover:border-[#1e3465] transition-all"
              >
                <div>
                  <span className="text-[9px] text-[#00f5d4] uppercase tracking-wide font-semibold block">{item.name}</span>
                  <div className="flex items-baseline justify-between mt-2 mb-1">
                    <strong className="text-2xl font-bold font-mono text-gray-100">{item.value}%</strong>
                    <span className={`text-[10px] font-bold ${isNegative ? "text-rose-400" : "text-emerald-400"}`}>
                      {isNegative ? "" : "+"}{item.change}% {item.desc}
                    </span>
                  </div>
                </div>

                {/* Micro sparks representation */}
                <div className="mt-3 flex justify-end">
                  {renderSparkline(item.sparkline)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: METRIC BOXES AND REAL-TIME PIPELINE (Screen 1 Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Statistical summary blocks left */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          <div className="bg-[#090e1a]/85 border border-[#1a294d] p-4 rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">Data Points/Hour</span>
            <strong className="text-xl font-bold text-gray-100 font-mono mt-2">2.4M+</strong>
          </div>
          <div className="bg-[#090e1a]/85 border border-[#1a294d] p-4 rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">Events Detected/Day</span>
            <strong className="text-xl font-bold text-gray-100 font-mono mt-2">15,000+</strong>
          </div>
          <div className="bg-[#090e1a]/85 border border-[#1a294d] p-4 rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">Analyses/Minute</span>
            <strong className="text-xl font-bold text-gray-100 font-mono mt-1">840</strong>
          </div>
          <div className="bg-[#090e1a]/85 border border-[#1a294d] p-4 rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">Model Updates/Hour</span>
            <strong className="text-xl font-bold text-[#00f5d4] font-mono mt-1">120</strong>
          </div>
        </div>

        {/* Real-time Processing Pipeline bar rates standard right */}
        <div className="lg:col-span-8 bg-[#090e1a]/85 border border-[#1a294d] rounded-2xl p-5 flex flex-col justify-between shadow-xl backdrop-blur-sm">
          <div className="flex justify-between items-center border-b border-[#131f3b] pb-2 mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00f5d4] animate-pulse" />
              <h4 className="text-xs font-bold text-gray-200 tracking-wider uppercase">Real-Time Processing Pipeline</h4>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Processing 847 events/second</span>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs text-gray-300 font-medium mb-1">
                <span>Ingestion Pipeline</span>
                <span className="font-mono text-gray-400">98%</span>
              </div>
              <div className="w-full bg-[#050912] h-2 rounded-full overflow-hidden border border-[#12203e]">
                <div className="bg-[#00f5d4] h-full rounded-full" style={{ width: "98%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-300 font-medium mb-1">
                <span>Analytical Parsing</span>
                <span className="font-mono text-gray-400">94%</span>
              </div>
              <div className="w-full bg-[#050912] h-2 rounded-full overflow-hidden border border-[#12203e]">
                <div className="bg-[#00b4d8] h-full rounded-full" style={{ width: "94%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-300 font-medium mb-1">
                <span>Classification Calibration</span>
                <span className="font-mono text-gray-400">91%</span>
              </div>
              <div className="w-full bg-[#050912] h-2 rounded-full overflow-hidden border border-[#12203e]">
                <div className="bg-[#7209b7] h-full rounded-full" style={{ width: "91%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-300 font-medium mb-1">
                <span>Risk Forecasting Engine</span>
                <span className="font-mono text-gray-400">87%</span>
              </div>
              <div className="w-full bg-[#050912] h-2 rounded-full overflow-hidden border border-[#12203e]">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: "87%" }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 3: SYSTEM ARCHITECTURE OVERVIEW (Screen 2 Details) */}
      <div className="bg-[#090e1a]/85 border border-[#1a294d] rounded-2xl p-6 shadow-xl backdrop-blur-sm" id="neims-architecture-overview">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[10px] text-[#00f5d4] font-mono tracking-widest font-extrabold bg-[#00f5d4]/10 px-3 py-1 rounded-full border border-[#00f5d4]/20 uppercase inline-block">
            Technical Infrastructure Overview
          </span>
          <h3 className="text-xl font-bold font-sans text-gray-100 tracking-tight mt-3">NEIMS AI Architecture Diagram</h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            How NEIMS transforms raw multi-source datasets into dynamic electoral probability forecasts.
          </p>
        </div>

        {/* 5 columns flowchart connecting lines style */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          
          {/* COLUMN 1: Data Sources */}
          <div className="bg-[#050a14] border border-[#152446] rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3 border-b border-[#142340] pb-2">
              <Server className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs font-bold text-gray-200">Data Sources</h4>
            </div>
            <ul className="space-y-2 text-[11px] text-gray-400 font-sans">
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />Web Media Portals</li>
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />Social Networks Feed</li>
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />Economic Bulletins</li>
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />Official Gazettes</li>
            </ul>
          </div>

          {/* COLUMN 2: Event Detection */}
          <div className="bg-[#050a14] border border-[#152446] rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3 border-b border-[#142340] pb-2">
              <Eye className="w-4 h-4 text-orange-400" />
              <h4 className="text-xs font-bold text-gray-200">Event Detection</h4>
            </div>
            <ul className="space-y-2 text-[11px] text-gray-400 font-sans">
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />Political Rallies</li>
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />Protest Sentiment</li>
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />Economic Adjustments</li>
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />Security Disruption</li>
            </ul>
          </div>

          {/* COLUMN 3: Sentiment Matrix */}
          <div className="bg-[#050a14] border border-[#152446] rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3 border-b border-[#142340] pb-2">
              <Radio className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-bold text-gray-200">Sentiment Analysis</h4>
            </div>
            <ul className="space-y-2 text-[11px] text-gray-400 font-sans">
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />Demographic Mood</li>
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />State-by-State Weight</li>
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />Youth Engagement</li>
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />Media Undercurrents</li>
            </ul>
          </div>

          {/* COLUMN 4: Forecast Model */}
          <div className="bg-[#050a14] border border-[#152446] rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3 border-b border-[#142340] pb-2">
              <Cpu className="w-4 h-4 text-[#00f5d4]" />
              <h4 className="text-xs font-bold text-gray-200">Electoral Model</h4>
            </div>
            <ul className="space-y-2 text-[11px] text-gray-400 font-sans">
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-[#00f5d4] rounded-full" />Probability Trajectory</li>
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-[#00f5d4] rounded-full" />Historic Regressions</li>
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-[#00f5d4] rounded-full" />Coalition Baliders</li>
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-[#00f5d4] rounded-full" />Confidence Scoring</li>
            </ul>
          </div>

          {/* COLUMN 5: Dashboards */}
          <div className="bg-[#050a14] border border-[#152446] rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3 border-b border-[#142340] pb-2">
              <Network className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-gray-200">Visualization</h4>
            </div>
            <ul className="space-y-2 text-[11px] text-gray-400 font-sans">
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />Interactive Charts</li>
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />Live Stream Feed</li>
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />Knowledge Graph</li>
              <li className="flex items-center gap-2 bg-[#0c1424] p-1.5 rounded border border-[#172b53]/45"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />Explainable AI Bot</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}
