import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Filter, Download, ExternalLink, SlidersHorizontal } from 'lucide-react';

export default function PublicationsList({ publications = [], initialSearch = "" }) {
  const [search, setSearch] = useState(initialSearch || "");

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearch(initialSearch || "");
    }
  }, [initialSearch]);

  const filtered = publications.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.faculty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
       <header className="flex justify-between items-end">
          <div>
             <h1 className="text-3xl font-black tracking-tight">Institutional Repository</h1>
             <p className="text-slate-400 font-medium">{publications.length} total research index entries</p>
          </div>
          <div className="flex gap-4">
             <div className="relative w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                   type="text" 
                   placeholder="Search papers, faculty, journals..." 
                   className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm focus:border-blue-500/50 outline-none transition-all"
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                />
             </div>
             <button className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white text-sm font-bold px-5 transition-all">
                <SlidersHorizontal size={18} /> Filters
             </button>
             <button className="p-3 bg-blue-600/10 border border-blue-500/10 rounded-2xl text-blue-400 hover:bg-blue-600/20 transition-all">
                <Download size={20} />
             </button>
          </div>
       </header>

       <div className="glass rounded-[2rem] overflow-hidden border border-white/5">
          <table className="w-full text-left">
             <thead>
                <tr className="bg-white/[0.02]">
                   <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Identity / Title</th>
                   <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Source</th>
                   <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Author</th>
                   <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Year</th>
                   <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {filtered.map((p, i) => (
                   <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                         <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                               <BookOpen size={20} />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-200 line-clamp-1 group-hover:text-blue-400 transition-colors">{p.title}</p>
                               <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-1">{p.journal}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {p.source || 'Scopus'}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-300">{p.faculty}</td>
                      <td className="px-8 py-6 text-sm font-mono text-slate-500 text-center font-bold">{p.year}</td>
                      <td className="px-8 py-6 text-right">
                         <button className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl transition-all">
                            <ExternalLink size={18} />
                         </button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}
