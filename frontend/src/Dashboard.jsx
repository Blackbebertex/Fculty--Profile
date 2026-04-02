import React from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  FileText, Users, TrendingUp, Trophy, Download, RefreshCw, BarChart2,
  BookOpen, Globe, Search
} from 'lucide-react';

const FALLBACK_TRENDS = [
  { year: '2018', count: 15 },
  { year: '2019', count: 25 },
  { year: '2020', count: 30 },
  { year: '2021', count: 35 },
  { year: '2022', count: 42 },
  { year: '2023', count: 58 },
];

const FALLBACK_DIST = [
  { name: 'Computer Science', value: 51 },
];

const COLORS = ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899'];

export default function Dashboard({
  stats = { totalPublications: 0, totalFaculties: 0, journalsCovered: 0 },
  trends = [],
  distribution = [],
  feed = [],
  faculties = [],
  onViewPapers = () => {},
}) {
  const topFaculties = [...faculties].sort((a, b) => b.papers - a.papers).slice(0, 5);
  const topFaculty = topFaculties[0];
  const trendData = trends.length > 0 ? trends : FALLBACK_TRENDS;
  const distData = distribution.length > 0 ? distribution : FALLBACK_DIST;

  return (
    <div className="dashboard-layout">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="window-controls">
          <div className="dot dot-red"></div>
          <div className="dot dot-yellow"></div>
          <div className="dot dot-green"></div>
        </div>
        <h1 className="text-lg font-bold tracking-tight">Faculty Research Intelligence Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem', opacity: 0.7 }}>
          <BarChart2 size={18} />
          <Download size={18} />
          <RefreshCw size={18} />
        </div>
      </div>

      {/* KPI Stats Row — now driven by real data */}
      <div className="stats-grid">
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(59,130,246,0.15)', borderRadius: '0.5rem', color: '#60a5fa' }}>
            <FileText size={24} />
          </div>
          <div>
            <p className="kpi-label">Total Publications</p>
            <p className="kpi-value">{stats.totalPublications}</p>
          </div>
        </div>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(99,102,241,0.15)', borderRadius: '0.5rem', color: '#818cf8' }}>
            <Users size={24} />
          </div>
          <div>
            <p className="kpi-label">Total Faculties</p>
            <p className="kpi-value">{stats.totalFaculties}</p>
          </div>
        </div>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(16,185,129,0.15)', borderRadius: '0.5rem', color: '#34d399' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="kpi-label">Journals Covered</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <p className="kpi-value">{stats.journalsCovered}</p>
            </div>
          </div>
        </div>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(245,158,11,0.15)', borderRadius: '0.5rem', color: '#fbbf24' }}>
            <Trophy size={24} />
          </div>
          <div>
            <p className="kpi-label">Top Faculty</p>
            <p className="kpi-value" style={{ fontSize: '1.1rem' }}>
              {topFaculty ? `${topFaculty.name.split(' ')[0]} ${topFaculty.name.split(' ')[1] || ''} — H:${topFaculty.hIndex}` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Top Researchers + Trend Chart */}
      <div className="main-grid">
        <div className="glass-card">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
            Top Researchers
          </h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Papers</th>
                  <th>Citations</th>
                  <th>H-Index</th>
                  <th>i10-Index</th>
                </tr>
              </thead>
              <tbody>
                {topFaculties.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 'bold', color: '#60a5fa' }}>#{i + 1}</td>
                    <td style={{ fontWeight: 'bold' }}>{r.name}</td>
                    <td style={{ fontFamily: 'monospace' }}>{r.papers}</td>
                    <td style={{ fontFamily: 'monospace', color: '#93c5fd' }}>{r.citations}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: '900' }}>{r.hIndex}</td>
                    <td style={{ fontFamily: 'monospace', color: '#818cf8' }}>{r.i10Index || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
            Publications Over Time
          </h2>
          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWave)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Faculty Spotlight Cards */}
      <div className="faculty-grid">
        {faculties.slice(0, 4).map((f, i) => (
          <div key={i} className="glass-card researcher-card" style={{ cursor: 'pointer', transition: 'border-color 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
          >
            <div style={{
              width: '5rem', height: '5rem', borderRadius: '50%',
              background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', marginBottom: '1rem',
              border: '2px solid rgba(59,130,246,0.2)',
              boxShadow: '0 10px 30px rgba(59,130,246,0.1)',
              transition: 'transform 0.3s'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: '#60a5fa' }}>{f.name[0]}</span>
            </div>
            <h3 style={{ fontWeight: 'bold', color: '#f1f5f9', fontSize: '0.95rem', textAlign: 'center' }}>{f.name}</h3>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.area}</p>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem',
              width: '100%', marginTop: '1rem', padding: '0.75rem',
              background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', textAlign: 'center'
            }}>
              <div>
                <p style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Papers</p>
                <p style={{ color: '#60a5fa', fontWeight: 700 }}>{f.papers}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Cites</p>
                <p style={{ color: '#60a5fa', fontWeight: 700 }}>{f.citations}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase' }}>i10-idx</p>
                <p style={{ color: '#818cf8', fontWeight: 700 }}>{f.i10Index || 0}</p>
              </div>
            </div>
            <button 
              className="view-btn" 
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => onViewPapers(f.name)}
            >
              View Papers
            </button>
          </div>
        ))}
      </div>

      {/* Research Focus Pie + Latest Feed */}
      <div className="main-grid">
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)', textAlign: 'center', width: '100%' }}>
            Research Distribution
          </h2>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ height: '220px', minWidth: '200px', flex: '0 0 auto' }}>
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie data={distData} innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                    {distData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '1 1 auto' }}>
              {distData.map((item, index) => (
                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0.5rem', borderRadius: '0.5rem', cursor: 'default' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[index % COLORS.length], flexShrink: 0 }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.name}</span>
                  </div>
                  <span style={{ fontFamily: 'monospace', fontWeight: 900, color: '#60a5fa', fontSize: '0.8rem' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
            Recent Publications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {feed.slice(0, 5).map((p, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem',
                background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem',
                border: '1px solid rgba(255,255,255,0.06)', transition: 'border-color 0.3s', cursor: 'pointer'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                <div style={{ padding: '0.5rem', background: 'rgba(59,130,246,0.1)', borderRadius: '0.5rem', color: '#60a5fa', flexShrink: 0 }}>
                  <BookOpen size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.faculty} · {p.year} | {p.journal}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', padding: '0 0.5rem' }}>
          <Search size={16} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Filters</span>
        </div>
        <select className="filter-select"><option>All Faculties</option></select>
        <select className="filter-select"><option>All Years</option><option>2024</option><option>2023</option><option>2022</option></select>
        <select className="filter-select"><option>All Journals</option><option>Springer</option><option>IEEE Xplore</option></select>
        <select className="filter-select"><option>Research Area</option><option>Computer Science</option></select>
        <button className="apply-btn" style={{ marginLeft: 'auto' }}>Apply Filters</button>
      </div>

      {/* Bottom Publications Table — live data */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
          Publication Repository
        </h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Faculty</th>
                <th>Journal</th>
                <th>Year</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {feed.slice(0, 10).map((p, i) => (
                <tr key={i}>
                  <td style={{ fontStyle: 'italic', color: '#60a5fa', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>• {p.title}</td>
                  <td style={{ fontWeight: 600 }}>{p.faculty}</td>
                  <td>{p.journal}</td>
                  <td style={{ fontFamily: 'monospace' }}>{p.year}</td>
                  <td>
                    <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)' }}>
                      {p.source || 'Scopus'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
