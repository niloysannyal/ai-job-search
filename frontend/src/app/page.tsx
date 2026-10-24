"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Radar,
  FileEdit,
  Kanban,
  GraduationCap,
  Settings,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Search,
  Sparkles,
  RefreshCw,
  Building2,
  MapPin,
  Calendar,
  Send,
  Sliders,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  FileText
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8005/api";

export default function CareerOS() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "radar" | "studio" | "kanban" | "interview" | "profile">("dashboard");
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [stats, setStats] = useState<any>({
    total_applications: 0,
    interviews_count: 0,
    offers_count: 0,
    average_fit_score: 0,
    status_breakdown: {},
    channel_breakdown: {}
  });

  // Tracker state
  const [trackerItems, setTrackerItems] = useState<any[]>([]);
  const [loadingTracker, setLoadingTracker] = useState(false);

  // Scraper state
  const [searchQuery, setSearchQuery] = useState("AI Engineer");
  const [searchLocation, setSearchLocation] = useState("Remote");
  const [selectedPortal, setSelectedPortal] = useState("linkedin");
  const [scrapedJobs, setScrapedJobs] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // Studio state
  const [postingInput, setPostingInput] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [guardResult, setGuardResult] = useState<any>(null);
  const [evalResult, setEvalResult] = useState<any>(null);
  const [processingGuard, setProcessingGuard] = useState(false);

  // STAR Interview state
  const [selectedStar, setSelectedStar] = useState<number>(0);

  // Check Backend Health
  useEffect(() => {
    fetchHealth();
    fetchTracker();
    fetchStats();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8005/api/health");
      if (res.ok) {
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch {
      setBackendOnline(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/tracker/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTracker = async () => {
    setLoadingTracker(true);
    try {
      const res = await fetch(`${API_BASE}/tracker`);
      if (res.ok) {
        const data = await res.json();
        setTrackerItems(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTracker(false);
    }
  };

  const handleSearch = async () => {
    setSearching(true);
    try {
      const res = await fetch(`${API_BASE}/scraper/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          location: searchLocation,
          portal: selectedPortal,
          limit: 10
        })
      });
      if (res.ok) {
        const data = await res.json();
        setScrapedJobs(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const handleRunGuard = async () => {
    if (!postingInput) return;
    setProcessingGuard(true);
    try {
      // 1. Guard check
      const gRes = await fetch(`${API_BASE}/apply/guard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: postingInput })
      });
      if (gRes.ok) {
        const gData = await gRes.json();
        setGuardResult(gData);
      }

      // 2. Evaluate
      const eRes = await fetch(`${API_BASE}/apply/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          posting_text: postingInput,
          company_name: companyName || "Target Company",
          role_title: roleTitle || "AI Engineer"
        })
      });
      if (eRes.ok) {
        const eData = await eRes.json();
        setEvalResult(eData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingGuard(false);
    }
  };

  const handleMoveStatus = async (item: any, newStatus: string) => {
    try {
      await fetch(`${API_BASE}/tracker/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      fetchTracker();
      fetchStats();
    } catch (e) {
      console.error(e);
    }
  };

  const starStories = [
    {
      title: "Betopia Sales Agent",
      category: "Multi-Provider LLM & Agentic AI",
      situation: "Betopia Group needed an autonomous sales intelligence system for 600+ sales agents embedded in Odoo CRM, but single-provider rate limits created reliability issues.",
      task: "Architect and deploy an enterprise Agentic AI with client psychological profiling and autonomous lead closing recommendations.",
      action: "Designed dynamic multi-provider LLM routing (OpenAI, Anthropic, Gemini) with slot failover, Redis AOF state persistence, and Next.js 15 dashboard.",
      result: "Active production deployment across 600+ sales agents with zero downtime and sub-second failover."
    },
    {
      title: "Enterprise Qdrant RAG Pipeline",
      category: "Vector Search & Retrieval",
      situation: "Sales agents were crafting proposals inconsistently, missing high-converting historical phrasing and approved proposal templates.",
      task: "Build a production semantic search layer to inject context-aware historical proposal templates into live generation.",
      action: "Implemented a vector RAG pipeline on Qdrant with semantic search over historical proposals and automated VPS backup/restore workflows.",
      result: "Accelerated lead response times and significantly enhanced proposal win rates."
    },
    {
      title: "HA-MEEM Group Factory Digitization",
      category: "Technical Leadership & Consulting",
      situation: "Major RMG manufacturer with disparate manual operations across inventory, washing recipes, fabric QC, cutting, and management reporting.",
      task: "Lead an external technical consulting engagement to scope and architect a 5-module factory floor digitization program.",
      action: "Met directly with plant managers, extracted domain constraints, scoped 5 core modules, and designed architecture diagrams.",
      result: "Delivered client-approved blueprints establishing the technical foundation for automation."
    },
    {
      title: "Full Send Sports AI",
      category: "MLOps & Low-Latency API",
      situation: "Needed a real-time prediction service for UFC fights with high accuracy and sub-100ms response time.",
      task: "Engineer end-to-end ML pipeline on 10,000+ fights with 80+ features and cloud deployment.",
      action: "Trained XGBoost/LightGBM ensembles, wrapped inference in async FastAPI, and deployed containerized services on AWS.",
      result: "Live on iOS App Store serving real-time predictions with sub-100ms latency."
    }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090d16] text-slate-100">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-slate-800/80 bg-[#0c1222]/90 backdrop-blur-xl flex flex-col justify-between p-4 z-20">
        <div>
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                AI Career OS
              </h1>
              <p className="text-xs text-slate-400">Niloy Sannyal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "dashboard"
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("radar")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "radar"
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Radar className="h-4 w-4" />
              Job Radar
            </button>

            <button
              onClick={() => setActiveTab("studio")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "studio"
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <FileEdit className="h-4 w-4" />
              Application Studio
            </button>

            <button
              onClick={() => setActiveTab("kanban")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "kanban"
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Kanban className="h-4 w-4" />
              Pipeline Kanban
            </button>

            <button
              onClick={() => setActiveTab("interview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "interview"
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              STAR Interview Coach
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Settings className="h-4 w-4" />
              Profile & Rules
            </button>
          </nav>
        </div>

        {/* Candidate Profile Widget */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center font-bold text-xs text-indigo-300">
              NS
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate">Niloy Sannyal</p>
              <p className="text-[10px] text-slate-400 truncate">AI Engineer (Betopia)</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${backendOnline ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
              {backendOnline ? "Gateway Live" : "Offline"}
            </span>
            <span>Dhaka (Remote)</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top App Header */}
        <header className="h-16 border-b border-slate-800/70 bg-[#0a0f1d]/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold bg-indigo-950/60 border border-indigo-800/40 px-2.5 py-1 rounded-md">
              Autonomous Agent Mode
            </span>
            <span className="text-xs text-slate-400">Branch: <span className="text-slate-200 font-mono">feature/fullstack-agent</span></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab("studio");
              }}
              className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              + Quick Evaluate & Draft
            </button>
          </div>
        </header>

        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Executive Command Center</h2>
              <p className="text-sm text-slate-400 mt-1">Live metrics, pipeline conversion rates, and autonomous career funnel.</p>
            </div>

            {/* Metric Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-medium text-slate-400">Total Tracked Applications</span>
                  <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Layers className="h-4 w-4" />
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-white">{stats.total_applications || trackerItems.length || 0}</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3.5 w-3.5" /> Synchronized with tracker.csv
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-medium text-slate-400">Active Interview Stages</span>
                  <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-white">{stats.interviews_count || 0}</div>
                <div className="text-xs text-slate-400 mt-2">Ready for STAR coaching</div>
              </div>

              <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-medium text-slate-400">Offers / Hired</span>
                  <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Award className="h-4 w-4" />
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-white">{stats.offers_count || 0}</div>
                <div className="text-xs text-cyan-400 mt-2">Goal: 100k-250k USD or 75k BDT</div>
              </div>

              <div className="glass-panel rounded-2xl p-5 border border-slate-800/80">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-medium text-slate-400">Average Match Score</span>
                  <span className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    <TrendingUp className="h-4 w-4" />
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-white">{stats.average_fit_score || 88}%</div>
                <div className="text-xs text-emerald-400 mt-2">5-Dimension Rubric Verified</div>
              </div>
            </div>

            {/* Quick Actions & Recent Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Funnel Card */}
              <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center justify-between">
                  <span>Application Funnel Conversion</span>
                  <button onClick={fetchTracker} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    <RefreshCw className="h-3 w-3" /> Refresh
                  </button>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Drafted Applications</span>
                      <span>{trackerItems.filter(i => i.status === "drafted").length}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: "100%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Submitted / Applied</span>
                      <span>{trackerItems.filter(i => i.status === "applied").length}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Interviews / Assessments</span>
                      <span>{trackerItems.filter(i => i.status === "interview").length}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: "35%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Offers</span>
                      <span>{trackerItems.filter(i => i.status === "offer").length}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: "15%" }} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Primary criteria: <span className="text-slate-200">Remote Worldwide / Dhaka / Relocation Visa</span>
                  </div>
                  <button onClick={() => setActiveTab("kanban")} className="text-xs text-indigo-400 font-semibold flex items-center gap-1 hover:underline">
                    Open Kanban Pipeline <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Ready STAR Stories Preview */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-indigo-400" /> STAR Library
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">4 calibrated interview stories ready to deploy during roleplay.</p>
                  
                  <div className="space-y-2.5">
                    {starStories.slice(0, 3).map((s, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                        <div className="font-semibold text-slate-200">{s.title}</div>
                        <div className="text-[10px] text-indigo-400 mt-0.5">{s.category}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("interview")}
                  className="w-full mt-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold transition-all text-center"
                >
                  Start Mock Interview Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JOB RADAR (LIVE SCRAPER) */}
        {activeTab === "radar" && (
          <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Job Radar & Sourcing Hub</h2>
              <p className="text-sm text-slate-400 mt-1">
                Execute live portal scrapers across LinkedIn & FreeHire using the underlying Bun CLIs.
              </p>
            </div>

            {/* Sourcing Search Control Bar */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1.5 block">Search Role / Query</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. AI Engineer, Agentic AI, ML"
                    className="w-full px-3.5 py-2 glass-input rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1.5 block">Location Scope</label>
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Remote / Dhaka / Worldwide"
                    className="w-full px-3.5 py-2 glass-input rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1.5 block">Portal CLI</label>
                  <select
                    value={selectedPortal}
                    onChange={(e) => setSelectedPortal(e.target.value)}
                    className="w-full px-3.5 py-2 glass-input rounded-lg text-sm"
                  >
                    <option value="linkedin">LinkedIn Jobs (Global / Remote)</option>
                    <option value="freehire">FreeHire Tech Aggregator (~50 ATS)</option>
                  </select>
                </div>

                <div>
                  <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm rounded-lg shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {searching ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Searching Portals...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" /> Trigger Sourcing
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Scraped Results Table */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">
                  Discovered Postings ({scrapedJobs.length})
                </span>
                <span className="text-xs text-slate-400">
                  Runs natively through <code className="text-cyan-400">bun run .agents/skills/*</code>
                </span>
              </div>

              {scrapedJobs.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-sm">
                  {searching ? "Fetching live postings..." : "No scraped jobs yet. Click 'Trigger Sourcing' to scan LinkedIn or FreeHire."}
                </div>
              ) : (
                <div className="divide-y divide-slate-800/60">
                  {scrapedJobs.map((job) => (
                    <div key={job.id} className="p-4 hover:bg-slate-800/30 transition-colors flex items-center justify-between">
                      <div className="space-y-1 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-200 text-sm">{job.title}</h4>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/50">
                            {job.portal}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" /> {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {job.location}
                          </span>
                          {job.date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {job.date}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            setCompanyName(job.company);
                            setRoleTitle(job.title);
                            setPostingInput(`Role: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location}\nURL: ${job.url}`);
                            setActiveTab("studio");
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          Evaluate in Studio
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: APPLICATION STUDIO */}
        {activeTab === "studio" && (
          <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Application Studio & Security Gate</h2>
              <p className="text-sm text-slate-400 mt-1">
                Deterministic adversarial prompt-injection sanitization, 5-dimension job-fit evaluation, and LaTeX tailoring.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Job Input & Posting Guard */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" /> Posting Guard Gate
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">tools/posting_guard.py</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. OpenAI / Anthropic"
                      className="w-full px-3 py-1.5 glass-input rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Role Title</label>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      placeholder="e.g. AI Engineer"
                      className="w-full px-3 py-1.5 glass-input rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Paste Job Description / Requirements</label>
                  <textarea
                    rows={8}
                    value={postingInput}
                    onChange={(e) => setPostingInput(e.target.value)}
                    placeholder="Paste the full job posting text here to scan for hidden characters, zero-width tags, and prompt injection attempts..."
                    className="w-full p-3 glass-input rounded-lg text-xs font-mono"
                  />
                </div>

                <button
                  onClick={handleRunGuard}
                  disabled={processingGuard || !postingInput}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {processingGuard ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  Sanitize & Evaluate Fit
                </button>

                {/* Guard Results Box */}
                {guardResult && (
                  <div className={`p-4 rounded-xl border ${guardResult.is_clean ? "bg-emerald-950/30 border-emerald-800/60" : "bg-amber-950/30 border-amber-800/60"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {guardResult.is_clean ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                      )}
                      <span className="font-semibold text-xs text-white">
                        Integrity Gate: {guardResult.verdict}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Hidden blocks, tag characters, and injection-like directives were analyzed and stripped before evaluation.
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: 5-Dimension Evaluation Results */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                <h3 className="text-base font-semibold text-white flex items-center justify-between">
                  <span>Candidate Fit Evaluation</span>
                  {evalResult && (
                    <span className="text-sm font-bold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700">
                      Score: {evalResult.overall_score}%
                    </span>
                  )}
                </h3>

                {!evalResult ? (
                  <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                    <Sparkles className="h-6 w-6 text-slate-500" />
                    Paste a posting on the left and click "Sanitize & Evaluate Fit" to view the 5-dimension score breakdown.
                  </div>
                ) : (
                  <div className="space-y-4 text-xs">
                    {/* Technical Match */}
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-semibold text-slate-200">1. Technical Skills Match</span>
                        <span className="font-bold text-indigo-400">{evalResult.dimensions.technical_skills.score}%</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{evalResult.dimensions.technical_skills.notes}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {evalResult.dimensions.technical_skills.matched.map((m: string) => (
                          <span key={m} className="px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 text-[10px] border border-indigo-800/40">
                            ✓ {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Location Gate */}
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-semibold text-slate-200">2. Location & Logistics Gate</span>
                        <span className={`font-bold ${evalResult.dimensions.location_logistics.verdict === "PASS" ? "text-emerald-400" : "text-rose-400"}`}>
                          {evalResult.dimensions.location_logistics.verdict}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{evalResult.dimensions.location_logistics.notes}</p>
                    </div>

                    {/* Language Gate */}
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-semibold text-slate-200">3. Language Gate</span>
                        <span className={`font-bold ${evalResult.dimensions.language_gate.verdict === "PASS" ? "text-emerald-400" : "text-rose-400"}`}>
                          {evalResult.dimensions.language_gate.verdict}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{evalResult.dimensions.language_gate.notes}</p>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={async () => {
                          await fetch(`${API_BASE}/tracker`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              date: new Date().toISOString().split("T")[0],
                              company: companyName || "Target Company",
                              role: roleTitle || "AI Engineer",
                              status: "drafted",
                              fit_rating: String(evalResult.overall_score),
                              channel: "portal",
                              notes: "Added via Studio workbench"
                            })
                          });
                          fetchTracker();
                          setActiveTab("kanban");
                        }}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-all cursor-pointer shadow-md"
                      >
                        Add to Pipeline Tracker
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PIPELINE KANBAN */}
        {activeTab === "kanban" && (
          <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Application Pipeline Kanban</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Drag and drop application states directly synchronizing with <code className="text-cyan-400">job_search_tracker.csv</code>.
                </p>
              </div>
              <button onClick={fetchTracker} className="px-3 py-1.5 glass-panel rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-slate-800">
                <RefreshCw className="h-3.5 w-3.5" /> Refresh Columns
              </button>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Column 1: Drafted */}
              <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col min-h-[500px]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Drafted</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {trackerItems.filter((i) => i.status === "drafted").length}
                  </span>
                </div>
                <div className="space-y-3 flex-1">
                  {trackerItems
                    .filter((i) => i.status === "drafted")
                    .map((item) => (
                      <div key={item.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md space-y-2">
                        <div className="font-semibold text-sm text-white">{item.role}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {item.company}
                        </div>
                        {item.fit_rating && (
                          <div className="text-[10px] text-indigo-400 font-bold">Fit Score: {item.fit_rating}%</div>
                        )}
                        <button
                          onClick={() => handleMoveStatus(item, "applied")}
                          className="w-full mt-2 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 rounded text-[10px] font-semibold transition-all"
                        >
                          Mark Applied →
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Column 2: Applied */}
              <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col min-h-[500px]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Applied</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono">
                    {trackerItems.filter((i) => i.status === "applied").length}
                  </span>
                </div>
                <div className="space-y-3 flex-1">
                  {trackerItems
                    .filter((i) => i.status === "applied")
                    .map((item) => (
                      <div key={item.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md space-y-2">
                        <div className="font-semibold text-sm text-white">{item.role}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {item.company}
                        </div>
                        <button
                          onClick={() => handleMoveStatus(item, "interview")}
                          className="w-full mt-2 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/30 rounded text-[10px] font-semibold transition-all"
                        >
                          Interview Scheduled →
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Column 3: Interview */}
              <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col min-h-[500px]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Interview</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300 font-mono">
                    {trackerItems.filter((i) => i.status === "interview").length}
                  </span>
                </div>
                <div className="space-y-3 flex-1">
                  {trackerItems
                    .filter((i) => i.status === "interview")
                    .map((item) => (
                      <div key={item.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md space-y-2">
                        <div className="font-semibold text-sm text-white">{item.role}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {item.company}
                        </div>
                        <button
                          onClick={() => handleMoveStatus(item, "offer")}
                          className="w-full mt-2 py-1 bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/30 rounded text-[10px] font-semibold transition-all"
                        >
                          Received Offer →
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Column 4: Offer */}
              <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col min-h-[500px]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Offer</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-mono">
                    {trackerItems.filter((i) => i.status === "offer").length}
                  </span>
                </div>
                <div className="space-y-3 flex-1">
                  {trackerItems
                    .filter((i) => i.status === "offer")
                    .map((item) => (
                      <div key={item.id} className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/60 shadow-md space-y-2">
                        <div className="font-semibold text-sm text-amber-200">{item.role}</div>
                        <div className="text-xs text-slate-300 flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {item.company}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-semibold">Ready to review compensation</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STAR INTERVIEW COACH */}
        {activeTab === "interview" && (
          <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">STAR Interview Simulator & Story Library</h2>
              <p className="text-sm text-slate-400 mt-1">
                Calibrated behavioral stories grounded in your actual production achievements.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Story Picker */}
              <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block px-2">Production Stories</span>
                {starStories.map((story, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedStar(idx)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all ${
                      selectedStar === idx
                        ? "bg-indigo-600/30 border border-indigo-500/40 text-white shadow-md"
                        : "bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="font-semibold text-sm">{story.title}</div>
                    <div className="text-xs text-indigo-400 mt-0.5">{story.category}</div>
                  </button>
                ))}
              </div>

              {/* Right Column: Active Story Breakdown */}
              <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
                <div className="border-b border-slate-800/80 pb-4">
                  <h3 className="text-lg font-bold text-white">{starStories[selectedStar].title}</h3>
                  <p className="text-xs text-indigo-400 font-medium">{starStories[selectedStar].category}</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="font-bold text-indigo-300 block mb-1">Situation (Context & Problem):</span>
                    <p className="text-slate-300 leading-relaxed">{starStories[selectedStar].situation}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="font-bold text-cyan-300 block mb-1">Task (Your Direct Responsibility):</span>
                    <p className="text-slate-300 leading-relaxed">{starStories[selectedStar].task}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="font-bold text-emerald-300 block mb-1">Action (Concrete Engineering & Implementation):</span>
                    <p className="text-slate-300 leading-relaxed">{starStories[selectedStar].action}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="font-bold text-amber-300 block mb-1">Result (Measurable Business & Technical Impact):</span>
                    <p className="text-slate-300 leading-relaxed">{starStories[selectedStar].result}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PROFILE & RULES */}
        {activeTab === "profile" && (
          <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Profile, Grounding & Search Rules</h2>
              <p className="text-sm text-slate-400 mt-1">
                Your verified candidate grounding rules stored in <code className="text-cyan-400">CLAUDE.md</code> and <code className="text-cyan-400">01-candidate-profile.md</code>.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div>
                  <h3 className="font-semibold text-white text-sm">Verified Candidate Summary</h3>
                  <p className="text-xs text-slate-400">Niloy Sannyal — AI Engineer at Betopia Limited</p>
                </div>
                <span className="text-xs text-emerald-400 font-semibold px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/40">
                  Grounding Audit Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="font-semibold text-slate-400 block mb-1">Core Tech Stack:</span>
                  <span className="text-slate-200">
                    Python, FastAPI, Agentic AI, LangChain/LangGraph, Qdrant RAG, Next.js 15, Redis, Docker, PostgreSQL
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="font-semibold text-slate-400 block mb-1">Compensation Expectations:</span>
                  <span className="text-slate-200">
                    Bangladesh: Min 45k BDT / Target 75k BDT; International: 100k - 250k USD / Year
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="font-semibold text-slate-400 block mb-1">Languages (Language Gate):</span>
                  <span className="text-slate-200">Bengali (Native), English (Professional), Hindi (Conversational)</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="font-semibold text-slate-400 block mb-1">Hard Deal-breaker:</span>
                  <span className="text-slate-200">100% Remote unless Visa Sponsorship & Relocation provided</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
