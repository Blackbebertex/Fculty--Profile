import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LayoutDashboard, Users, BookOpen, Terminal, ChevronRight,
  Sun, Moon, Zap, Activity, GraduationCap, LogOut, Settings,
  TrendingUp, Database
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Dashboard from './Dashboard';
import FacultyList from './FacultyList';
import PublicationsList from './PublicationsList';
import ScraperShell from './ScraperShell';

// Use relative path — Vite proxy routes /api → http://localhost:8001
const API_BASE = "/api";

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Analytics overview' },
  { id: 'faculties', label: 'Faculties', icon: Users, desc: 'Researcher profiles' },
  { id: 'publications', label: 'Publications', icon: BookOpen, desc: 'Research repository' },
  { id: 'scraper', label: 'Scraper Engine', icon: Terminal, desc: 'Data extraction' },
];

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const [stats, setStats] = useState({ totalPublications: 0, totalFaculties: 0, journalsCovered: 0, sourcesCovered: 0 });
  const [trends, setTrends] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const fetchData = async () => {
    try {
      const [resStats, resTrends, resFaculties, resDist, resFeed] = await Promise.all([
        axios.get(`${API_BASE}/stats`),
        axios.get(`${API_BASE}/trends`),
        axios.get(`${API_BASE}/faculties`),
        axios.get(`${API_BASE}/distribution`),
        axios.get(`${API_BASE}/feed`),
      ]);
      setStats(resStats.data);
      setTrends(resTrends.data);
      setFaculties(resFaculties.data);
      setDistribution(resDist.data);
      setFeed(resFeed.data);
      setBackendOnline(true);
    } catch (e) {
      setBackendOnline(false);
      console.error("Backend fetch error:", e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => setTheme(p => p === 'dark' ? 'light' : 'dark');
  
  const handleViewPapers = (facultyName) => {
    setSelectedFaculty(facultyName);
    setActiveTab('publications');
  };

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'publications') {
      setSelectedFaculty(null); // Clear filter if navigating manually
    }
  };

  const currentNav = NAV_ITEMS.find(n => n.id === activeTab);

  return (
    <div className="pro-container">

      {/* ── PREMIUM SIDEBAR ── */}
      <aside
        className="sidebar-width"
        style={{
          width: sidebarCollapsed ? '72px' : '260px',
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #080c18 0%, #0d1425 50%, #080c18 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 30,
          flexShrink: 0,
          minHeight: '100vh',
        }}
      >
        {/* Glow effect top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '200px',
          background: 'radial-gradient(ellipse at 50% -20%, rgba(59,130,246,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: sidebarCollapsed ? '1.5rem 0' : '1.5rem 1.5rem',
          paddingLeft: sidebarCollapsed ? '0' : '1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          marginBottom: '0.5rem',
          position: 'relative', zIndex: 1
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div style={{
              width: '38px', height: '38px', flexShrink: 0,
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(59,130,246,0.4)'
            }}>
              <GraduationCap size={20} color="white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', lineHeight: 1 }}>Faculty Hub</p>
                <p style={{ fontSize: '0.65rem', color: '#60a5fa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Research Platform</p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b', padding: '0.35rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {/* Expand button (collapsed) */}
        {sidebarCollapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <button
              onClick={() => setSidebarCollapsed(false)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b', padding: '0.4rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', transition: 'all 0.2s', transform: 'rotate(180deg)' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Status Badge */}
        {!sidebarCollapsed && (
          <div style={{ padding: '0 1.25rem 1rem', position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              background: backendOnline ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${backendOnline ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              borderRadius: '0.5rem', padding: '0.5rem 0.75rem'
            }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: backendOnline ? '#10b981' : '#ef4444', flexShrink: 0, animation: backendOnline ? 'pulse 2s infinite' : 'none' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: backendOnline ? '#34d399' : '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {backendOnline ? 'System Online' : 'Backend Offline'}
              </span>
              <Database size={12} color={backendOnline ? '#34d399' : '#f87171'} style={{ marginLeft: 'auto' }} />
            </div>
          </div>
        )}

        {/* Live Stats Mini */}
        {!sidebarCollapsed && backendOnline && (
          <div style={{ padding: '0 1.25rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              { label: 'Publications', value: stats.totalPublications, color: '#60a5fa' },
              { label: 'Faculties', value: stats.totalFaculties, color: '#a78bfa' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '0.5rem', padding: '0.6rem 0.75rem', textAlign: 'center'
              }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 900, color: s.color }}>{s.value}</p>
                <p style={{ fontSize: '0.6rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Section label */}
        {!sidebarCollapsed && (
          <p style={{ padding: '0 1.25rem 0.5rem', fontSize: '0.6rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Navigation
          </p>
        )}

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: sidebarCollapsed ? '0 0.75rem' : '0 0.75rem', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV_ITEMS.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={sidebarCollapsed ? item.label : ''}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: sidebarCollapsed ? '0' : '0.75rem',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '0.75rem' : '0.7rem 0.85rem',
                  borderRadius: '0.625rem', border: 'none', cursor: 'pointer',
                  background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                  outline: isActive ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  position: 'relative', overflow: 'hidden'
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; } }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: '20%', width: '3px', height: '60%',
                    background: '#3b82f6', borderRadius: '0 3px 3px 0',
                    boxShadow: '0 0 8px rgba(59,130,246,0.6)'
                  }} />
                )}
                <div style={{
                  padding: '0.35rem', borderRadius: '0.4rem', flexShrink: 0,
                  background: isActive ? 'rgba(59,130,246,0.2)' : 'transparent',
                  color: isActive ? '#60a5fa' : '#475569',
                  transition: 'all 0.2s'
                }}>
                  <item.icon size={18} />
                </div>
                {!sidebarCollapsed && (
                  <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: isActive ? '#fff' : '#94a3b8', lineHeight: 1.2, whiteSpace: 'nowrap' }}>{item.label}</p>
                    <p style={{ fontSize: '0.65rem', color: isActive ? '#60a5fa' : '#334155', fontWeight: 500, whiteSpace: 'nowrap' }}>{item.desc}</p>
                  </div>
                )}
                {!sidebarCollapsed && isActive && (
                  <ChevronRight size={14} color="#3b82f6" style={{ flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.05)', padding: sidebarCollapsed ? '1rem 0.75rem' : '1rem 0.75rem' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: '0.75rem', padding: sidebarCollapsed ? '0.65rem' : '0.65rem 0.85rem',
              borderRadius: '0.625rem', border: 'none', background: 'transparent', cursor: 'pointer',
              color: '#475569', transition: 'all 0.2s', marginBottom: '4px'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569'; }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {!sidebarCollapsed && <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {/* Admin Profile */}
          {!sidebarCollapsed && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.75rem', marginTop: '0.5rem'
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '0.9rem', color: '#fff'
              }}>A</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0', lineHeight: 1 }}>Admin Portal</p>
                <p style={{ fontSize: '0.62rem', color: '#334155', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.15rem' }}>Superuser Access</p>
              </div>
              <Zap size={14} color="#60a5fa" />
            </div>
          )}

          {sidebarCollapsed && (
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', margin: '0.5rem auto 0',
              background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '0.9rem', color: '#fff'
            }}>A</div>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content">
        {/* Top breadcrumb bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(10,14,26,0.7)', backdropFilter: 'blur(10px)',
          position: 'sticky', top: 0, zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#334155', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Faculty Hub</span>
            <ChevronRight size={12} color="#334155" />
            <span style={{ fontSize: 'rgb(0.75rem)', color: '#60a5fa', fontWeight: 700 }}>{currentNav?.label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={14} color={backendOnline ? '#10b981' : '#ef4444'} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: backendOnline ? '#34d399' : '#f87171', textTransform: 'uppercase' }}>
                {backendOnline ? 'Live Data' : 'Offline'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', background: 'rgba(59,130,246,0.08)', borderRadius: '99px', border: '1px solid rgba(59,130,246,0.15)' }}>
              <TrendingUp size={13} color="#60a5fa" />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#60a5fa' }}>{stats.totalPublications} Publications</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ minHeight: 'calc(100vh - 57px)' }}>
          {activeTab === 'dashboard' && (
            <Dashboard 
              stats={stats} 
              trends={trends} 
              distribution={distribution} 
              feed={feed} 
              faculties={faculties} 
              onViewPapers={handleViewPapers}
            />
          )}
          {activeTab === 'faculties' && <FacultyList faculties={faculties} onViewPapers={handleViewPapers} />}
          {activeTab === 'publications' && <PublicationsList publications={feed} initialSearch={selectedFaculty} />}
          {activeTab === 'scraper' && <ScraperShell />}
        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
