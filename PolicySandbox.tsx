import React, { useState, useMemo } from 'react';
import { 
  Settings2, 
  Play, 
  Save, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown, 
  Map, 
  Database,
  Info,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';

const PolicySandbox: React.FC = () => {
  const [params, setParams] = useState({
    dormancy: 90,
    healthWeight: 0.4,
    riskWeight: 0.6,
    inspectionInterval: 365,
    sectorGrace: 45
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [simulationData, setSimulationData] = useState([
    { name: 'Baseline', score: 65, alerts: 420 },
    { name: 'Jan', score: 68, alerts: 380 },
    { name: 'Feb', score: 62, alerts: 450 },
    { name: 'Mar', score: 75, alerts: 310 },
    { name: 'Apr', score: 82, alerts: 290 },
    { name: 'May (Sim)', score: 88, alerts: 210 },
  ]);

  const handleSimulate = () => {
    setIsSimulating(true);
    
    // Logic: 
    // Higher dormancy threshold = lower alert volume
    // Higher risk weight = higher score sensitivity
    // Higher inspection interval = lower health score over time
    
    setTimeout(() => {
      const newScore = Math.min(95, 80 + (params.riskWeight * 15) - (params.inspectionInterval / 365 * 5));
      const newAlerts = Math.max(100, 300 - (params.dormancy / 90 * 50) + (params.riskWeight * 80));
      
      setSimulationData(prev => [
        ...prev.slice(0, 5),
        { name: 'May (Sim)', score: Math.round(newScore), alerts: Math.round(newAlerts) }
      ]);
      setIsSimulating(false);
    }, 1500);
  };

  const handlePublish = () => {
    setIsPublished(true);
    setTimeout(() => setIsPublished(false), 3000);
  };

  const impactMetrics = useMemo(() => {
    const shift = 300 - (params.dormancy / 90 * 50);
    const workload = (365 / params.inspectionInterval) * 100 - 100;
    return {
      alertShift: Math.round(shift - 420),
      workload: Math.round(workload)
    };
  }, [params]);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header Controls */}
      <header className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Policy Simulation Sandbox</h1>
          <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Versioning: Draft Scenario v1.02 (Bengo-East Focus)</p>
        </div>
        <div className="flex gap-2 relative">
          <button 
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {isSimulating ? (
              <RotateCcw size={14} className="animate-spin" />
            ) : (
              <Play size={14} className="fill-current" />
            )}
            Run Simulation
          </button>
          <button 
            onClick={handlePublish}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-100 active:scale-95"
          >
            <Save size={14} /> Publish Policy
          </button>

          <AnimatePresence>
            {isPublished && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-full right-0 mt-2 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 text-xs font-bold z-50"
              >
                <Check size={14} /> Policy Published to Mainnet
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        {/* Left: Parameter Configuration */}
        <div className="col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-y-auto">
          <header className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Settings2 size={12} /> Policy Parameters
            </h3>
            <button 
              onClick={() => setParams({ dormancy: 90, healthWeight: 0.4, riskWeight: 0.6, inspectionInterval: 365, sectorGrace: 45 })}
              className="text-[10px] font-bold text-blue-600 hover:underline"
            >
              Reset to Current
            </button>
          </header>
          
          <div className="p-4 space-y-8">
            <SliderParam 
              label="Dormancy Threshold (Days)" 
              value={params.dormancy} 
              min={30} max={360} 
              onChange={(v: number) => setParams(p => ({ ...p, dormancy: v }))} 
              description="Minimum number of inactive utility days before marking as 'Silent Shutdown'."
            />
            <SliderParam 
              label="Risk Score Multiplier" 
              value={params.riskWeight} 
              min={0} max={1} step={0.1}
              onChange={(v: number) => setParams(p => ({ ...p, riskWeight: v }))} 
              description="Weightage of predictive anomalies compared to historical compliance."
            />
             <SliderParam 
              label="Inspection Cycle (Days)" 
              value={params.inspectionInterval} 
              min={90} max={730}
              onChange={(v: number) => setParams(p => ({ ...p, inspectionInterval: v }))} 
              description="Standard interval for mandatory physical verification of high-risk units."
            />
            <SliderParam 
              label="Sector Grace Window" 
              value={params.sectorGrace} 
              min={0} max={90}
              onChange={(v: number) => setParams(p => ({ ...p, sectorGrace: v }))} 
              description="Extended compliance window for MSME sector during audit cycles."
            />
          </div>

          <div className="mt-auto p-4 bg-slate-50 border-t border-slate-100">
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
               <Info size={12} className="inline mr-1 text-blue-500" />
               Scenarios are computed against a feature-store snapshot from 2026-04-20. Total population: 8.2M records.
             </p>
          </div>
        </div>

        {/* Right: Simulation Impact */}
        <div className="col-span-8 flex flex-col gap-4 min-h-0 overflow-y-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
             <ImpactCard 
               label="Alert Volume Shift" 
               value={impactMetrics.alertShift} 
               icon={impactMetrics.alertShift < 0 ? <TrendingDown size={20} className="text-emerald-500" /> : <TrendingUp size={20} className="text-rose-500" />}
               sub={`Reduces noise by ${Math.abs(Math.round(impactMetrics.alertShift / 420 * 100))}%`}
               positive={impactMetrics.alertShift <= 0}
             />
             <ImpactCard 
               label="Inspection Workload" 
               value={`${impactMetrics.workload > 0 ? '+' : ''}${impactMetrics.workload}%`} 
               icon={<TrendingUp size={20} className={impactMetrics.workload > 0 ? "text-amber-500" : "text-emerald-500"} />}
               sub={`Est. ${Math.abs(Math.round(4200 * (impactMetrics.workload / 100)))} task delta`}
               positive={impactMetrics.workload <= 0}
             />
             <ImpactCard 
               label="Scenario Confidence" 
               value="94.2%" 
               icon={<Database size={20} className="text-indigo-500" />}
               sub="Monte Carlo Pass: 1k runs"
               positive
             />
          </div>

          {/* Chart Board */}
          <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6 min-h-[400px]">
             <div className="flex justify-between items-center">
                <div>
                   <h3 className="text-sm font-bold text-slate-800">Predicted Policy Impact Trend</h3>
                   <p className="text-[10px] text-slate-500">Comparing Projected Health Scores vs Alert Volumes</p>
                </div>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-[10px] font-bold text-slate-600">Health Index</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-slate-300 rounded-full" />
                      <span className="text-[10px] font-bold text-slate-600">Alert Volume</span>
                   </div>
                </div>
             </div>
             
             <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={simulationData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" fontSize={10} fontWeight="bold" stroke="#64748b" axisLine={false} tickLine={false} />
                      <YAxis fontSize={10} fontWeight="bold" stroke="#64748b" axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                      <Area type="monotone" dataKey="alerts" stroke="#cbd5e1" strokeWidth={1} fillOpacity={0} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* District Impact Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
             <header className="p-3 border-b border-slate-100 flex items-center gap-2">
                <Map size={14} className="text-slate-400" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest tracking-tighter">District Impact Heatmap</h3>
             </header>
             <div className="p-2 grid grid-cols-4 gap-2">
                <DistrictChip name="Bengaluru Urban" delta={`${impactMetrics.alertShift < 0 ? '-' : '+'}${Math.abs(Math.round(impactMetrics.alertShift/10))}%`} color="bg-emerald-50 text-emerald-700" />
                <DistrictChip name="Mysuru" delta="+4.2%" color="bg-amber-50 text-amber-700" />
                <DistrictChip name="Belagavi" delta="-2.1%" color="bg-emerald-50 text-emerald-700" />
                <DistrictChip name="Kalaburagi" delta="+18.5%" color="bg-rose-50 text-rose-700" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SliderParam = ({ label, value, min, max, step = 1, onChange, description }: any) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <label className="text-[11px] font-bold text-slate-800">{label}</label>
      <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 font-black">{value}</span>
    </div>
    <input 
      type="range" 
      min={min} max={max} step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
    <p className="text-[9px] text-slate-400 font-medium leading-relaxed">{description}</p>
  </div>
);

const ImpactCard = ({ label, value, icon, sub, positive }: any) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:border-slate-300 transition-colors">
     <div className="flex justify-between items-start mb-3">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        {icon}
     </div>
     <p className={cn(
       "text-2xl font-black mb-1",
       positive ? "text-slate-900" : "text-amber-600"
     )}>{value}</p>
     <p className="text-[10px] font-bold text-slate-500">{sub}</p>
  </div>
);

const DistrictChip = ({ name, delta, color }: any) => (
  <div className={cn("p-2 rounded-lg flex justify-between items-center border border-transparent hover:border-slate-200 transition-all", color)}>
    <span className="text-[10px] font-bold truncate">{name}</span>
    <span className="text-[10px] font-black">{delta}</span>
  </div>
);

export default PolicySandbox;

