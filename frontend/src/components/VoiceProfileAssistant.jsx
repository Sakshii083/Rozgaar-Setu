import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLanguage } from "../context/LanguageContext";

const LANGUAGES = [
  { code: "en", label: "English", speechCode: "en-IN" },
  { code: "hi", label: "हिन्दी", speechCode: "hi-IN" },
  { code: "kn", label: "ಕನ್ನಡ", speechCode: "kn-IN" },
  { code: "mr", label: "मराठी", speechCode: "mr-IN" },
  { code: "te", label: "తెలుగు", speechCode: "te-IN" },
];

const createEmptyProfile = () => ({
  primarySkill: "",
  skills: [],
  experienceYears: "",
  city: "",
  serviceAreas: [],
  profileSummary: "",
});

export default function VoiceProfileAssistant() {
  const { t } = useLanguage();
  const [language, setLanguage] = useState("en");
  const [transcript, setTranscript] = useState("");
  const [profile, setProfile] = useState(createEmptyProfile);
  const [missingInformation, setMissingInformation] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generated, setGenerated] = useState(false);

  const selectedLanguage = LANGUAGES.find(
    (item) => item.code === language
  ) || LANGUAGES[0];

  useEffect(() => {
    return () => {
      if (window.profileRecognition) {
        window.profileRecognition.onend = null;
        window.profileRecognition.stop();
        window.profileRecognition = null;
      }
    };
  }, []);

  // Start voice recording
  const startRecording = () => {
    setError("");
    setStatus("");

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported by your current browser. You can type your work details directly into the text box below."
      );
      return;
    }

    if (window.profileRecognition) {
      window.profileRecognition.onend = null;
      window.profileRecognition.stop();
      window.profileRecognition = null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLanguage.speechCode;
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = transcript.trim();

    recognition.onstart = () => {
      setListening(true);
      setStatus(
        `Listening in ${selectedLanguage.label}. Speak naturally about your trade, experience, and service locations.`
      );
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript +=
            (finalTranscript ? " " : "") + result[0].transcript.trim();
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript(
        [finalTranscript, interimTranscript.trim()].filter(Boolean).join(" ")
      );
    };

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === "not-allowed") {
        setError(
          "Microphone access was denied. Please allow microphone permissions in your browser or type your description."
        );
      } else if (event.error === "language-not-supported") {
        setError(
          `Speech recognition for ${selectedLanguage.label} is not available on this device. You can type your description directly.`
        );
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        setError(
          `Voice recognition error (${event.error}). Please type your description.`
        );
      }
    };

    recognition.onend = () => {
      setListening(false);
      setStatus((prev) =>
        prev || "Recording stopped. Review your statement before generating profile."
      );
      if (window.profileRecognition === recognition) {
        window.profileRecognition = null;
      }
    };

    window.profileRecognition = recognition;

    try {
      recognition.start();
    } catch (err) {
      window.profileRecognition = null;
      setListening(false);
      setError("Could not activate microphone. Please type your work description.");
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (window.profileRecognition) {
      window.profileRecognition.stop();
    }
    setListening(false);
  };

  // Generate structured profile
  const generateProfile = async () => {
    if (!transcript.trim()) {
      setError("Please speak or type a description of your work first.");
      return;
    }

    setGenerating(true);
    setError("");
    setStatus("");

    try {
      const response = await API.post("/ai-profile/generate", {
        text: transcript.trim(),
        language,
      });

      const data = response.data.profile || response.data;
      const experience =
        data.experienceYears === null ||
        data.experienceYears === undefined ||
        data.experienceYears === ""
          ? ""
          : Number(data.experienceYears);

      setProfile({
        primarySkill: typeof data.primarySkill === "string" ? data.primarySkill : "",
        skills: Array.isArray(data.skills)
          ? data.skills.filter((item) => typeof item === "string")
          : [],
        experienceYears: Number.isFinite(experience) ? experience : "",
        city: typeof data.city === "string" ? data.city : "",
        serviceAreas: Array.isArray(data.serviceAreas)
          ? data.serviceAreas.filter((item) => typeof item === "string")
          : [],
        profileSummary: typeof data.profileSummary === "string" ? data.profileSummary : "",
      });

      setMissingInformation(
        Array.isArray(data.missingInformation)
          ? data.missingInformation.filter((item) => typeof item === "string")
          : []
      );

      setGenerated(true);
      setStatus("Profile generated! Review and edit the details below, then click Confirm & Save.");
    } catch (err) {
      console.error("Profile generation error:", err);
      setError(
        err.response?.data?.message ||
          "Could not generate profile. Please ensure you are logged in and your network is active."
      );
    } finally {
      setGenerating(false);
    }
  };

  const updateField = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateList = (field, value) => {
    updateField(
      field,
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    );
  };

  // Save confirmed profile
  const saveProfile = async () => {
    if (!profile.primarySkill.trim()) {
      setError("Please enter your main trade or skill before saving.");
      return;
    }

    const experience =
      profile.experienceYears === "" ||
      profile.experienceYears === null ||
      profile.experienceYears === undefined
        ? null
        : Number(profile.experienceYears);

    setSaving(true);
    setError("");
    setStatus("");

    try {
      await API.post("/ai-profile/save", {
        ...profile,
        experienceYears: experience,
        preferredLanguage: language,
      });

      setStatus("✅ Your profile has been successfully saved to your worker account!");
    } catch (err) {
      console.error("Profile saving error:", err);
      setError(
        err.response?.data?.message ||
          "Could not save profile. Please make sure you are logged into a worker account."
      );
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setTranscript("");
    setProfile(createEmptyProfile());
    setMissingInformation([]);
    setGenerated(false);
    setError("");
    setStatus("");
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#173B57] via-[#1c4769] to-[#0F9D8A] px-6 py-8 text-white sm:px-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold text-[#F4B942]">
              <span>🎙️</span>
              <span>Vaani AI — Vernacular Assistant</span>
            </div>

            <h1 className="mt-3 text-2xl font-black sm:text-3xl">
              Create Your Worker Profile with Your Voice
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
              Speak naturally in your mother tongue. Vaani AI structures your experience into a professional employment profile for employers to discover you.
            </p>
          </div>

          <div className="space-y-6 p-6 sm:p-10">
            {/* Language Selection */}
            <div>
              <label htmlFor="profile-language" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#173B57]">
                Choose your spoken language
              </label>

              <select
                id="profile-language"
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setStatus("");
                  setError("");
                }}
                disabled={listening || generating || saving}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] px-4 py-3 text-sm font-semibold text-[#202938] outline-none transition focus:border-[#0F9D8A] focus:bg-white focus:ring-2 focus:ring-[#0F9D8A]/20"
              >
                {LANGUAGES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Spoken / Typed Description */}
            <div>
              <label htmlFor="work-description" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#173B57]">
                Describe your work & experience
              </label>

              <textarea
                id="work-description"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Example: I am a plumber with 6 years of experience. I do residential piping, leak repairs, and bathroom fitting in Pune and nearby areas."
                rows={5}
                disabled={generating || saving}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-4 text-sm text-[#202938] outline-none transition focus:border-[#0F9D8A] focus:bg-white focus:ring-2 focus:ring-[#0F9D8A]/20"
              />

              <p className="mt-2 text-xs text-slate-500">
                You can tap "Speak About My Work" below to dictate with your microphone, or type directly into the box.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {!listening ? (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={generating || saving}
                  className="flex-1 rounded-xl border-2 border-[#0F9D8A] bg-[#0F9D8A]/10 px-5 py-3 text-sm font-bold text-[#0F9D8A] transition hover:bg-[#0F9D8A] hover:text-white disabled:opacity-50"
                >
                  🎙️ Speak About My Work
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex-1 animate-pulse rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  ⏹ Stop Recording
                </button>
              )}

              <button
                type="button"
                onClick={generateProfile}
                disabled={!transcript.trim() || generating || listening || saving}
                className="flex-1 rounded-xl bg-[#173B57] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#0f2638] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generating ? "Generating Profile with AI..." : "✨ Generate My Profile"}
              </button>
            </div>

            {/* Status & Error Alerts */}
            {status && (
              <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-xs font-semibold text-green-800">
                {status}
              </div>
            )}

            {error && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
                ⚠️ {error}
              </div>
            )}

            {/* Review & Edit AI Generated Profile */}
            {generated && (
              <div className="space-y-5 border-t border-[#E2E8F0] pt-6">
                <div>
                  <h2 className="text-lg font-bold text-[#173B57]">
                    Review Your Profile Details
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Verify and edit the details extracted by AI before saving to your account.
                  </p>
                </div>

                {missingInformation.length > 0 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      Suggested details to fill in:
                    </h3>
                    <ul className="mt-2 list-inside list-disc text-xs text-amber-800 space-y-1">
                      {missingInformation.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Primary Skill */}
                <div>
                  <label htmlFor="primary-skill" className="mb-1 block text-xs font-bold text-slate-700">
                    Main Occupation / Skill *
                  </label>
                  <input
                    id="primary-skill"
                    value={profile.primarySkill}
                    onChange={(e) => updateField("primarySkill", e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm outline-none focus:border-[#0F9D8A]"
                    placeholder="e.g. Plumber, Electrician, Carpenter"
                  />
                </div>

                {/* Additional Skills */}
                <div>
                  <label htmlFor="skills" className="mb-1 block text-xs font-bold text-slate-700">
                    Specific Skills (comma separated)
                  </label>
                  <input
                    id="skills"
                    value={profile.skills.join(", ")}
                    onChange={(e) => updateList("skills", e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm outline-none focus:border-[#0F9D8A]"
                    placeholder="e.g. Sanitary fittings, Pipeline repair, Water pump installation"
                  />
                </div>

                {/* Experience & City */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="experience" className="mb-1 block text-xs font-bold text-slate-700">
                      Years of Experience
                    </label>
                    <input
                      id="experience"
                      type="number"
                      min="0"
                      max="80"
                      step="0.5"
                      value={profile.experienceYears}
                      onChange={(e) => updateField("experienceYears", e.target.value)}
                      className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm outline-none focus:border-[#0F9D8A]"
                      placeholder="e.g. 5"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="mb-1 block text-xs font-bold text-slate-700">
                      City
                    </label>
                    <input
                      id="city"
                      value={profile.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm outline-none focus:border-[#0F9D8A]"
                      placeholder="e.g. Pune, Bengaluru, Mumbai"
                    />
                  </div>
                </div>

                {/* Service Areas */}
                <div>
                  <label htmlFor="service-areas" className="mb-1 block text-xs font-bold text-slate-700">
                    Service Areas / Localities (comma separated)
                  </label>
                  <input
                    id="service-areas"
                    value={profile.serviceAreas.join(", ")}
                    onChange={(e) => updateList("serviceAreas", e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm outline-none focus:border-[#0F9D8A]"
                    placeholder="e.g. Kothrud, Shivaji Nagar, Baner"
                  />
                </div>

                {/* Professional Summary */}
                <div>
                  <label htmlFor="profile-summary" className="mb-1 block text-xs font-bold text-slate-700">
                    Professional Summary
                  </label>
                  <textarea
                    id="profile-summary"
                    rows={4}
                    value={profile.profileSummary}
                    onChange={(e) => updateField("profileSummary", e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm outline-none focus:border-[#0F9D8A]"
                    placeholder="Brief description for employers..."
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={saving || generating}
                    className="flex-1 rounded-xl bg-[#0F9D8A] px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#0b7c6d] disabled:opacity-50"
                  >
                    {saving ? "Saving to Account..." : "💾 Confirm & Save Profile"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving || generating || listening}
                    className="rounded-xl border border-[#E2E8F0] px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                  >
                    Start Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
