import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { applyJob, calculateJobMatch } from "../api/jobApi";
import { useLanguage } from "../context/LanguageContext";

function AIFeatures({ compact = false }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [matchingJobs, setMatchingJobs] = useState([]);
  const [error, setError] = useState("");

  const startListening = () => {
    setError("");
    setAiResult(null);
    setMatchingJobs([]);
    setTranscript("");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Voice recognition is not supported in this browser. Please use Google Chrome."
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

      await processWithAI(spokenText);
    };

    recognition.onerror = (event) => {
      setListening(false);

      if (event.error === "not-allowed") {
        setError("Please allow microphone access in your browser.");
      } else {
        setError("Voice recognition failed. Please try again.");
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const processWithAI = async (text) => {
    try {
      setProcessing(true);
      setError("");

      // Send the spoken requirements to the backend AI endpoint.
      const response = await API.post("/ai/parse", {
        text,
      });

      // Support the existing backend response format.
      const parsedData = response.data?.data ?? response.data;

      setAiResult(parsedData);

      await findMatchingJobs(parsedData);
    } catch (err) {
      console.error("AI processing error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  const findMatchingJobs = async (requirements) => {
    try {
      // Fetch jobs from the existing backend API.
      const response = await API.get("/jobs");

      const jobsData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.jobs || [];

      // Calculate matching scores using the existing project function.
      const matched = jobsData
        .map((job) => {
          const matchResult = calculateJobMatch(job, requirements);

          const score =
            typeof matchResult === "number"
              ? matchResult
              : matchResult?.score ?? 0;

          return {
            ...job,
            matchScore: score,
          };
        })
        .filter((job) => job.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);

      setMatchingJobs(matched);
    } catch (err) {
      console.error("Job matching error:", err);
      setMatchingJobs([]);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await applyJob(jobId);

      alert("Application submitted successfully!");
    } catch (err) {
      console.error("Application error:", err);

      if (err.response?.status === 401) {
        alert("Please log in before applying for a job.");
        navigate("/login");
        return;
      }

      alert(
        err.response?.data?.message ||
          "Unable to apply for this job. Please try again."
      );
    }
  };

  const getJobTitle = (job) =>
    job.title || job.jobTitle || job.position || "Job opportunity";

  const getJobLocation = (job) =>
    job.location || job.city || job.address || "Location not specified";

  return (
    <section
      className={
        compact
          ? "rounded-xl border border-blue-100 bg-blue-50 p-3"
          : "bg-blue-50 px-4 py-8 md:px-6 md:py-10"
      }
    >
      <div className={compact ? "mx-auto" : "mx-auto max-w-6xl"}>
        {/* Heading */}
        <div className={compact ? "text-left" : "text-center"}>
          <h2
            className={
              compact
                ? "text-base font-bold text-gray-900"
                : "text-3xl font-bold text-gray-900 md:text-4xl"
            }
          >
            {compact ? "Rozgaar Saathi AI 🤖" : `${t("ai.title")} 🤖`}
          </h2>

          <p
            className={
              compact
                ? "mt-1 text-xs text-gray-600"
                : "mt-3 text-sm text-gray-600 md:text-base"
            }
          >
            {compact
              ? "Speak your skills and discover matching jobs."
              : t("ai.description")}
          </p>
        </div>

        {/* Voice Input Card */}
        <div
          className={
            compact
              ? "mt-3 rounded-lg bg-white p-3 shadow-sm"
              : "mt-6 rounded-2xl bg-white p-6 shadow-lg md:p-8"
          }
        >
          <div
            className={
              compact
                ? "flex flex-col gap-3"
                : "flex flex-col items-center gap-4"
            }
          >
            <div
              className={
                compact
                  ? "flex items-center gap-3"
                  : "flex flex-col items-center text-center"
              }
            >
              <div
                className={
                  compact
                    ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg"
                    : "flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl"
                }
              >
                🎙️
              </div>

              <div className={compact ? "min-w-0" : "mt-3"}>
                <h3
                  className={
                    compact
                      ? "text-sm font-semibold text-gray-800"
                      : "text-xl font-semibold text-gray-800"
                  }
                >
                  {listening
                    ? "Listening..."
                    : processing
                    ? "Finding matching jobs..."
                    : "Tell us what work you need"}
                </h3>

                <p
                  className={
                    compact
                      ? "mt-1 text-xs text-gray-500"
                      : "mt-2 text-sm text-gray-500"
                  }
                >
                  {compact
                    ? "Tap below and speak."
                    : "Describe your skills, job requirements, or preferred location."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={startListening}
              disabled={listening || processing}
              className={`rounded-lg font-semibold text-white transition ${
                compact
                  ? "w-full px-3 py-2 text-sm"
                  : "px-6 py-3 text-base"
              } ${
                listening || processing
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {listening
                ? "🎙️ Listening..."
                : processing
                ? "Processing..."
                : "🎤 Speak Now"}
            </button>
          </div>

          {/* Recognized Speech */}
          {transcript && (
            <div className="mt-3 rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-500">
                YOU SAID
              </p>

              <p className="mt-1 break-words text-sm text-gray-800">
                {transcript}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* AI Parsed Requirements */}
          {aiResult && (
            <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
              <h3 className="text-sm font-bold text-gray-900">
                AI Detected Requirements
              </h3>

              <div className="mt-2 space-y-1 text-sm text-gray-700">
                {Object.entries(aiResult).map(([key, value]) => {
                  if (
                    value === null ||
                    value === undefined ||
                    typeof value === "object"
                  ) {
                    return null;
                  }

                  return (
                    <p key={key} className="break-words">
                      <span className="font-semibold">
                        {key.replace(/([A-Z])/g, " $1")}:
                      </span>{" "}
                      {String(value)}
                    </p>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching Jobs */}
          {matchingJobs.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-bold text-gray-900">
                Matching Jobs
              </h3>

              <div className="mt-2 space-y-2">
                {matchingJobs.map((job) => (
                  <div
                    key={job._id || job.id}
                    className="rounded-lg border border-gray-200 bg-white p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="break-words text-sm font-semibold text-gray-900">
                          {getJobTitle(job)}
                        </h4>

                        <p className="mt-1 text-xs text-gray-600">
                          📍 {getJobLocation(job)}
                        </p>

                        {job.salary !== undefined && (
                          <p className="mt-1 text-xs text-gray-600">
                            💰 {job.salary}
                          </p>
                        )}
                      </div>

                      <span className="shrink-0 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                        {job.matchScore}% match
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApply(job._id || job.id)}
                      className="mt-3 rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Matching Jobs */}
          {aiResult && !processing && matchingJobs.length === 0 && (
            <p className="mt-3 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
              No matching jobs were found. Try describing your skills or
              requirements differently.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default AIFeatures;