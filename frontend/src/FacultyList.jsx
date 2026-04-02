import React, { useState } from 'react';
import { Search, User, Mail, ExternalLink, Filter, BookOpen, Globe, Award, TrendingUp } from 'lucide-react';

const FacultyCard = ({ faculty, onViewPapers }) => {
  const links = faculty.profileLinks || {};
  
  return (
    <div className="glass-elite p-8 rounded-[2rem] card-hover-effect group relative overflow-hidden flex flex-col h-full">
      {/* Background Decorative Element */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
      
      <div className="flex items-start justify-between mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center border border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-500">
             <span className="text-3xl font-black bg-gradient-to-br from-blue-400 to-indigo-300 bg-clip-text text-transparent">{faculty.name[0]}</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
             <TrendingUp size={14} />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
           {links.googleScholar && (
             <a href={links.googleScholar} target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 rounded-lg transition-all border border-white/5" title="Google Scholar">
                <Globe size={14} />
             </a>
           )}
           {links.scopus && (
             <a href={links.scopus} target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-orange-500/10 text-slate-400 hover:text-orange-400 rounded-lg transition-all border border-white/5" title="Scopus">
                <Award size={14} />
             </a>
           )}
        </div>
      </div>
      
      <div className="mb-8">
         <h3 className="text-xl font-bold text-slate-100 leading-tight mb-1 group-hover:text-blue-400 transition-colors">{faculty.name}</h3>
         <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">{faculty.area || 'Academic Research'}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="metric-badge">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Citations</p>
            <p className="text-lg font-black text-blue-400 font-mono tracking-tighter">{faculty.citations}</p>
         </div>
         <div className="metric-badge">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">h-Index</p>
            <p className="text-lg font-black text-indigo-400 font-mono tracking-tighter">{faculty.hIndex}</p>
         </div>
         <div className="metric-badge">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Papers</p>
            <p className="text-lg font-black text-emerald-400 font-mono tracking-tighter">{faculty.papers}</p>
         </div>
         <div className="metric-badge">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">i10-idx</p>
            <p className="text-lg font-black text-purple-400 font-mono tracking-tighter">{faculty.i10Index || 0}</p>
         </div>
      </div>

      <div className="mt-auto flex gap-3">
         <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:border-blue-500/50 flex items-center justify-center gap-2">
            <Mail size={14} /> Contact
         </button>
         <button 
            className="flex-1 py-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/20 text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            onClick={() => onViewPapers(faculty.name)}
         >
            <BookOpen size={14} /> Papers
         </button>
      </div>
    </div>
  );
};

export default function FacultyList({ faculties = [], onViewPapers }) {
  const [search, setSearch] = useState("");
  const filtered = faculties.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-12 animate-slide-up pb-20">
       <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white/[0.02] p-10 rounded-[3rem] border border-white/5">
          <div>
             <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Global Directory</span>
             </div>
             <h1 className="text-5xl font-black tracking-tight text-white mb-2">Researcher Profile Index</h1>
             <p className="text-slate-500 font-medium text-lg italic">Accessing database of {faculties.length} world-class academic authorities</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-96">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                   type="text" 
                   placeholder="Identify researcher by name..." 
                   className="w-full bg-black/40 border border-white/10 rounded-3xl pl-16 pr-8 py-5 text-base focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600 focus:bg-black/60"
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                />
             </div>
             <button className="p-5 bg-white/5 border border-white/10 rounded-3xl text-slate-400 hover:text-white transition-all hover:bg-white/10">
                <Filter size={24} />
             </button>
          </div>
       </header>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.length > 0 ? (
            filtered.map((f, i) => <FacultyCard key={i} faculty={f} onViewPapers={onViewPapers} />)
          ) : (
            <div className="col-span-full py-40 text-center glass-elite rounded-[4rem] border-dashed">
               <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                  <User size={48} className="text-slate-600" />
               </div>
               <h3 className="text-2xl font-black text-slate-400 mb-2">Identity Not Found</h3>
               <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">No records matching "{search}" in secure database</p>
               <button onClick={() => setSearch("")} className="mt-8 text-blue-500 font-black uppercase tracking-widest text-[10px] border-b border-blue-500/20 hover:border-blue-500 transition-all">Clear Search Filters</button>
            </div>
          )}
       </div>
    </div>
  );
}
