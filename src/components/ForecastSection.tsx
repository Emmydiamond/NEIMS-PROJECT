import React, { useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { TrendingUp, AlertCircle, ChevronRight, Activity, Award, Compass } from "lucide-react";
import { Party } from "../types";

// Generates time series data based on chosen frame
const generateTimelineData = (range: string) => {
  const points = range === "7d" ? 7 : range === "30d" ? 30 : range === "6m" ? 12 : 24;
  const list = [];
  
  // Starting values
  let lp = 31.0;
  let pdp = 32.5;
  let apc = 33.0;
  let nnpp = 6.0;
  let coalition = 3.5;
  
  for (let i = 0; i < points; i++) {
    const factor = (i / points);
    // Simulating political swing trajectories leading to current state
    const tLp = lp + (34.2 - lp) * factor + Math.sin(i * 0.5) * 0.8;
    const tPdp = pdp + (33.5 - pdp) * factor + Math.cos(i * 0.5) * 0.6;
    const tApc = apc + (30.5 - apc) * factor - Math.sin(i * 0.4) * 0.7;
    const tNnpp = nnpp + (5.4 - nnpp) * factor + Math.cos(i * 0.8) * 0.3;
    const tCoal = coalition + (4.8 - coalition) * factor + Math.sin(i * 0.9) * 0.4;
    const sdp = 2.8 + Math.cos(i * 1.1) * 0.1;
    const adp = 1.7 + Math.sin(i * 1.5) * 0.05;
    
    let dateStr = "";
    if (range === "7d") {
      dateStr = `Jun ${12 - (6 - i)}`;
    } else if (range === "30d") {
      dateStr = `May ${13 + i}`;
    } else if (range === "6m") {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      dateStr = `${months[Math.floor(i / 2) % 6]} W${(i % 2) + 1}`;
    } else {
      dateStr = `M${i + 1}`;
    }

    list.push({
      name: dateStr,
      "Labour Party": parseFloat(tLp.toFixed(1)),
      "PDP": parseFloat(tPdp.toFixed(1)),
      "APC": parseFloat(tApc.toFixed(1)),
      "NNPP": parseFloat(tNnpp.toFixed(1)),
      "Emerging Coalition": parseFloat(tCoal.toFixed(1)),
      "SDP": parseFloat(sdp.toFixed(1)),
      "ADP": parseFloat(adp.toFixed(1)),
    });
  }
  return list;
};

interface ForecastProps {
  parties: Party[];
}

export default function ForecastSection({ parties }: ForecastProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "6m" | "1y">("30d");
  const data = generateTimelineData(timeRange);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="election-forecast-engine">
      {/* LEFT COLUMN: DYNAMIC AREA CHART */}
      <div className="lg:col-span-9 bg-[#090e1a]/85 border border-[#1a294d] rounded-2xl p-5 flex flex-col h-[600px] shadow-2xl backdrop-blur-md">
        
        {/* Graph Header: Title + Time Picker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#131f3b] pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 px-2 rounded-md bg-[#00f5d4]/10 border border-[#00f5d4]/20 text-[#00f5d4] text-[10px] font-mono font-extrabold">AI STOCHASTIC ENGINE</span>
              <h3 className="text-lg font-bold font-sans text-gray-100 tracking-tight">Party Probability Trends</h3>
            </div>
            <p className="text-xs text-gray-400 mt-1">Projected win probability with historical regression and confidence intervals</p>
          </div>

          <div className="flex gap-1.5 bg-[#0f192b] p-1 rounded-lg border border-[#1b2f57] self-end sm:self-auto">
            {Object.entries({
              "7d": "7 Days",
              "30d": "30 Days",
              "6m": "6 Months",
              "1y": "1 Year"
            }).map(([key, label]) => (
              <button
                key={key}
                id={`btn-timeline-${key}`}
                onClick={() => setTimeRange(key as any)}
                className={`px-3 py-1 rounded text-xs transition-all ${
                  timeRange === key 
                    ? "bg-[#00f5d4] text-[#050b14] font-bold shadow-md" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-[#142340]/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend pills matching the Screen 6 details */}
        <div className="flex flex-wrap gap-2.5 mb-5" id="forecast-party-legend">
          {parties.map(p => (
            <div 
              key={p.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#142340] bg-[#0c1424] text-xs font-medium"
            >
              <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: p.color }} />
              <span className="text-gray-300 font-sans">{p.short}</span>
              <strong className="text-gray-100 font-mono pl-1">{p.prob.toFixed(1)}%</strong>
              <span className={`text-[10px] font-bold ${p.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {p.change >= 0 ? `+${p.change}` : p.change}%
              </span>
            </div>
          ))}
        </div>

        {/* Interactive Recharts Canvas Wrapper */}
        <div className="flex-1 w-full text-xs font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -22, bottom: 5 }}>
              <defs>
                <linearGradient id="lpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e36414" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#e36414" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="pdpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0077b6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0077b6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="apcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00b4d8" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#00b4d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#101c36" vertical={false} />
              <XAxis dataKey="name" stroke="#5d6f8f" tickLine={false} />
              <YAxis domain={[0, 50]} stroke="#5d6f8f" tickLine={false} unit="%" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#0d1424", 
                  borderColor: "#1d2e54", 
                  color: "#d1d5db",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontFamily: "Inter, sans-serif"
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="Labour Party" 
                stroke="#e36414" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#lpGrad)" 
              />
              <Area 
                type="monotone" 
                dataKey="PDP" 
                stroke="#0077b6" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#pdpGrad)" 
              />
              <Area 
                type="monotone" 
                dataKey="APC" 
                stroke="#00b4d8" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#apcGrad)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* RIGHT COLUMN: AI SUMMARY AND REGIONAL ALERTS */}
      <div className="lg:col-span-3 flex flex-col gap-6" id="forecast-analytics-sidebar">
        
        {/* Leader Summary card */}
        <div className="bg-[#090e1a]/85 border border-[#1a294d] rounded-2xl p-5 backdrop-blur-md shadow-2xl flex flex-col justify-between">
          <div className="border-b border-[#131f3b] pb-3 mb-4 flex items-center justify-between">
            <h3 className="text-xs font-bold font-sans text-gray-200 tracking-wider uppercase">AI Forecast Summary</h3>
            <span className="text-[9px] text-emerald-400 font-mono">LIVE MATRIX</span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block mb-1">Current Leader</span>
              <div className="flex justify-between items-baseline bg-[#080d1a] border border-[#131f3c] rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#e36414] rounded-full inline-block shrink-0" />
                  <span className="text-sm font-bold text-gray-100">Labour Party</span>
                </div>
                <strong className="text-xl font-bold text-gray-500 font-mono">34.2%</strong>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block mb-1">Rising Opposition</span>
              <div className="flex justify-between items-baseline bg-[#080d1a] border border-[#131f3c] rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#00b4d8] rounded-full inline-block shrink-0 animate-pulse" />
                  <span className="text-sm font-bold text-gray-100">APC</span>
                </div>
                <strong className="text-sm text-emerald-400 font-bold font-mono">+4.2% <span className="text-[10px] font-medium text-gray-400">7d momentum</span></strong>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Alert Signals Box */}
        <div className="bg-[#090e1a]/85 border border-[#1a294d] rounded-2xl p-5 backdrop-blur-md shadow-2xl flex-1 flex flex-col">
          <div className="border-b border-[#131f3b] pb-3 mb-4">
            <h3 className="text-xs font-bold font-sans text-gray-200 tracking-wider uppercase">Regional Warnings</h3>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-3 rounded-xl bg-orange-950/15 border border-orange-500/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-orange-400">North-Central instability</h4>
                  <p className="text-[11px] text-gray-300 mt-1 leading-snug">
                    Unprecedented youth voter registrations surge shifts swing index towards PDP/LP in Benue and Plateau.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-red-950/15 border border-red-500/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-red-500">Southwest Voter Volatility</h4>
                  <p className="text-[11px] text-gray-300 mt-1 leading-snug">
                    Urban petroleum queues increase dissatisfaction. Progressive voter base split logged across Lagos polling units.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#091a24] border border-[#2a6d4e]/30">
              <div className="flex items-start gap-2">
                <Compass className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-400">Northwest Fragmentation</h4>
                  <p className="text-[11px] text-gray-300 mt-1 leading-snug">
                    NNPP mobilization base consolidates around local chieftains in Kano, pulling core points away from national blocks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
