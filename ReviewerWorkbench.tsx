import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCheck, 
  GitMerge, 
  AlertCircle, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  XCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';

const ReviewerWorkbench: React.FC = () => {
  const [queue, setQueue] = useState<any[]>([]);
  const [completedQueue, setCompletedQueue] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  useEffect(() => {
    fetch('/api/reviews/queue')
      .then(res => res.json())
      .then(data => {
        setQueue(data);
        if (data.length > 0) setSelectedItem(data[0]);
      });
  }, []);

  const handleConfirmMerge = async () => {
    if (!selectedItem) return;
    setIsProcessing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setQueue(prev => prev.filter(item => item.id !== selectedItem.id));
    setCompletedQueue(prev => [{ ...selectedItem, completedAt: new Date().toISOString() }, ...prev]);
    
    // Select the next item in the pending queue
    const nextItem = queue.find(item => item.id !== selectedItem.id);
    setSelectedItem(nextItem || null);
    
    setIsProcessing(false);
  };

  const displayQueue = activeTab === 'pending' ? queue : completedQueue;

  const getEvidenceData = (item: any) => {
    if (!item) return null;
    
    if (item.type === 'Cluster Split') {
      return {
        nameScore: 40, panScore: 20, addressScore: 0, sectorScore: 10,
        e1Title: 'Temporal Ownership Conflict', e1Icon: <AlertCircle size={16} />,
        e1Text: 'Records show concurrent active directorships that violate cross-holding limits, suggesting distinct subsidiaries.',
        e1Color: 'text-red-700', e1Bg: 'bg-red-50/50 border-red-100',
        e2Title: 'Address Mismatch', e2Icon: <MapPin size={16} />,
        e2Text: 'Geospatial proximity is >50 km. One entity operates in Peenya, the other is registered in Tumkur.',
        e2Color: 'text-amber-700', e2Bg: 'bg-amber-50/50 border-amber-100',
        aiInsight: 'The temporal ownership conflict and large geospatial distance indicate these are distinct entities that were incorrectly clustered by automated systems, likely due to a shared registered agent or parent company name.'
      };
    }
    
    // Default Candidate Merge
    return {
      nameScore: 92, panScore: 100, addressScore: 65, sectorScore: 20,
      e1Title: 'PAN Confirmed', e1Icon: <CheckCircle2 size={16} />,
      e1Text: 'Both records share the identical PAN AFG***221Q verified against the MCA database.',
      e1Color: 'text-emerald-700', e1Bg: 'bg-emerald-50/50 border-emerald-100',
      e2Title: 'Address Variation', e2Icon: <MapPin size={16} />,
      e2Text: 'Geospatial proximity is 0.4 km. Addresses describe the same industrial plot using different municipal naming conventions.',
      e2Color: 'text-amber-700', e2Bg: 'bg-amber-50/50 border-amber-100',
      aiInsight: 'Despite the sector mismatch ("Advanced Manufacturing" vs "Tools and Dies"), the shared PAN and extremely close geospatial proximity strongly indicate these are the same entity. The sector difference is likely a classification artifact.'
    };
  };

  const evidence = getEvidenceData(selectedItem);

  return (
    <div className="h-full grid grid-cols-12 gap-4">
      {/* Left Column: Review Queue */}
      <div className="col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <header className="p-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Verification Queue</h2>
          <div className="flex bg-slate-50 p-1 rounded-lg">
            <button 
              onClick={() => { setActiveTab('pending'); setSelectedItem(queue[0] || null); }}
              className={cn(
                "flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all",
                activeTab === 'pending' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Pending ({queue.length})
            </button>
            <button 
              onClick={() => { setActiveTab('completed'); setSelectedItem(completedQueue[0] || null); }}
              className={cn(
                "flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all",
                activeTab === 'completed' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Completed ({completedQueue.length})
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {displayQueue.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={cn(
                "w-full p-3 rounded-lg text-left transition-all group border",
                selectedItem?.id === item.id 
                  ? "bg-blue-50/50 border-blue-200 shadow-sm" 
                  : "border-transparent hover:bg-slate-50"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={cn(
                  "text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                  item.type === 'Candidate Merge' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                )}>
                  {item.type}
                </span>
                <span className="text-[9px] font-bold text-slate-400 font-mono">{item.id}</span>
              </div>
              <p className="text-[11px] font-bold text-slate-900 truncate">{item.businessA}</p>
              <div className="flex items-center gap-1 mt-1">
                <Clock size={10} className="text-slate-400" />
                <span className="text-[9px] font-medium text-slate-500">Received 12m ago</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace: Comparison */}
      <div className="col-span-8 flex flex-col gap-4 min-h-0">
        <AnimatePresence mode="wait">
          {selectedItem ? (
            <motion.div 
              key={selectedItem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col gap-4 overflow-hidden"
            >
              {/* Evidence Strip */}
              <div className="bg-slate-900 text-white rounded-xl p-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <UserCheck className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Manual Entity Resolution</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Identity Confidence Score: <span className="text-emerald-400 font-bold">{(selectedItem.confidence * 100).toFixed(0)}%</span></p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={() => setIsEvidenceOpen(true)}
                     className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-[11px] font-bold rounded-lg border border-white/10 transition-colors"
                   >
                     View Evidence Pack
                   </button>
                </div>
              </div>

              {/* Comparison Grid */}
              <div className="flex-1 grid grid-cols-2 gap-4 min-h-0 overflow-y-auto">
                <ComparisonCard 
                  title="Source Entity"
                  name={selectedItem.businessA}
                  id="UBID-KA-X992"
                  address="Phase III, Peenya Industrial Area, Bengaluru - 560058"
                  sector="Advanced Manufacturing"
                  pan="AFG***221Q"
                />
                <ComparisonCard 
                  title={selectedItem.type === 'Candidate Merge' ? "Match Candidate" : "Cluster Member"}
                  name={selectedItem.businessB || "Entity B"}
                  id="TEMP-REC-2292"
                  address="Plot 44, Peenya 3rd Phase, Bengaluru Rural (Urban Limit)"
                  sector="Tools and Dies"
                  pan="AFG***221Q"
                  isMatch={selectedItem.type === 'Candidate Merge'}
                />
              </div>

              {/* Action Bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className={cn("flex items-center gap-2 text-[11px] font-bold", activeTab === 'completed' ? "text-emerald-600" : "text-slate-600")}>
                     {activeTab === 'completed' ? (
                       <>
                         <CheckCircle2 size={14} className="text-emerald-500" />
                         Merge confirmed and processed.
                       </>
                     ) : (
                       <>
                         <AlertCircle size={14} className="text-amber-500" />
                         Conflicting sectors: Manual review required.
                       </>
                     )}
                   </div>
                </div>
                {activeTab === 'pending' && (
                  <div className="flex gap-2">
                    <button 
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-200 disabled:opacity-50"
                    >
                      <XCircle size={14} /> Reject Match
                    </button>
                    <button 
                      onClick={handleConfirmMerge}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-200 disabled:opacity-75 disabled:cursor-wait"
                    >
                      {isProcessing ? (
                        <>
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
                            <Clock size={14} />
                          </motion.div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={14} /> Confirm Merge
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center bg-white rounded-xl border border-slate-200 border-dashed">
              <p className="text-slate-400 font-bold">Select a queue item to begin verification</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Evidence Modal */}
      <AnimatePresence>
        {isEvidenceOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsEvidenceOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Resolution Evidence Pack</h2>
                  <p className="text-sm text-slate-500 font-medium">UBID-KA-X992 ↔ TEMP-REC-2292</p>
                </div>
                <button 
                  onClick={() => setIsEvidenceOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <XCircle size={24} className="text-slate-400" />
                </button>
              </div>
              
                {evidence && (
                  <div className="p-6 overflow-y-auto flex flex-col gap-6">
                    {/* Score Breakdown */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-tight">Confidence Breakdown</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="w-24 text-xs font-bold text-slate-500">Legal Name</div>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${evidence.nameScore > 50 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${evidence.nameScore}%` }}></div>
                          </div>
                          <div className={`w-12 text-right text-xs font-bold ${evidence.nameScore > 50 ? 'text-emerald-600' : 'text-red-600'}`}>{evidence.nameScore}%</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-24 text-xs font-bold text-slate-500">PAN Identity</div>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${evidence.panScore > 50 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${evidence.panScore}%` }}></div>
                          </div>
                          <div className={`w-12 text-right text-xs font-bold ${evidence.panScore > 50 ? 'text-emerald-600' : 'text-red-600'}`}>{evidence.panScore}%</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-24 text-xs font-bold text-slate-500">Address Prox.</div>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: `${evidence.addressScore}%` }}></div>
                          </div>
                          <div className="w-12 text-right text-xs font-bold text-amber-600">{evidence.addressScore}%</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-24 text-xs font-bold text-slate-500">Sector Match</div>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${evidence.sectorScore > 50 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${evidence.sectorScore}%` }}></div>
                          </div>
                          <div className={`w-12 text-right text-xs font-bold ${evidence.sectorScore > 50 ? 'text-emerald-600' : 'text-red-600'}`}>{evidence.sectorScore}%</div>
                        </div>
                      </div>
                    </div>

                    {/* Specific Evidence */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 border rounded-xl ${evidence.e1Bg}`}>
                        <div className={`flex items-center gap-2 font-bold text-sm mb-2 ${evidence.e1Color}`}>
                          {evidence.e1Icon} {evidence.e1Title}
                        </div>
                        <p className="text-xs text-slate-600">{evidence.e1Text}</p>
                      </div>
                      <div className={`p-4 border rounded-xl ${evidence.e2Bg}`}>
                        <div className={`flex items-center gap-2 font-bold text-sm mb-2 ${evidence.e2Color}`}>
                          {evidence.e2Icon} {evidence.e2Title}
                        </div>
                        <p className="text-xs text-slate-600">{evidence.e2Text}</p>
                      </div>
                    </div>

                    {/* AI Summary */}
                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                      <div className="flex items-center gap-2 text-blue-800 font-bold text-sm mb-2">
                        ✨ AI Analyst Insight
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {evidence.aiInsight}
                      </p>
                    </div>
                  </div>
                )}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setIsEvidenceOpen(false)}
                  className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Close Evidence
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ComparisonCard = ({ title, name, id, address, sector, pan, isMatch }: any) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden group hover:border-blue-200 transition-colors">
    <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
      <span className="text-[10px] font-mono text-slate-500">{id}</span>
    </div>
    <div className="p-4 space-y-4">
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-tight mb-1">Legal Name</h4>
        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{name}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 flex items-center gap-1">
            <MapPin size={10} /> Registered Address
          </h4>
          <p className="text-[11px] text-slate-700 leading-snug">{address}</p>
        </div>
        <div>
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1 flex items-center gap-1">
            <Calendar size={10} /> Est. Date
          </h4>
          <p className="text-[11px] text-slate-700">Jan 12, 1998</p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
         <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase">Sector</span>
            <span className="text-[11px] font-bold text-slate-800">{sector}</span>
         </div>
         <div className={cn(
           "px-2 py-1 rounded text-[10px] font-bold",
           isMatch ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
         )}>
           PAN Identity Match
         </div>
      </div>
    </div>
  </div>
);

export default ReviewerWorkbench;
