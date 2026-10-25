import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { getJobs, applyJob, calculateJobMatch } from "../api/jobApi";
import { searchWorkers } from "../api/workerDashboardApi";
import { getStats } from "../api/statsApi";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const navigate = useNavigate();
  const { t, language, changeLanguage } = useLanguage();

  // Active view tab: "workers" | "jobs" | "sathi" | "vaani"
  const [activeTab, setActiveTab] = useState("workers");

  // User state
  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };
  const user = getStoredUser();

  // Platform live stats
  const [stats, setStats] = useState({
    workers: 0,
    jobs: 0,
    employers: 0,
    cities: 0,
  });

  // Workers Tab state
  const [workers, setWorkers] = useState([]);
  const [workerSkill, setWorkerSkill] = useState("");
  const [workerCity, setWorkerCity] = useState("");
  const [workerLoading, setWorkerLoading] = useState(false);
  const [selectedWorkerModal, setSelectedWorkerModal] = useState(null);

  // Jobs Tab state
  const [jobs, setJobs] = useState([]);
  const [jobSkill, setJobSkill] = useState("");
  const [jobCity, setJobCity] = useState("");
  const [jobLoading, setJobLoading] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [applyingJobId, setApplyingJobId] = useState(null);

  // Rozgaar Saathi AI Tab state
  const [sathiText, setSathiText] = useState("");
  const [sathiListening, setSathiListening] = useState(false);
  const [sathiProcessing, setSathiProcessing] = useState(false);
  const [sathiResult, setSathiResult] = useState(null);
  const [sathiMatches, setSathiMatches] = useState([]);
  const [sathiError, setSathiError] = useState("");

  // Vaani AI Voice Profile Tab state
  const [vaaniText, setVaaniText] = useState("");
  const [vaaniLang, setVaaniLang] = useState("en");
  const [vaaniListening, setVaaniListening] = useState(false);
  const [vaaniGenerating, setVaaniGenerating] = useState(false);
  const [vaaniSaving, setVaaniSaving] = useState(false);
  const [vaaniProfile, setVaaniProfile] = useState(null);
  const [vaaniStatus, setVaaniStatus] = useState("");
  const [vaaniError, setVaaniError] = useState("");

  // Info modal state (About / Help)
  const [infoModal, setInfoModal] = useState(null);

  const skillsList = [
    "Plumber",
    "Electrician",
    "Painter",
    "Carpenter",
    "Mason",
    "Driver",
    "Tailor",
    "Cook",
    "Housekeeper",
    "Welder",
    "Mechanic",
  ];

  const citiesList = [
    "Pune",
    "Bengaluru",
    "Mumbai",
    "Hyderabad",
    "Belgaum",
    "Delhi",
    "Nagpur",
    "Nashik",
  ];

  // Load initial data on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [statsRes, workersRes, jobsRes] = await Promise.all([
        getStats(),
        searchWorkers("", ""),
        getJobs(),
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (workersRes.data?.workers) setWorkers(workersRes.data.workers);
      if (jobsRes.data?.jobs) setJobs(jobsRes.data.jobs);
    } catch (err) {
      console.error("Initial data load error:", err);
    }
  };

  // Filter Workers
  const handleWorkerSearch = async (e) => {
    if (e) e.preventDefault();
    try {
      setWorkerLoading(true);
      const res = await searchWorkers(workerSkill, workerCity);
      setWorkers(res.data.workers || []);
    } catch (err) {
      console.error("Worker search error:", err);
    } finally {
      setWorkerLoading(false);
    }
  };

  // Filter Jobs
  const handleJobSearch = async (e) => {
    if (e) e.preventDefault();
    try {
      setJobLoading(true);
      const res = await getJobs();
      let list = res.data.jobs || [];
      if (jobSkill) {
        list = list.filter((j) => j.skill?.toLowerCase().includes(jobSkill.toLowerCase()));
      }
      if (jobCity) {
        list = list.filter((j) => j.city?.toLowerCase().includes(jobCity.toLowerCase()));
      }
      setJobs(list);
    } catch (err) {
      console.error("Job search error:", err);
    } finally {
      setJobLoading(false);
    }
  };

  // Apply for Job
  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to apply for this job.");
      navigate("/login");
      return;
    }

    try {
      setApplyingJobId(jobId);
      await applyJob({ jobId });
      alert("✅ Application submitted successfully!");
      setAppliedJobIds((prev) => new Set([...prev, jobId]));
    } catch (err) {
      console.error("Apply error:", err);
      alert(err.response?.data?.message || "Failed to apply.");
    } finally {
      setApplyingJobId(null);
    }
  };

  // Rozgaar Saathi AI Voice Trigger
  const startSathiVoice = () => {
    setSathiError("");
    setSathiResult(null);
    setSathiMatches([]);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSathiError("Voice recognition not supported in this browser. Please type your query in the box below.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;

    recognition.onstart = () => setSathiListening(true);
    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setSathiText(text);
      await processSathiAI(text);
    };
    recognition.onerror = (e) => {
      setSathiListening(false);
      setSathiError("Microphone error. Please type your requirement.");
    };
    recognition.onend = () => setSathiListening(false);

    try {
      recognition.start();
    } catch {
      setSathiListening(false);
      setSathiError("Could not start microphone.");
    }
  };

  // Rozgaar Saathi AI Processing
  const processSathiAI = async (queryText) => {
    const text = queryText || sathiText;
    if (!text.trim()) return;

    try {
      setSathiProcessing(true);
      setSathiError("");
      setSathiMatches([]);

      const response = await API.post("/ai/parse", { text });
      const data = response.data?.data || response.data;
      setSathiResult(data);

      if (data.intent === "employer") {
        // Find matching workers
        const res = await searchWorkers(data.skill || "", data.city || "");
        setSathiMatches({ type: "workers", list: res.data?.workers || [] });
      } else {
        // Find matching jobs
        const res = await getJobs();
        const allJobs = res.data?.jobs || [];
        const matched = allJobs
          .map((job) => ({
            ...job,
            matchScore: calculateJobMatch(job, data),
          }))
          .filter((j) => j.matchScore > 0)
          .sort((a, b) => b.matchScore - a.matchScore);
        setSathiMatches({ type: "jobs", list: matched });
      }
    } catch (err) {
      console.error("Saathi AI error:", err);
      setSathiError("Could not analyze requirement. Please try typing your request.");
    } finally {
      setSathiProcessing(false);
    }
  };

  // Vaani AI Voice Trigger
  const startVaaniVoice = () => {
    setVaaniError("");
    setVaaniStatus("");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVaaniError("Speech recognition not supported in this browser. Please type your work description.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = vaaniLang === "hi" ? "hi-IN" : vaaniLang === "kn" ? "kn-IN" : vaaniLang === "mr" ? "mr-IN" : vaaniLang === "te" ? "te-IN" : "en-IN";

    recognition.onstart = () => {
      setVaaniListening(true);
      setVaaniStatus("Listening... Speak about your trade, experience, and city.");
    };
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setVaaniText((prev) => (prev ? `${prev} ${text}` : text));
    };
    recognition.onerror = () => {
      setVaaniListening(false);
      setVaaniError("Voice capture failed. You can type directly.");
    };
    recognition.onend = () => {
      setVaaniListening(false);
      setVaaniStatus("Recording stopped. Click 'Generate My Profile'.");
    };

    try {
      recognition.start();
    } catch {
      setVaaniListening(false);
    }
  };

  // Vaani AI Profile Generator
  const generateVaaniProfile = async () => {
    if (!vaaniText.trim()) {
      setVaaniError("Please speak or type your work details first.");
      return;
    }

    try {
      setVaaniGenerating(true);
      setVaaniError("");
      const res = await API.post("/ai-profile/generate", {
        text: vaaniText,
        language: vaaniLang,
      });

      const p = res.data?.profile || res.data;
      setVaaniProfile({
        primarySkill: p.primarySkill || "Plumber",
        skills: p.skills || [],
        experienceYears: p.experienceYears || 3,
        city: p.city || "Pune",
        serviceAreas: p.serviceAreas || [],
        profileSummary: p.profileSummary || "",
      });
      setVaaniStatus("Profile generated! Review and click Save.");
    } catch (err) {
      console.error("Vaani error:", err);
      setVaaniError("Unable to generate profile. Please verify network.");
    } finally {
      setVaaniGenerating(false);
    }
  };

  // Vaani Profile Save
  const saveVaaniProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to save your profile to your worker account.");
      navigate("/login");
      return;
    }

    try {
      setVaaniSaving(true);
      await API.post("/ai-profile/save", {
        ...vaaniProfile,
        preferredLanguage: vaaniLang,
      });
      alert("✅ Your AI-generated worker profile has been saved to your account!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setVaaniSaving(false);
    }
  };

  const getWhatsAppNumber = (phone) => {
    if (!phone) return "";
    const n = String(phone).replace(/\D/g, "");
    return n.startsWith("91") ? n : `91${n}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="min-h-screen md:h-screen w-full md:overflow-hidden bg-[#F7F9FC] text-[#202938] flex flex-col font-sans select-none">
      {/* 1. COMPACT TOP HEADER BAR (FIT IN FRAME) */}
      <header className="h-12 bg-white border-b border-[#E2E8F0] px-3 sm:px-5 flex items-center justify-between shrink-0 shadow-2xs z-30">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#173B57] text-base font-black text-white shadow-2xs">
            R
          </div>
          <div>
            <span className="text-base sm:text-lg font-black text-[#173B57] tracking-tight">
              Rozgaar<span className="text-[#0F9D8A]"> Setu</span>
            </span>
            <span className="hidden md:inline ml-2 text-[9px] bg-[#0F9D8A]/10 text-[#0F9D8A] font-bold px-1.5 py-0.5 rounded-full">
              Local Employment Hub
            </span>
          </div>
        </div>

        {/* Center Mode Switcher Tabs */}
        <nav className="flex items-center gap-1 bg-[#F7F9FC] p-0.5 rounded-lg border border-[#E2E8F0] text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("workers")}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md font-bold transition text-xs ${
              activeTab === "workers"
                ? "bg-[#173B57] text-white shadow-2xs"
                : "text-slate-600 hover:text-[#173B57]"
            }`}
          >
            <span>👷</span>
            <span className="hidden sm:inline">Find Workers</span>
            <span className="sm:hidden">Workers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md font-bold transition text-xs ${
              activeTab === "jobs"
                ? "bg-[#173B57] text-white shadow-2xs"
                : "text-slate-600 hover:text-[#173B57]"
            }`}
          >
            <span>💼</span>
            <span className="hidden sm:inline">Find Jobs</span>
            <span className="sm:hidden">Jobs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sathi")}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md font-bold transition text-xs ${
              activeTab === "sathi"
                ? "bg-[#0F9D8A] text-white shadow-2xs"
                : "text-[#0F9D8A] hover:bg-[#0F9D8A]/10"
            }`}
          >
            <span>🤖</span>
            <span className="hidden sm:inline">Rozgaar Saathi</span>
            <span className="sm:hidden">Saathi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("vaani")}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md font-bold transition text-xs ${
              activeTab === "vaani"
                ? "bg-[#F4B942] text-[#202938] shadow-2xs"
                : "text-slate-600 hover:text-[#173B57]"
            }`}
          >
            <span>🎙️</span>
            <span className="hidden md:inline">Vaani AI</span>
            <span className="md:hidden">Vaani</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("hub")}
            className={`md:hidden flex items-center gap-1 px-2 py-1 rounded-md font-bold transition text-xs ${
              activeTab === "hub"
                ? "bg-[#173B57] text-white shadow-2xs"
                : "text-slate-600 hover:text-[#173B57]"
            }`}
          >
            <span>📊</span>
            <span>Hub</span>
          </button>
        </nav>

        {/* Right Actions: Language & Auth */}
        <div className="flex items-center gap-2">
          {/* Vernacular Language Selector */}
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2 py-1 text-xs font-bold text-slate-700 outline-none cursor-pointer"
            title="Choose Language"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="mr">मराठी</option>
            <option value="te">తెలుగు</option>
          </select>

          {/* User state */}
          {!user ? (
            <div className="flex items-center gap-1.5">
              <Link
                to="/login"
                className="rounded-lg px-2.5 py-1 text-xs font-bold text-[#173B57] hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline rounded-lg bg-[#173B57] px-3 py-1 text-xs font-bold text-white shadow-2xs hover:bg-[#0f2638]"
              >
                Register Free
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                to={user.role === "employer" ? "/employer" : "/worker"}
                className="rounded-lg bg-[#0F9D8A]/10 px-2.5 py-1 text-xs font-bold text-[#0F9D8A] hover:bg-[#0F9D8A]/20"
              >
                📊 Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-600 text-xs font-bold p-1"
                title="Logout"
              >
                🚪
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 2. MAIN ONE-FRAME WORKSPACE (NO OUTER SCROLL) */}
      <main className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_315px] p-2 sm:p-2.5 gap-2 sm:gap-2.5 md:overflow-hidden">
        {/* ========================================================= */}
        {/* LEFT / CENTER INTERACTIVE STAGE (Dynamic by Active Tab)   */}
        {/* ========================================================= */}
        <div className="h-full min-h-0 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col overflow-hidden">
          {/* TAB 1: FIND WORKERS */}
          {activeTab === "workers" && (
            <div className="h-full flex flex-col min-h-0 p-3 sm:p-4">
              {/* Compact Filter Bar */}
              <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100 shrink-0">
                <span className="text-xs font-bold text-[#173B57] shrink-0">Filter:</span>
                <select
                  value={workerSkill}
                  onChange={(e) => {
                    setWorkerSkill(e.target.value);
                  }}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none"
                >
                  <option value="">All Trades / Skills</option>
                  {skillsList.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <select
                  value={workerCity}
                  onChange={(e) => {
                    setWorkerCity(e.target.value);
                  }}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none"
                >
                  <option value="">All Cities</option>
                  {citiesList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleWorkerSearch}
                  className="rounded-lg bg-[#173B57] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#0f2638]"
                >
                  {workerLoading ? "Searching..." : "🔍 Filter"}
                </button>

                {(workerSkill || workerCity) && (
                  <button
                    type="button"
                    onClick={() => {
                      setWorkerSkill("");
                      setWorkerCity("");
                      searchWorkers("", "").then((res) => setWorkers(res.data.workers || []));
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 font-semibold underline"
                  >
                    Reset
                  </button>
                )}

                <div className="ml-auto text-xs text-slate-500 font-semibold">
                  {workers.length} Workers Available
                </div>
              </div>

              {/* Instant Workers Grid (Inner Scroll Only) */}
              <div className="flex-1 min-h-0 overflow-y-auto mt-3 pr-1">
                {workers.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <span className="text-3xl">👷</span>
                    <p className="mt-2 text-xs font-bold text-slate-700">No workers match this exact filter.</p>
                    <p className="text-[11px]">Select another trade or clear filters to view all workers.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                    {workers.map((w, idx) => (
                      <div
                        key={w._id || idx}
                        className="rounded-xl border border-slate-200 bg-[#F7F9FC] p-3 text-xs flex flex-col justify-between hover:border-[#0F9D8A] transition shadow-2xs"
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-slate-900 truncate">{w.fullName || "Worker"}</h4>
                              <p className="font-bold text-[#0F9D8A] text-[11px]">🛠️ {w.skill}</p>
                            </div>
                            <span className="rounded-full bg-green-100 text-green-800 font-bold px-2 py-0.5 text-[10px]">
                              ₹{w.wage || "N/A"}/day
                            </span>
                          </div>

                          <div className="mt-2 text-[11px] text-slate-600 space-y-0.5">
                            <p>📍 {w.area ? `${w.area}, ` : ""}{w.city || "Local"}</p>
                            <p>⏳ {w.experience || "Experienced"}</p>
                          </div>
                        </div>

                        {/* Direct Connect Buttons */}
                        <div className="mt-2.5 pt-2 border-t border-slate-200 flex gap-1.5">
                          {w.phone ? (
                            <>
                              <a
                                href={`tel:${w.phone}`}
                                className="flex-1 rounded-lg bg-[#0F9D8A] py-1 text-center font-bold text-white hover:bg-[#0b7c6d] text-[11px]"
                              >
                                📞 Call
                              </a>
                              <a
                                href={`https://wa.me/${getWhatsAppNumber(w.phone)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 rounded-lg bg-emerald-500 py-1 text-center font-bold text-white hover:bg-emerald-600 text-[11px]"
                              >
                                💬 WhatsApp
                              </a>
                            </>
                          ) : (
                            <button
                              onClick={() => setSelectedWorkerModal(w)}
                              className="w-full rounded-lg bg-slate-200 py-1 text-slate-600 font-bold text-[11px]"
                            >
                              View Details
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FIND JOBS */}
          {activeTab === "jobs" && (
            <div className="h-full flex flex-col min-h-0 p-3 sm:p-4">
              <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100 shrink-0">
                <span className="text-xs font-bold text-[#173B57] shrink-0">Filter Jobs:</span>
                <select
                  value={jobSkill}
                  onChange={(e) => setJobSkill(e.target.value)}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none"
                >
                  <option value="">All Skills</option>
                  {skillsList.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <select
                  value={jobCity}
                  onChange={(e) => setJobCity(e.target.value)}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none"
                >
                  <option value="">All Cities</option>
                  {citiesList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleJobSearch}
                  className="rounded-lg bg-[#173B57] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0f2638]"
                >
                  {jobLoading ? "Filtering..." : "🔍 Search"}
                </button>

                <div className="ml-auto text-xs text-slate-500 font-semibold">
                  {jobs.length} Active Openings
                </div>
              </div>

              {/* Instant Jobs Grid (Inner Scroll Only) */}
              <div className="flex-1 min-h-0 overflow-y-auto mt-3 pr-1">
                {jobs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <span className="text-3xl">💼</span>
                    <p className="mt-2 text-xs font-bold text-slate-700">No jobs match this filter.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                    {jobs.map((job) => {
                      const isApplied = appliedJobIds.has(job._id);
                      const isApplying = applyingJobId === job._id;

                      return (
                        <div
                          key={job._id}
                          className="rounded-xl border border-slate-200 bg-[#F7F9FC] p-3 text-xs flex flex-col justify-between hover:border-[#173B57] transition shadow-2xs"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <span className="rounded-full bg-[#0F9D8A]/10 text-[#0F9D8A] font-bold px-2 py-0.5 text-[10px]">
                                {job.jobType || "Daily Wage"}
                              </span>
                              <span className="font-bold text-[#0F9D8A] text-xs">
                                ₹{job.salary}
                              </span>
                            </div>

                            <h4 className="mt-1.5 font-bold text-[#173B57] truncate text-sm">
                              {job.title}
                            </h4>

                            <p className="text-slate-600 text-[11px] line-clamp-2 mt-1">
                              {job.description}
                            </p>

                            <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
                              <span>📍 {job.city}</span>
                              <span>🛠️ {job.skill}</span>
                            </div>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-200">
                            {isApplied ? (
                              <div className="text-center py-1 text-green-700 font-bold bg-green-50 rounded-lg text-[11px]">
                                ✓ Applied
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleApply(job._id)}
                                disabled={isApplying}
                                className="w-full rounded-lg bg-[#173B57] py-1 text-center font-bold text-white hover:bg-[#0f2638] text-[11px] disabled:opacity-50"
                              >
                                {isApplying ? "Applying..." : "Apply Now"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ROZGAAR SAATHI AI */}
          {activeTab === "sathi" && (
            <div className="h-full flex flex-col min-h-0 p-3 sm:p-4">
              <div className="pb-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🤖</span>
                    <h3 className="text-sm font-black text-[#173B57]">
                      Rozgaar Saathi AI — Natural Language Discovery
                    </h3>
                  </div>
                  <span className="text-[10px] bg-[#0F9D8A]/10 text-[#0F9D8A] font-bold px-2 py-0.5 rounded-full">
                    Voice & Text Enabled
                  </span>
                </div>

                {/* Input Bar */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sathiText}
                    onChange={(e) => setSathiText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && processSathiAI()}
                    placeholder='Describe your need: e.g. "I need a plumber in Pune today budget ₹800" or "Electrician looking for work in Bengaluru"'
                    className="flex-1 rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] px-3.5 py-2 text-xs outline-none focus:border-[#0F9D8A] focus:bg-white"
                  />

                  <button
                    type="button"
                    onClick={startSathiVoice}
                    disabled={sathiListening || sathiProcessing}
                    className={`rounded-xl px-3 py-2 text-xs font-bold text-white flex items-center gap-1 ${
                      sathiListening ? "bg-red-600 animate-pulse" : "bg-[#0F9D8A] hover:bg-[#0b7c6d]"
                    }`}
                    title="Speak in English, Hindi, or Hinglish"
                  >
                    <span>{sathiListening ? "⏹" : "🎤"}</span>
                    <span className="hidden sm:inline">{sathiListening ? "Listening" : "Speak"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => processSathiAI()}
                    disabled={sathiProcessing || !sathiText.trim()}
                    className="rounded-xl bg-[#173B57] px-4 py-2 text-xs font-bold text-white hover:bg-[#0f2638] disabled:opacity-50"
                  >
                    {sathiProcessing ? "Analyzing..." : "Ask Saathi"}
                  </button>
                </div>

                {sathiError && (
                  <p className="mt-1 text-[11px] text-red-600 font-semibold">{sathiError}</p>
                )}
              </div>

              {/* AI Understanding & Live Results (Inner Scroll Only) */}
              <div className="flex-1 min-h-0 overflow-y-auto mt-2.5 pr-1">
                {sathiResult && (
                  <div className="mb-3 rounded-xl bg-[#0F9D8A]/5 border border-[#0F9D8A]/20 p-2.5 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-[#0F9D8A] text-[11px] uppercase">
                        AI Detected Requirements
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold text-[#173B57]">
                        Intent: {sathiResult.intent === "employer" ? "Hiring Workers" : "Seeking Work"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="bg-white p-1.5 rounded-lg">
                        <span className="text-slate-400 block text-[9px]">Trade</span>
                        <span className="font-bold text-slate-800">{sathiResult.skill || "Any"}</span>
                      </div>
                      <div className="bg-white p-1.5 rounded-lg">
                        <span className="text-slate-400 block text-[9px]">City</span>
                        <span className="font-bold text-slate-800">{sathiResult.city || "Nearby"}</span>
                      </div>
                      <div className="bg-white p-1.5 rounded-lg">
                        <span className="text-slate-400 block text-[9px]">Budget / Wage</span>
                        <span className="font-bold text-[#0F9D8A]">{sathiResult.wage || "Standard"}</span>
                      </div>
                      <div className="bg-white p-1.5 rounded-lg">
                        <span className="text-slate-400 block text-[9px]">Experience</span>
                        <span className="font-bold text-slate-800">{sathiResult.experience || "Any"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Matches Result View */}
                {sathiMatches?.list?.length > 0 ? (
                  <div>
                    <h4 className="text-xs font-bold text-[#173B57] mb-2">
                      {sathiMatches.type === "workers" ? "Matching Local Workers:" : "Matching Jobs:"}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                      {sathiMatches.list.map((item, idx) => (
                        <div key={item._id || idx} className="rounded-xl border border-slate-200 bg-[#F7F9FC] p-3 text-xs">
                          {sathiMatches.type === "workers" ? (
                            <>
                              <div className="flex justify-between">
                                <span className="font-bold text-slate-900">{item.fullName}</span>
                                <span className="font-bold text-[#0F9D8A]">₹{item.wage}/day</span>
                              </div>
                              <p className="text-[11px] text-[#0F9D8A] font-semibold mt-0.5">🛠️ {item.skill}</p>
                              <p className="text-[10px] text-slate-500">📍 {item.city}</p>
                              {item.phone && (
                                <div className="mt-2 flex gap-1 pt-1.5 border-t border-slate-200">
                                  <a href={`tel:${item.phone}`} className="flex-1 bg-[#0F9D8A] py-1 text-center font-bold text-white rounded text-[10px]">
                                    📞 Call
                                  </a>
                                  <a href={`https://wa.me/${getWhatsAppNumber(item.phone)}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-emerald-500 py-1 text-center font-bold text-white rounded text-[10px]">
                                    💬 WhatsApp
                                  </a>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between">
                                <span className="font-bold text-[#173B57] truncate">{item.title}</span>
                                <span className="font-bold text-[#0F9D8A]">₹{item.salary}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-1">📍 {item.city} • 🛠️ {item.skill}</p>
                              <button
                                onClick={() => handleApply(item._id)}
                                className="mt-2 w-full bg-[#173B57] text-white py-1 font-bold rounded text-[10px]"
                              >
                                Apply Now
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : !sathiProcessing && !sathiResult ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <span className="text-3xl">🎙️</span>
                    <p className="mt-2 text-xs font-bold text-slate-700">Speak or type your requirement above.</p>
                    <p className="text-[11px]">Rozgaar Saathi will extract the skill, city, and budget to connect you instantly.</p>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* TAB 4: VAANI VOICE AI (PROFILE CREATOR) */}
          {activeTab === "vaani" && (
            <div className="h-full flex flex-col min-h-0 p-3 sm:p-4">
              <div className="pb-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🎙️</span>
                    <h3 className="text-sm font-black text-[#173B57]">
                      Vaani AI — Voice-First Worker Profile Creator
                    </h3>
                  </div>
                  <select
                    value={vaaniLang}
                    onChange={(e) => setVaaniLang(e.target.value)}
                    className="rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] px-2 py-1 text-[11px] font-bold text-slate-700 outline-none"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                    <option value="kn">ಕನ್ನಡ</option>
                    <option value="mr">मराठी</option>
                    <option value="te">తెలుగు</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={vaaniText}
                    onChange={(e) => setVaaniText(e.target.value)}
                    placeholder="Speak or type: 'I am a plumber with 5 years experience in Pune. I do pipe repair, sanitary fittings in Kothrud and Baner.'"
                    className="flex-1 rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-2 text-xs outline-none focus:border-[#0F9D8A] focus:bg-white resize-none"
                  />

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={startVaaniVoice}
                      disabled={vaaniListening || vaaniGenerating}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold text-white flex items-center justify-center gap-1 ${
                        vaaniListening ? "bg-red-600 animate-pulse" : "bg-[#0F9D8A] hover:bg-[#0b7c6d]"
                      }`}
                    >
                      <span>{vaaniListening ? "⏹" : "🎤"}</span>
                      <span>{vaaniListening ? "Listening" : "Speak"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={generateVaaniProfile}
                      disabled={vaaniGenerating || !vaaniText.trim()}
                      className="rounded-xl bg-[#173B57] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#0f2638] disabled:opacity-50"
                    >
                      {vaaniGenerating ? "Generating..." : "Generate"}
                    </button>
                  </div>
                </div>

                {vaaniStatus && <p className="mt-1 text-[11px] text-green-700 font-semibold">{vaaniStatus}</p>}
                {vaaniError && <p className="mt-1 text-[11px] text-red-600 font-semibold">{vaaniError}</p>}
              </div>

              {/* Review Generated Profile & Save (Inner Scroll Only) */}
              <div className="flex-1 min-h-0 overflow-y-auto mt-2.5 pr-1">
                {vaaniProfile ? (
                  <div className="space-y-2 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#173B57] text-xs">Review AI-Generated Profile:</span>
                      <button
                        type="button"
                        onClick={saveVaaniProfile}
                        disabled={vaaniSaving}
                        className="rounded-lg bg-[#0F9D8A] px-3 py-1 text-xs font-bold text-white hover:bg-[#0b7c6d] shadow-2xs"
                      >
                        {vaaniSaving ? "Saving..." : "💾 Confirm & Save Profile"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold">Main Trade</label>
                        <input
                          type="text"
                          value={vaaniProfile.primarySkill}
                          onChange={(e) => setVaaniProfile({ ...vaaniProfile, primarySkill: e.target.value })}
                          className="w-full rounded border border-[#E2E8F0] bg-white p-1 text-xs font-bold text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold">Experience (Years)</label>
                        <input
                          type="number"
                          value={vaaniProfile.experienceYears}
                          onChange={(e) => setVaaniProfile({ ...vaaniProfile, experienceYears: e.target.value })}
                          className="w-full rounded border border-[#E2E8F0] bg-white p-1 text-xs font-bold text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold">City</label>
                        <input
                          type="text"
                          value={vaaniProfile.city}
                          onChange={(e) => setVaaniProfile({ ...vaaniProfile, city: e.target.value })}
                          className="w-full rounded border border-[#E2E8F0] bg-white p-1 text-xs font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold">Summary</label>
                      <textarea
                        rows={2}
                        value={vaaniProfile.profileSummary}
                        onChange={(e) => setVaaniProfile({ ...vaaniProfile, profileSummary: e.target.value })}
                        className="w-full rounded border border-[#E2E8F0] bg-white p-1.5 text-xs text-slate-700 resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <span className="text-3xl">🎙️</span>
                    <p className="mt-2 text-xs font-bold text-slate-700">Speak in your mother tongue above.</p>
                    <p className="text-[11px]">Vaani AI formats your informal spoken statement into a structured employment profile.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* TAB 5: MOBILE COMMAND HUB (VISIBLE ON MOBILE) */}
          {activeTab === "hub" && (
            <div className="h-full flex flex-col justify-between min-h-0 p-4 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <span className="text-xs font-black text-[#173B57] uppercase tracking-wider">
                    Live Platform Activity
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Connected
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="rounded-xl bg-[#F7F9FC] p-3 text-center border border-slate-100">
                    <span className="text-lg">👷</span>
                    <p className="text-xl font-black text-[#173B57] leading-tight mt-0.5">{stats.workers}</p>
                    <p className="text-[11px] font-semibold text-slate-500">Registered Workers</p>
                  </div>

                  <div className="rounded-xl bg-[#F7F9FC] p-3 text-center border border-slate-100">
                    <span className="text-lg">💼</span>
                    <p className="text-xl font-black text-[#0F9D8A] leading-tight mt-0.5">{stats.jobs}</p>
                    <p className="text-[11px] font-semibold text-slate-500">Active Job Openings</p>
                  </div>

                  <div className="rounded-xl bg-[#F7F9FC] p-3 text-center border border-slate-100">
                    <span className="text-lg">🏢</span>
                    <p className="text-xl font-black text-slate-800 leading-tight mt-0.5">{stats.employers}</p>
                    <p className="text-[11px] font-semibold text-slate-500">Direct Employers</p>
                  </div>

                  <div className="rounded-xl bg-[#F7F9FC] p-3 text-center border border-slate-100">
                    <span className="text-lg">📍</span>
                    <p className="text-xl font-black text-[#F4B942] leading-tight mt-0.5">{stats.cities}</p>
                    <p className="text-[11px] font-semibold text-slate-500">Cities Connected</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <Link
                    to="/post-job"
                    className="w-full flex items-center justify-between rounded-xl bg-[#173B57] px-3.5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#0f2638] transition"
                  >
                    <span>➕ Post a Job Requirement</span>
                    <span>→</span>
                  </Link>

                  <Link
                    to="/worker-register"
                    className="w-full flex items-center justify-between rounded-xl bg-[#0F9D8A] px-3.5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#0b7c6d] transition"
                  >
                    <span>👷 Register as Worker</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs mt-3">
                <div className="rounded-xl bg-[#F7F9FC] p-2.5 space-y-1.5 text-[11px] text-slate-600 border border-slate-100">
                  <p className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="text-[#0F9D8A]">✓</span> 0% Middleman Commission
                  </p>
                  <p className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="text-[#0F9D8A]">✓</span> Direct Call & WhatsApp Contact
                  </p>
                  <p className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="text-[#0F9D8A]">✓</span> 5 Regional Indian Languages
                  </p>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                  <button
                    type="button"
                    onClick={() => setInfoModal("about")}
                    className="hover:text-[#173B57] font-semibold"
                  >
                    ℹ️ About
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setInfoModal("contact")}
                    className="hover:text-[#173B57] font-semibold"
                  >
                    📞 Helpline
                  </button>
                  <span>•</span>
                  <span>© {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT COMMAND WIDGET (STATS, DIRECT ACTIONS & PILLARS)    */}
        {/* ========================================================= */}
        <aside className="hidden md:flex h-full min-h-0 bg-white rounded-xl border border-[#E2E8F0] p-2.5 sm:p-3 shadow-2xs flex-col justify-between md:overflow-hidden">
          {/* Top: Live Platform Counters */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-black text-[#173B57] uppercase tracking-wider">
                Live Activity
              </span>
              <span className="flex items-center gap-1 text-[9px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Connected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 mt-2">
              <div className="rounded-lg bg-[#F7F9FC] p-2 text-center border border-slate-100">
                <span className="text-sm">👷</span>
                <p className="text-base font-black text-[#173B57] leading-tight mt-0.5">{stats.workers}</p>
                <p className="text-[9px] font-semibold text-slate-500">Registered Workers</p>
              </div>

              <div className="rounded-xl bg-[#F7F9FC] p-2 text-center border border-slate-100">
                <span className="text-sm">💼</span>
                <p className="text-base font-black text-[#0F9D8A] leading-tight mt-0.5">{stats.jobs}</p>
                <p className="text-[9px] font-semibold text-slate-500">Active Job Openings</p>
              </div>

              <div className="rounded-xl bg-[#F7F9FC] p-2 text-center border border-slate-100">
                <span className="text-sm">🏢</span>
                <p className="text-base font-black text-slate-800 leading-tight mt-0.5">{stats.employers}</p>
                <p className="text-[9px] font-semibold text-slate-500">Direct Employers</p>
              </div>

              <div className="rounded-xl bg-[#F7F9FC] p-2 text-center border border-slate-100">
                <span className="text-sm">📍</span>
                <p className="text-base font-black text-[#F4B942] leading-tight mt-0.5">{stats.cities}</p>
                <p className="text-[9px] font-semibold text-slate-500">Cities Connected</p>
              </div>
            </div>

            {/* Middle: Fast Action Buttons */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
              <Link
                to="/post-job"
                className="w-full flex items-center justify-between rounded-lg bg-[#173B57] px-3 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#0f2638] transition"
              >
                <span>➕ Post a Job Opening</span>
                <span>→</span>
              </Link>

              <Link
                to="/worker-register"
                className="w-full flex items-center justify-between rounded-lg bg-[#0F9D8A] px-3 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#0b7c6d] transition"
              >
                <span>👷 Register as Worker</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Bottom: Trust Badges & Help Modal Triggers */}
          <div className="pt-3 border-t border-slate-100 text-xs">
            <div className="rounded-xl bg-[#F7F9FC] p-2.5 space-y-1.5 text-[11px] text-slate-600 border border-slate-100">
              <p className="flex items-center gap-1.5 font-bold text-slate-800">
                <span className="text-[#0F9D8A]">✓</span> 0% Middleman Commission
              </p>
              <p className="flex items-center gap-1.5 font-bold text-slate-800">
                <span className="text-[#0F9D8A]">✓</span> Direct Call & WhatsApp Contact
              </p>
              <p className="flex items-center gap-1.5 font-bold text-slate-800">
                <span className="text-[#0F9D8A]">✓</span> 5 Regional Indian Languages
              </p>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
              <button
                type="button"
                onClick={() => setInfoModal("about")}
                className="hover:text-[#173B57] font-semibold"
              >
                ℹ️ About
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setInfoModal("contact")}
                className="hover:text-[#173B57] font-semibold"
              >
                📞 Helpline
              </button>
              <span>•</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </aside>
      </main>

      {/* 3. POPUP MODAL: WORKER DETAILS (IF CLICKED) */}
      {selectedWorkerModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs"
          onClick={() => setSelectedWorkerModal(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-[#173B57]">{selectedWorkerModal.fullName}</h3>
                <p className="text-[#0F9D8A] font-bold">🛠️ {selectedWorkerModal.skill}</p>
              </div>
              <button onClick={() => setSelectedWorkerModal(null)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <div className="mt-3 space-y-1 bg-[#F7F9FC] p-3 rounded-xl text-slate-700">
              <p>📍 Location: {selectedWorkerModal.area ? `${selectedWorkerModal.area}, ` : ""}{selectedWorkerModal.city}</p>
              <p>⏳ Experience: {selectedWorkerModal.experience || "Experienced"}</p>
              <p>💰 Daily Wage: ₹{selectedWorkerModal.wage || "Standard"}/day</p>
            </div>

            {selectedWorkerModal.phone && (
              <div className="mt-4 flex gap-2">
                <a
                  href={`tel:${selectedWorkerModal.phone}`}
                  className="flex-1 rounded-lg bg-[#0F9D8A] py-2 text-center text-white font-bold"
                >
                  📞 Call
                </a>
                <a
                  href={`https://wa.me/${getWhatsAppNumber(selectedWorkerModal.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-lg bg-emerald-500 py-2 text-center text-white font-bold"
                >
                  💬 WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. POPUP MODAL: ABOUT / CONTACT HELP POPUP */}
      {infoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs"
          onClick={() => setInfoModal(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-[#173B57]">
                {infoModal === "about" ? "About Rozgaar Setu" : "Support & Helpline"}
              </h3>
              <button onClick={() => setInfoModal(null)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            {infoModal === "about" ? (
              <div className="space-y-2 text-slate-600 leading-relaxed">
                <p>
                  <strong>Rozgaar Setu</strong> connects local skilled tradespeople (plumbers, electricians, masons, carpenters, painters, drivers) directly with neighborhood employers across India.
                </p>
                <p>
                  Built with voice-first vernacular accessibility (Vaani AI) and smart matching (Rozgaar Saathi), ensuring zero middleman commissions.
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-slate-600 leading-relaxed">
                <p><strong>Platform Helpline:</strong> +91 1800-ROZGAAR</p>
                <p><strong>Email Support:</strong> support@rozgaarsetu.in</p>
                <p><strong>Operating Hours:</strong> Monday – Saturday, 9 AM – 6 PM</p>
              </div>
            )}

            <button
              onClick={() => setInfoModal(null)}
              className="mt-4 w-full rounded-xl bg-[#173B57] py-2 text-white font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
