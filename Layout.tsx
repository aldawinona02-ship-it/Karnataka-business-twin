import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Network, 
  UserCheck, 
  AlertTriangle, 
  Settings, 
  ShieldCheck, 
  MessageSquare,
  Menu,
  X,
  Bell,
  ChevronRight,
  Loader2,
  Send,
  FilePlus
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai/web";

let _aiInstance: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!_aiInstance) {
    // @ts-ignore
    const key = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
    console.log("KBDT: Initializing AI with key:", key ? (key.substring(0, 5) + "...") : "MISSING");
    _aiInstance = new GoogleGenAI({ apiKey: key || "placeholder" });
  }
  return _aiInstance;
}

import { usePlatform } from '../context/PlatformContext';

const navItems = [
  { icon: FilePlus, label: 'UBID Assignment Center', path: '/' },
  { icon: LayoutDashboard, label: 'Executive Dashboard', path: '/dashboard' },
  { icon: Search, label: 'UBID Explorer', path: '/explorer' },
  { icon: Network, label: 'Graph View', path: '/graph' },
  { icon: UserCheck, label: 'Reviewer Workbench', path: '/workbench' },
  { icon: AlertTriangle, label: 'Alert Center', path: '/alerts' },
  { icon: Settings, label: 'Policy Sandbox', path: '/sandbox' },
  { icon: ShieldCheck, label: 'Governance Console', path: '/governance' },
];

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isRegistrationModalOpen, setIsRegistrationModalOpen } = usePlatform();

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-slate-900 text-white transition-all duration-300 flex flex-col z-50",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center flex-shrink-0 font-bold">
            B
          </div>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold tracking-tight leading-tight"
            >
              Business Twin <span className="text-slate-400 block text-[10px] uppercase font-medium">Govt of Karnataka</span>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-3 rounded cursor-pointer transition-all duration-200",
                isActive 
                  ? "bg-white/10 border-l-4 border-blue-500 text-white" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white group"
              )}
            >
              <item.icon size={18} className={cn("opacity-70 group-hover:opacity-100")} />
              {isSidebarOpen && <span className="text-sm">{item.label}</span>}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0" />
             {isSidebarOpen && (
               <div className="min-w-0">
                 <div className="text-xs font-semibold truncate">Admin User</div>
                 <div className="text-[10px] text-slate-500 truncate">Dept of Commerce</div>
               </div>
             )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F1F5F9]">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-40 shadow-sm shadow-slate-100">
          <div className="flex items-center gap-4 w-96">
                <Search size={14} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by GSTIN, PAN or Business Name..." 
                  className="w-full py-2 bg-transparent text-sm focus:outline-none placeholder:text-slate-400"
                />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsRegistrationModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg transition-all shadow-lg active:scale-95"
            >
              Request New UBID
            </button>
            <span className="bg-gradient-to-r from-blue-600 to-purple-500 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-sm shadow-purple-200 uppercase tracking-wider">
              Gemini 3.1 Flash Lite (HA)
            </span>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex gap-2">
              <button className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                🔔
              </button>
              <button className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                ⚙️
              </button>
            </div>
          </div>
        </header>

        {/* Page Area */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <Outlet />
        </div>
      </main>

      {/* Copilot Sidebar (Collapsible) */}
      <Copilot />

      {/* Registration Modal */}
      <RegistrationModal isOpen={isRegistrationModalOpen} onClose={() => setIsRegistrationModalOpen(false)} />
    </div>
  );
}

function RegistrationModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Register New Entity</h2>
            <p className="text-[11px] text-slate-500 font-medium font-mono uppercase tracking-widest mt-1">UBID-INTAKE-FORM v4.0</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>
        
        <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setIsSubmitting(true); setTimeout(() => { setIsSubmitting(false); onClose(); }, 1500); }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">Legal Entity Name</label>
              <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20" placeholder="e.g. Karnataka Tools Ltd" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">PAN / GSTIN</label>
              <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20" placeholder="AAAP***921P" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">Registered Address</label>
            <textarea required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 h-20 resize-none" placeholder="Enter full primary address..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">District</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20">
                 <option>Bengaluru Urban</option>
                 <option>Mysuru</option>
                 <option>Belagavi</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">Business Sector</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20">
                 <option>Manufacturing</option>
                 <option>IT / Services</option>
                 <option>Agriculture</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-2 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              Generate Digital Twin
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function Copilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant', text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    const handleOpenEvent = (e: any) => {
      setIsOpen(true);
      if (e.detail?.message) {
        setMessage(e.detail.message);
      }
    };
    window.addEventListener('kbdt:open-copilot', handleOpenEvent);
    return () => window.removeEventListener('kbdt:open-copilot', handleOpenEvent);
  }, []);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userEntry = { role: 'user' as const, text: message };
    setChatHistory(prev => [...prev, userEntry]);
    const currentMessage = message;
    setMessage("");
    setIsLoading(true);

    try {
      const systemInstruction = `You are the KBDT Analyst Copilot. 
      You help government officers analyze business data, summarize risks, and explain policy impacts.
      Context: User is viewing the KBDT Dashboard.
      Never make final legal merge decisions. Only provide summaries and explain logic.`;

      // Implement robust retry logic for 503/429 errors
      let response;
      let lastError;
      for (let i = 0; i < 5; i++) {
        try {
          response = await getAI().models.generateContent({
            model: "gemini-3.1-flash-lite-preview",
            contents: [{ role: 'user', parts: [{ text: currentMessage }] }],
            config: {
              systemInstruction: systemInstruction
            }
          });
          if (response) break;
        } catch (err: any) {
          lastError = err;
          const isRetryable = err.message?.includes('503') || err.message?.includes('429') || err.message?.includes('high demand') || err.message?.includes('quota');
          if (isRetryable && i < 4) {
            console.warn(`Gemini Retry ${i + 1} due to:`, err.message);
            await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
            continue;
          }
          throw err;
        }
      }
      
      const responseText = response?.text || "I'm sorry, I couldn't generate a response.";
      setChatHistory(prev => [...prev, { role: 'assistant', text: responseText }]);
    } catch (error: any) {
       console.error("Gemini Error:", error);
       setChatHistory(prev => [...prev, { role: 'assistant', text: `Sorry, I encountered an error: ${error.message || String(error)}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "fixed right-0 top-0 h-screen bg-white border-l border-slate-200 shadow-2xl transition-all duration-300 z-[60] flex flex-col",
      isOpen ? "w-[400px]" : "w-0 translate-x-full"
    )}>
       <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "absolute right-full top-24 bg-red-700 text-white p-3 rounded-l-xl shadow-lg flex items-center gap-2 transition-transform",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <MessageSquare size={20} />
      </button>

      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-700 rounded-lg flex items-center justify-center shadow-sm">
            <MessageSquare size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-slate-900">KBDT Analyst Copilot</h3>
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X size={18} className="text-slate-400" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#FCFDFF]">
        {chatHistory.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={24} className="text-red-700 opacity-50" />
            </div>
            <p className="text-slate-500 text-xs px-8 leading-relaxed">
              I'm your AI assistant for the Business Digital Twin. Ask me about compliance trends, risk anomalies, or regional insights.
            </p>
          </div>
        )}
        
        {chatHistory.map((msg, i) => (
          <div key={i} className={cn(
            "flex flex-col max-w-[85%]",
            msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
          )}>
            <div className={cn(
              "px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-sm",
              msg.role === 'user' 
                ? "bg-red-700 text-white rounded-tr-none" 
                : "bg-white border border-slate-100 text-slate-800 rounded-tl-none markdown-body"
            )}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
            <span className="text-[9px] text-slate-400 mt-1 font-medium px-1">
              {msg.role === 'user' ? 'You' : 'KBDT Assistant'}
            </span>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 italic text-[10px] bg-slate-50 px-3 py-2 rounded-full w-fit">
            <Loader2 size={12} className="animate-spin text-red-600" />
            Assistant is thinking...
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative group"
        >
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your query..."
            className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 border-slate-200 text-xs focus:ring-2 focus:ring-red-100 focus:bg-white transition-all min-h-[50px] max-h-32 resize-none border"
          />
          <button 
            type="submit"
            disabled={isLoading || !message.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-red-700 text-white rounded-lg disabled:opacity-30 disabled:bg-slate-400 transition-all hover:bg-red-800 shadow-md"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </form>
        <p className="text-[9px] text-center text-slate-400 mt-3 font-medium">
          Powered by Gemini 3.1 Flash Lite • High Availability Tier
        </p>
      </div>
    </div>
  );
}
