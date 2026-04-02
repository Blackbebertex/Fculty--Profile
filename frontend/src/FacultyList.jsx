import React, { useState } from 'react';
import { Search, User, MoreHorizontal, Mail, ExternalLink, Filter, BookOpen } from 'lucide-react';

const FacultyCard = ({ faculty, onViewPapers }) => (
  <div className="glass p-6 rounded-[1.5rem] hover:border-blue-500/30 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-100 transition-opacity">
       <MoreHorizontal size={18} className="cursor-pointer" />
    </div>
    
    <div className="flex items-center gap-4 mb-6">
       <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/5 shadow-xl">
          <span className="text-2xl font-black text-blue-400">{faculty.name[0]}</span>
       </div>
       <div>
          <h3 className="text-lg font-bold text-slate-100 leading-tight">{faculty.name}</h3>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">{faculty.area || 'Research Faculty'}</p>
       </div>
    </div>

    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/5">
       <div className="text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Papers</p>
          <p className="text-sm font-black text-blue-400">{faculty.papers}</p>
       </div>
       <div className="text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase">Citations</p>
          <p className="text-sm font-black text-blue-400">{faculty.citations}</p>
       </div>
       <div className="text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase">h-index</p>
          <p className="text-sm font-black text-blue-400">{faculty.hIndex}</p>
       </div>
    </div>

    <div className="flex gap-2">
       <button className="flex-1 py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
          <Mail size={14} /> Contact
       </button>
        <button 
           className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
           onClick={() => onViewPapers(faculty.name)}
        >
           <BookOpen size={14} /> Papers
        </button>
     </div>
  </div>
);

export default function FacultyList({ faculties = [], onViewPapers }) {
  const [search, setSearch] = useState("");
  const filtered = faculties.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-8 animate-slide-up">
       <header className="flex justify-between items-end">
          <div>
             <h1 className="text-3xl font-black tracking-tight">Faculty Directory</h1>
             <p className="text-slate-400 font-medium">Managing {faculties.length} academic researchers</p>
          </div>
          <div className="flex gap-4">
             <div className="relative w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                   type="text" 
                   placeholder="Find a faculty member..." 
                   className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm focus:border-blue-500/50 outline-none transition-all"
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                />
             </div>
             <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white">
                <Filter size={20} />
             </button>
          </div>
       </header>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.length > 0 ? (
            filtered.map((f, i) => <FacultyCard key={i} faculty={f} onViewPapers={onViewPapers} />)
          ) : (
            <div className="col-span-full py-20 text-center glass rounded-3xl">
               <User size={48} className="mx-auto text-slate-600 mb-4" />
               <p className="text-slate-500 font-bold">No researchers found matching "{search}"</p>
            </div>
          )}
       </div>
    </div>
  );
}
