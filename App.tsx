import React, { useState } from 'react';
import { UserRole, Orphanage, ChildProfile } from './types';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Donation from './components/Donation';
import AIAssistant from './components/AIAssistant';
import OrphanageManager from './components/OrphanageManager';
import { MOCK_ORPHANAGES, MOCK_CHILDREN } from './constants';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'donation' | 'home' | 'manage'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dynamic data state
  const [orphanages, setOrphanages] = useState<Orphanage[]>(MOCK_ORPHANAGES);
  const [children, setChildren] = useState<ChildProfile[]>(MOCK_CHILDREN);

  if (!userRole) {
    return <Auth onLogin={(role) => {
      setUserRole(role);
      // Redirect orphanages to their management page by default
      if (role === UserRole.ORPHANAGE) {
        setActiveTab('manage');
      }
    }} />;
  }

  const mockUser = {
    name: userRole === UserRole.ORPHANAGE ? "Admin @ Hope Center" : "Jane Doe",
    email: userRole === UserRole.ORPHANAGE ? "admin@hopecenter.org" : "jane.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
  };

  const handleLogout = () => {
    setUserRole(null);
    setActiveTab('home');
    setIsMobileMenuOpen(false);
  };

  const navigateTo = (tab: 'dashboard' | 'donation' | 'home' | 'manage') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const LandingPage = () => (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 text-center lg:text-left space-y-8 animate-slide-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-sm font-bold">
            <i className="fas fa-sparkles"></i>
            <span>Transforming Lives Globally</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight">
            Creating Bright Futures for <span className="text-indigo-600">Every Child</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            KindHeart connects compassionate souls with orphanages worldwide. Support through donations, find a child to sponsor, or start your adoption journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
            <button 
              onClick={() => navigateTo('dashboard')}
              className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-200"
            >
              Find a Child to Support
            </button>
            <button 
              onClick={() => navigateTo('donation')}
              className="px-10 py-5 bg-white text-indigo-600 border-2 border-indigo-100 rounded-2xl font-bold text-lg hover:border-indigo-600 hover:scale-105 transition-all shadow-sm"
            >
              Make a Donation
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 relative group">
          <div className="absolute -inset-4 bg-indigo-100 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop" 
            alt="Happy Children" 
            className="relative rounded-[2.5rem] shadow-2xl border-8 border-white object-cover aspect-[4/3] w-full"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="glass sticky top-0 z-50 border-b border-slate-200/50 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigateTo('home')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
              <i className="fas fa-hand-holding-heart"></i>
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">KindHeart</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigateTo('home')} className={`font-semibold text-sm transition-colors ${activeTab === 'home' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Home</button>
            
            {userRole === UserRole.ORPHANAGE ? (
              <button onClick={() => navigateTo('manage')} className={`font-semibold text-sm transition-colors ${activeTab === 'manage' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Manage Profiles</button>
            ) : (
              <>
                <button onClick={() => navigateTo('dashboard')} className={`font-semibold text-sm transition-colors ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Adoption Profiles</button>
                <button onClick={() => navigateTo('donation')} className={`font-semibold text-sm transition-colors ${activeTab === 'donation' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}>Give Support</button>
              </>
            )}

            <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
              <img src={mockUser.avatar} className="w-8 h-8 rounded-lg object-cover" alt="Profile" />
              <div className="text-left leading-none">
                <div className="text-xs font-black text-slate-900">{mockUser.name}</div>
                <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">{userRole}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors" title="Logout">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>

          <button className="md:hidden text-slate-600 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>

        {/* FULL SCREEN VERTICAL MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-[100] flex flex-col p-8 animate-slide-down overflow-y-auto h-screen w-screen">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                  <i className="fas fa-hand-holding-heart"></i>
                </div>
                <span className="text-2xl font-black text-slate-800 tracking-tight">KindHeart</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="w-14 h-14 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>

            <div className="mb-14 flex flex-col items-center">
              <div className="relative mb-6">
                <img src={mockUser.avatar} className="w-32 h-32 rounded-[3rem] object-cover shadow-2xl border-4 border-indigo-50" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full"></div>
              </div>
              <h3 className="text-4xl font-black text-slate-900 text-center">{mockUser.name}</h3>
              <p className="text-slate-400 font-medium mt-2">{mockUser.email}</p>
              <div className="mt-4 px-6 py-2 bg-indigo-50 text-indigo-600 text-xs font-black uppercase rounded-2xl tracking-[0.2em] border border-indigo-100">
                {userRole}
              </div>
            </div>

            <div className="flex-1 space-y-4 max-w-md mx-auto w-full flex flex-col justify-center">
              <button onClick={() => navigateTo('home')} className={`w-full py-7 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 transition-all ${activeTab === 'home' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'bg-slate-50 text-slate-600'}`}>
                <i className="fas fa-house-user"></i>
                Home
              </button>
              
              {userRole === UserRole.ORPHANAGE ? (
                <button onClick={() => navigateTo('manage')} className={`w-full py-7 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 transition-all ${activeTab === 'manage' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'bg-slate-50 text-slate-600'}`}>
                  <i className="fas fa-tasks"></i>
                  Manage Profiles
                </button>
              ) : (
                <>
                  <button onClick={() => navigateTo('dashboard')} className={`w-full py-7 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'bg-slate-50 text-slate-600'}`}>
                    <i className="fas fa-id-card"></i>
                    Adoption Profiles
                  </button>
                  <button onClick={() => navigateTo('donation')} className={`w-full py-7 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 transition-all ${activeTab === 'donation' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'bg-slate-50 text-slate-600'}`}>
                    <i className="fas fa-heart"></i>
                    Give Support
                  </button>
                </>
              )}
            </div>

            <div className="mt-16 pt-10 border-t border-slate-100 max-w-md mx-auto w-full">
              <button onClick={handleLogout} className="w-full py-7 bg-red-50 text-red-600 rounded-[2.5rem] font-black text-xl border border-red-100 flex items-center justify-center gap-4 hover:bg-red-100 transition-all">
                <i className="fas fa-sign-out-alt"></i> Log Out
              </button>
              <p className="text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] mt-10">KindHeart humanitarian network v2.0</p>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 relative">
        {activeTab === 'home' && <LandingPage />}
        {activeTab === 'dashboard' && <Dashboard orphanages={orphanages} children={children} />}
        {activeTab === 'donation' && <Donation orphanages={orphanages} />}
        {activeTab === 'manage' && userRole === UserRole.ORPHANAGE && (
          <OrphanageManager 
            orphanages={orphanages} 
            children={children}
            onUpdateOrphanage={(updated) => setOrphanages(prev => prev.map(o => o.id === updated.id ? updated : o))}
            onAddChild={(newChild) => setChildren(prev => [...prev, newChild])}
            onUpdateChild={(updated) => setChildren(prev => prev.map(c => c.id === updated.id ? updated : c))}
          />
        )}
      </main>

      <AIAssistant />
    </div>
  );
};

export default App;