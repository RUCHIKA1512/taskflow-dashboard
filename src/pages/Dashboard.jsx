import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FolderKanban, CheckSquare, Clock, TrendingUp, Loader2, Calendar, Zap, ArrowRight, UserCheck, X, ShieldCheck, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const data = [
  { name: 'Mon', count: 4 }, { name: 'Tue', count: 7 }, { name: 'Wed', count: 5 },
  { name: 'Thu', count: 9 }, { name: 'Fri', count: 12 }, { name: 'Sat', count: 8 }, { name: 'Sun', count: 6 },
];

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-8 rounded-[2.5rem] group cursor-pointer relative overflow-hidden flex flex-col justify-between"
  >
    <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-all group-hover:rotate-12">
      <Icon size={120} className="text-white" />
    </div>
    <div className="flex items-center justify-between mb-8 relative z-10">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 shadow-xl shadow-black/20`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 text-[10px] font-black rounded-full uppercase tracking-widest">
        <TrendingUp size={12} />
        <span>+12%</span>
      </div>
    </div>
    <div className="relative z-10">
      <h3 className="text-zinc-500 text-[10px] font-black mb-1 uppercase tracking-[0.2em]">{title}</h3>
      <p className="text-4xl font-black tracking-tighter text-white">{value}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalProjects: 0, pendingTasks: 0, completedTasks: 0, productivity: 0 });
  const [loading, setLoading] = useState(true);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '', priority: 'Medium' });

  const userName = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const [statsRes, projectsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/stats', { headers }),
          axios.get('http://localhost:5000/api/projects', { headers })
        ]);
        setStats(statsRes.data);
        setProjects(projectsRes.data);
      } catch (err) { console.error(err); } 
      finally { setTimeout(() => setLoading(false), 1000); }
    };
    fetchData();
  }, []);

  const handleQuickTask = async (e) => {
    e.preventDefault();
    if (!newTask.projectId) return toast.warning('Target project required');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tasks', newTask, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Task synchronized.');
      setIsQuickActionOpen(false);
      setNewTask({ title: '', description: '', projectId: '', priority: 'Medium' });
      const { data } = await axios.get('http://localhost:5000/api/dashboard/stats', { headers: { Authorization: `Bearer ${token}` } });
      setStats(data);
    } catch (err) { toast.error('Sync failed'); }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
            <Loader2 className="animate-spin text-primary size-14" />
            <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full animate-pulse"></div>
        </div>
        <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Initializing Command Center...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 max-w-[1600px] mx-auto animate-in">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Live Telemetry</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-2 text-white">Good morning, {userName}.</h1>
          <p className="text-zinc-500 font-medium max-w-lg text-lg leading-relaxed">
            System status is <span className="text-emerald-400 font-bold">Optimal</span>. You have {stats.pendingTasks} tasks pending verification in your workspace.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setIsCalendarOpen(true)}
            className="flex items-center gap-3 px-6 py-4 glass-card rounded-[1.5rem] text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white group transition-all"
          >
             <Calendar size={18} className="text-zinc-600 group-hover:text-primary transition-colors" />
             <span>Calendar</span>
          </button>
          <button 
            onClick={() => setIsQuickActionOpen(true)}
            className="flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
          >
             <Zap size={18} />
             <span>Quick Action</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
        <StatCard title="Active Workflows" value={stats.totalProjects} icon={FolderKanban} color="bg-primary" delay={0.1} />
        <StatCard title="Pending Review" value={stats.pendingTasks} icon={Clock} color="bg-amber-400" delay={0.2} />
        <StatCard title="Verified Nodes" value={stats.completedTasks} icon={CheckSquare} color="bg-emerald-400" delay={0.3} />
        <StatCard title="Efficiency Index" value={`${stats.productivity}%`} icon={UserCheck} color="bg-secondary" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 glass-card p-10 rounded-[3rem] border border-zinc-800/50">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Productivity Velocity</h2>
              <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-1">Rolling 7-day performance telemetry</p>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10, fontWeight: 900}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10, fontWeight: 900}} />
                <Tooltip 
                  cursor={{stroke: '#6366f1', strokeWidth: 2}}
                  contentStyle={{backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'}}
                  itemStyle={{color: '#fff', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px'}}
                />
                <Legend verticalAlign="top" height={40} wrapperStyle={{paddingBottom: '20px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', trackingWidest: '0.2em'}} />
                <Area type="monotone" name="Task Output" dataKey="count" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[3rem] flex flex-col justify-between border border-zinc-800/50">
          <div>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">System Load</h2>
              <Link to="/tasks" className="p-2 bg-zinc-900 rounded-xl hover:bg-primary/20 text-primary transition-all">
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="space-y-8">
              {[
                { label: 'Cloud Infrastructure', progress: stats.productivity, color: 'bg-primary' },
                { label: 'Security Protocols', progress: 45, color: 'bg-secondary' },
                { label: 'Dataset Ingestion', progress: 82, color: 'bg-emerald-400' },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item.label}</span>
                    <span className="text-xs font-black text-white">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800/50 p-[2px]">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`${item.color} h-full rounded-full relative shadow-[0_0_12px_rgba(99,102,241,0.4)]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link to="/analysis" className="mt-12 p-8 bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800/50 group cursor-pointer hover:border-primary/40 transition-all relative overflow-hidden">
             <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                   <div className="flex items-center gap-2 text-primary">
                      <ShieldCheck size={14} />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Safety Core</p>
                   </div>
                   <p className="text-lg font-black text-white">Ingest Kaggle Data</p>
                </div>
                <div className="p-3 bg-zinc-800 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all group-hover:translate-x-1">
                   <Activity size={20} />
                </div>
             </div>
          </Link>
        </div>
      </div>

      {/* Modals remain functional but visually updated */}
      <AnimatePresence>
        {isQuickActionOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-card w-full max-w-lg rounded-[3rem] p-10 shadow-2xl border border-zinc-700/50">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <Zap size={28} className="text-primary fill-primary/20" />
                  Synchronize Task
                </h2>
                <button onClick={() => setIsQuickActionOpen(false)} className="p-2 bg-zinc-900 rounded-xl hover:text-white transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleQuickTask} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Target Workflow</label>
                  <select 
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-2xl p-4 text-sm font-black outline-none focus:border-primary transition-all appearance-none"
                    value={newTask.projectId}
                    onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}
                  >
                    <option value="">Select Target...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Mission Parameter</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Implement safety protocols" 
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-2xl p-4 text-sm font-black outline-none focus:border-primary transition-all shadow-inner"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                <button className="w-full py-5 bg-primary hover:bg-primary-dark text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 mt-4">Sync to Ledger</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
