import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Users, 
  History, 
  Lock, 
  Eye, 
  CheckCircle,
  Clock,
  ArrowRight,
  Database,
  Key,
  Download,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const GovernanceConsole: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [activeModule, setActiveModule] = useState('Audit Logs');

  useEffect(() => {
    fetch('/api/governance/audit')
      .then(res => res.json())
      .then(data => setLogs(data));
  }, []);

  // Simulate Live Feed
  useEffect(() => {
    const interval = setInterval(() => {
      const actions = ['Policy Updated', 'RBAC Change', 'Record Access', 'API Key Rotation'];
      const users = ['Officer Kumar', 'Admin Singh', 'Dr. Patil', 'Officer Rao'];
      const targets = ['UBID-KA-X992', 'Sandbox Policy v2', 'PII_MASKING_RULE', 'MASTER_AUTH'];
      
      const newLog = {
        id: `LOG-${Math.floor(Math.random() * 10000)}`,
        user: users[Math.floor(Math.random() * users.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        target: targets[Math.floor(Math.random() * targets.length)],
        timestamp: new Date().toISOString()
      };

      setLogs(prev => [newLog, ...prev].slice(0, 15));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Governance Summary */}
      <div className="grid grid-cols-4 gap-4">
        <GovCard label="System Integrity" value="Trustworthy" icon={<ShieldCheck className="text-emerald-500" size={24} />} sub="All safety checks passed" />
        <GovCard label="Active Policies" value="12" icon={<FileText className="text-blue-500" size={24} />} sub="3 updates pending review" />
        <GovCard label="Privileged Users" value="84" icon={<Users className="text-indigo-500" size={24} />} sub="2 sessions active" />
        <GovCard label="Audit Compliance" value="100%" icon={<CheckCircle className="text-emerald-500" size={24} />} sub="Log coverage: Full" />
      </div>

      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        {/* Left: Module Navigation & Controls */}
        <div className="col-span-3 flex flex-col gap-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4"
          >
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Lock size={12} /> Governance Modules
             </h3>
             <nav className="space-y-1">
                <GovNavItem label="Audit Logs" active={activeModule === 'Audit Logs'} icon={<History size={14} />} onClick={() => setActiveModule('Audit Logs')} />
                <GovNavItem label="Access Control (RBAC)" active={activeModule === 'Access Control (RBAC)'} icon={<Key size={14} />} onClick={() => setActiveModule('Access Control (RBAC)')} />
                <GovNavItem label="Data Masking Rules" active={activeModule === 'Data Masking Rules'} icon={<Eye size={14} />} onClick={() => setActiveModule('Data Masking Rules')} />
                <GovNavItem label="Model Registry" active={activeModule === 'Model Registry'} icon={<Database size={14} />} onClick={() => setActiveModule('Model Registry')} />
             </nav>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-indigo-900 p-4 rounded-xl shadow-lg shadow-indigo-100 text-white space-y-3"
          >
             <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Compliance Status</h4>
             <p className="text-[11px] font-medium leading-relaxed">
               All PII exports are currently <span className="text-emerald-400 font-bold">LOCKED</span> per Dept. of Commerce policy.
             </p>
             <button className="w-full py-1.5 bg-white/10 hover:bg-white/20 text-[10px] font-bold rounded-lg transition-colors border border-white/10 italic">
               View Masking Policy
             </button>
          </motion.div>
        </div>

        {/* Right: Module Workspace */}
        <div className="col-span-9 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {activeModule === 'Audit Logs' ? (
              <motion.div 
                key="audit-logs"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-full"
              >
                <header className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                      <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        System-wide Audit Logs
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </h2>
                      <p className="text-[10px] text-slate-500">Immutable trace of all administrative and analytical actions.</p>
                  </div>
                  <div className="flex gap-2 text-[11px] font-bold text-slate-400">
                      <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Today</button>
                      <button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                      >
                        {isExporting ? <Check size={12} className="text-emerald-600" /> : <Download size={12} />}
                        {isExporting ? 'Exported' : 'Export PDF'}
                      </button>
                  </div>
                </header>

                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50/50 sticky top-0 z-10">
                        <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">Principal User</th>
                            <th className="px-6 py-4">Action Type</th>
                            <th className="px-6 py-4">Target Resource</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        <AnimatePresence initial={false}>
                          {logs.map((log) => (
                              <motion.tr 
                                key={log.id}
                                initial={{ opacity: 0, backgroundColor: '#f0f9ff' }}
                                animate={{ opacity: 1, backgroundColor: '#ffffff' }}
                                className="hover:bg-slate-50 group transition-colors"
                              >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-400">
                                      <Clock size={12} />
                                      <span className="text-[10px] font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-200">
                                          {log.user[0]}
                                      </div>
                                      <span className="text-[11px] font-bold text-slate-800 tracking-tight">{log.user}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                      {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[11px] font-mono text-slate-500">{log.target}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px]">
                                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                      Audited
                                    </div>
                                </td>
                              </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-6 border border-slate-100 shadow-inner">
                   <Lock size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{activeModule}</h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  This governance module is under restricted access. Detailed configuration for <strong>{activeModule}</strong> will be available in the next release.
                </p>
                <button 
                  onClick={() => setActiveModule('Audit Logs')}
                  className="mt-8 px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  Return to Audit Logs
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const GovCard = ({ label, value, icon, sub }: any) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 group hover:border-blue-100 transition-colors">
     <div className="flex justify-between items-start">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
           {icon}
        </div>
     </div>
     <div>
        <p className="text-xl font-black text-slate-900 tracking-tight">{value}</p>
        <p className="text-[10px] font-medium text-slate-500 mt-0.5">{sub}</p>
     </div>
  </div>
);

const GovNavItem = ({ label, icon, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
    "w-full flex items-center justify-between p-2 rounded-lg transition-all group",
    active ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-600"
  )}>
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-[11px] font-bold tracking-tight">{label}</span>
    </div>
    <ArrowRight size={12} className={cn(
      "transition-all",
      active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
    )} />
  </button>
);

export default GovernanceConsole;

