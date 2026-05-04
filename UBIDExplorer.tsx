import React, { useState, useMemo } from 'react';
import { Search, Filter, ShieldCheck, ExternalLink, MoreVertical, Share2, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { usePlatform } from '../context/PlatformContext';

const mockBusinesses = [
  { id: '1', ubid: 'UBID-KA-560001-A12', name: 'Peenya Precision Tools', status: 'Active', district: 'Bengaluru Urban', score: 92, risk: 'Low', sector: 'Industrial' },
  { id: '2', ubid: 'UBID-KA-570002-B45', name: 'Hassan Agro Co-op', status: 'Dormant', district: 'Hassan', score: 45, risk: 'Critical', sector: 'Agriculture' },
  { id: '3', ubid: 'UBID-KA-600392-C09', name: 'Dharwad Soft Tech', status: 'Active', district: 'Dharwad', score: 78, risk: 'Medium', sector: 'Services' },
  { id: '4', ubid: 'UBID-KA-293847-D88', name: 'Mysuru Silk Emporium', status: 'Closed', district: 'Mysuru', score: 10, risk: 'N/A', sector: 'Retail' },
  { id: '5', ubid: 'UBID-KA-112233-E55', name: 'Hubli Logistics', status: 'Active', district: 'Dharwad', score: 85, risk: 'Low', sector: 'Logistics' },
  { id: '6', ubid: 'UBID-KA-445566-F77', name: 'Belagavi Foundry', status: 'Active', district: 'Belagavi', score: 60, risk: 'Medium', sector: 'Industrial' },
];

export default function UBIDExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { setIsRegistrationModalOpen } = usePlatform();

  const itemsPerPage = 4;

  const filteredBusinesses = useMemo(() => {
    return mockBusinesses.filter(biz => 
      biz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biz.ubid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biz.district.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
  const paginatedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleShare = (ubid: string) => {
    navigator.clipboard.writeText(ubid);
    setCopiedId(ubid);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">UBID Explorer</h1>
          <p className="text-slate-500 text-sm mt-1">Unified records for 4.2M registered entities in Karnataka.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
             <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "px-4 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 transition-all",
                isFilterOpen ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 hover:bg-slate-50"
              )}
            >
              <Filter size={16} /> Filters
            </button>
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4"
                >
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Filter by Sector</h4>
                  <div className="space-y-2">
                    {['Industrial', 'Agriculture', 'Services', 'Retail'].map(sector => (
                      <label key={sector} className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer hover:text-slate-900">
                        <input type="checkbox" className="rounded border-slate-300 text-red-600 focus:ring-red-500" />
                        {sector}
                      </label>
                    ))}
                  </div>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full mt-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg"
                  >
                    Apply Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={() => setIsRegistrationModalOpen(true)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            Register New UBID
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm shadow-slate-100">
        <div className="p-4 border-b border-slate-100 bg-slate-50/30">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Name, UBID or District..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-600 outline-none transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Entity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">UBID / Region</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">DNA Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Health Score</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk Level</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedBusinesses.map((biz, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={biz.id} 
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{biz.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{biz.sector}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-mono text-[11px] text-red-700 bg-red-50 px-2 py-0.5 rounded inline-block mb-1">
                      {biz.ubid}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">{biz.district}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={cn(
                      "text-[10px] font-bold px-2.5 py-1 rounded-full inline-block uppercase tracking-wider",
                      biz.status === 'Active' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      biz.status === 'Dormant' ? "bg-amber-50 text-amber-700 border border-amber-100" :
                      "bg-slate-100 text-slate-500"
                    )}>
                      {biz.status}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="w-full max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          biz.score > 80 ? "bg-emerald-500" : biz.score > 50 ? "bg-amber-500" : "bg-red-600"
                        )}
                        style={{ width: `${biz.score}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 mt-1 block tracking-tight">{biz.score}% Compliance</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className={cn(
                      "flex items-center gap-1.5 text-xs font-semibold",
                      biz.risk === 'Low' ? "text-emerald-600" : 
                      biz.risk === 'Medium' ? "text-amber-600" : 
                      "text-red-700"
                    )}>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full animate-pulse",
                        biz.risk === 'Low' ? "bg-emerald-600" : 
                        biz.risk === 'Medium' ? "bg-amber-600" : 
                        "bg-red-700"
                      )} />
                      {biz.risk}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                        onClick={(e) => { e.stopPropagation(); handleShare(biz.ubid); }}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          copiedId === biz.ubid ? "bg-emerald-50 text-emerald-600" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        )}
                      >
                        {copiedId === biz.ubid ? <Check size={16} /> : <Share2 size={16} />}
                      </button>
                       <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {paginatedBusinesses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic text-sm">
                    No entities found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
          <div className="text-[10px] text-slate-500 font-medium font-mono uppercase tracking-wider">
            Showing {paginatedBusinesses.length} of {filteredBusinesses.length} entities
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={cn(
                "px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 flex items-center gap-1 transition-all",
                currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-50 active:scale-95"
              )}
            >
              <ChevronLeft size={12} /> Prev
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={cn(
                "px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 flex items-center gap-1 transition-all",
                currentPage === totalPages || totalPages === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-50 active:scale-95"
              )}
            >
              Next <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
