import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Plus, ChevronDown, Clock, AlertCircle, CheckCircle2, X, Loader2, MoreVertical, Flag, ListTodo } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [submitting, setSubmitting] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '', priority: 'Medium' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [tasksRes, projectsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/tasks', { headers }),
        axios.get('http://localhost:5000/api/projects', { headers })
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (err) { console.error(err); } 
    finally { setTimeout(() => setLoading(false), 1000); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.projectId) return toast.warning('Select a project target');
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tasks', newTask, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Task synchronized successfully.');
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', projectId: '', priority: 'Medium' });
      fetchData();
    } catch (err) { toast.error('Creation failed'); } 
    finally { setSubmitting(false); }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 animate-in max-w-[1600px] mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <ListTodo size={14} />
            <span>Task Ledger</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Operational Nodes</h1>
          <p className="text-zinc-500 font-medium max-w-lg">Monitor and manage the execution of mission-critical tasks.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95"
        >
          <Plus size={18} />
          <span>Synchronize Node</span>
        </button>
      </div>

      <div className="glass-card rounded-[3rem] overflow-hidden shadow-2xl border border-zinc-800/50">
        <div className="p-10 border-b border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-6 bg-zinc-900/10">
          <div className="relative max-w-md w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 size-4 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by node name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#09090b] border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all shadow-inner"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
              {['All', 'Pending', 'In Progress', 'Completed'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-primary text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-[#121214]">
                <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Node Telemetry</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Priority Space</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Lifecycle Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin text-primary size-10" />
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest animate-pulse">Requesting Ledger...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                     <div className="flex flex-col items-center gap-4 grayscale opacity-40">
                        <ListTodo size={48} className="text-zinc-600" />
                        <p className="text-sm font-black text-zinc-600 uppercase tracking-widest">No nodes identified in this sector</p>
                     </div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-primary/[0.02] transition-all group cursor-pointer border-b border-zinc-800/20">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          task.status === 'Completed' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 
                          task.status === 'In Progress' ? 'bg-primary shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-zinc-600 shadow-[0_0_8px_rgba(113,113,122,0.6)]'
                        }`}></div>
                        <div>
                          <p className="text-base font-black text-white group-hover:text-primary transition-colors tracking-tight">{task.title}</p>
                          <p className="text-xs text-zinc-500 font-medium max-w-sm mt-1 leading-relaxed">{task.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800/50 bg-zinc-900/30 ${
                        task.priority === 'High' ? 'text-rose-400' : 
                        task.priority === 'Medium' ? 'text-amber-400' : 'text-blue-400'
                      }`}>
                        <Flag size={14} className="fill-current/20" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{task.priority}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className={`flex items-center gap-2.5 ${
                        task.status === 'Completed' ? 'text-emerald-400' : 
                        task.status === 'In Progress' ? 'text-primary' : 'text-zinc-500'
                      }`}>
                        {task.status === 'Completed' ? <CheckCircle2 size={18} /> : 
                         task.status === 'In Progress' ? <Clock size={18} className="animate-pulse-slow" /> : <AlertCircle size={18} />}
                        <span className="text-[11px] font-black uppercase tracking-widest">{task.status}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">{new Date(task.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-card w-full max-w-xl rounded-[3rem] p-12 shadow-2xl border border-zinc-700/50">
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                   <h2 className="text-2xl font-black text-white uppercase tracking-tight">Initialize Node</h2>
                   <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Append new parameter to the task ledger</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-zinc-900 rounded-2xl hover:text-white transition-colors border border-zinc-800"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddTask} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Target Workflow</label>
                    <select 
                      required
                      className="w-full bg-[#09090b] border border-zinc-800 rounded-2xl p-4 text-sm font-black outline-none focus:border-primary transition-all appearance-none"
                      value={newTask.projectId}
                      onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}
                    >
                      <option value="">Select Target...</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Priority Space</label>
                    <select 
                      className="w-full bg-[#09090b] border border-zinc-800 rounded-2xl p-4 text-sm font-black outline-none focus:border-primary transition-all appearance-none"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Node Title</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Implement security headers"
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-2xl p-4 text-sm font-black outline-none focus:border-primary transition-all shadow-inner"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Mission Parameters</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Define node objectives and scope..."
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-2xl p-4 text-sm font-black outline-none focus:border-primary transition-all resize-none shadow-inner"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-black py-5 rounded-2xl transition-all border border-zinc-800 uppercase text-[10px] tracking-[0.3em]">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-primary/30 disabled:opacity-50 hover:scale-105 active:scale-95 uppercase text-[10px] tracking-[0.3em]">
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Sync to Ledger'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
