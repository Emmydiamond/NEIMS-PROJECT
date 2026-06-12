import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Search, 
  Bell, 
  User, 
  MapPin, 
  Radio, 
  HelpCircle, 
  ListFilter, 
  Activity, 
  Calendar, 
  Users, 
  Layers, 
  TrendingUp, 
  MessageSquare, 
  Network,
  RotateCcw,
  Sparkles,
  Award
} from "lucide-react";
import { MarketMetric, Party, IntelEvent } from "./types";

// Import custom sections
import OverviewSection from "./components/OverviewSection";
import LiveFeedSection from "./components/LiveFeedSection";
import ForecastSection from "./components/ForecastSection";
import ExplainableSection from "./components/ExplainableSection";
import KnowledgeGraphSection from "./components/KnowledgeGraphSection";
import { useFirebase } from "./components/FirebaseContext";

export default function App() {
  const { user, loading: fbLoading, signInWithGoogle, logout, realTimeSignals } = useFirebase();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [metrics, setMetrics] = useState<Record<string, MarketMetric>>({});
  const [parties, setParties] = useState<Party[]>([]);
  const [events, setEvents] = useState<IntelEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [unreadAlerts, setUnreadAlerts] = useState<number>(3);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [matchingEntitiesResult, setMatchingEntitiesResult] = useState<string[]>([]);

  // Fetch initial datasets from the express simulation server
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const response = await fetch("/api/data");
      const data = await response.json();
      setMetrics(data.metrics);
      setParties(data.parties);
      setEvents(data.events);
    } catch (err) {
      console.error("Failed to load political data from backend, utilizing rules fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  // Perform lightweight instant entities search as typed
  useEffect(() => {
    if (!searchQuery.trim()) {
      setMatchingEntitiesResult([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const matches: string[] = [];
    
    if ("peter obi lp labour".includes(query)) matches.push("Obi (LP Node): Active leading contender.");
    if ("bola tinubu apc legacy".includes(query)) matches.push("Tinubu (APC Node): Incumbent flagbearer.");
    if ("atiku abubakar pdp northern".includes(query)) matches.push("Atiku (PDP Node): Traditional coalition base.");
    if ("fuel price subsidy spikes inflation".includes(query)) matches.push("Fuel subsidy spikes: Disruption impact 87%.");
    if ("lagos state sw southwest".includes(query)) matches.push("Lagos hub: Split sentiments logged.");
    if ("kano state nw northwest".includes(query)) matches.push("Kano hub: Heavy NNPP traction logged.");

    setMatchingEntitiesResult(matches);
  }, [searchQuery]);

  const handleAddEventAlert = (count: number) => {
    setUnreadAlerts(prev => prev + count);
  };

  const handleResetAlerts = () => {
    setUnreadAlerts(0);
  };

  if (loading || fbLoading) {
    return (
      <div className="min-h-screen bg-[#040812] flex flex-col items-center justify-center text-xs text-gray-400 gap-2 font-mono">
        <Shield className="w-8 h-8 text-[#00f5d4] animate-spin" />
        <span>Initializing Safe-Haven Tactical Intelligence Terminal...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040812] text-gray-200 font-sans flex flex-col antialiased">
      
      {/* GLOBAL HEADER BAR */}
      <header className="sticky top-0 z-50 bg-[#040812]/90 border-b border-[#142340]/80 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* LOGO & TITLE */}
        <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => setActiveTab("overview")}>
          <div className="p-1 px-1.5 rounded-lg bg-gradient-to-br from-teal-500/20 to-blue-500/10 border border-[#00f5d4]/30 shadow-[0_0_12px_rgba(0,245,212,0.15)] flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#00f5d4]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black font-sans tracking-tight text-white uppercase">NEIMS</span>
              <span className="h-4 w-px bg-slate-800" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden sm:inline-block">Intelligence System</span>
            </div>
            <p className="text-[8.5px] font-mono text-gray-500 uppercase tracking-widest hidden sm:block">National Election Intelligence Monitoring System</p>
          </div>
        </div>

        {/* SEARCH BAR (INTELLIGENT KNOWLEDGE AUTOCOMPLETE) */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              id="global-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search regions, candidates, events..."
              className="w-full bg-[#070c18] border border-[#142340] hover:border-[#1e3465] rounded-xl pl-10 pr-4 py-2 text-xs text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-[#00f5d4] transition-all font-sans"
            />
          </div>
          
          {/* Autocomplete result dropdown */}
          {matchingEntitiesResult.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0a101f] border border-[#1b315c] rounded-xl p-2 shadow-2xl z-50 text-xs">
              <span className="text-[9px] text-[#00f5d4] uppercase tracking-widest font-mono font-bold px-2 py-1 block border-b border-[#142340] mb-1">Matching Entity Nodes</span>
              {matchingEntitiesResult.map((res, i) => (
                <div 
                  key={i} 
                  className="p-2 py-1.5 hover:bg-[#121c33] hover:text-white rounded-lg cursor-pointer text-gray-300 font-sans transition-all"
                  onClick={() => {
                    setSearchQuery("");
                    // Navigate to appropriate workspace tab
                    if (res.includes("Subsidy") || res.includes("Lagos")) setActiveTab("livefeed");
                    else if (res.includes("Contender") || res.includes("Tinubu") || res.includes("Atiku")) setActiveTab("graph");
                    else setActiveTab("explainable");
                  }}
                >
                  {res}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONTROLS (ALERTS, METRICS, PROFILE INTERACTION) */}
        <div className="flex items-center gap-3">
          
          {/* LIVE TACTICAL SYSTEM STATE */}
          <div className="items-center gap-1.5 bg-emerald-950/20 border border-emerald-500/20 rounded-full px-3 py-1 hidden sm:flex shrink-0">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-bold font-mono tracking-wider uppercase text-emerald-400">Tactical Feed: LIVE</span>
          </div>

          {/* BELL BADGE BADGE */}
          <button 
            id="btn-bell-alerts"
            onClick={handleResetAlerts}
            className="p-2 bg-[#0c1424] hover:bg-[#142340]/90 transition-all rounded-xl border border-[#142340] relative text-gray-400 hover:text-gray-200 cursor-pointer"
            title="Clear Feed Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {unreadAlerts}
              </span>
            )}
          </button>

          <span className="h-6 w-px bg-[#142340] hidden sm:block" />

          {/* PROFILE DROP DOWN MENU */}
          <div className="relative">
            {user ? (
              <>
                <button
                  id="btn-user-profile"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[#00f5d4]/30 bg-[#0c1424]/80 hover:bg-[#121c33] transition-all cursor-pointer"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || "User"} 
                      className="w-6 h-6 rounded-full border border-[#00f5d4]/40" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00f5d4] to-blue-500 text-[#050b14] font-black text-xs flex items-center justify-center uppercase shrink-0">
                      {(user.displayName || user.email || "US").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                  )}
                  <div className="text-left hidden sm:block max-w-[120px]">
                    <span className="text-[11px] font-bold text-gray-200 block truncate">{user.displayName || "Ella Alao"}</span>
                    <span className="text-[9px] text-[#00f5d4] font-semibold font-mono tracking-widest block uppercase">Level 5 Clearance</span>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-2 w-52 bg-[#0a101f] border border-[#1a294d] rounded-xl p-3 shadow-2xl z-[100] text-xs">
                    <p className="text-gray-400 font-semibold uppercase tracking-widest text-[8.5px] px-2 mb-2 border-b border-[#131f3c] pb-1.5">Authorized Analyst</p>
                    <div className="px-2 py-1 text-[10px] text-gray-500 font-mono truncate mb-2">{user.email}</div>
                    <div className="p-2 hover:bg-[#142340]/60 hover:text-white rounded-lg cursor-pointer transition-all">Command Console settings</div>
                    <div className="p-2 hover:bg-[#142340]/60 hover:text-white rounded-lg cursor-pointer transition-all">Audit Logs & Access Keys</div>
                    <button 
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left p-2 hover:bg-red-950/40 hover:text-red-400 rounded-lg cursor-pointer text-red-400 font-bold transition-all border-t border-[#131f3c]/40 mt-1.5 pt-2"
                    >
                      Close Session
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                id="btn-gmail-login"
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#00f5d4] bg-[#00f5d4]/10 hover:bg-[#00f5d4]/20 text-white font-bold text-xs transition-all cursor-pointer shadow-[0_0_12px_rgba(0,245,212,0.1)]"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[#00f5d4]">Login with Gmail</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* CORE FRAME LAYOUT */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* SIDE BAR SELECTION MENUS */}
        <aside className="w-full lg:w-64 bg-[#050a14] border-b lg:border-b-0 lg:border-r border-[#142340]/80 p-4 shrink-0 space-y-4">
          <div className="text-xs text-gray-500 uppercase tracking-widest font-bold font-mono pl-2 hidden lg:block">INTELLIGENCE TERMINAL</div>
          
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible custom-scrollbar pb-2 lg:pb-0">
            <button
              id="sidebar-btn-overview"
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all uppercase shrink-0 w-auto lg:w-full text-left ${
                activeTab === "overview" 
                  ? "bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/20 font-bold" 
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#0d1424]/50"
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span>System Overview</span>
            </button>

            <button
              id="sidebar-btn-livefeed"
              onClick={() => setActiveTab("livefeed")}
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all uppercase shrink-0 w-auto lg:w-full text-left ${
                activeTab === "livefeed" 
                  ? "bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/20 font-bold" 
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#0d1424]/50"
              }`}
            >
              <Radio className="w-4 h-4 shrink-0" />
              <span>Live Intel Feed</span>
              {unreadAlerts > 0 && (
                <span className="bg-red-500 text-white rounded-full text-[8.5px] px-1.5 py-0.5 ml-auto font-black font-mono animate-pulse">
                  {unreadAlerts}
                </span>
              )}
            </button>

            <button
              id="sidebar-btn-forecast"
              onClick={() => setActiveTab("forecast")}
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all uppercase shrink-0 w-auto lg:w-full text-left ${
                activeTab === "forecast" 
                  ? "bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/20 font-bold" 
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#0d1424]/50"
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>Forecast Engine</span>
            </button>

            <button
              id="sidebar-btn-explainable"
              onClick={() => setActiveTab("explainable")}
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all uppercase shrink-0 w-auto lg:w-full text-left ${
                activeTab === "explainable" 
                  ? "bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/20 font-bold" 
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#0d1424]/50"
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Explainable AI</span>
            </button>

            <button
              id="sidebar-btn-graph"
              onClick={() => setActiveTab("graph")}
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all uppercase shrink-0 w-auto lg:w-full text-left ${
                activeTab === "graph" 
                  ? "bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/20 font-bold" 
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#0d1424]/50"
              }`}
            >
              <Network className="w-4 h-4 shrink-0" />
              <span>Knowledge Graph</span>
            </button>
          </nav>

          {/* Static credits section hidden on mobile */}
          <div className="absolute bottom-6 left-4 right-4 bg-[#0a0f1d] border border-[#1b315c]/20 p-3 rounded-xl hidden lg:block">
            <span className="text-[9.5px] uppercase font-bold text-[#00f5d4] tracking-widest font-mono">NEIMS SECURE UNIT</span>
            <p className="text-[10px] text-gray-500 leading-relaxed font-sans mt-1">
              Encrypted under Operations Directive 92-A. Handled strictly for authorized analysts.
            </p>
          </div>
        </aside>

        {/* PRIMARY WORK SPACE CONTAINER */}
        <main className="flex-1 bg-[#040812] p-4 sm:p-6 overflow-y-auto w-full">
          {activeTab === "overview" && (
            <OverviewSection 
              metrics={metrics} 
              onNavigateToTab={(tabId) => setActiveTab(tabId)} 
            />
          )}

          {activeTab === "livefeed" && (
            <LiveFeedSection 
              initialEvents={[...realTimeSignals, ...events]} 
              onAddEventAlert={handleAddEventAlert} 
            />
          )}

          {activeTab === "forecast" && (
            <ForecastSection parties={parties} />
          )}

          {activeTab === "explainable" && (
            <ExplainableSection />
          )}

          {activeTab === "graph" && (
            <KnowledgeGraphSection />
          )}
        </main>

      </div>

    </div>
  );
}
