import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { applyJob, calculateJobMatch } from "../api/jobApi";
import { searchWorkers } from "../api/workerDashboardApi";
import { useLanguage } from "../context/LanguageContext";

function AIFeatures({ compact = false }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [inputQuery, setInputQuery] = useState("");
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [matchingJobs, setMatchingJobs] = useState([]);
  const [matchingWorkers, setMatchingWorkers] = useState([]);
  const [sourceNotice, setSourceNotice] = useState("");
  const [error, setError] = useState("");
  const [applyingJobId, setApplyingJobId] = useState(null);

  const startListening = () => {
    setError("");
    setAiResult(null);
    setMatchingJobs([]);
    setMatchingWorkers([]);
    setTranscript("");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Voice recognition is not supported in this browser. Please type your query in the text box below or use Google Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      setInputQuery(spokenText);
      await processWithAI(spokenText);
    };

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === "not-allowed") {
        setError("Please allow microphone access in your browser, or type your query.");
      } else {
        setError("Voice capture failed. You can type your request directly.");
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      setListening(false);
      setError("Could not activate microphone. Please type your requirement.");
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) {
      setError("Please enter what worker or job you are looking for.");
      return;
    }
    setTranscript(inputQuery.trim());
    await processWithAI(inputQuery.trim());
  };

  const processWithAI = async (text) => {
    try {
      setProcessing(true);
      setError("");
      setMatchingJobs([]);
      setMatchingWorkers([]);

      // Call backend AI parse endpoint
      const response = await API.post("/ai/parse", { text });
      const parsedData = response.data?.data ?? response.data;
      const source = response.data?.source;

      if (source === "fallback") {
        setSourceNotice("Interpreted using Rozgaar Saathi assistant.");
      } else {
        setSourceNotice("");
      }

      setAiResult(parsedData);

      // Depending on intent, search workers or jobs (or both)
      if (parsedData.intent === "employer") {
        await findMatchingWorkers(parsedData);
      } else if (parsedData.intent === "job_seeker") {
        await findMatchingJobs(parsedData);
      } else {
        // Unknown: try both
        await Promise.all([
          findMatchingWorkers(parsedData),
          findMatchingJobs(parsedData),
        ]);
      }
    } catch (err) {
      console.error("AI processing error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to process your request. Please try typing your search."
      );
    } finally {
      setProcessing(false);
    }
  };

  const findMatchingWorkers = async (requirements) => {
    try {
      const skill = requirements.skill || "";
      const city = requirements.city || "";
      const res = await searchWorkers(skill, city);
      const workers = res.data?.workers || [];
      setMatchingWorkers(workers.slice(0, 6));
    } catch (err) {
      console.error("Worker matching error:", err);
      setMatchingWorkers([]);
    }
  };

  const findMatchingJobs = async (requirements) => {
    try {
      const response = await API.get("/jobs");
      const jobsData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.jobs || [];

      const matched = jobsData
        .map((job) => {
          const matchResult = calculateJobMatch(job, requirements);
          const score = typeof matchResult === "number" ? matchResult : matchResult?.score ?? 0;
          return {
            ...job,
            matchScore: score,
          };
        })
        .filter((job) => job.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 6);

      setMatchingJobs(matched);
    } catch (err) {
      console.error("Job matching error:", err);
      setMatchingJobs([]);
    }
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to apply for this job.");
      navigate("/login");
      return;
    }

    try {
      setApplyingJobId(jobId);
      // Strictly pass { jobId } object payload
      await applyJob({ jobId });
      alert("✅ Application submitted successfully!");
    } catch (err) {
      console.error("Application error:", err);
      alert(
        err.response?.data?.message ||
          "Unable to apply for this job. Please try again."
      );
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <section
      id="sathi"
      className={
        compact
          ? "rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm"
          : "bg-gradient-to-b from-[#F7F9FC] to-white px-4 py-12 md:px-6 md:py-16"
      }
    >
      <div className={compact ? "mx-auto" : "mx-auto max-w-5xl"}>
        {/* Header */}
        <div className={compact ? "text-left" : "text-center"}>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#173B57]/10 px-3.5 py-1 text-xs font-bold text-[#173B57]">
            <span>🤖</span>
            <span>Rozgaar Saathi AI</span>
          </div>

          <h2
            className={
              compact
                ? "mt-2 text-base font-bold text-[#173B57]"
                : "mt-3 text-3xl font-extrabold text-[#173B57] sm:text-4xl"
            }
          >
            {compact ? "Discover Workers & Jobs Naturally" : "Rozgaar Saathi — Smart Voice & Text Assistant"}
          </h2>

          <p
            className={
              compact
                ? "mt-1 text-xs text-slate-600"
                : "mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base"
            }
          >
            Describe what you need in your everyday language. Tell us your occupation, required worker, city, or budget.
          </p>
        </div>

        {/* Input Card: Voice + Text */}
        <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <form onSubmit={handleTextSubmit} className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder='e.g. "I need a plumber in Pune today budget ₹800" or "Electrician with 4 years experience in Bengaluru"'
                className="flex-1 rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] px-4 py-3 text-sm text-[#202938] outline-none transition focus:border-[#0F9D8A] focus:bg-white focus:ring-2 focus:ring-[#0F9D8A]/20"
                disabled={processing || listening}
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={startListening}
                  disabled={listening || processing}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold text-white transition ${
                    listening
                      ? "animate-pulse bg-red-600"
                      : "bg-[#0F9D8A] hover:bg-[#0b7c6d]"
                  }`}
                  title="Speak your requirement"
                >
                  <span>{listening ? "⏹" : "🎤"}</span>
                  <span className="hidden sm:inline">
                    {listening ? "Listening..." : "Speak"}
                  </span>
                </button>

                <button
                  type="submit"
                  disabled={processing || listening || !inputQuery.trim()}
                  className="rounded-xl bg-[#173B57] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0f2638] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processing ? "Processing..." : "Search"}
                </button>
              </div>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Try asking:</span>
              {[
                "Plumber in Pune",
                "Electrician in Bengaluru ₹800",
                "Carpenter in Mumbai",
                "Painter in Hyderabad",
              ].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => {
                    setInputQuery(sample);
                    processWithAI(sample);
                  }}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700 transition hover:bg-[#0F9D8A]/10 hover:text-[#0F9D8A]"
                >
                  {sample}
                </button>
              ))}
            </div>
          </form>

          {/* Spoken Text Display */}
          {transcript && (
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 border border-slate-100">
              <span className="font-bold text-[#173B57]">Transcribed query:</span>{" "}
              <span>"{transcript}"</span>
            </div>
          )}

          {/* Status / Error Message */}
          {error && (
            <div role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
              ⚠️ {error}
            </div>
          )}

          {sourceNotice && (
            <div className="mt-2 text-right text-[11px] text-slate-400">
              {sourceNotice}
            </div>
          )}

          {/* AI Extracted Criteria Review */}
          {aiResult && (
            <div className="mt-5 rounded-xl border border-[#0F9D8A]/20 bg-[#0F9D8A]/5 p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F9D8A]">
                  Extracted Criteria
                </h4>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#173B57] shadow-xs">
                  Intent: {aiResult.intent === "employer" ? "Hiring Worker" : aiResult.intent === "job_seeker" ? "Job Search" : "General Query"}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs">
                <div className="rounded-lg bg-white p-2.5 shadow-2xs">
                  <span className="block text-slate-400">Skill</span>
                  <span className="font-bold text-slate-800">{aiResult.skill || "Any"}</span>
                </div>
                <div className="rounded-lg bg-white p-2.5 shadow-2xs">
                  <span className="block text-slate-400">Location</span>
                  <span className="font-bold text-slate-800">{aiResult.city || "Nearby"}</span>
                </div>
                <div className="rounded-lg bg-white p-2.5 shadow-2xs">
                  <span className="block text-slate-400">Wage / Budget</span>
                  <span className="font-bold text-[#0F9D8A]">{aiResult.wage || "Standard"}</span>
                </div>
                <div className="rounded-lg bg-white p-2.5 shadow-2xs">
                  <span className="block text-slate-400">Experience</span>
                  <span className="font-bold text-slate-800">{aiResult.experience || "Any"}</span>
                </div>
              </div>
            </div>
          )}

          {/* MATCHING WORKERS (When searching for workers) */}
          {matchingWorkers.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#173B57]">
                  Matching Workers ({matchingWorkers.length})
                </h3>
                <Link to="/workers" className="text-xs font-semibold text-[#0F9D8A] hover:underline">
                  View All Workers →
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {matchingWorkers.map((worker) => (
                  <div
                    key={worker._id}
                    className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs transition hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#202938]">
                          {worker.fullName || "Worker"}
                        </h4>
                        <p className="text-xs font-semibold text-[#0F9D8A]">
                          🛠️ {worker.skill}
                        </p>
                      </div>
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700">
                        {worker.availability || "Available"}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-slate-600">
                      <p>📍 {worker.area ? `${worker.area}, ` : ""}{worker.city || "Local"}</p>
                      <p>⏳ {worker.experience || "Experienced"}</p>
                      <p className="font-semibold text-slate-800">
                        💰 ₹{worker.wage || "N/A"}/day
                      </p>
                    </div>

                    {worker.phone && (
                      <div className="mt-3 flex gap-2 pt-2 border-t border-slate-100">
                        <a
                          href={`tel:${worker.phone}`}
                          className="flex-1 rounded-lg bg-[#0F9D8A] py-1.5 text-center text-xs font-bold text-white transition hover:bg-[#0b7c6d]"
                        >
                          📞 Call
                        </a>
                        <a
                          href={`https://wa.me/91${String(worker.phone).replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 rounded-lg bg-emerald-500 py-1.5 text-center text-xs font-bold text-white transition hover:bg-emerald-600"
                        >
                          💬 WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MATCHING JOBS (When looking for work) */}
          {matchingJobs.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#173B57]">
                  Matching Job Opportunities ({matchingJobs.length})
                </h3>
                <Link to="/jobs" className="text-xs font-semibold text-[#0F9D8A] hover:underline">
                  View All Jobs →
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {matchingJobs.map((job) => (
                  <div
                    key={job._id || job.id}
                    className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs transition hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-[#202938]">
                          {job.title}
                        </h4>
                        <span className="shrink-0 rounded-full bg-[#0F9D8A]/10 px-2 py-0.5 text-[10px] font-bold text-[#0F9D8A]">
                          {job.matchScore}% Match
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="mt-3 space-y-1 text-xs text-slate-600">
                        <p>📍 {job.city}</p>
                        <p className="font-semibold text-slate-800">
                          💰 ₹{job.salary} ({job.jobType || "Daily Wage"})
                        </p>
                        {job.employer?.name && (
                          <p>👤 Posted by: {job.employer.name}</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApply(job._id || job.id)}
                      disabled={applyingJobId === (job._id || job.id)}
                      className="mt-4 w-full rounded-lg bg-[#173B57] py-2 text-xs font-bold text-white transition hover:bg-[#0f2638] disabled:opacity-50"
                    >
                      {applyingJobId === (job._id || job.id) ? "Applying..." : "Apply Now"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state when processed but nothing matched */}
          {aiResult && !processing && matchingJobs.length === 0 && matchingWorkers.length === 0 && (
            <div className="mt-4 rounded-xl bg-amber-50 p-4 text-center text-xs text-amber-900 border border-amber-200">
              <p className="font-semibold">No direct matches found for "{aiResult.skill || inputQuery}" in "{aiResult.city || "your area"}".</p>
              <p className="mt-1 text-amber-700">Try broadening your search or browse our full listings directly.</p>
              <div className="mt-3 flex justify-center gap-3">
                <Link to="/jobs" className="rounded-lg bg-[#173B57] px-3.5 py-1.5 text-xs font-bold text-white">
                  Browse All Jobs
                </Link>
                <Link to="/workers" className="rounded-lg bg-[#0F9D8A] px-3.5 py-1.5 text-xs font-bold text-white">
                  Browse All Workers
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AIFeatures;
