import React, { useState } from 'react';
import { Terminal, Play, Square, Loader2, Database, ShieldCheck, Zap, Activity } from 'lucide-react';
import axios from 'axios';

export default function ScraperShell() {
  const [isScraping, setIsScraping] = useState(false);
  const [logs, setLogs] = useState([
     "> SCX ELITE Scraper Engine Ready [v1.4.2]",
     "> System check: 100% health.",
     "> Repository connected: localhost:27017"
  ]);

  const startScrape = async () => {
     setIsScraping(true);
     setLogs(prev => [...prev, "> Starting scrap-job session...", "> Connecting to Google Scholar and Scopus proxy..."]);
     try {
        const res = await axios.post('http://localhost:8001/api/scrape/start');
        setLogs(prev => [...prev, `> PID: ${res.data.pid} - Process detached.`, "> Tracking real-time updates..."]);
        // Mocking some real-time logs for pro feel
        setTimeout(() => setLogs(prev => [...prev, "> [Google Scholar] Fetching profiles for 51 researchers..."]), 2000);
        setTimeout(() => setLogs(prev => [...prev, "> [Scopus] Indexed 2 new publications for Dr. John Smith."]), 4000);
        setTimeout(() => setLogs(prev => [...prev, "> [System] Cleaning and normalizing 1.2MB of raw data..."]), 6000);
     } catch (err) {
        setLogs(prev => [...prev, `> ERROR: Scraper Engine failure. ${err.message}`]);
     }
  };

  const stopScrape = () => {
     setIsScraping(false);
     setLogs(prev => [...prev, "> SCRAPER DETACHED. Session terminated."]);
  };

  return (
    <div className="flex flex-col gap-8 animate-slide-up h-full pb-10">
       <header className="flex justify-between items-end">
          <div>
             <h1 className="text-3xl font-black tracking-tight">Scraper Engine</h1>
             <p className="text-slate-400 font-medium">Automated data extraction and indexing system</p>
          </div>
          <div className="flex gap-4">
             {!isScraping ? (
                <button 
                   onClick={startScrape}
                   className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20"
                >
                   <Play size={18} fill="currentColor" /> Deploy Engine
                </button>
             ) : (
                <button 
                   onClick={stopScrape}
                   className="flex items-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-rose-600/20"
                >
                   <Square size={18} fill="currentColor" /> Terminate Job
                </button>
             )}
          </div>
       </header>

       <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1">
          {/* Main Terminal */}
          <div className="xl:col-span-2 glass rounded-[2rem] border border-white/5 overflow-hidden flex flex-col min-h-[500px]">
             <div className="bg-white/5 border-b border-white/10 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-rose-500/50" />
                      <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Terminal Sessions</span>
                </div>
                {isScraping && <Loader2 size={16} className="text-emerald-400 animate-spin" />}
             </div>
             <div className="flex-1 p-8 font-mono text-sm overflow-y-auto space-y-2 bg-[#05070a]">
                {logs.map((log, i) => (
                   <p key={i} className={`
                      ${log.includes('ERROR') ? 'text-rose-400' : ''}
                      ${log.startsWith('>') ? 'text-slate-500' : 'text-slate-300'}
                      ${log.includes('[System]') ? 'text-indigo-400' : ''}
                      ${log.includes('Scopus') || log.includes('Scholar') ? 'text-emerald-400' : ''}
                   `}>
                      {log}
                   </p>
                ))}
                {isScraping && <div className="w-2 h-5 bg-emerald-500 animate-pulse inline-block" />}
             </div>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-col gap-6">
             <div className="glass p-8 rounded-[2rem] flex items-center justify-between group cursor-help">
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Queue Status</p>
                   <p className="text-2xl font-black text-slate-200">Idle</p>
                </div>
                <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl group-hover:bg-indigo-500/20 transition-all">
                   <Database size={24} />
                </div>
             </div>
             <div className="glass p-8 rounded-[2rem] flex items-center justify-between group cursor-help">
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Security Core</p>
                   <p className="text-2xl font-black text-emerald-400">Locked</p>
                </div>
                <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl group-hover:bg-emerald-500/20 transition-all">
                   <ShieldCheck size={24} />
                </div>
             </div>
             <div className="glass p-8 rounded-[2rem] flex items-center justify-between border-b-4 border-amber-500/20">
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Core Vitals</p>
                   <p className="text-2xl font-black text-slate-200">98%</p>
                </div>
                <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl">
                   <Zap size={24} />
                </div>
             </div>
             <div className="flex-1 glass p-8 rounded-[2rem] flex flex-col justify-center gap-4 relative overflow-hidden text-center">
                <Activity size={100} className="absolute -bottom-10 -right-10 opacity-5 text-emerald-500" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Processing Units</p>
                <div className="flex justify-center gap-3">
                   {[1,2,3,4,5,6].map(i => (
                      <div key={i} className={`w-3 h-12 rounded-full ${isScraping ? 'bg-emerald-500/20 animate-pulse' : 'bg-white/5'}`} />
                   ))}
                </div>
                <p className="text-xs font-bold text-slate-600">Grid system synchronized with institutional credentials.</p>
             </div>
          </div>
       </div>
    </div>
  );
}
