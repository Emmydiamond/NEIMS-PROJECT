import React, { useState } from "react";
import { Share2, HelpCircle, Network, User, Globe, AlertTriangle, Info, ZoomIn, Compass } from "lucide-react";

interface Node {
  id: string;
  label: string;
  type: "party" | "candidate" | "region" | "event";
  size: number;
  color: string;
  x: number;
  y: number;
  details: string;
}

interface Edge {
  source: string;
  target: string;
  label: string;
}

export default function KnowledgeGraphSection() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [filterType, setFilterType] = useState<string>("ALL");

  const nodes: Node[] = [
    { id: "LP", label: "Labour Party (LP)", type: "party", size: 28, color: "#e36414", x: 260, y: 180, details: "Opposition party logging unprecedented rise driven by high youth mobilization." },
    { id: "APC", label: "All Progressives Congress (APC)", type: "party", size: 28, color: "#00b4d8", x: 540, y: 180, details: "Ruling party holding core structures across Northern and Southwest hubs." },
    { id: "PDP", label: "People's Democratic Party (PDP)", type: "party", size: 28, color: "#0077b6", x: 400, y: 340, details: "Main traditional opposition with deep administrative networks nationally." },
    { id: "Obi", label: "Peter Obi", type: "candidate", size: 22, color: "#ff823b", x: 140, y: 100, details: "LP presidential candidate. High polling concentration in southern metropolitan centers." },
    { id: "Tinubu", label: "Bola Tinubu", type: "candidate", size: 22, color: "#4cc9f0", x: 660, y: 100, details: "APC presidential candidate, relying on Southwest political structures and regional alliances." },
    { id: "Atiku", label: "Atiku Abubakar", type: "candidate", size: 22, color: "#023e8a", x: 400, y: 440, details: "PDP presidential nominee with established leverage across several Northern emirates." },
    { id: "Lagos", label: "Lagos State (Southwest)", type: "region", size: 24, color: "#9b5de5", x: 180, y: 280, details: "High-density voter ground registering heavy structural split margins." },
    { id: "Kano", label: "Kano State (Northwest)", type: "region", size: 24, color: "#7209b7", x: 620, y: 280, details: "Crucial Northern block split by NNPP local mobilization campaigns." },
    { id: "FuelSpike", label: "Fuel Subsidy Spikes", type: "event", size: 20, color: "#f72585", x: 400, y: 230, details: "Macroeconomic catalyst increasing public dissatisfaction scores." },
    { id: "YouthVoter", label: "Youth Voter Surge", type: "event", size: 20, color: "#00f5d4", x: 220, y: 390, details: "Unprecedented voter surge driving high record PVC retrieve metrics." },
  ];

  const edges: Edge[] = [
    { source: "LP", target: "Obi", label: "Nominee Flagbearer" },
    { source: "APC", target: "Tinubu", label: "Nominee Flagbearer" },
    { source: "PDP", target: "Atiku", label: "Nominee Flagbearer" },
    { source: "Obi", target: "Lagos", label: "Strong Sentiment base" },
    { source: "Tinubu", target: "Lagos", label: "Legacy Power Base" },
    { source: "LP", target: "YouthVoter", label: "Mobilized By" },
    { source: "FuelSpike", target: "APC", label: "Direct Incumbent Pressure" },
    { source: "FuelSpike", target: "PDP", label: "Opposition Leverage option" },
    { source: "FuelSpike", target: "LP", label: "Opposition Leverage option" },
    { source: "Atiku", target: "Kano", label: "Primary target Swing" },
    { source: "YouthVoter", target: "Lagos", label: "Mass Concentration center" },
  ];

  // Helper check if edge relates to selected node
  const isEdgeHighlighted = (edge: Edge) => {
    if (!selectedNode) return true;
    return edge.source === selectedNode.id || edge.target === selectedNode.id;
  };

  const isNodeHighlighted = (node: Node) => {
    if (!selectedNode) return true;
    if (selectedNode.id === node.id) return true;
    // Highlight if connected by edge
    return edges.some(e => 
      (e.source === selectedNode.id && e.target === node.id) || 
      (e.target === selectedNode.id && e.source === node.id)
    );
  };

  const shownNodes = nodes.filter(n => filterType === "ALL" || n.type === filterType);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="knowledge-graph-workspace">
      
      {/* GRAPH CANVAS COLUMN */}
      <div className="lg:col-span-8 bg-[#090e1a]/85 border border-[#1a294d] rounded-2xl p-5 flex flex-col h-[600px] shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#131f3b] pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-[#00f5d4]" />
              <h3 className="text-sm font-bold font-sans text-gray-100 tracking-wider uppercase">Election Entity Knowledge Graph</h3>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Visualizing cross-entity networks, candidates, geographic regions, and disruption vectors
            </p>
          </div>

          <div className="flex gap-1 bg-[#0f192b] p-1 rounded-lg border border-[#1b2f57] shrink-0">
            {["ALL", "party", "candidate", "region", "event"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase transition-all ${
                  filterType === t 
                    ? "bg-[#00f5d4] text-[#050b14]" 
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Interactive SVG Canvas */}
        <div className="flex-1 bg-[#050a14] border border-[#111e3b] rounded-xl overflow-hidden relative cursor-crosshair">
          <svg className="w-full h-full" viewBox="0 0 800 500">
            {/* Draw connection lines / edges */}
            <g>
              {edges.map((edge, index) => {
                const srcNode = nodes.find(n => n.id === edge.source);
                const tgtNode = nodes.find(n => n.id === edge.target);

                if (!srcNode || !tgtNode) return null;

                const highlighted = isEdgeHighlighted(edge);

                return (
                  <g key={`edge-${index}`} className="transition-all duration-300">
                    <line
                      x1={srcNode.x}
                      y1={srcNode.y}
                      x2={tgtNode.x}
                      y2={tgtNode.y}
                      stroke={highlighted ? "#00f5d4" : "#1a2c52"}
                      strokeWidth={highlighted ? 2.5 : 0.8}
                      strokeDasharray={edge.label.includes("Nominee") ? "0" : "5,5"}
                      opacity={highlighted ? 0.85 : 0.2}
                    />
                    
                    {/* Tiny edge labels displayed when highlighted or node is selected */}
                    {highlighted && selectedNode && (
                      <g>
                        <rect
                          x={(srcNode.x + tgtNode.x) / 2 - 50}
                          y={(srcNode.y + tgtNode.y) / 2 - 10}
                          width={100}
                          height={18}
                          rx={3}
                          fill="#0c1424"
                          stroke="#1a294d"
                          strokeWidth={0.5}
                          className="transition-all pointer-events-none"
                        />
                        <text
                          x={(srcNode.x + tgtNode.x) / 2}
                          y={(srcNode.y + tgtNode.y) / 2 + 3}
                          fill="#d1d5db"
                          fontSize="9"
                          fontFamily="monospace"
                          textAnchor="middle"
                          className="pointer-events-none"
                        >
                          {edge.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Draw entity node bubbles */}
            <g>
              {nodes.map((node) => {
                if (filterType !== "ALL" && node.type !== filterType) return null;

                const highlighted = isNodeHighlighted(node);
                const isSelected = selectedNode?.id === node.id;

                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNode(isSelected ? null : node)}
                    className="cursor-pointer group select-none transition-all duration-300"
                    id={`node-${node.id.toLowerCase()}`}
                  >
                    {/* Node pulse aura if active */}
                    {isSelected && (
                      <circle
                        r={node.size + 10}
                        fill="none"
                        stroke="#00f5d4"
                        strokeWidth={1}
                        className="animate-ping"
                        opacity={0.3}
                      />
                    )}

                    {/* Node Circle */}
                    <circle
                      r={node.size}
                      fill={highlighted ? (isSelected ? "#00f5d4" : "#0d1b38") : "#060e1f"}
                      stroke={highlighted ? (isSelected ? "#050b14" : node.color) : "#152545"}
                      strokeWidth={isSelected ? 3 : 2}
                      opacity={highlighted ? 1 : 0.3}
                      className="transition-all duration-300 shadow-md group-hover:scale-110"
                    />

                    {/* Node text content */}
                    {node.type === "candidate" ? (
                      <g transform="translate(0, -2)">
                        <circle r="4" fill={node.color} cy="-4" />
                        <line x1="-6" y1="4" x2="6" y2="4" stroke={node.color} strokeWidth="1.5" />
                      </g>
                    ) : node.type === "region" ? (
                      <rect x="-6" y="-6" width="12" height="12" rx="2" fill="none" stroke={node.color} strokeWidth="1.5" />
                    ) : node.type === "event" ? (
                      <polygon points="0,-7 6,4 -6,4" fill="none" stroke={node.color} strokeWidth="1.5" />
                    ) : (
                      <circle r="6" fill="none" stroke={node.color} strokeWidth="2" />
                    )}

                    {/* Node Name */}
                    <text
                      y={node.size + 14}
                      fill={highlighted ? (isSelected ? "#00f5d4" : "#e5e7eb") : "#4b5563"}
                      fontSize={isSelected ? "11" : "9"}
                      fontWeight={isSelected ? "bold" : "600"}
                      textAnchor="middle"
                      fontFamily="sans-serif"
                      className="pointer-events-none group-hover:fill-white font-medium"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Quick tips label floating bottom right */}
          <div className="absolute bottom-3 left-3 bg-[#0a0f1d]/90 border border-[#152445] rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 pointer-events-none text-[10px] text-gray-400 font-mono">
            <Info className="w-3.5 h-3.5 text-[#00f5d4]" />
            <span>Click any node bubble to reveal connected electoral vectors</span>
          </div>
        </div>

      </div>

      {/* DETAIL SIDEBAR PANEL */}
      <div className="lg:col-span-4 bg-[#090e1a]/85 border border-[#1a294d] rounded-2xl p-5 flex flex-col justify-between h-[600px] shadow-2xl backdrop-blur-md" id="panel-graph-details">
        
        {/* Top summary */}
        <div>
          <div className="border-b border-[#131f3b] pb-3 mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold font-sans text-gray-200 tracking-wider uppercase">Entity Intelligence Registry</h3>
            <span className="text-[10px] text-gray-500 font-mono">NEIMS K-BASE</span>
          </div>

          {selectedNode ? (
            <div className="space-y-4">
              <div className="bg-[#0c1424] border border-[#1c305a] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedNode.color }} />
                  <span className="text-xs uppercase font-mono tracking-widest text-[#00f5d4]">{selectedNode.type} Node</span>
                </div>
                <h4 className="text-base font-bold text-gray-100">{selectedNode.label}</h4>
                <p className="text-xs text-gray-300 mt-2.5 leading-relaxed">{selectedNode.details}</p>
              </div>

              {/* Edge connections details from this node */}
              <div className="space-y-2">
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block font-semibold">Active Political Relations</span>
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto custom-scrollbar">
                  {edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).map((edge, idx) => {
                    const isSource = edge.source === selectedNode.id;
                    const counterpartId = isSource ? edge.target : edge.source;
                    const counterpart = nodes.find(n => n.id === counterpartId);

                    return (
                      <div 
                        key={idx}
                        className="p-3 bg-[#060b13] border border-[#142340] rounded-xl flex items-center justify-between text-xs cursor-pointer hover:border-[#00f5d4]"
                        onClick={() => {
                          const cpNode = nodes.find(n => n.id === counterpartId);
                          if (cpNode) setSelectedNode(cpNode);
                        }}
                      >
                        <span className="text-gray-400 font-sans italic">{edge.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5-h-1.5 font-bold text-gray-200">{counterpart?.label}</span>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: counterpart?.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center text-gray-500">
              <Network className="w-10 h-10 stroke-1 text-[#1c2c52]" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400">Tactical Node Registry Idle</p>
                <p className="text-[11px] text-gray-500 px-6 leading-relaxed">
                  Select any visual stakeholder bubble on the interactive entity canvas to load geopolitical intelligence relations.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Global overview metrics stats block */}
        <div className="bg-[#050912] p-4 rounded-xl border border-[#142340] space-y-2 text-xs">
          <span className="text-[10px] text-gray-500 font-mono tracking-widest font-semibold block uppercase">Graph Statistics</span>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Entities:</span>
            <strong className="text-gray-200 font-mono">10</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Core Relations Map:</span>
            <strong className="text-gray-200 font-mono">11 Linked Channels</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Cluster Density Index:</span>
            <strong className="text-emerald-400 font-mono">0.82 High</strong>
          </div>
        </div>

      </div>

    </div>
  );
}
