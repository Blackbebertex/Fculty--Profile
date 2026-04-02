import React from 'react';
import { 
  ArrowLeft, BookOpen, Globe, Award, TrendingUp, Mail, 
  ExternalLink, FileText, Calendar, LucideInfo 
} from 'lucide-react';

export default function FacultyProfile({ faculty, publications = [], onBack }) {
  if (!faculty) return null;

  const filteredPubs = publications.filter(p => p.faculty.toLowerCase() === faculty.name.toLowerCase());
  const links = faculty.profileLinks || {};

  return (
    <div className="flex flex-col gap-12 animate-slide-up pb-20">
      {/* ── BACK NAVIGATION ── */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-400 font-black uppercase tracking-[0.2em] text-[10px] transition-all group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Directory
      </button>

      {/* ── PROFILE HERO SECTION ── */}
      <div className="glass-elite p-12 rounded-[3.5rem] relative overflow-hidden border border-white/10">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start relative z-10 text-center md:text-left">
           <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gradient-to-br from-blue-600/30 to-indigo-600/30 flex items-center justify-center border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
              <span className="text-5xl md:text-6xl font-black bg-gradient-to-br from-blue-200 to-indigo-100 bg-clip-text text-transparent">{faculty.name[0]}</span>
           </div>

           <div className="flex-1">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4 mb-4">
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">{faculty.name}</h1>
                 <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    Verified Scholar
                 </div>
              </div>
              <p className="text-xl font-medium text-slate-400 mb-8 italic">{faculty.area || 'Senior Research Faculty'}</p>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                 {links.googleScholar && (
                   <a href={links.googleScholar} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-blue-600/10 border border-white/5 text-slate-300 hover:text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                      <Globe size={14} /> Google Scholar
                   </a>
                 )}
                 {links.scopus && (
                   <a href={links.scopus} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-orange-600/10 border border-white/5 text-slate-300 hover:text-orange-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                      <Award size={14} /> Scopus Index
                   </a>
                 )}
                 <button className="flex items-center gap-2 px-5 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/20 text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                    <Mail size={14} /> Contact Researcher
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* ── KEY METRICS DASHBOARD ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Total Citations', value: faculty.citations, icon: TrendingUp, color: '#60a5fa', bg: 'rgba(59,130,246,0.1)' },
           { label: 'h-Index', value: faculty.hIndex, icon: Award, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
           { label: 'i10-Index', value: faculty.i10Index || 0, icon: LucideInfo, color: '#f472b6', bg: 'rgba(244,114,182,0.1)' },
           { label: 'Research Papers', value: faculty.papers, icon: FileText, color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
         ].map(m => (
           <div key={m.label} className="glass-elite p-8 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
              <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{m.label}</p>
                 <p className="text-3xl font-black text-white font-mono">{m.value}</p>
              </div>
              <div style={{ background: m.bg, color: m.color }} className="p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                 <m.icon size={24} />
              </div>
           </div>
         ))}
      </div>

      {/* ── PUBLICATION INVENTORY ── */}
      <div className="flex flex-col gap-6">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <BookOpen size={20} />
               </div>
               <h2 className="text-2xl font-black tracking-tight text-white">Full Research Inventory</h2>
            </div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{filteredPubs.length} entries indexed</p>
         </div>

         <div className="grid grid-cols-1 gap-4">
            {filteredPubs.length > 0 ? (
               filteredPubs.map((p, i) => (
                  <div key={i} className="glass-elite p-8 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all group">
                     <div className="flex justify-between items-start gap-8">
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-3 mb-2">
                              {p.year && <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-lg font-mono">{p.year}</span>}
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.source || 'Scholar Index'}</span>
                           </div>
                           <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors mb-2">{p.title}</h3>
                           <p className="text-xs font-medium text-slate-500 italic mb-4">{p.journal || 'General Publication'}</p>
                           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Authors: {p.authors || faculty.name}</p>
                        </div>
                        
                        {p.link && (
                           <a 
                             href={p.link} 
                             target="_blank" 
                             rel="noreferrer" 
                             className="p-4 bg-white/5 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 rounded-2xl border border-white/5 transition-all flexShrink-0"
                           >
                              <ExternalLink size={20} />
                           </a>
                        )}
                     </div>
                  </div>
               ))
            ) : (
               <div className="py-20 text-center glass-elite rounded-[3rem] border-dashed border-white/10">
                  <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">No publications indexed in local database yet</p>
                  <p className="text-slate-600 text-[10px] mt-2 italic font-medium">Use the Scraper Engine to discover research entries for {faculty.name}</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
