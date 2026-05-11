import React, { useState } from 'react';
import { Bell, Search, User, ChevronDown, X, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Task Assigned', message: 'You have been assigned to "Design Mockups"', time: '2 mins ago', icon: MessageSquare, color: 'text-primary' },
    { id: 2, title: 'Project Completed', message: 'API Integration project is now marked as finished', time: '1 hour ago', icon: CheckCircle, color: 'text-emerald-400' },
    { id: 3, title: 'Deadline Approaching', message: 'Mobile App UI/UX design is due tomorrow', time: '5 hours ago', icon: Clock, color: 'text-amber-400' },
  ]);

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.info('Notification cleared', { autoClose: 1000, hideProgressBar: true });
  };

  const userName = localStorage.getItem('userName') || 'User';

  return (
    <header className="h-16 nav-blur fixed top-0 right-0 left-0 md:left-64 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 max-w-md w-full">
        <div className="relative w-full hidden sm:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 size-4 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search tasks, projects..." 
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`p-2.5 rounded-xl transition-all relative ${isNotificationsOpen ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-[#09090b]"></span>
            )}
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setIsNotificationsOpen(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 glass-card rounded-[2rem] shadow-2xl overflow-hidden border border-zinc-800/50"
                >
                  <div className="p-5 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/20">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    <span className="text-[10px] font-black bg-primary/20 text-primary px-2 py-0.5 rounded-full">{notifications.length} NEW</span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-10 text-center text-zinc-500 text-sm italic">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-4 border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-all group relative">
                          <div className="flex gap-4">
                            <div className={`mt-1 p-2 rounded-lg bg-zinc-900/50 ${n.color}`}>
                              <n.icon size={16} />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-white mb-0.5">{n.title}</p>
                              <p className="text-[11px] text-zinc-500 leading-relaxed mb-1.5">{n.message}</p>
                              <p className="text-[10px] font-medium text-zinc-600">{n.time}</p>
                            </div>
                            <button 
                              onClick={() => removeNotification(n.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-white transition-all"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 bg-zinc-900/40 text-center">
                    <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Mark all as read</button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        
        <div className="h-6 w-px bg-zinc-800 mx-2"></div>
        
        <div className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-2xl hover:bg-zinc-800/40 transition-all cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-zinc-100 leading-tight">{userName}</p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Product Lead</p>
          </div>
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary p-[1px]">
              <div className="w-full h-full rounded-xl bg-zinc-900 flex items-center justify-center overflow-hidden">
                <span className="text-xs font-bold text-white">{userName.charAt(0)}</span>
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
          <ChevronDown size={14} className="text-zinc-500 group-hover:text-white transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
