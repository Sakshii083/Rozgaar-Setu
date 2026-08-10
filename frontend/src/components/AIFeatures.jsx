import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { applyJob } from "../api/applicationApi";
import { calculateJobMatch } from "../utils/jobMatcher";

function AIFeatures() {
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [processing, setProcessing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const [matchingJobs, setMatchingJobs] = useState([]);
  const [findingJobs, setFindingJobs] = useState(false);
  const [matchError, setMatchError] = useState("");

  // =====================================================
  // AI PROCESSING
  // =====================================================

  const processWithAI = async (text) => {
    try {
      setProcessing(true);
      setAiResult(null);
      setMatchingJobs([]);
      setMatchError("");

      const response = await API.post("/ai/parse", {
        text,
      });

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
          "Unable to process your request with AI."
      );
    } finally {
      setProcessing(false);
    }
  };

  // =====================================================
  // VOICE RECOGNITION
  // =====================================================

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );
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
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsListening(false);

      if (event.error === "not-allowed") {
        alert(
          "Microphone permission was denied. Please allow microphone access and try again."
        );
      } else {
        alert(
          "Unable to capture your voice. Please try again."
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // =====================================================
  // FIND MATCHING JOBS
  // =====================================================

  const findMatchingJobs = async () => {
    if (!aiResult) {
      alert("Please speak your requirement first.");
      return;
    }

    try {
      setFindingJobs(true);
      setMatchingJobs([]);
      setMatchError("");

      const response = await API.get("/jobs");

      const jobs = response.data?.jobs || [];

      console.log("Available jobs:", jobs);
      console.log("AI data:", aiResult);

      const rankedJobs = jobs
        .map((job) => {
          const match = calculateJobMatch(
            job,
            aiResult
          );

          return {
            ...job,
            matchScore: match.score,
            matchReasons: match.reasons,
          };
        })
        .filter((job) => job.matchScore > 0)
        .sort(
          (a, b) =>
            b.matchScore - a.matchScore
        );

      console.log(
        "Matching jobs:",
        rankedJobs
      );

      setMatchingJobs(rankedJobs);

      if (rankedJobs.length === 0) {
        setMatchError(
          "No matching jobs found yet. Try another skill or location."
        );
      }
    } catch (error) {
      console.error(
        "Job matching error:",
        error
      );

      setMatchError(
        error.response?.data?.message ||
          "Unable to load available jobs."
      );
    } finally {
      setFindingJobs(false);
    }
  };

  // =====================================================
  // APPLY TO JOB
  // =====================================================

  const handleApplyFromAI = async (jobId) => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      alert(
        "Please login first to apply for this job."
      );

      navigate("/login");
      return;
    }

    try {
      await applyJob(jobId);

      alert(
        "✅ Application submitted successfully!"
      );
    } catch (error) {
      console.error(
        "Application error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to apply for this job."
      );
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="bg-blue-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center">

          <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            AI-Powered Employment
          </span>

          <h2 className="mt-5 text-4xl font-bold text-gray-900">
            Meet Rozgaar Saathi 🤖
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Tell us naturally what kind of work
            you are looking for. Rozgaar Saathi
            understands your requirements and
            finds relevant jobs for you.
          </p>

        </div>

        {/* =================================================
            MAIN CARD
        ================================================= */}

        <div className="mx-auto mt-12 max-w-4xl rounded-3xl bg-white p-8 shadow-xl">

          {/* =================================================
              VOICE SECTION
          ================================================= */}

          <div className="text-center">

            <div
              className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full text-5xl ${
                isListening
                  ? "animate-pulse bg-red-100"
                  : "bg-blue-100"
              }`}
            >
              {isListening ? "🔴" : "🎤"}
            </div>

            <h3 className="mt-6 text-2xl font-bold text-gray-900">
              {isListening
                ? "I'm listening..."
                : "Tell Rozgaar Saathi what you need"}
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-gray-500">
              Try saying:
            </p>

            <div className="mx-auto mt-3 max-w-xl rounded-xl bg-gray-50 p-4 text-gray-700">
              <p className="italic">
                "I am an electrician with 4 years
                of experience looking for work in
                Pune and I expect 900 rupees per day."
              </p>
            </div>

            <button
              type="button"
              onClick={startListening}
              disabled={
                isListening || processing
              }
              className={`mt-6 rounded-xl px-8 py-3 font-semibold text-white transition ${
                isListening || processing
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isListening
                ? "🎙️ Listening..."
                : processing
                ? "🤖 Processing..."
                : "🎙️ Start Speaking"}
            </button>

          </div>

          {/* =================================================
              TRANSCRIPT
          ================================================= */}

          {transcript && (
            <div className="mt-10">

              <h4 className="text-lg font-bold text-gray-900">
                What I heard
              </h4>

              <div className="mt-3 rounded-xl border bg-gray-50 p-5">
                <p className="text-gray-700">
                  "{transcript}"
                </p>
              </div>

            </div>
          )}

          {/* =================================================
              PROCESSING
          ================================================= */}

          {processing && (
            <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-5">

              <div className="flex items-center gap-3">

                <span className="animate-pulse text-2xl">
                  🤖
                </span>

                <div>

                  <p className="font-semibold text-yellow-800">
                    Rozgaar Saathi is understanding
                    your request...
                  </p>

                  <p className="mt-1 text-sm text-yellow-700">
                    Extracting skills, experience,
                    location and employment requirements.
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* =================================================
              AI RESULT
          ================================================= */}

          {aiResult && !processing && (
            <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">

              <div className="flex items-center gap-3">

                <span className="text-3xl">
                  🤖
                </span>

                <div>

                  <h4 className="text-xl font-bold text-blue-700">
                    AI Understanding
                  </h4>

                  <p className="text-sm text-blue-600">
                    Here's what Rozgaar Saathi understood.
                  </p>

                </div>

              </div>

              {/* =================================================
                  EXTRACTED DATA
              ================================================= */}

              <div className="mt-6 grid gap-4 md:grid-cols-2">

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Intent
                  </p>

                  <p className="mt-1 font-semibold capitalize text-gray-900">
                    {aiResult.intent ||
                      "Not detected"}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Skill
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {aiResult.skill ||
                      "Not detected"}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Experience
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {aiResult.experience ||
                      "Not detected"}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    City
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {aiResult.city ||
                      "Not detected"}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Area
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {aiResult.area ||
                      "Not detected"}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Expected Wage
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {aiResult.wage ||
                      "Not detected"}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Job Type
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {aiResult.jobType ||
                      "Not detected"}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Availability
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {aiResult.availability ||
                      "Not detected"}
                  </p>
                </div>

              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              {aiResult.description && (
                <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">

                  <p className="text-sm text-gray-500">
                    Description
                  </p>

                  <p className="mt-1 text-gray-900">
                    {aiResult.description}
                  </p>

                </div>
              )}

              {/* =================================================
                  ALWAYS SHOW FIND MATCHING JOBS
              ================================================= */}

              <div className="mt-6">

                <button
                  type="button"
                  onClick={findMatchingJobs}
                  disabled={findingJobs}
                  className={`w-full rounded-xl px-6 py-3 font-semibold text-white transition ${
                    findingJobs
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {findingJobs
                    ? "🔎 Finding matching jobs..."
                    : "🔎 Find Matching Jobs"}
                </button>

              </div>

            </div>
          )}

          {/* =================================================
              FINDING JOBS
          ================================================= */}

          {findingJobs && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5">

              <div className="flex items-center gap-3">

                <span className="animate-pulse text-2xl">
                  🔎
                </span>

                <div>

                  <p className="font-semibold text-green-800">
                    Finding jobs for you...
                  </p>

                  <p className="mt-1 text-sm text-green-700">
                    Comparing your requirements
                    with available jobs.
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* =================================================
              MATCH ERROR / NO JOBS
          ================================================= */}

          {!findingJobs &&
            matchError && (
              <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-5 text-center">

                <div className="text-3xl">
                  🔎
                </div>

                <p className="mt-2 font-semibold text-orange-800">
                  {matchError}
                </p>

                <p className="mt-2 text-sm text-orange-700">
                  Make sure there are jobs available
                  in the Jobs section.
                </p>

              </div>
            )}

          {/* =================================================
              MATCHING JOBS
          ================================================= */}

          {matchingJobs.length > 0 && (
            <div className="mt-10">

              <div className="mb-6">

                <h3 className="text-2xl font-bold text-gray-900">
                  🔎 Jobs Matching Your Requirements
                </h3>

                <p className="mt-2 text-gray-600">
                  These jobs are ranked according
                  to your requirements.
                </p>

              </div>

              <div className="space-y-5">

                {matchingJobs.map(
                  (job) => (
                    <div
                      key={job._id}
                      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
                    >

                      <div className="flex flex-col justify-between gap-6 md:flex-row">

                        {/* JOB DETAILS */}

                        <div className="flex-1">

                          <h4 className="text-xl font-bold text-gray-900">
                            {job.title}
                          </h4>

                          <p className="mt-2 text-gray-600">
                            {job.description}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">

                            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                              🛠️ {job.skill}
                            </span>

                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                              📍 {job.city}
                            </span>

                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                              💰 ₹{job.salary}
                            </span>

                            {job.jobType && (
                              <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                                💼 {job.jobType}
                              </span>
                            )}

                          </div>

                          {/* MATCH REASONS */}

                          {job.matchReasons &&
                            job.matchReasons.length > 0 && (
                              <div className="mt-4">

                                <p className="text-sm font-semibold text-gray-700">
                                  Why this matches:
                                </p>

                                <div className="mt-2 space-y-1">

                                  {job.matchReasons.map(
                                    (reason) => (
                                      <p
                                        key={reason}
                                        className="text-sm text-green-700"
                                      >
                                        ✓ {reason}
                                      </p>
                                    )
                                  )}

                                </div>

                              </div>
                            )}

                        </div>

                        {/* MATCH SCORE + APPLY */}

                        <div className="flex min-w-[170px] flex-col items-start justify-between md:items-end">

                          <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                            ⭐ {job.matchScore}% Match
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleApplyFromAI(
                                job._id
                              )
                            }
                            className="mt-4 w-full rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 md:w-auto"
                          >
                            Apply Now
                          </button>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}

export default AIFeatures;