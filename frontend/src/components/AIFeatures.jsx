import { useState } from "react";
import API from "../api/axios";

function AIFeatures() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [processing, setProcessing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const processWithAI = async (text) => {
    try {
      setProcessing(true);
      setAiResult(null);

      const response = await API.post("/ai/parse", {
        text,
      });

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

  return (
    <section className="bg-blue-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="text-center">

          <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            AI-Powered Employment
          </span>

          <h2 className="mt-5 text-4xl font-bold text-gray-900">
            Meet Rozgaar Saathi 🤖
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Tell us naturally what kind of work you are looking for.
            Rozgaar Saathi uses AI to understand your requirements
            and convert them into structured employment information.
          </p>

        </div>

        {/* AI Card */}
        <div className="mx-auto mt-12 max-w-3xl rounded-3xl bg-white p-8 shadow-xl">

          {/* Voice Section */}
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
                "I am an electrician with 4 years of experience
                looking for work in Pune and I expect 900 rupees
                per day."
              </p>
            </div>

            <button
              type="button"
              onClick={startListening}
              disabled={isListening || processing}
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

          {/* Transcript */}
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

          {/* Processing */}
          {processing && (
            <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-5">

              <div className="flex items-center gap-3">
                <span className="animate-pulse text-2xl">
                  🤖
                </span>

                <div>
                  <p className="font-semibold text-yellow-800">
                    Rozgaar Saathi is understanding your request...
                  </p>

                  <p className="mt-1 text-sm text-yellow-700">
                    Extracting skills, experience, location and
                    employment requirements.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* AI Result */}
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

              {/* Extracted Information */}
              <div className="mt-6 grid gap-4 md:grid-cols-2">

                {/* Intent */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Intent
                  </p>

                  <p className="mt-1 font-semibold capitalize text-gray-900">
                    {aiResult.intent || "Not detected"}
                  </p>
                </div>

                {/* Skill */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Skill
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {aiResult.skill || "Not detected"}
                  </p>
                </div>

                {/* Experience */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Experience
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {aiResult.experience || "Not detected"}
                  </p>
                </div>

                {/* City */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    City
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {aiResult.city || "Not detected"}
                  </p>
                </div>

                {/* Area */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Area
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {aiResult.area || "Not detected"}
                  </p>
                </div>

                {/* Wage */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Expected Wage
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {aiResult.wage || "Not detected"}
                  </p>
                </div>

                {/* Job Type */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Job Type
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {aiResult.jobType || "Not detected"}
                  </p>
                </div>

                {/* Availability */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">
                    Availability
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {aiResult.availability || "Not detected"}
                  </p>
                </div>

              </div>

              {/* Description */}
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

              {/* Future Action */}
              <div className="mt-6 rounded-xl border border-blue-200 bg-white p-4">

                <p className="text-sm text-gray-600">
                  ✨ This information can now be used to create
                  your worker profile or job posting.
                </p>

              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}

export default AIFeatures;