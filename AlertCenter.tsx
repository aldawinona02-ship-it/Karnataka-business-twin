import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, 
  Filter, 
  Search, 
  ChevronRight, 
  MoreVertical, 
  Clock,
  ShieldAlert,
  ArrowUpRight,
  Download,
  Info,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const AlertCenter: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data));
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesFilter = filter === 'All' || alert.severity === filter;
      const matchesSearch = alert.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           alert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           alert.district.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [alerts, filter, searchTerm]);

  const handleResolve = () => {
    if (!selectedAlert) return;
    setIsResolving(true);
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== selectedAlert.id));
      setSelectedAlert(null);
      setIsResolving(false);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* KPI Header */}
      <div className="grid grid-cols-4 gap-4">
        <KPIBox label="Total Open Alerts" value={alerts.length} trend="+12" color="bg-blue-600" />
        <KPIBox label="Critical Overdue" value={alerts.filter(a => a.severity === 'Critical').length} trend="+3" color="bg-rose-600" />
        <KPIBox label="SLA Resolution" value="94.2%" trend="-0.4" color="bg-amber-500" />
        <KPIBox label="Assigned to Me" value="18" trend="0" color="bg-indigo-600" />
      </div>

      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        {/* Main Alert Feed */}
        <div className="col-span-8 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <header className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold text-slate-800">Operational Alerts</h2>
              <div className="flex gap-1">
                <FilterButton label="All" active={filter === 'All'} onClick={() => setFilter('All')} />
                <FilterButton label="Critical" active={filter === 'Critical'} onClick={() => setFilter('Critical')} />
                <FilterButton label="High" active={filter === 'High'} onClick={() => setFilter('High')} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter by ID or District..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-[11px] outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                <Download size={14} />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 sticky top-0 z-10">
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-4 py-3">Alert Details</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">District</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr 
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={cn(
                      "group cursor-pointer border-b border-slate-50 transition-colors",
                      selectedAlert?.id === alert.id ? "bg-blue-50/30" : "hover:bg-slate-50/50"
                    )}
                  >
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{alert.type}</span>
                        <span className="text-[9px] font-mono text-slate-500">{alert.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight",
                        alert.severity === 'Critical' ? "bg-rose-100 text-rose-700" : 
                        alert.severity === 'High' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                      )}>
                        <ShieldAlert size={10} />
                        {alert.severity}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[10px] font-bold text-slate-600 uppercase">{alert.district}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock size={10} />
                        <span className="text-[10px] font-medium">{alert.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <ChevronRight size={14} className={cn(
                        "text-slate-300 transition-all",
                        selectedAlert?.id === alert.id ? "translate-x-1 text-blue-500" : "group-hover:translate-x-1"
                      )} />
                    </td>
                  </tr>
                ))}
                {filteredAlerts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-400 italic text-xs">
                      No alerts found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evidence Drawer */}
        <div className="col-span-4 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {selectedAlert ? (
              <motion.div
                key={selectedAlert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden"
              >
                <header className="p-4 bg-slate-900 text-white">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Evidence Pack</span>
                    <button onClick={() => setSelectedAlert(null)} className="p-1 hover:bg-white/10 rounded-lg">
                      <ChevronRight size={14} className="rotate-180" />
                    </button>
                  </div>
                  <h3 className="text-sm font-bold leading-tight">{selectedAlert.type}</h3>
                </header>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  <section>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">AI Explanation</h4>
                     <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100 text-[11px] text-slate-700 leading-relaxed italic">
                        "{selectedAlert.evidence}"
                     </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Linked Entities</h4>
                    <div className="space-y-2">
                       <LinkedEntity ubid="UBID-KA-560001" status="Active" label="Primary Target" />
                       <LinkedEntity ubid="UBID-KA-X2292" status="Candidate" label="Conflict Match" />
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Next Required Actions</h4>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                       <ul className="space-y-2">
                          <ActionItem label="Dispatch Field Inspection" />
                          <ActionItem label="Freeze GSTIN Subsidies" />
                          <ActionItem label="Request PAN Affidavit" />
                       </ul>
                    </div>
                  </section>
                </div>

                <footer className="p-4 border-t border-slate-100 flex gap-2">
                  <button className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-200">
                    Assign Owner
                  </button>
                  <button 
                    onClick={handleResolve}
                    disabled={isResolving}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                  >
                    {isResolving ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
                    {isResolving ? 'Resolving...' : 'Resolve Alert'}
                  </button>
                </footer>
              </motion.div>
            ) : (
              <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 border-dashed flex flex-col items-center justify-center p-8 text-center">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
                    <Info size={24} />
                 </div>
                 <p className="text-xs font-bold text-slate-400">Select an alert from the feed to view detailed evidence and recommended actions.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const KPIBox = ({ label, value, trend, color }: any) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={cn("w-2 h-10 rounded-full", color)} />
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="flex items-end gap-2">
        <p className="text-xl font-bold text-slate-900">{value}</p>
        {trend && (
          <span className={cn(
            "text-[10px] font-black mb-1",
            trend.startsWith('+') ? "text-emerald-500" : trend === '0' ? "text-slate-400" : "text-rose-500"
          )}>
            {trend}%
          </span>
        )}
      </div>
    </div>
  </div>
);

const FilterButton = ({ label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all",
      active ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
    )}
  >
    {label}
  </button>
);

const LinkedEntity = ({ ubid, status, label }: any) => (
  <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors group">
    <div className="flex flex-col">
       <span className="text-[9px] font-bold text-slate-400 uppercase">{label}</span>
       <span className="text-[11px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{ubid}</span>
    </div>
    <ArrowUpRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
  </div>
);

const ActionItem = ({ label }: any) => (
  <li className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
    {label}
  </li>
);

export default AlertCenter;


