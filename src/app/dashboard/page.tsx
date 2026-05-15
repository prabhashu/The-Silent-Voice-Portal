'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, CheckCircle, Clock, Activity, Shield, Search, Filter, SlidersHorizontal, RefreshCw, ArrowDownUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Report {
  _id: string;
  text: string;
  category: string;
  studentName?: string;
  contactInfo?: string;
  severity: number;
  isHighRisk: boolean;
  status: string;
  timestamp: string;
}

export default function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showOnlyHighRisk, setShowOnlyHighRisk] = useState(false);
  const [sortBy, setSortBy] = useState('Newest');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (error) {
      console.error('Failed to fetch reports', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(reports.map(r => r.category)))];

  // Apply filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || report.category === filterCategory;
    const matchesRisk = showOnlyHighRisk ? report.isHighRisk : true;
    
    return matchesSearch && matchesCategory && matchesRisk;
  }).sort((a, b) => {
    if (sortBy === 'Highest AI Score') {
      return b.severity - a.severity;
    }
    // Default to Newest
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const highRiskCount = reports.filter(r => r.isHighRisk).length;
  const pendingCount = reports.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 p-6 md:p-10 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <Shield className="w-8 h-8 text-indigo-400" />
              </div>
              Pannala National School
            </h1>
            <p className="text-neutral-400 mt-2 text-sm">Silent Voice - Counselor Command Center</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl px-6 py-4 flex items-center gap-4 min-w-[180px]">
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <ShieldAlert className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{highRiskCount}</div>
                <div className="text-xs text-neutral-400 font-medium uppercase tracking-wider mt-1">High Risk</div>
              </div>
            </div>
            
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl px-6 py-4 flex items-center gap-4 min-w-[180px]">
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{pendingCount}</div>
                <div className="text-xs text-neutral-400 font-medium uppercase tracking-wider mt-1">Pending</div>
              </div>
            </div>
          </div>
        </header>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 bg-neutral-900/30 p-4 rounded-2xl border border-neutral-800/60">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input 
              type="text"
              placeholder="Search reports by keywords (e.g. 'gahanawa', 'bully')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-neutral-600"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Filter className="w-4 h-4 text-neutral-500" />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="appearance-none bg-neutral-950/50 border border-neutral-800 rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-neutral-300 cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <ArrowDownUp className="w-4 h-4 text-neutral-500" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-neutral-950/50 border border-neutral-800 rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-neutral-300 cursor-pointer"
              >
                <option value="Newest">Newest First</option>
                <option value="Highest AI Score">Highest AI Score</option>
              </select>
            </div>

            <button
              onClick={() => setShowOnlyHighRisk(!showOnlyHighRisk)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200",
                showOnlyHighRisk 
                  ? "bg-red-500/20 border-red-500/50 text-red-400" 
                  : "bg-neutral-950/50 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300"
              )}
            >
              <AlertTriangle className={cn("w-4 h-4", showOnlyHighRisk && "animate-pulse")} />
              Urgent Only
            </button>
            
            <button
              onClick={fetchReports}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950/50 text-neutral-400 hover:bg-neutral-800 hover:text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh Reports"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin text-indigo-400")} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full py-24 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-neutral-500 text-sm font-medium animate-pulse">Decrypting and loading reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-neutral-900/10 rounded-3xl border border-neutral-800/50 border-dashed">
              <div className="p-4 bg-neutral-800/30 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-neutral-500" />
              </div>
              <h3 className="text-lg font-medium text-neutral-300">No reports found</h3>
              <p className="text-neutral-500 text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredReports.map((report, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  key={report._id}
                  className={cn(
                    "flex flex-col p-6 rounded-3xl border backdrop-blur-sm transition-all hover:shadow-lg group",
                    report.isHighRisk 
                      ? "bg-gradient-to-b from-red-950/40 to-neutral-900/40 border-red-900/50 hover:border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.03)]" 
                      : "bg-gradient-to-b from-neutral-900/40 to-neutral-950/40 border-neutral-800 hover:border-neutral-700"
                  )}
                >
                  <div className="flex items-start justify-between mb-5">
                    <span className={cn(
                      "text-xs font-bold px-3 py-1.5 rounded-lg border",
                      report.isHighRisk 
                        ? "bg-red-500/10 border-red-500/20 text-red-400" 
                        : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                    )}>
                      {report.category}
                    </span>
                    
                    {report.isHighRisk && (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20">
                        <AlertTriangle className="w-3.5 h-3.5 animate-pulse" /> URGENT
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 mb-6 relative">
                    <div className="absolute -left-2 top-0 bottom-0 w-1 rounded-full bg-neutral-800 group-hover:bg-indigo-500/50 transition-colors" />
                    <p className="text-neutral-200 text-sm leading-relaxed pl-3 italic">
                      "{report.text}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-800/80 mt-auto">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(report.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs font-medium">
                      <span className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-md bg-neutral-950/50 border",
                        report.severity > 0.7 ? "text-red-400 border-red-900/30" : 
                        report.severity > 0.4 ? "text-amber-400 border-amber-900/30" : "text-green-400 border-green-900/30"
                      )}>
                        <Activity className="w-3.5 h-3.5 opacity-70" />
                        AI Score: {(report.severity * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Optional Student Info Section */}
                  {(report.studentName !== 'Anonymous' || report.contactInfo !== 'None provided') && (
                    <div className="mt-4 pt-4 border-t border-neutral-800/80 text-xs flex flex-col gap-1.5 bg-neutral-900/30 -mx-6 -mb-6 p-4 rounded-b-3xl">
                      <div className="font-semibold text-neutral-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        Identity Revealed
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-neutral-400">
                        <div>
                          <span className="text-neutral-500">Name:</span> {report.studentName !== 'Anonymous' ? report.studentName : 'Not provided'}
                        </div>
                        <div>
                          <span className="text-neutral-500">Contact:</span> {report.contactInfo !== 'None provided' ? report.contactInfo : 'Not provided'}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
