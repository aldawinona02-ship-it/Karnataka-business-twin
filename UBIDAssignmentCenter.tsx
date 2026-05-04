import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Wand2, 
  CheckCircle2, 
  AlertCircle, 
  Network, 
  UserCheck, 
  History,
  FilePlus,
  RefreshCw,
  Plus,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

type AssignmentStatus = 'idle' | 'standardizing' | 'standardized' | 'matching' | 'matched' | 'assigned';
type FlowType = 'strong' | 'none' | 'borderline';

export default function UBIDAssignmentCenter() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<AssignmentStatus>('idle');
  
  // Raw Input State
  const [rawRecord, setRawRecord] = useState({
    name: 'ABC INDUSTRIAL WORKS',
    tradeName: 'ABC Industries',
    address: 'Plot 44, Peenya Phase 3, BLR',
    pan: 'AFG***221Q',
    gstin: '29AFG***221Q1Z5',
    source: 'Commercial Taxes',
    sourceId: 'CT-2024-9981',
    sector: 'Manufacturing',
  });

  // Simulated Cleaned Record State
  const [cleanedRecord, setCleanedRecord] = useState<any>(null);
  
  // Simulated Candidates
  const [candidates, setCandidates] = useState<any[]>([]);
  
  // Final UBID Result
  const [finalResult, setFinalResult] = useState<any>(null);

  // Mock processing functions
  const handleCleanRecord = async () => {
    setStatus('standardizing');
    await new Promise(r => setTimeout(r, 1200));
    setCleanedRecord({
      name: 'ABC INDUSTRIAL WORKS PRIVATE LIMITED',
      tradeName: 'ABC Industries',
      address: 'Plot No. 44, Peenya 3rd Phase Industrial Area, Bengaluru, Karnataka - 560058',
      district: 'Bengaluru Urban',
      pin: '560058',
      pan: 'AFG***221Q',
      panValid: true,
      gstin: '29AFG***221Q1Z5',
      gstinValid: true,
      derivedPan: 'AFG***221Q (High Reliability)'
    });
    setStatus('standardized');
  };

  const handleFindMatches = async () => {
    setStatus('matching');
    await new Promise(r => setTimeout(r, 1500));
    
    // Simulate flow based on current raw name length (just as a quick way to show different flows)
    const nameLen = rawRecord.name.length;
    let flow: FlowType = 'strong';
    if (nameLen < 10) flow = 'none';
    if (nameLen > 25) flow = 'borderline';

    if (flow === 'strong') {
      setCandidates([
        { ubid: 'UBID-KA-000231', name: 'ABC INDUSTRIES PVT LTD', match: 98.7, pan: 'Exact', gstin: 'Exact', addr: 'High' }
      ]);
    } else if (flow === 'borderline') {
      setCandidates([
        { ubid: 'UBID-KA-000442', name: 'ABC INDUSTRIAL WORKS', match: 74.2, pan: 'No', gstin: 'Partial', addr: 'Medium' },
        { ubid: 'UBID-KA-000891', name: 'ABC ENTERPRISES', match: 45.1, pan: 'No', gstin: 'No', addr: 'Low' }
      ]);
    } else {
      setCandidates([]);
    }
    setStatus('matched');
  };

  const handleAssignUBID = (candidate: any) => {
    setFinalResult({
      ubid: candidate.ubid,
      type: 'Existing Association',
      confidence: candidate.match,
      path: 'Algorithmic Match > PAN verification',
      name: candidate.name,
      address: cleanedRecord?.address,
      links: 4
    });
    setStatus('assigned');
  };

  const handleCreateNewUBID = () => {
    setFinalResult({
      ubid: `UBID-KA-${Math.floor(Math.random() * 900000 + 100000)}`,
      type: 'Newly Created',
      confidence: 100,
      path: 'No viable candidates found > Automated creation',
      name: cleanedRecord?.name || rawRecord.name,
      address: cleanedRecord?.address || rawRecord.address,
      links: 1
    });
    setStatus('assigned');
  };

  const handleSendToReview = () => {
    // In a real app this would call an API, then maybe show a toast
    navigate('/workbench');
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FilePlus className="text-blue-600" /> UBID Assignment Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">Ingest, standardize, and resolve business entity identities.</p>
        </div>
        
        {/* Helper to switch mock data */}
        <div className="flex gap-2">
           <button onClick={() => setRawRecord({...rawRecord, name: 'ABC INDUSTRIAL WORKS'})} className="px-3 py-1 bg-white border rounded text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50">Mock: Strong Match</button>
           <button onClick={() => setRawRecord({...rawRecord, name: 'TINY STORE'})} className="px-3 py-1 bg-white border rounded text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50">Mock: No Match</button>
           <button onClick={() => setRawRecord({...rawRecord, name: 'AMBIGUOUS BUSINESS ENTITY WITH LONG NAME'})} className="px-3 py-1 bg-white border rounded text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50">Mock: Borderline</button>
        </div>
      </div>

      {status === 'assigned' && finalResult ? (
        // Panel 4: Final UBID Result Panel
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-600 text-white rounded-2xl p-8 shadow-2xl flex items-center justify-between border-4 border-blue-400/30"
        >
          <div className="flex gap-6 items-center">
             <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-inner">
                <CheckCircle2 size={48} className="text-emerald-500" />
             </div>
             <div>
               <div className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                 Identity Assigned • {finalResult.type}
               </div>
               <h2 className="text-4xl font-black font-mono tracking-tight text-white mb-2">{finalResult.ubid}</h2>
               <div className="flex items-center gap-4 text-sm font-medium text-blue-100">
                  <span className="bg-blue-500/50 px-2 py-1 rounded">Confidence: {finalResult.confidence}%</span>
                  <span>{finalResult.path}</span>
               </div>
               
               <div className="mt-6 space-y-1">
                 <p className="font-bold text-lg">{finalResult.name}</p>
                 <p className="text-blue-200 text-sm max-w-lg">{finalResult.address}</p>
               </div>
             </div>
          </div>
          
          <div className="flex flex-col gap-3 min-w-[200px]">
            <button onClick={() => navigate('/graph')} className="flex items-center gap-2 bg-white text-blue-700 px-4 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg">
              <Network size={18} /> Open in Graph View
            </button>
            <button className="flex items-center gap-2 bg-blue-700/50 text-white border border-blue-500 px-4 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
              <UserCheck size={18} /> Open Merge Card
            </button>
            <button className="flex items-center gap-2 bg-transparent text-blue-200 hover:text-white px-4 py-2 rounded-lg font-bold transition-colors">
              <History size={18} /> View Audit History
            </button>
            
            <div className="mt-4 text-right">
              <button 
                onClick={() => {
                  setStatus('idle');
                  setCleanedRecord(null);
                  setCandidates([]);
                  setFinalResult(null);
                }} 
                className="text-xs font-bold text-blue-300 hover:text-white underline underline-offset-2 flex items-center gap-1 justify-end"
              >
                <RefreshCw size={12} /> Process Another Record
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-12 gap-6 min-h-[600px]">
          {/* Panel 1: Raw Input Panel */}
          <div className="col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
            <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500">1</div>
              Raw Input Panel
            </h2>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Raw Business Name</label>
                <input type="text" value={rawRecord.name} onChange={e => setRawRecord({...rawRecord, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm text-slate-700 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Raw Trade Name</label>
                <input type="text" value={rawRecord.tradeName} onChange={e => setRawRecord({...rawRecord, tradeName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm text-slate-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Raw Address</label>
                <textarea value={rawRecord.address} onChange={e => setRawRecord({...rawRecord, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm text-slate-700 resize-none h-20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">PAN</label>
                  <input type="text" value={rawRecord.pan} onChange={e => setRawRecord({...rawRecord, pan: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm text-slate-700 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">GSTIN</label>
                  <input type="text" value={rawRecord.gstin} onChange={e => setRawRecord({...rawRecord, gstin: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm text-slate-700 uppercase" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Source Dept</label>
                  <input type="text" value={rawRecord.source} onChange={e => setRawRecord({...rawRecord, source: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm text-slate-700" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Sector</label>
                  <input type="text" value={rawRecord.sector} onChange={e => setRawRecord({...rawRecord, sector: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm text-slate-700" />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100">
              <button 
                onClick={handleCleanRecord}
                disabled={status !== 'idle'}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'standardizing' ? <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1}}><Loader2 size={16}/></motion.div> : <Wand2 size={16} />}
                Clean & Standardize Record
              </button>
            </div>
          </div>

          <div className="col-span-8 flex flex-col gap-6">
            {/* Panel 2: Standardized Record Panel */}
            <div className={cn("bg-white rounded-xl shadow-sm border p-5 transition-all duration-500", status === 'idle' ? "opacity-50 grayscale pointer-events-none border-slate-200" : "border-emerald-200")}>
              <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold", status === 'idle' ? "bg-slate-100 text-slate-400" : "bg-emerald-100 text-emerald-600")}>2</div>
                   Standardized Record Panel
                </div>
                {status !== 'idle' && status !== 'standardizing' && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1"><CheckCircle2 size={12}/> Cleaned</span>}
              </h2>

              <div className="grid grid-cols-2 gap-6 min-h-[120px]">
                {cleanedRecord ? (
                  <>
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Canonical Legal Name</span>
                        <p className="text-sm font-bold text-slate-900">{cleanedRecord.name}</p>
                      </div>
                      <div>
                         <span className="text-[10px] uppercase font-bold text-slate-400">Canonical Address</span>
                         <p className="text-xs text-slate-700">{cleanedRecord.address}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Derived PAN</span>
                        <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">{cleanedRecord.derivedPan}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Validated GSTIN</span>
                        <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">{cleanedRecord.gstin}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Parsed District</span>
                        <span className="text-xs font-bold text-slate-700">{cleanedRecord.district}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 flex items-center justify-center text-sm text-slate-400 italic">
                    Awaiting standardization...
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={handleFindMatches}
                  disabled={status === 'idle' || status === 'standardizing' || status === 'matching'}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {status === 'matching' ? <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1}}><Loader2 size={16}/></motion.div> : <Search size={16} />}
                  Find Candidate Matches
                </button>
              </div>
            </div>

            {/* Panel 3: Candidate Match Panel */}
            <div className={cn("flex-1 bg-white rounded-xl shadow-sm border p-5 transition-all duration-500 flex flex-col", (status === 'idle' || status === 'standardizing' || status === 'standardized') ? "opacity-50 grayscale pointer-events-none border-slate-200" : "border-blue-200")}>
              <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold", (status === 'idle' || status === 'standardizing' || status === 'standardized') ? "bg-slate-100 text-slate-400" : "bg-blue-100 text-blue-600")}>3</div>
                   Candidate Match Panel
                </div>
              </h2>

              <div className="flex-1">
                {status === 'matching' ? (
                  <div className="h-full flex flex-col items-center justify-center text-blue-500">
                     <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1.5,ease:"linear"}}><Loader2 size={32} className="opacity-50" /></motion.div>
                     <p className="mt-4 font-bold text-sm">Querying Graph Database...</p>
                  </div>
                ) : status === 'matched' ? (
                  candidates.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider">
                            <th className="p-3 font-bold">Candidate UBID</th>
                            <th className="p-3 font-bold">Business Name</th>
                            <th className="p-3 font-bold text-right">Match %</th>
                            <th className="p-3 font-bold text-center">PAN</th>
                            <th className="p-3 font-bold text-center">GSTIN</th>
                            <th className="p-3 font-bold text-center">Address</th>
                            <th className="p-3 font-bold text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {candidates.map((c, i) => (
                            <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="p-3 font-mono text-xs font-bold text-blue-600">{c.ubid}</td>
                              <td className="p-3 text-xs font-bold text-slate-800">{c.name}</td>
                              <td className="p-3 text-right">
                                <span className={cn("px-2 py-0.5 rounded text-xs font-bold", c.match > 90 ? "bg-emerald-100 text-emerald-700" : c.match > 70 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700")}>
                                  {c.match}%
                                </span>
                              </td>
                              <td className="p-3 text-center"><span className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold", c.pan === 'Exact' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>{c.pan}</span></td>
                              <td className="p-3 text-center"><span className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold", c.gstin === 'Exact' ? "bg-emerald-50 text-emerald-600" : c.gstin === 'Partial' ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500")}>{c.gstin}</span></td>
                              <td className="p-3 text-center"><span className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold", c.addr === 'High' ? "bg-emerald-50 text-emerald-600" : c.addr === 'Medium' ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500")}>{c.addr}</span></td>
                              <td className="p-3 text-right">
                                {c.match > 90 ? (
                                  <button onClick={() => handleAssignUBID(c)} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-colors">Assign</button>
                                ) : (
                                  <button onClick={handleSendToReview} className="px-4 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded text-xs font-bold transition-colors flex items-center gap-1 justify-end ml-auto">
                                    <AlertCircle size={12}/> Review
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 rounded-xl">
                       <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                         <Search size={20} className="text-slate-400" />
                       </div>
                       <h3 className="font-bold text-slate-700 mb-1">No reliable match found</h3>
                       <p className="text-xs text-slate-500 mb-4 max-w-sm">The matching engine could not find any safe candidate for this record. You can create a new UBID.</p>
                       <button onClick={handleCreateNewUBID} className="flex items-center gap-2 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm transition-colors text-sm">
                         <Plus size={16} /> Create New UBID
                       </button>
                    </div>
                  )
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-slate-400 italic">
                    Awaiting matching request...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
