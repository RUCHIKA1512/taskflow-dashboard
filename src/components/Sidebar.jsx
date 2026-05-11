import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, Layers, Sparkles, Command, ShieldCheck, Activity } from 'lucide-react';

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.reload();
  };

  return (
    <aside className="w-64 bg-[#09090b] border-r border-zinc-800 flex-col hidden md:flex h-screen fixed left-0 top-0 z-50">
      <div className="h-16 flex items-center px-6 gap-3">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Command className="text-white size-5" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">TaskFlow</span>
      </div>
      
      <div className="flex-1 px-4 py-8 space-y-8 overflow-y-auto scrollbar-hide">
        <div>
          <p className="px-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Workspace</p>
          <nav className="space-y-1.5">
            <NavLink to="/" className={({isActive}) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </NavLink>
            <NavLink to="/projects" className={({isActive}) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
              <FolderKanban size={18} />
              <span>Projects</span>
            </NavLink>
            <NavLink to="/tasks" className={({isActive}) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
              <CheckSquare size={18} />
              <span>My Tasks</span>
            </NavLink>
          </nav>
        </div>

        <div>
          <p className="px-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Safety Engine</p>
          <nav className="space-y-1.5">
            <NavLink to="/analysis" className={({isActive}) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
              <Activity size={18} />
              <span>Real-time Analysis</span>
            </NavLink>
          </nav>
        </div>

        <div className="pt-4">
           <div className="px-4 py-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 group hover:border-primary/30 transition-all cursor-pointer">
              <div className="flex items-center gap-2 mb-2 text-primary">
                 <ShieldCheck size={14} />
                 <span className="text-[10px] font-black uppercase tracking-wider">Enterprise Plan</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium leading-relaxed mb-3">Your workspace is protected by enterprise-grade safety encryption.</p>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                 <div className="h-full bg-primary w-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
              </div>
           </div>
        </div>
      </div>

      <div className="p-4 border-t border-zinc-800/50 space-y-2">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-800/50 transition-all text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Disconnect Session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
