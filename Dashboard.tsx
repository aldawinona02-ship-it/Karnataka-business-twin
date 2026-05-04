import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Activity, 
  AlertCircle, 
  Clock,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const stats = [
  { label: 'Active Businesses', value: '42,892', trend: '+12%', icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Dormant Units', value: '5,210', trend: '-2.4%', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Pending Reviews', value: '842', trend: '+18.2%', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Critical Alerts', value: '124', trend: '+5%', icon: AlertCircle, color: 'text-red-700', bg: 'bg-red-50' },
];

const healthData = [
  { month: 'Jan', active: 4000, dormant: 600 },
  { month: 'Feb', active: 4200, dormant: 580 },
  { month: 'Mar', active: 4350, dormant: 610 },
  { month: 'Apr', active: 4100, dormant: 550 },
  { month: 'May', active: 4400, dormant: 520 },
  { month: 'Jun', active: 4600, dormant: 480 },
];

export default function Dashboard() {
  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-4 h-[calc(100vh-120px)] min-h-[600px] max-w-[1400px]">
      {/* 1x1 Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col"
      >
        <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Active UBIDs</p>
        <div className="text-[28px] font-bold text-slate-900 mt-1">1,248,592</div>
        <div className="text-[10px] text-emerald-600 font-bold mt-auto flex items-center gap-1">
          ↑ 4.2% <span className="opacity-60">since last month</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col"
      >
        <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Dormant Status</p>
        <div className="text-[28px] font-bold text-slate-900 mt-1">84,102</div>
        <div className="text-[10px] text-amber-600 font-bold mt-auto">
          3,109 Pending Cleanup
        </div>
      </motion.div>

      {/* 2x2 Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm col-span-2 row-span-2 flex flex-col"
      >
        <div className="flex justify-between items-center mb-6">
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">District Heatmap</p>
          <select className="text-[10px] border border-slate-200 rounded p-1 bg-slate-50 font-bold text-slate-500">
            <option>Total UBIDs</option>
            <option>Risk Distribution</option>
          </select>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          {[
            { name: 'Bangalore Urban', val: '452,109', w: '90%' },
            { name: 'Mysuru Division', val: '210,482', w: '65%' },
            { name: 'Belagavi Division', val: '185,920', w: '55%' },
            { name: 'Kalaburagi Division', val: '112,044', w: '40%' },
            { name: 'Peenya Industrial Hub', val: '92,311', w: '35%' },
          ].map((district) => (
            <div key={district.name} className="py-2 border-b border-slate-50 last:border-0">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-xs font-medium text-slate-700">{district.name}</span>
                 <span className="text-xs font-bold text-slate-900">{district.val}</span>
               </div>
               <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 rounded-full" style={{ width: district.w }} />
               </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Another 1x1 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col"
      >
        <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Reviewer Queue</p>
        <div className="text-[28px] font-bold text-red-600 mt-1">452</div>
        <p className="text-[10px] mt-auto font-medium text-slate-500">Avg turnaround: 14h</p>
      </motion.div>

      {/* 1x1 Confidence */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col"
      >
        <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Identity Confidence</p>
        <div className="text-[28px] font-bold text-slate-900 mt-1">99.8%</div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-auto overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: '99.8%' }} />
        </div>
      </motion.div>

      {/* 2x2 Trends/Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm col-span-2 row-span-2 flex flex-col"
      >
        <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-4">High-Risk Insights</p>
        <div className="space-y-3 flex-1">
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
            <div className="flex justify-between">
              <span className="text-[11px] font-bold text-red-700">Multiple GSTIN Collision</span>
              <span className="text-[10px] text-red-400 font-bold">2m ago</span>
            </div>
            <p className="text-[10px] text-red-600/80 mt-1 leading-normal font-medium">3 identical entities found in Peenya under different PAN IDs.</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
            <div className="flex justify-between">
              <span className="text-[11px] font-bold text-slate-700">License Expiry Prediction</span>
              <span className="text-[10px] text-slate-400 font-bold">1h ago</span>
            </div>
            <p className="text-[10px] text-slate-600/80 mt-1 leading-normal font-medium">80% probability of manufacturing license lapse for 12 units.</p>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg opacity-80">
            <div className="flex justify-between">
              <span className="text-[11px] font-bold text-blue-700">Data Coverage Increase</span>
              <span className="text-[10px] text-blue-400 font-bold">4h ago</span>
            </div>
            <p className="text-[10px] text-blue-600/80 mt-1 leading-normal font-medium">Electricity utility data synced for 14,000 SMEs in Mysuru.</p>
          </div>
        </div>
      </motion.div>

      {/* AI Copilot Prompt Bento */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-xl p-4 shadow-sm col-span-2 row-span-1 flex items-center gap-6"
      >
        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-2xl flex-shrink-0 border border-blue-100">
          ✨
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-800">Analyst Copilot</p>
          <p className="text-[10px] text-slate-500 italic mt-0.5 truncate italic">"Summarize why candidate cluster ID #8842 was flagged for manual review..."</p>
        </div>
        <button 
          onClick={() => {
            window.dispatchEvent(new CustomEvent('kbdt:open-copilot', { 
              detail: { message: "Summarize why candidate cluster ID #8842 was flagged for manual review" } 
            }));
          }}
          className="px-4 py-2 bg-blue-600 text-white text-[11px] font-bold rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex-shrink-0"
        >
          Ask Gemini
        </button>
      </motion.div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
