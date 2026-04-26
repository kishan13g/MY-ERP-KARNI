import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Search, LayoutGrid, Database, Zap, Sparkles, 
  BarChart3, Users, Factory, Package, 
  Settings, Globe, Shield, RefreshCw,
  Cpu, FileSearch, Camera, Palette
} from 'lucide-react';

interface DemoHomeProps {
  onModuleClick: (moduleId: string) => void;
}

export const DemoHome: React.FC<DemoHomeProps> = ({ onModuleClick }) => {
  const modules = [
    { id: 'dashboard', label: 'Main Dashboard', icon: LayoutGrid, color: 'bg-blue-500', desc: 'Real-time production and financial overview' },
    { id: 'jobs', label: 'Job Master', icon: Factory, color: 'bg-amber-500', desc: 'Manage lots, stages, and production flow' },
    { id: 'ai_studio', label: 'AI Design Studio', icon: Palette, color: 'bg-purple-500', desc: 'Generate and analyze garment designs' },
    { id: 'fabric', label: 'Inventory', icon: Package, color: 'bg-emerald-500', desc: 'Raw material stock and registers' },
    { id: 'karigar', label: 'Karigar Ledger', icon: Users, color: 'bg-indigo-500', desc: 'Worker payments and work tracking' },
    { id: 'kpi', label: 'Analytics', icon: BarChart3, color: 'bg-rose-500', desc: 'Production KPIs and efficiency reports' },
    { id: 'importexport', label: 'Cloud Sync', icon: Globe, color: 'bg-slate-700', desc: 'Google Sheets and external data integrations' },
    { id: 'doc_scanner', label: 'OCR Scanner', icon: Camera, color: 'bg-cyan-500', desc: 'Scan bundles, rolls and IDs' }
  ];

  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-12 text-white shadow-2xl">
        <div className="relative z-10 space-y-6 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-[10px] font-bold uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3" />
            Empowering Textile Manufacturing
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black tracking-tight leading-tight"
          >
            Welcome to <span className="text-amber-500">KarniERP Master</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 font-medium"
          >
            The ultimate manufacturing intelligence platform for modern apparel makers. 
            Streamline your production, manage workers, and leverage AI for cutting-edge designs.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 pt-4"
          >
            <button 
              onClick={() => onModuleClick('dashboard')}
              className="px-8 py-4 bg-amber-500 text-slate-900 rounded-2xl font-black text-sm hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20"
            >
              Launch Dashboard
            </button>
            <button 
              onClick={() => onModuleClick('ai_studio')}
              className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-bold text-sm hover:bg-slate-700 transition-all border border-slate-700"
            >
              Open AI Studio
            </button>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-full overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              rotate: [0, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full" 
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center opacity-10">
            <LayoutGrid className="w-96 h-96 text-white" strokeWidth={0.5} />
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((mod, i) => (
          <motion.button
            key={mod.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            onClick={() => onModuleClick(mod.id)}
            className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all text-left overflow-hidden"
          >
            <div className={`p-4 ${mod.color} rounded-2xl text-white w-fit mb-6 shadow-lg shadow-${mod.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
              <mod.icon className="w-6 h-6" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-2 truncate">{mod.label}</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{mod.desc}</p>
            
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* System Integrity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-blue-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row gap-8 items-center">
          <div className="relative z-10 flex-1 space-y-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-200" />
              <span className="text-xs font-bold text-blue-100 uppercase tracking-widest">Enterprise Security</span>
            </div>
            <h2 className="text-3xl font-black">Connected to SQLite Native Database</h2>
            <p className="text-blue-100 text-sm font-medium leading-relaxed">
              Your ERP data is securely stored in a local SQLite database, ensuring zero-latency performance 
              and full offline capabilities. Integrated with JWT authentication and Bcrypt hashing.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                <Database className="w-4 h-4" />
                <span className="text-xs font-bold">SQL Ready</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-bold">Local Engine</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 shrink-0">
            <RefreshCw className="w-20 h-20 text-white animate-spin-slow" />
          </div>
        </div>

        <div className="bg-slate-100 rounded-[2.5rem] p-10 flex flex-col justify-between border border-slate-200 shadow-inner">
          <div className="space-y-4">
            <div className="p-3 bg-white w-fit rounded-2xl shadow-sm border border-slate-200">
              <Zap className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Quick Actions</h3>
            <p className="text-xs text-slate-500 font-medium">Fast-track common tasks with one click.</p>
          </div>
          
          <div className="space-y-3 mt-8">
            <button className="w-full py-4 bg-white rounded-2xl text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
              <FileSearch className="w-4 h-4" /> Scan Design Draft
            </button>
            <button className="w-full py-4 bg-white rounded-2xl text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
              <RefreshCw className="w-4 h-4" /> Backup All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
