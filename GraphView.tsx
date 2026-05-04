import React, { useEffect, useState, useMemo } from 'react';
import ReactFlow, { Background, Controls, Node, Edge, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import { Search, Filter, Download, Info, Layers, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const GraphView: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [exporting, setExporting] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    Licenses: true,
    Utilities: true,
    Compliance: false,
    Candidates: true
  });

  useEffect(() => {
    fetch('/api/graph/business/UBID-KA-560001')
      .then(res => res.json())
      .then(data => {
        setNodes(data.nodes);
        setEdges(data.edges);
        setIsLoading(false);
      });
  }, []);

  const filteredNodes = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      hidden: (node.data.label === 'Trade License' && !activeLayers.Licenses) ||
              (node.data.label === 'Utility Account' && !activeLayers.Utilities) ||
              (node.data.label === 'Legacy PAN Record' && !activeLayers.Candidates),
      style: {
        ...node.style,
        border: node.data.label.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm !== '' 
          ? '2px solid #ef4444' 
          : undefined,
        boxShadow: node.data.label.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm !== ''
          ? '0 0 15px rgba(239, 68, 68, 0.5)'
          : undefined
      }
    }));
  }, [nodes, activeLayers, searchTerm]);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert('Graph snapshot exported as UBID-KA-560001-Graph.json');
    }, 1500);
  };

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Entity Graph Explorer</h1>
          <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Investigating UBID-KA-560001-A12</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-200">
            <Filter size={14} /> Filter Relations
          </button>
          <button 
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            {exporting ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Download size={14} />}
            {exporting ? 'Generating...' : 'Export Snapshot'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4 flex-1 min-h-0">
        {/* Left Sidebar: Controls & Presets */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4 overflow-y-auto"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search nodes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <section>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Layers size={12} /> View Layers
            </h3>
            <div className="space-y-2">
              <LayerToggle label="Licenses" active={activeLayers.Licenses} color="bg-blue-500" onClick={() => toggleLayer('Licenses')} />
              <LayerToggle label="Utilities" active={activeLayers.Utilities} color="bg-orange-500" onClick={() => toggleLayer('Utilities')} />
              <LayerToggle label="Compliance Events" active={activeLayers.Compliance} color="bg-purple-500" onClick={() => toggleLayer('Compliance')} />
              <LayerToggle label="Linked Candidates" active={activeLayers.Candidates} color="bg-emerald-500" dashed onClick={() => toggleLayer('Candidates')} />
            </div>
          </section>

          <section className="mt-auto">
             <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs mb-1">
                  <Info size={14} className="text-blue-500" />
                  Graph Tip
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Nodes are highlighted in <span className="text-red-500 font-bold">Red</span> when they match your search query.
                </p>
             </div>
          </section>
        </motion.div>

        {/* Center: Graph Canvas */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden"
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 z-10">
               <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-slate-500">Projecting Knowledge Graph...</p>
               </div>
            </div>
          ) : (
            <ReactFlow 
              nodes={filteredNodes} 
              edges={edges} 
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
            >
              <Background color="#f1f5f9" gap={20} />
              <Controls showInteractive={true} className="!bg-white !border !border-slate-200 !shadow-lg !rounded-lg" />
            </ReactFlow>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const LayerToggle = ({ label, active, color, dashed, onClick }: { label: string, active: boolean, color: string, dashed?: boolean, onClick: () => void }) => (
  <label onClick={onClick} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors">
    <div className="flex items-center gap-3">
      <div className={cn("w-2 h-2 rounded-full", color, dashed && active && "animate-pulse")} />
      <span className={cn("text-[11px] font-medium transition-colors", active ? "text-slate-700" : "text-slate-400")}>{label}</span>
    </div>
    <div className={cn("w-8 h-4 rounded-full relative transition-colors", active ? "bg-blue-600" : "bg-slate-200")}>
      <div className={cn("absolute top-1 w-2 h-2 bg-white rounded-full transition-all", active ? "left-5" : "left-1")} />
    </div>
  </label>
);

export default GraphView;
