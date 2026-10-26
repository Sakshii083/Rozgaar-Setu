import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getStats } from "../api/statsApi";
import API from "../api/axios";
import { useLanguage } from "../context/LanguageContext";
import { CITIES } from "../constants/cities";

export default function Home() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  // Platform statistics from MongoDB
  const [stats, setStats] = useState({
    workers: 0,
    jobs: 0,
    employers: 0,
    cities: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Skill & City selection states (store identifiers for routing)
  const [selectedSkill, setSelectedSkill] = useState("Painter");
  const [customSkill, setCustomSkill] = useState("");
  const [selectedCity, setSelectedCity] = useState("Belagavi");
  const [customCity, setCustomCity] = useState("");

  // Rozgaar Saathi AI Voice state
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const recognitionRef = useRef(null);

  // 9 skills
  const skillList = [
    { id: "Plumber", defaultName: "Plumber", icon: "🔧" },
    { id: "Electrician", defaultName: "Electrician", icon: "⚡" },
    { id: "Painter", defaultName: "Painter", icon: "🎨" },
    { id: "Carpenter", defaultName: "Carpenter", icon: "🪚" },
    { id: "Mason", defaultName: "Mason", icon: "🧱" },
    { id: "Driver", defaultName: "Driver", icon: "🚗" },
    { id: "Tailor", defaultName: "Tailor", icon: "🧵" },
    { id: "Housekeeper", defaultName: "Housekeeper", icon: "🧹" },
    { id: "Other", defaultName: "Other", icon: "✏️" },
  ];

  // 10 predefined operational cities + Other option
  const cityList = [...CITIES, "Other"];

  // Fetch real statistics from MongoDB backend
  useEffect(() => {
    let isMounted = true;
    const fetchPlatformStats = async () => {
      try {
        const res = await getStats();
        if (isMounted && res.data) {
          setStats({
            workers: res.data.workers || 0,
            jobs: res.data.jobs || 0,
            employers: res.data.employers || 0,
            cities: res.data.cities || 0,
          });
        }
      } catch (err) {
        console.error("Failed to load platform stats:", err);
      } finally {
        if (isMounted) setStatsLoading(false);
      }
    };

    fetchPlatformStats();
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper functions to get localized skill & city labels
  const getSkillLabel = (skillId) => {
    if (skillId === "Other") return t("hero.other") || "Other";
    return t(`hero.skills.${skillId.toLowerCase()}`) || skillId;
  };

  const getCityLabel = (cityName) => {
    if (cityName === "Other") return t("hero.other") || "Other";
    return t(`hero.cities.${cityName.toLowerCase()}`) || cityName;
  };

  // Compute effective display for summary
  const effectiveSkillDisplay =
    selectedSkill === "Other"
      ? customSkill.trim() || t("hero.other") || "Other"
      : getSkillLabel(selectedSkill);

  const effectiveCityDisplay =
    selectedCity === "Other"
      ? customCity.trim() || t("hero.other") || "Other"
      : getCityLabel(selectedCity);

  // Selected skill icon for summary
  const currentSkillObj = skillList.find((s) => s.id === selectedSkill);
  const currentSkillIcon = currentSkillObj ? currentSkillObj.icon : "🔧";

  // Handle Find Local Workers button click
  const handleFindWorkers = () => {
    const params = new URLSearchParams();
    if (selectedSkill === "Other") {
      if (customSkill.trim()) params.set("skill", customSkill.trim());
    } else if (selectedSkill) {
      params.set("skill", selectedSkill);
    }

    if (selectedCity === "Other") {
      if (customCity.trim()) params.set("city", customCity.trim());
    } else if (selectedCity) {
      params.set("city", selectedCity);
    }

    const query = params.toString();
    navigate(query ? `/workers?${query}` : "/workers");
  };

  // Rozgaar Saathi AI Voice handler
  const handleVoiceSearch = () => {
    setVoiceError("");
    setVoiceStatus("");

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(t("ai.voiceNotSupported") || "Voice recognition not supported in browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Map language context to recognition locale
      const langMap = {
        en: "en-IN",
        hi: "hi-IN",
        kn: "kn-IN",
        mr: "mr-IN",
        te: "te-IN",
      };
      recognition.lang = langMap[language] || "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus(t("ai.listeningStatus") || "Listening... speak your skill or city.");
      };

      recognition.onresult = async (event) => {
        const spokenText = event.results[0][0].transcript;
        setVoiceTranscript(spokenText);
        setVoiceStatus(t("ai.aiInterpreting") || "Interpreting with Rozgaar Saathi AI...");

        try {
          const aiRes = await API.post("/ai/parse", { text: spokenText });
          const parsed = aiRes.data?.data || aiRes.data;

          if (parsed?.skill) {
            const matchedSkill = skillList.find(
              (s) => s.defaultName.toLowerCase() === parsed.skill.toLowerCase()
            );
            if (matchedSkill) {
              setSelectedSkill(matchedSkill.id);
            } else {
              setSelectedSkill("Other");
              setCustomSkill(parsed.skill);
            }
          }

          if (parsed?.city) {
            const matchedCity = cityList.find(
              (c) => c.toLowerCase() === parsed.city.toLowerCase()
            );
            if (matchedCity) {
              setSelectedCity(matchedCity);
            } else {
              setSelectedCity("Other");
              setCustomCity(parsed.city);
            }
          }

          const matchedLabel = t("ai.matchedLabel") || "Matched";
          const inLabel = t("ai.inLabel") || "in";
          setVoiceStatus(`${matchedLabel}: ${parsed?.skill || "Trade"} ${inLabel} ${parsed?.city || "Location"}`);
        } catch {
          const lower = spokenText.toLowerCase();
          const foundSkill = skillList.find((s) =>
            lower.includes(s.defaultName.toLowerCase())
          );
          if (foundSkill) setSelectedSkill(foundSkill.id);

          const foundCity = cityList.find((c) =>
            lower.includes(c.toLowerCase())
          );
          if (foundCity) setSelectedCity(foundCity);

          const recLabel = t("ai.recognizedLabel") || "Recognized";
          setVoiceStatus(`${recLabel}: "${spokenText}"`);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === "not-allowed") {
          setVoiceError(t("ai.micDenied") || "Microphone access denied.");
        } else {
          setVoiceError(t("ai.voiceError") || "Could not hear clearly. Try again.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Speech recognition startup error:", err);
      setIsListening(false);
      setVoiceError(t("ai.voiceError") || "Unable to activate microphone.");
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden flex flex-col justify-between bg-[#F4F8FB] text-[#172B4D] font-sans">
      {/* 1. COMPACT NAVBAR */}
      <Navbar />

      {/* 2. MAIN HOMEPAGE CONTENT (FITS IN SINGLE SCREEN ON DESKTOP) */}
      <main className="flex-1 flex flex-col justify-between px-3 sm:px-6 py-2 max-w-7xl mx-auto w-full gap-2 overflow-y-auto lg:overflow-hidden">
        
        {/* ================= TOP SECTION: HERO (LEFT) & SEARCH CARD (RIGHT) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-5 items-stretch flex-1">
          
          {/* LEFT SIDE: Hero Info, AI Voice Card, Key Benefits, and CTA Buttons */}
          <div className="lg:col-span-5 flex flex-col justify-between py-0.5">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#DCE6EF] bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#172B4D] shadow-2xs mb-2">
                <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
                <span>{t("hero.badge")}</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-black tracking-tight leading-tight text-[#173B57]">
                {t("hero.title1")}
                <br />
                <span className="text-[#0F9D8A]">{t("hero.title2")}</span>
              </h1>

              {/* Short Description */}
              <p className="mt-1 text-xs text-[#64748B] leading-relaxed">
                {t("hero.description")}
              </p>

              {/* Action & CTA Buttons */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F9D8A] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#0c8272] transition"
                >
                  <span>{t("nav.jobs") || "Find Jobs"}</span>
                  <span>→</span>
                </Link>

                <Link
                  to="/workers"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE6EF] bg-white px-3.5 py-1.5 text-xs font-bold text-[#173B57] shadow-2xs hover:bg-slate-50 transition"
                >
                  <span>{t("nav.workers") || "Find Workers"}</span>
                </Link>

                <Link
                  to="/worker-register"
                  className="inline-flex items-center gap-1 rounded-xl bg-[#F4B942] px-3 py-1.5 text-xs font-bold text-[#172B4D] shadow-2xs hover:bg-[#e5ad3a] transition"
                >
                  <span>👷 {t("nav.registerWorker") || "Register as Worker"}</span>
                </Link>

                <Link
                  to="/post-job"
                  className="inline-flex items-center gap-1 rounded-xl bg-[#173B57] px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#0f2638] transition"
                >
                  <span>➕ {t("nav.postJob") || "Post Job"}</span>
                </Link>
              </div>
            </div>

            {/* Compact Rozgaar Saathi AI Card */}
            <div className="my-2 rounded-xl border border-[#DCE6EF] bg-white p-2.5 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#173B57]">Rozgaar Saathi AI</span>
                  <span className="text-xs">🤖</span>
                </div>
                <span className="text-[10px] font-bold text-[#0F9D8A] bg-[#E8F7F4] px-2 py-0.5 rounded-md">
                  {t("ai.saathiVoiceSearch") || "Voice Search"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0 bg-[#F4F8FB] border border-[#DCE6EF] rounded-lg px-2.5 py-1.5 flex items-center gap-2">
                  <span className="text-xs">🎙️</span>
                  <p className="text-[11px] text-[#172B4D] font-medium truncate">
                    {voiceStatus || voiceTranscript || t("ai.promptPlaceholder") || "Tell us what work you need..."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`shrink-0 flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition ${
                    isListening
                      ? "bg-rose-600 hover:bg-rose-700 animate-pulse"
                      : "bg-[#0F9D8A] hover:bg-[#0c8272]"
                  }`}
                >
                  <span>{isListening ? "🔴" : "🎤"}</span>
                  <span>{isListening ? (t("ai.stopButton") || "Stop") : (t("ai.speakButton") || "Speak")}</span>
                </button>
              </div>

              {voiceError && (
                <p className="mt-1 text-[10px] font-semibold text-rose-600 truncate">
                  ⚠️ {voiceError}
                </p>
              )}
            </div>

            {/* Key Benefits in a Compact Horizontal Row */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#64748B]">
              <span className="inline-flex items-center gap-1 bg-white border border-[#DCE6EF] rounded-md px-2 py-0.5">
                <span className="font-bold text-[#0F9D8A]">✓</span> {t("hero.benefits.zeroCommission") || "0% Middleman Cut"}
              </span>
              <span className="inline-flex items-center gap-1 bg-white border border-[#DCE6EF] rounded-md px-2 py-0.5">
                <span className="font-bold text-[#0F9D8A]">✓</span> {t("hero.benefits.hyperlocal") || "Hyperlocal Jobs"}
              </span>
              <span className="inline-flex items-center gap-1 bg-white border border-[#DCE6EF] rounded-md px-2 py-0.5">
                <span className="font-bold text-[#0F9D8A]">✓</span> {t("hero.benefits.directContact") || "Direct Call/WhatsApp"}
              </span>
              <span className="inline-flex items-center gap-1 bg-white border border-[#DCE6EF] rounded-md px-2 py-0.5">
                <span className="font-bold text-[#0F9D8A]">✓</span> {t("hero.benefits.vernacular") || "5 Vernacular Languages"}
              </span>
            </div>
          </div>

          {/* RIGHT SIDE: Worker Search Card with Skill and City Selection */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="rounded-2xl border border-[#DCE6EF] bg-white p-3 sm:p-4 shadow-sm flex flex-col justify-between h-full">
              {/* Header */}
              <div className="flex items-center justify-between pb-1.5 border-b border-[#DCE6EF]/60">
                <div>
                  <h2 className="text-sm sm:text-base font-black text-[#173B57]">
                    {t("hero.searchTitle")}
                  </h2>
                  <p className="text-[11px] text-[#64748B]">
                    {t("hero.searchDescription")}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {t("hero.live") || "LIVE"}
                </span>
              </div>

              {/* 1. Skill Selection */}
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#172B4D]">
                    {t("hero.skillQuestion")}
                  </label>
                  <span className="text-[10px] text-[#64748B]">
                    {t("hero.selectOne")}
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-4 gap-1.5">
                  {skillList.slice(0, 8).map((skill) => {
                    const isSelected = selectedSkill === skill.id;
                    const localizedSkillName = getSkillLabel(skill.id);
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => setSelectedSkill(skill.id)}
                        className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-left transition ${
                          isSelected
                            ? "border-[#0F9D8A] bg-[#E8F7F4] text-[#0F9D8A] font-bold shadow-2xs"
                            : "border-[#DCE6EF] bg-white text-[#172B4D] hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-xs shrink-0">{skill.icon}</span>
                        <span className="text-[11px] truncate w-full">
                          {localizedSkillName}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Other Skill Input */}
                <div className="mt-1.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSkill("Other")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-left transition text-xs shrink-0 ${
                      selectedSkill === "Other"
                        ? "border-[#0F9D8A] bg-[#E8F7F4] text-[#0F9D8A] font-bold"
                        : "border-[#DCE6EF] bg-white text-[#172B4D] hover:bg-slate-50"
                    }`}
                  >
                    <span>✏️</span>
                    <span className="text-[11px]">{t("hero.other") || "Other"}</span>
                  </button>

                  {selectedSkill === "Other" && (
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      placeholder={t("hero.enterSkill") || "Type trade name..."}
                      className="flex-1 rounded-lg border border-[#0F9D8A] bg-white px-2 py-1 text-xs font-semibold text-[#172B4D] outline-none"
                      autoFocus
                    />
                  )}
                </div>
              </div>

              {/* 2. City Selection */}
              <div className="mt-2.5">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#172B4D]">
                    {t("hero.locationQuestion")}
                  </label>
                  <span className="text-[10px] text-[#64748B]">
                    {t("hero.selectCity")}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {cityList.map((city) => {
                    const isSelected = selectedCity === city;
                    const localizedCityName = getCityLabel(city);
                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => setSelectedCity(city)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition ${
                          isSelected
                            ? "bg-[#0F9D8A] text-white shadow-2xs border border-[#0F9D8A]"
                            : "bg-white text-[#172B4D] border border-[#DCE6EF] hover:border-slate-300"
                        }`}
                      >
                        <span className="text-[10px]">
                          {city === "Other" ? "✏️" : "📍"}
                        </span>
                        <span className="text-[11px]">{localizedCityName}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedCity === "Other" && (
                  <div className="mt-1">
                    <input
                      type="text"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder={t("hero.enterCity") || "Enter city / town name..."}
                      className="w-full rounded-lg border border-[#0F9D8A] bg-white px-2 py-1 text-xs font-semibold text-[#172B4D] outline-none"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* 3. Summary & Prominent Search Button */}
              <div className="mt-3 pt-2 border-t border-[#DCE6EF]/60 flex flex-col sm:flex-row items-center gap-2">
                <div className="flex-1 min-w-0 flex items-center gap-1.5 text-xs font-semibold text-[#172B4D] bg-[#F4F8FB] px-2.5 py-1.5 rounded-lg border border-[#DCE6EF] w-full sm:w-auto">
                  <span className="text-[#64748B] text-[11px]">{t("hero.lookingFor")}:</span>
                  <span className="font-bold text-[#173B57] truncate">
                    {currentSkillIcon} {effectiveSkillDisplay}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="font-bold text-[#0F9D8A] truncate">
                    📍 {effectiveCityDisplay}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleFindWorkers}
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 rounded-xl bg-[#0F9D8A] py-2 px-4 text-xs font-bold text-white shadow-xs hover:bg-[#0c8272] transition"
                >
                  <span>🔎</span>
                  <span>{t("hero.searchWorkers")}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ================= BOTTOM SECTION: STATISTICS & HOW IT WORKS STRIP ================= */}
        <div className="rounded-2xl bg-[#173B57] text-white p-2.5 sm:p-3 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-3 items-center shrink-0">
          
          {/* Left: Platform Statistics (Horizontal Row) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#F4B942] uppercase tracking-wider">
                {t("stats.title")}
              </span>
              <span className="text-[10px] text-slate-300">
                {t("stats.networkBadge") || "Live MongoDB Network"}
              </span>
            </div>

            {statsLoading ? (
              <p className="text-[11px] text-slate-300 py-1">{t("stats.loading")}</p>
            ) : (
              <div className="grid grid-cols-4 gap-1.5 text-center">
                <div className="bg-white/10 rounded-lg py-1 px-1 border border-white/10">
                  <p className="text-sm sm:text-base font-black text-[#F4B942]">
                    {stats.workers}
                  </p>
                  <p className="text-[9px] font-medium text-slate-300 truncate">
                    {t("stats.workersLabel") || t("stats.workers") || "Workers"}
                  </p>
                </div>

                <div className="bg-white/10 rounded-lg py-1 px-1 border border-white/10">
                  <p className="text-sm sm:text-base font-black text-[#0F9D8A]">
                    {stats.jobs}
                  </p>
                  <p className="text-[9px] font-medium text-slate-300 truncate">
                    {t("stats.jobsLabel") || t("stats.jobs") || "Active Jobs"}
                  </p>
                </div>

                <div className="bg-white/10 rounded-lg py-1 px-1 border border-white/10">
                  <p className="text-sm sm:text-base font-black text-white">
                    {stats.employers}
                  </p>
                  <p className="text-[9px] font-medium text-slate-300 truncate">
                    {t("stats.employersLabel") || t("stats.employers") || "Employers"}
                  </p>
                </div>

                <div className="bg-white/10 rounded-lg py-1 px-1 border border-white/10">
                  <p className="text-sm sm:text-base font-black text-[#F4B942]">
                    {stats.cities}
                  </p>
                  <p className="text-[9px] font-medium text-slate-300 truncate">
                    {t("stats.citiesLabel") || t("stats.cities") || "Cities"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: How It Works (Three Compact Steps in One Row) */}
          <div className="lg:col-span-7 lg:border-l lg:border-white/15 lg:pl-3 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                {t("howItWorks.title")}
              </span>
              <span className="text-[10px] text-[#0F9D8A] font-bold">
                {t("howItWorks.simpleProcess") || "Simple 3-Step Process"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/10 rounded-lg p-1.5 border border-white/10 flex items-start gap-1.5">
                <span className="text-xs bg-[#0F9D8A] text-white rounded p-0.5 shrink-0">1</span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white truncate">
                    {t("howItWorks.step1Title")}
                  </p>
                  <p className="text-[9px] text-slate-300 leading-tight">
                    {t("howItWorks.step1Short") || "Worker profile or post a job"}
                  </p>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-1.5 border border-white/10 flex items-start gap-1.5">
                <span className="text-xs bg-[#0F9D8A] text-white rounded p-0.5 shrink-0">2</span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white truncate">
                    {t("howItWorks.step2Title")}
                  </p>
                  <p className="text-[9px] text-slate-300 leading-tight">
                    {t("howItWorks.step2Short") || "Filter by trade skill & locality"}
                  </p>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-1.5 border border-white/10 flex items-start gap-1.5">
                <span className="text-xs bg-[#F4B942] text-[#172B4D] rounded p-0.5 shrink-0 font-bold">3</span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white truncate">
                    {t("howItWorks.step3Title")}
                  </p>
                  <p className="text-[9px] text-slate-300 leading-tight">
                    {t("howItWorks.step3Short") || "Call or WhatsApp with 0% cut"}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* 3. MINIMAL FOOTER */}
      <Footer compact={true} />
    </div>
  );
}
