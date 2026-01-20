
import React, { useState } from 'react';
import { 
  KeyRound, 
  FileSearch, 
  LogOut, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DashboardTab } from '../types';
import PasswordChecker from './PasswordChecker';
import LogAnalyzer from './LogAnalyzer';
import { logoutFromBackend } from '../services/cyberService';

interface DashboardProps {
  user: { username: string } | null;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.PASSWORD_CHECKER);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const NavItem = ({ tab, icon: Icon, label }: { tab: DashboardTab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center transition-all duration-300 rounded-xl group relative overflow-hidden h-12 ${
        isSidebarOpen ? 'px-3 gap-3' : 'px-0 justify-center'
      } ${
        activeTab === tab 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
      title={!isSidebarOpen ? label : ''}
    >
      <div className={`flex shrink-0 items-center justify-center transition-all duration-300 ${isSidebarOpen ? 'w-6 h-6' : 'w-10 h-10'}`}>
        <Icon className={`${isSidebarOpen ? 'w-5 h-5' : 'w-6 h-6'}`} />
      </div>
      {isSidebarOpen && (
        <span className="font-semibold text-sm truncate animate-in fade-in slide-in-from-left-4 duration-300 whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Sidebar */}
      <aside 
        className={`bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out hidden md:flex z-20 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className={`p-6 flex items-center overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'gap-3' : 'justify-center'}`}>
          <div className="p-2 bg-blue-600 rounded-lg shrink-0 shadow-lg shadow-blue-900/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && (
            <span className="text-xl font-black tracking-tighter truncate animate-in fade-in duration-300 uppercase">
              CyberShield
            </span>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-2 mt-4 overflow-hidden">
          <NavItem tab={DashboardTab.PASSWORD_CHECKER} icon={KeyRound} label="Password Auditor" />
          <NavItem tab={DashboardTab.LOG_ANALYZER} icon={FileSearch} label="Threat Intelligence" />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-4 overflow-hidden">
          {isSidebarOpen ? (
            <div className="px-1 animate-in fade-in duration-300">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-3">System Operator</p>
              <div className="flex items-center gap-3 bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs font-black text-blue-400 shrink-0">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-200 truncate leading-tight">{user?.username}</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Level 4 Analyst</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center transition-all duration-300">
               <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-blue-400 hover:border-blue-500/50 transition-colors">
                  {user?.username?.[0]?.toUpperCase()}
               </div>
            </div>
          )}
          
          <button
            onClick={() => {
              logoutFromBackend();
              onLogout();
            }}
            className={`w-full flex items-center text-red-400 hover:bg-red-500/10 rounded-xl transition-all group overflow-hidden ${
              isSidebarOpen ? 'px-4 py-3 gap-3' : 'px-0 py-3 justify-center'
            }`}
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
            {isSidebarOpen && <span className="font-bold text-xs uppercase tracking-widest">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 min-w-0">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
               className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors hidden md:block"
               aria-label="Toggle Sidebar"
             >
               {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
             </button>
             <h2 className="text-sm md:text-lg font-bold truncate text-slate-200 tracking-tight">
               {activeTab === DashboardTab.PASSWORD_CHECKER ? 'Advanced Credential Auditor' : 'AI-Powered Threat Intelligence'}
             </h2>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter hidden sm:inline">Active Session</span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-950 scroll-smooth">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            {activeTab === DashboardTab.PASSWORD_CHECKER ? (
              <PasswordChecker />
            ) : (
              <LogAnalyzer />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
