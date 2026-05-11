import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Folder, MoreVertical, Clock, Users, ArrowRight, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/projects', newProject, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Project created successfully!');
      setIsModalOpen(false);
      setNewProject({ title: '', description: '' });
      fetchData();
    } catch (err) {
      toast.error('Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Projects</h1>
          <p className="text-zinc-500">Manage and track all your active workstreams.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
        >
          <Plus size={20} />
          <span>New Project</span>
        </button>
      </div>

      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 size-4" />
        <input 
          type="text" 
          placeholder="Search projects..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-zinc-500 col-span-full text-center py-10">Loading projects...</p>
        ) : filteredProjects.length === 0 ? (
          <p className="text-zinc-500 col-span-full text-center py-10">No projects found.</p>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="glass-card p-6 rounded-[2rem] border border-zinc-800/50 hover:border-primary/40 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Folder size={20} />
                </div>
                <button className="text-zinc-500 hover:text-white transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
              <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-zinc-500 text-sm mb-6 line-clamp-2">{project.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Clock size={14} />
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <button className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                  View <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface border border-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="text-xl font-bold">Create New Project</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddProject} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Project Title</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Website Redesign"
                    className="w-full bg-background border border-zinc-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Description</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Describe the project goal..."
                    className="w-full bg-background border border-zinc-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Create Project'}
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

export default Projects;
