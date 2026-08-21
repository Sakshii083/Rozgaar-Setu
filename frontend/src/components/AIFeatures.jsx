import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { applyJob } from "../api/applicationApi";
import { calculateJobMatch } from "../utils/jobMatcher";
import { useLanguage } from "../context/LanguageContext";

function AIFeatures() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [processing, setProcessing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const [matchingJobs, setMatchingJobs] = useState([]);
  const [findingJobs, setFindingJobs] = useState(false);
  const [matchError, setMatchError] = useState("");

  const processWithAI = async (text) => {
    try {
      setProcessing(true);
      setAiResult(null);
      setMatchingJobs([]);
      setMatchError("");

      const response = await API.post("/ai/parse", { text });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "AI processing failed"
        );
      }

      setAiResult(response.data.data);
    } catch (error) {
      console.error("AI processing error:", error);

      alert(
        error.response?.data?.message ||
          t("ai.processingError")
      );
    } finally {
      setProcessing(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(t("ai.browserNotSupported"));
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
      setAiResult(null);
      setMatchingJobs([]);
      setMatchError("");
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      setTranscript(text);
      processWithAI(text);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      setIsListening(false);

      if (event.error === "not-allowed") {
        alert(t("ai.microphoneDenied"));
      } else {
        alert(t("ai.voiceError"));
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const findMatchingJobs = async () => {
    if (!aiResult) {
      alert(t("ai.speakRequirement"));
      return;
    }

    try {
      setFindingJobs(true);
      setMatchingJobs([]);
      setMatchError("");

      const response = await API.get("/jobs");
      const jobs = response.data?.jobs || [];

      const rankedJobs = jobs
        .map((job) => {
          const match = calculateJobMatch(job, aiResult);

          return {
            ...job,
            matchScore: match.score,
            matchReasons: match.reasons,
          };
        })
        .filter((job) => job.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);

      setMatchingJobs(rankedJobs);

      if (rankedJobs.length === 0) {
        setMatchError(t("ai.noMatchingJobs"));
      }
    } catch (error) {
      console.error("Job matching error:", error);

      setMatchError(
        error.response?.data?.message ||
          t("ai.jobsLoadError")
      );
    } finally {
      setFindingJobs(false);
    }
  };

  const handleApplyFromAI = async (jobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert(t("ai.loginToApply"));
      navigate("/login");
      return;
    }

    try {
      await applyJob(jobId);
      alert(t("ai.applicationSuccess"));
    } catch (error) {
      console.error("Application error:", error);

      alert(
        error.response?.data?.message ||
          t("ai.applicationError")
      );
    }
  };

  return (
    <section className="bg-blue-50 px-4 py-8 md:px-6 md:py-10">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="text-center">

          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {t("ai.badge")}
          </span>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("ai.title")} 🤖
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600">
            {t("ai.description")}
          </p>

        </div>

        {/* MAIN CARD */}

        <div className="mx-auto mt-7 max-w-5xl rounded-2xl bg-white p-5 shadow-lg md:p-6">

          {/* VOICE AREA */}

          <div className="grid items-center gap-5 md:grid-cols-[auto_1fr_auto]">

            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
                isListening
                  ? "animate-pulse bg-red-100"
                  : "bg-blue-100"
              }`}
            >
              {isListening ? "🔴" : "🎤"}
            </div>

            <div>

              <h3 className="text-xl font-bold text-gray-900">
                {isListening
                  ? t("ai.listening")
                  : t("ai.tellSaathi")}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {t("ai.trySaying")}
              </p>

              <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs italic text-gray-600">
                "{t("ai.example")}"
              </p>

            </div>

            <button
              type="button"
              onClick={startListening}
              disabled={isListening || processing}
              className={`rounded-lg px-5 py-3 text-sm font-semibold text-white transition ${
                isListening || processing
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isListening
                ? `🎙️ ${t("ai.listeningButton")}`
                : processing
                ? `🤖 ${t("ai.processing")}`
                : `🎙️ ${t("ai.startSpeaking")}`}
            </button>

          </div>

          {/* TRANSCRIPT */}

          {transcript && (
            <div className="mt-5 rounded-xl border bg-gray-50 p-4">

              <p className="text-xs font-bold text-gray-500">
                {t("ai.whatIHeard")}
              </p>

              <p className="mt-1 text-sm text-gray-700">
                "{transcript}"
              </p>

            </div>
          )}

          {/* PROCESSING */}

          {processing && (
            <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4">

              <div className="flex items-center gap-3">

                <span className="animate-pulse text-xl">
                  🤖
                </span>

                <div>

                  <p className="text-sm font-semibold text-yellow-800">
                    {t("ai.understanding")}
                  </p>

                  <p className="text-xs text-yellow-700">
                    {t("ai.extracting")}
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* AI RESULT */}

          {aiResult && !processing && (
            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">

              <div className="flex items-center gap-2">

                <span className="text-2xl">
                  🤖
                </span>

                <div>

                  <h4 className="text-lg font-bold text-blue-700">
                    {t("ai.understandingTitle")}
                  </h4>

                  <p className="text-xs text-blue-600">
                    {t("ai.understoodDescription")}
                  </p>

                </div>

              </div>

              {/* COMPACT AI DATA */}

              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">

                {[
                  ["intent", aiResult.intent],
                  ["skill", aiResult.skill],
                  ["experience", aiResult.experience],
                  ["city", aiResult.city],
                  ["area", aiResult.area],
                  ["expectedWage", aiResult.wage],
                  ["jobType", aiResult.jobType],
                  ["availability", aiResult.availability],
                ].map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-lg bg-white p-3 shadow-sm"
                  >
                    <p className="text-[10px] text-gray-500">
                      {t(`ai.${key}`)}
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                      {value || t("ai.notDetected")}
                    </p>
                  </div>
                ))}

              </div>

              {aiResult.description && (
                <div className="mt-2 rounded-lg bg-white p-3">
                  <p className="text-[10px] text-gray-500">
                    {t("ai.descriptionLabel")}
                  </p>

                  <p className="mt-1 text-sm text-gray-900">
                    {aiResult.description}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={findMatchingJobs}
                disabled={findingJobs}
                className={`mt-4 w-full rounded-lg px-5 py-3 text-sm font-semibold text-white transition ${
                  findingJobs
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {findingJobs
                  ? `🔎 ${t("ai.findingJobs")}`
                  : `🔎 ${t("ai.findMatchingJobs")}`}
              </button>

            </div>
          )}

          {/* FINDING JOBS */}

          {findingJobs && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">

              <div className="flex items-center gap-3">

                <span className="animate-pulse text-xl">
                  🔎
                </span>

                <div>

                  <p className="text-sm font-semibold text-green-800">
                    {t("ai.findingJobsTitle")}
                  </p>

                  <p className="text-xs text-green-700">
                    {t("ai.comparingRequirements")}
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* ERROR */}

          {!findingJobs && matchError && (
            <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-4 text-center">

              <div className="text-2xl">
                🔎
              </div>

              <p className="mt-1 text-sm font-semibold text-orange-800">
                {matchError}
              </p>

              <p className="mt-1 text-xs text-orange-700">
                {t("ai.makeSureJobs")}
              </p>

            </div>
          )}

          {/* MATCHING JOBS */}

          {matchingJobs.length > 0 && (
            <div className="mt-6">

              <div className="mb-4">

                <h3 className="text-xl font-bold text-gray-900">
                  🔎 {t("ai.matchingJobsTitle")}
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  {t("ai.matchingJobsDescription")}
                </p>

              </div>

              <div className="grid gap-4 md:grid-cols-2">

                {matchingJobs.map((job) => (
                  <div
                    key={job._id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <h4 className="truncate text-lg font-bold text-gray-900">
                          {job.title}
                        </h4>

                        <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                          {job.description}
                        </p>

                      </div>

                      <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                        ⭐ {job.matchScore}%
                      </span>

                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">

                      <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-medium text-blue-700">
                        🛠️ {job.skill}
                      </span>

                      <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-medium text-green-700">
                        📍 {job.city}
                      </span>

                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-[10px] font-medium text-yellow-700">
                        💰 ₹{job.salary}
                      </span>

                      {job.jobType && (
                        <span className="rounded-full bg-purple-100 px-2 py-1 text-[10px] font-medium text-purple-700">
                          💼 {job.jobType}
                        </span>
                      )}

                    </div>

                    {job.matchReasons?.length > 0 && (
                      <div className="mt-3">

                        <p className="text-xs font-semibold text-gray-700">
                          {t("ai.whyMatches")}
                        </p>

                        {job.matchReasons
                          .slice(0, 3)
                          .map((reason) => (
                            <p
                              key={reason}
                              className="text-xs text-green-700"
                            >
                              ✓ {reason}
                            </p>
                          ))}

                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        handleApplyFromAI(job._id)
                      }
                      className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                      {t("ai.applyNow")}
                    </button>

                  </div>
                ))}

              </div>

            </div>
          )}

        </div>

      </div>

    </section>
  );
}

export default AIFeatures;