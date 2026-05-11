import React, { useState, useMemo } from 'react';
import { Upload, FileText, BarChart3, PieChart as PieChartIcon, Activity, X, Loader2, Table as TableIcon, Database, TrendingUp, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#0ea5e9', '#10b981', '#f59e0b', '#3b82f6'];

const DataAnalysis = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [viewMode, setViewMode] = useState('charts'); 

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setFileName(file.name);
    
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cleanData = results.data.filter(row => Object.values(row).some(v => v !== null && v !== ''));
        setData(cleanData);
        const keys = Object.keys(cleanData[0] || {});
        const firstCategory = keys.find(k => typeof cleanData[0][k] === 'string') || keys[0];
        setSelectedColumn(firstCategory);
        setTimeout(() => setLoading(false), 1000);
        toast.success('Telemetry data synchronized.');
      },
      error: (err) => {
        toast.error('Sync failed');
        setLoading(false);
      }
    });
  };

  const chartData = useMemo(() => {
    if (data.length === 0 || !selectedColumn) return [];
    const counts = {};
    data.forEach(item => {
      const val = item[selectedColumn] || 'N/A';
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [data, selectedColumn]);

  const stats = useMemo(() => {
    if (data.length === 0) return null;
    return {
      totalRows: data.length,
      columns: Object.keys(data[0]).length,
      numericFields: Object.keys(data[0]).filter(k => typeof data[0][k] === 'number').length,
      classes: chartData.length
    };
  }, [data, chartData]);

  return (
    <div className="space-y-10 animate-in max-w-[1600px] mx-auto pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <Activity size={14} />
            <span>Safety Monitoring Engine</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase">Real-time Analysis</h1>
          <p className="text-zinc-500 font-medium max-w-lg">Advanced telemetry processing and safety vector visualization for enterprise workloads.</p>
        </div>
        
        {data.length > 0 && (
          <div className="flex bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800 shadow-xl">
            <button 
              onClick={() => setViewMode('charts')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'charts' ? 'bg-primary text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              Visualization
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'table' ? 'bg-primary text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              Raw Data
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Sidebar Analytics */}
        <div className="col-span-12 lg:col-span-3 space-y-8">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="glass-card p-10 rounded-[2.5rem] border-2 border-dashed border-zinc-800 hover:border-primary/50 transition-all group relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[300px]"
          >
            <input type="file" accept=".csv,.json" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="p-6 bg-zinc-900 rounded-3xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-6 shadow-2xl">
              <Upload size={36} />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Sync Module</h3>
            <p className="text-zinc-500 text-sm font-medium px-4">Ingest CSV/JSON telemetry for automated processing.</p>
            
            <AnimatePresence>
              {fileName && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 px-5 py-3 bg-primary/10 rounded-2xl flex items-center gap-3 border border-primary/20">
                  <FileText size={16} className="text-primary" />
                  <span className="text-xs font-black text-primary truncate max-w-[120px]">{fileName}</span>
                  <button onClick={() => { setData([]); setFileName(''); }} className="text-primary hover:text-white bg-primary/10 p-1 rounded-lg"><X size={14} /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {stats && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 rounded-[2.5rem] space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary"><Database size={18} /></div>
                <h3 className="font-black text-xs uppercase tracking-widest text-white">System Metrics</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {[
                  { label: 'Total Vectors', value: stats.totalRows, color: 'text-white' },
                  { label: 'Feature Dims', value: stats.columns, color: 'text-white' },
                  { label: 'Numeric Space', value: stats.numericFields, color: 'text-primary' },
                  { label: 'Output Classes', value: stats.classes, color: 'text-emerald-400' }
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-end p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/30 group hover:border-primary/20 transition-all">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{s.label}</span>
                    <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-zinc-800/50 space-y-4">
                 <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Analysis Target</label>
                 <select 
                   className="w-full bg-[#09090b] border border-zinc-800 rounded-2xl p-4 text-sm font-black outline-none focus:border-primary transition-all cursor-pointer appearance-none shadow-inner"
                   value={selectedColumn}
                   onChange={(e) => setSelectedColumn(e.target.value)}
                 >
                   {Object.keys(data[0] || {}).map(k => <option key={k} value={k}>{k}</option>)}
                 </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-9 h-full">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full min-h-[600px] glass-card rounded-[3rem] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                   <Loader2 className="animate-spin text-primary size-14" />
                   <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full animate-pulse"></div>
                </div>
                <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Running assessment logic...</p>
              </motion.div>
            ) : data.length > 0 ? (
              viewMode === 'charts' ? (
                <motion.div key="charts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
                  <div className="glass-card p-10 rounded-[3rem] flex flex-col h-full border border-zinc-800/50">
                    <div className="flex items-center justify-between mb-12">
                       <div>
                          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <BarChart3 className="text-primary" />
                            Distribution
                          </h3>
                          <p className="text-zinc-500 text-[11px] font-bold uppercase mt-1 tracking-widest">Frequency of values across target</p>
                       </div>
                    </div>
                    <div className="flex-1 min-h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} strokeOpacity={0.1} />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#71717a', fontSize: 10, fontWeight: 900}} 
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                          />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10, fontWeight: 900}} />
                          <Tooltip 
                            cursor={{fill: 'rgba(99, 102, 241, 0.05)'}}
                            contentStyle={{backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'}}
                            itemStyle={{color: '#fff', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px'}}
                          />
                          <Bar dataKey="value" name="Occurrences" radius={[6, 6, 0, 0]} barSize={40} label={{ position: 'top', fill: '#71717a', fontSize: 10, fontWeight: 900 }}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-card p-10 rounded-[3rem] flex flex-col h-full border border-zinc-800/50">
                    <div className="flex items-center justify-between mb-12">
                       <div>
                          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <PieChartIcon className="text-primary" />
                            Composition
                          </h3>
                          <p className="text-zinc-500 text-[11px] font-bold uppercase mt-1 tracking-widest">Weight distribution by class</p>
                       </div>
                    </div>
                    <div className="flex-1 min-h-[400px] flex items-center justify-center relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={110}
                            outerRadius={145}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer shadow-xl" />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '20px'}} />
                          <Legend verticalAlign="bottom" height={36} wrapperStyle={{fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', paddingTop: '30px'}} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                         <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Vector Sum</span>
                         <span className="text-5xl font-black text-white">{stats.totalRows}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="table" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[3rem] overflow-hidden h-full border border-zinc-800/50 shadow-2xl">
                  <div className="p-8 border-b border-zinc-800/50 bg-zinc-900/20 flex justify-between items-center">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                       <TableIcon size={20} className="text-primary" />
                       Data Ledger
                    </h3>
                    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-xl border border-zinc-800">
                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                       <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Validated module</span>
                    </div>
                  </div>
                  <div className="overflow-auto max-h-[700px] scrollbar-hide">
                    <table className="w-full text-left">
                      <thead className="sticky top-0 bg-[#121214] z-20 shadow-xl">
                        <tr>
                          {Object.keys(data[0]).map(key => (
                            <th key={key} className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] border-b border-zinc-800/50">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/30">
                        {data.slice(0, 100).map((row, i) => (
                          <tr key={i} className="hover:bg-primary/[0.02] transition-all group">
                            {Object.values(row).map((val, j) => (
                              <td key={j} className="px-8 py-5 text-sm font-bold text-zinc-400 group-hover:text-white transition-colors border-b border-zinc-800/10">{String(val)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full min-h-[700px] glass-card rounded-[4rem] flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-zinc-800/50 group">
                <div className="p-12 bg-zinc-900/50 rounded-[3rem] mb-10 grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 shadow-2xl relative">
                  <Database size={80} className="text-zinc-600 group-hover:text-primary transition-colors" />
                  <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Analytic Core Offline</h3>
                <p className="text-zinc-500 max-w-sm font-medium leading-relaxed text-lg">
                  Synchronize a telemetry module to initialize the safety monitoring engine and visualize system vectors.
                </p>
                <div className="mt-12 flex items-center gap-4">
                   <div className="flex items-center gap-2 px-6 py-3 bg-zinc-900 rounded-2xl border border-zinc-800 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      <ChevronRight size={14} className="text-primary" />
                      Kaggle CSV Ready
                   </div>
                   <div className="flex items-center gap-2 px-6 py-3 bg-zinc-900 rounded-2xl border border-zinc-800 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      <ChevronRight size={14} className="text-primary" />
                      JSON Mapping
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DataAnalysis;
