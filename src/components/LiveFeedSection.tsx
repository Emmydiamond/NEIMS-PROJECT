import React, { useState, useEffect, useRef } from "react";
import { 
  AlertTriangle, 
  Search, 
  Activity, 
  Zap, 
  Clock, 
  User, 
  Volume2, 
  TrendingUp, 
  Smartphone, 
  Filter, 
  Network 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { IntelEvent } from "../types";
import { useFirebase } from "./FirebaseContext";

interface LiveFeedProps {
  initialEvents: IntelEvent[];
  onAddEventAlert: (count: number) => void;
}

export default function LiveFeedSection({ initialEvents, onAddEventAlert }: LiveFeedProps) {
  const { user, addCustomSignal } = useFirebase();
  const [events, setEvents] = useState<IntelEvent[]>(initialEvents);
  
  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const [filterType, setFilterType] = useState<string>("ALL");
  const [selectedEvent, setSelectedEvent] = useState<IntelEvent | null>(initialEvents[0]);
  const [radarSweepAngle, setRadarSweepAngle] = useState(0);

  // Form states for creating custom political alerts
  const [showAddSignal, setShowAddSignal] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDetails, setFormDetails] = useState("");
  const [formType, setFormType] = useState("POLITICAL");
  const [formSeverity, setFormSeverity] = useState<"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">("MEDIUM");
  const [formCategory, setFormCategory] = useState<"Positive" | "Negative" | "Neutral">("Neutral");
  const [formImpact, setFormImpact] = useState(50);
  const [formAiConfidence, setFormAiConfidence] = useState(80);
  const [signalSubmitting, setSignalSubmitting] = useState(false);
  
  // Real-time scrolling feeds simulator
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Simulated events pool
  const simulatedPool = [
    {
      type: "SOCIAL",
      severity: "HIGH",
      category: "Negative",
      title: "Anomalous bot campaign detected targeting South-South coalition narratives",
      impact: 69,
      aiConfidence: 96,
      time: "Just now",
      details: "An automated brigade of over 4,000 accounts identified driving synthetic polarization ahead of the Delta State local government debates. Triangulation suggests automated server origins."
    },
    {
      type: "GOVERNMENT",
      severity: "LOW",
      category: "Positive",
      title: "Supreme Court ratifies governorship thresholds in central safe havens",
      impact: 42,
      aiConfidence: 98,
      time: "Just now",
      details: "A 7-to-0 panel decision stabilizes territorial administrative transitions in Plateau and Nasarawa, reducing localized tension matrices significantly."
    },
    {
      type: "POLITICAL",
      severity: "CRITICAL",
      category: "Negative",
      title: "Factional leadership disputes trigger local ward exit polls adjustments",
      impact: 84,
      aiConfidence: 79,
      time: "Just now",
      details: "Spontaneous boycotts over delegates selection logs in Rivers State lead to point transfers. Labour Party moves +0.6% on local structural swing metrics."
    },
    {
      type: "ECONOMIC",
      severity: "MEDIUM",
      category: "Neutral",
      title: "National Grid registers mild volatility in industrial manufacturing nodes",
      impact: 51,
      aiConfidence: 92,
      time: "Just now",
      details: "Power stabilization margins fluctuate by 8% in Ikeja and Aba industrial zones, influencing micro-sentiment scores slightly regarding infrastructure responsiveness parameters."
    }
  ];

  // Tick the radar sweep angle
  useEffect(() => {
    const handle = requestAnimationFrame(function sweep() {
      setRadarSweepAngle(prev => (prev + 1.2) % 360);
      requestAnimationFrame(sweep);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // Interval-based live intelligence push
  useEffect(() => {
    const timer = setInterval(() => {
      // Pick a random event from the simulation pool
      const baseObj = simulatedPool[Math.floor(Math.random() * simulatedPool.length)];
      const newEvent: IntelEvent = {
        id: `evt-dyn-${Date.now()}`,
        type: baseObj.type,
        severity: baseObj.severity as any,
        category: baseObj.category as any,
        title: baseObj.title,
        impact: baseObj.impact,
        aiConfidence: baseObj.aiConfidence,
        time: "Just now",
        details: baseObj.details
      };

      setEvents(prev => {
        // limit size to 15 items to prevent browser lag
        const updated = [newEvent, ...prev.map(e => {
          // Adjust dynamic time strings for existing list items
          if (e.time === "Just now") return { ...e, time: "1 min ago" };
          if (e.time.includes("min ago")) {
            const minNum = parseInt(e.time);
            return { ...e, time: `${minNum + 1} min ago` };
          }
          return e;
        })];
        return updated.slice(0, 15);
      });

      // Increase unread alerts count
      onAddEventAlert(1);

      // Auto-focus new event
      setSelectedEvent(newEvent);
    }, 14000); // Push every 14 seconds

    return () => clearInterval(timer);
  }, []);

  const filteredEvents = events.filter(e => filterType === "ALL" || e.type === filterType);

  const handleCreateSignal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !addCustomSignal) return;
    if (!formTitle.trim() || !formDetails.trim()) return;

    setSignalSubmitting(true);
    try {
      await addCustomSignal(
        formTitle,
        formDetails,
        formType,
        formSeverity,
        formCategory,
        formImpact,
        formAiConfidence
      );
      setFormTitle("");
      setFormDetails("");
      setFormType("POLITICAL");
      setFormSeverity("MEDIUM");
      setFormCategory("Neutral");
      setFormImpact(50);
      setFormAiConfidence(80);
      setShowAddSignal(false);
    } catch (err) {
      console.error("Failed to post custom signal:", err);
    } finally {
      setSignalSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="com-live-intelligence-feed">
      {/* LEFT COLUMN: EVENT LIST */}
      <div className="lg:col-span-8 bg-[#090e1a]/85 border border-[#1a294d] rounded-2xl p-5 flex flex-col h-[700px] shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        {/* Sub Header & Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#131f3b] pb-4 mb-4 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <h3 className="text-lg font-bold font-sans text-gray-100 tracking-tight">Event Stream</h3>
            </div>
            <p className="text-xs text-gray-400 mt-1">Real-time political, economic and social signals</p>
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-[#0f192b] p-1 rounded-lg border border-[#1d2f59]">
            {["ALL", "POLITICAL", "ECONOMIC", "COALITION", "SOCIAL", "GOVERNMENT"].map((type) => (
              <button
                key={type}
                id={`btn-filter-${type.toLowerCase()}`}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-md transition-all ${
                  filterType === type 
                    ? "bg-[#00f5d4] text-[#050b14] font-bold" 
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {!user ? (
          <div className="bg-[#141b2a]/60 border border-[#1b315c]/40 rounded-xl p-3 mb-4 text-xs text-gray-400 flex items-center justify-between gap-2 shrink-0">
            <div>
              <span className="font-semibold text-amber-500 block mb-0.5">🔒 SECURE BROADCASTING SHIELD INACTIVE</span>
              Want to insert custom political signal alerts to the state dashboard? Connect your accredited Gmail account in the top-right menu.
            </div>
          </div>
        ) : (
          <div className="mb-4 shrink-0">
            {!showAddSignal ? (
              <button
                id="btn-open-add-signal"
                onClick={() => setShowAddSignal(true)}
                className="w-full bg-[#00f5d4]/10 border border-[#00f5d4]/25 text-[#00f5d4] hover:bg-[#00f5d4]/20 transition-all font-bold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-widest"
              >
                <span>File Electoral Threat Report</span>
                <span className="text-sm">+</span>
              </button>
            ) : (
              <form onSubmit={handleCreateSignal} className="bg-[#0b1222]/90 border border-[#1d3566] rounded-xl p-4 space-y-3 relative">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#00f5d4]/5 blur-xl pointer-events-none" />
                <div className="text-xs font-bold uppercase tracking-widest text-teal-400 border-b border-[#142340] pb-2 mb-2 flex justify-between items-center">
                  <span>New State Intelligence Log</span>
                  <button 
                    type="button" 
                    onClick={() => setShowAddSignal(false)} 
                    className="text-gray-500 hover:text-gray-300 text-xs font-semibold px-1.5 cursor-pointer lowercase"
                  >
                    cancel
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-gray-400 block mb-1">Alert Headline</label>
                    <input 
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Incumbent campaign faces local delegate disputes in Port Harcourt"
                      className="w-full bg-[#040812] border border-[#192b51] rounded-lg px-3 py-1.5 text-xs text-gray-100 placeholder:text-gray-700 focus:outline-none focus:border-[#00f5d4]"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-bold text-gray-400 block mb-1">Signal Sector</label>
                    <select 
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full bg-[#040812] border border-[#192b51] rounded-lg px-2 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-[#00f5d4]"
                    >
                      <option value="POLITICAL">POLITICAL</option>
                      <option value="ECONOMIC">ECONOMIC</option>
                      <option value="COALITION">COALITION</option>
                      <option value="SOCIAL">SOCIAL</option>
                      <option value="GOVERNMENT">GOVERNMENT</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-400 block mb-1">Factual Investigative Details (Incident logs)</label>
                  <textarea 
                    required
                    value={formDetails}
                    onChange={(e) => setFormDetails(e.target.value)}
                    placeholder="Provide full operational details, verified outlets, affected ward numbers, and specific local geopolitical metrics impacted..."
                    className="w-full bg-[#040812] border border-[#192b51] rounded-lg px-3 py-1.5 text-xs text-gray-100 placeholder:text-gray-700 focus:outline-none focus:border-[#00f5d4] h-16 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-gray-400 block mb-1">Severity</label>
                    <select 
                      value={formSeverity}
                      onChange={(e) => setFormSeverity(e.target.value as any)}
                      className="w-full bg-[#040812] border border-[#192b51] rounded-lg px-2 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-[#00f5d4]"
                    >
                      <option value="CRITICAL">CRITICAL</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-bold text-gray-400 block mb-1">Direct Bias Category</label>
                    <select 
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full bg-[#040812] border border-[#192b51] rounded-lg px-2 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-[#00f5d4]"
                    >
                      <option value="Positive">Positive</option>
                      <option value="Negative">Negative</option>
                      <option value="Neutral">Neutral</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[9px] uppercase font-bold text-gray-400 block mb-1">Impact (0-100)</label>
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={formImpact}
                        onChange={(e) => setFormImpact(Number(e.target.value))}
                        className="w-full bg-[#040812] border border-[#192b51] rounded-lg px-2 py-1 text-xs text-gray-100 focus:outline-none focus:border-[#00f5d4]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[9px] uppercase font-bold text-gray-400 block mb-1">AI Proof (%)</label>
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={formAiConfidence}
                        onChange={(e) => setFormAiConfidence(Number(e.target.value))}
                        className="w-full bg-[#040812] border border-[#192b51] rounded-lg px-2 py-1 text-xs text-gray-100 focus:outline-none focus:border-[#00f5d4]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1 justify-end">
                  <button 
                    type="button"
                    onClick={() => setShowAddSignal(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-gray-200 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={signalSubmitting}
                    className="bg-[#00f5d4] text-[#050b14] hover:bg-[#00e1cf] disabled:opacity-50 font-bold text-xs px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {signalSubmitting ? "Syncing..." : "Publish Log"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Live List Stream with Custom Layout */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar" ref={logsContainerRef}>
          <AnimatePresence initial={false}>
            {filteredEvents.map((item) => {
              const isSelected = selectedEvent?.id === item.id;
              
              const severityColors = {
                CRITICAL: "border-l-4 border-l-red-500 bg-red-950/10 hover:bg-red-950/20",
                HIGH: "border-l-4 border-l-orange-500 bg-orange-950/10 hover:bg-orange-950/20",
                MEDIUM: "border-l-4 border-l-yellow-500 bg-yellow-950/10 hover:bg-yellow-950/20",
                LOW: "border-l-4 border-l-[#00f5d4] bg-teal-950/10 hover:bg-teal-950/20",
              };

              return (
                <motion.div
                  key={item.id}
                  id={`item-${item.id}`}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  onClick={() => setSelectedEvent(item)}
                  className={`p-4 rounded-xl cursor-pointer border ${
                    isSelected ? "border-[#00f5d4] bg-[#0c1c38]/90" : "border-[#142340] bg-[#0c1424]"
                  } ${severityColors[item.severity]} transition-all duration-150 shadow-md flex justify-between gap-4 items-start`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded ${
                        item.severity === "CRITICAL" ? "bg-red-500/20 text-red-400 border border-red-500/30" : 
                        item.severity === "HIGH" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" :
                        item.severity === "MEDIUM" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                        "bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/20"
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-600" />
                        {item.time}
                      </span>
                      {item.time === "Just now" && (
                        <span className="bg-[#00f5d4] text-[#050b14] bold py-0.5 px-1.5 rounded-full text-[8.5px] scale-90 animate-pulse font-extrabold tracking-wider">
                          NEW
                        </span>
                      )}
                    </div>
                    
                    <h4 className="text-sm font-sans font-medium text-gray-200 tracking-tight mb-2 leading-snug">
                      {item.title}
                    </h4>

                    {/* Footer values */}
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1.5 text-red-400">
                        <TrendingUp className="w-3.5 h-3.5 text-red-500/80" />
                        Impact Matrix: <strong className="font-semibold text-gray-300">{item.impact}</strong>
                      </span>
                      <span className="text-[#00f5d4] font-medium flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />
                        AI triangulation: {item.aiConfidence}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded font-extrabold capitalize ${
                      item.category === "Negative" ? "text-red-400 bg-red-950/20" :
                      item.category === "Positive" ? "text-green-400 bg-green-950/20" :
                      "text-gray-400 bg-gray-950/20"
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      ID: {item.id.slice(-5)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT COLUMN: ANALYTICAL SIGNAL RADAR SWEET AND DETAIL */}
      <div className="lg:col-span-4 flex flex-col gap-6" id="panel-signal-threats">
        
        {/* Radar Triangulation Panel */}
        <div className="bg-[#090e1a]/85 border border-[#1a294d] rounded-2xl p-5 backdrop-blur-md shadow-2xl flex flex-col items-center">
          <div className="w-full flex justify-between items-center border-b border-[#131f3b] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Network className="w-4.5 h-4.5 text-[#00f5d4]" />
              <h3 className="text-sm font-bold font-sans text-gray-200 tracking-wider uppercase">AI Signal Analysis</h3>
            </div>
            <span className="text-[9px] text-emerald-400 font-mono tracking-widest bg-emerald-900/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ACTIVE
            </span>
          </div>

          {/* Sweep Radar System Graphic */}
          <div className="relative w-48 h-48 bg-[#040812] border-2 border-[#13234d] rounded-full flex items-center justify-center overflow-hidden my-2 shadow-[0_0_20px_rgba(0,245,212,0.05)]">
            
            {/* Center node */}
            <div className="w-2.5 h-2.5 bg-[#00f5d4] rounded-full z-20 shadow-[0_0_12px_#00f5d4]" />
            
            {/* Radar rings */}
            <div className="absolute w-40 h-40 border border-[#13234d]/50 rounded-full" />
            <div className="absolute w-30 h-30 border border-[#13234d]/40 rounded-full" />
            <div className="absolute w-20 h-20 border border-[#13234d]/25 rounded-full" />
            <div className="absolute w-10 h-10 border border-[#13234d]/15 rounded-full" />

            {/* Sweep Angle */}
            <div 
              style={{ transform: `rotate(${radarSweepAngle}deg)` }} 
              className="absolute w-full h-full origin-center z-10 pointer-events-none"
            >
              <div className="absolute top-0 left-1/2 w-[2px] h-[96px] bg-gradient-to-t from-transparent to-[#00f5d4] opacity-50" />
              <div 
                className="absolute top-0 left-1/2 w-20 h-[96px] bg-[#00f5d4]/10 origin-bottom-left"
                style={{ 
                  transform: "rotate(-25deg)",
                  clipPath: "polygon(0 0, 100% 0, 0 100%)" 
                }} 
              />
            </div>

            {/* Simulated Ping dots */}
            <div className="absolute top-[35%] left-[25%] w-2 h-2 bg-[#e36414] rounded-full animate-pulse shadow-[0_0_6px_#e36414]" title="LP Surge Node" />
            <div className="absolute top-[65%] left-[45%] w-1.5 h-1.5 bg-[#ffd166] rounded-full animate-ping opacity-60" />
            <div className="absolute top-[20%] left-[70%] w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgb(239,68,68)]" title="Lagos Subsidy Hub" />
            <div className="absolute top-[55%] left-[75%] w-1.5 h-1.5 bg-[#00f5d4] rounded-full shadow-[0_0_4px_#00f5d4]" />
          </div>

          <p className="text-[10px] text-gray-400 font-mono text-center tracking-tight mt-3">
            Multi-source intelligence triangulation active
          </p>
        </div>

        {/* Threat Indicators Progress */}
        <div className="bg-[#090e1a]/85 border border-[#1a294d] rounded-2xl p-5 backdrop-blur-md shadow-2xl flex-1 flex flex-col justify-between">
          <div className="border-b border-[#131f3b] pb-3 mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold font-sans text-gray-200 tracking-wider uppercase">Threat Indicators</h3>
            <span className="text-[10px] text-gray-400 font-mono">Real-time weights</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-gray-300 font-medium mb-1">
                <span>Urban Negative Sentiment</span>
                <span className="text-red-400 font-bold">73%</span>
              </div>
              <div className="w-full bg-[#050b15] h-1.5 rounded-full overflow-hidden border border-[#17223b]">
                <div className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full" style={{ width: "73%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-300 font-medium mb-1">
                <span>Coalition Volatility</span>
                <span className="text-orange-400 font-bold">68%</span>
              </div>
              <div className="w-full bg-[#050b15] h-1.5 rounded-full overflow-hidden border border-[#17223b]">
                <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full" style={{ width: "68%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-300 font-medium mb-1">
                <span>Economic Dissatisfaction</span>
                <span className="text-red-400 font-bold">81%</span>
              </div>
              <div className="w-full bg-[#050b15] h-1.5 rounded-full overflow-hidden border border-[#17223b]">
                <div className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full" style={{ width: "81%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-300 font-medium mb-1">
                <span>Opposition Activity Surge</span>
                <span className="text-teal-400 font-bold">64%</span>
              </div>
              <div className="w-full bg-[#050b15] h-1.5 rounded-full overflow-hidden border border-[#17223b]">
                <div className="bg-gradient-to-r from-teal-500 to-[#00f5d4] h-full rounded-full" style={{ width: "64%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-300 font-medium mb-1">
                <span>Regional Security Tensions</span>
                <span className="text-yellow-400 font-bold">56%</span>
              </div>
              <div className="w-full bg-[#050b15] h-1.5 rounded-full overflow-hidden border border-[#17223b]">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-300 h-full rounded-full" style={{ width: "56%" }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* EVENT DETAILED DIALOG / DRAWER POPUP IN VIEW */}
      {selectedEvent && (
        <div className="col-span-full bg-[#0d1424] border border-[#1c325c] rounded-2xl p-5 shadow-2xl relative overflow-hidden" id="card-event-details">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-3xl rounded-full" />
          <div className="flex items-center justify-between mb-3 border-b border-[#1c2e54]/50 pb-2">
            <span className="text-xs text-[#00f5d4] uppercase tracking-widest font-bold font-sans">Triangulated Signal Matrix</span>
            <span className="text-xs text-gray-400 font-mono">INEC SWING INDEX CALCULATION</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-base font-bold text-gray-100 mb-1">{selectedEvent.title}</h4>
              <p className="text-sm text-gray-300 leading-relaxed max-w-4xl">{selectedEvent.details}</p>
            </div>
            
            <div className="flex flex-row md:flex-col items-center gap-3 shrink-0 bg-[#070b13] p-4 rounded-xl border border-[#1a294d] w-full md:w-auto">
              <div>
                <span className="text-[10px] text-gray-400 block tracking-wider font-semibold">AI CLASSIFIER CONFIDENCE</span>
                <strong className="text-lg font-bold text-[#00f5d4]">{selectedEvent.aiConfidence}%</strong>
              </div>
              <div className="h-px w-full bg-[#142240] hidden md:block" />
              <div>
                <span className="text-[10px] text-amber-400 block tracking-wider font-semibold">REGIONAL DISRUPTION INDEX</span>
                <strong className="text-lg font-bold text-red-400">{selectedEvent.impact}/100</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
