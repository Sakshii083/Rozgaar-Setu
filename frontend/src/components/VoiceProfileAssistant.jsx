import { useState, useEffect } from "react";
import API from "../api/axios";

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
  );

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
        "Speech recognition is not supported by this browser. " +
          "Please try a supported browser or type your description."
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
        `Listening in ${selectedLanguage.label}. Speak naturally about your work.`
      );
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const result = event.results[i];

        if (result.isFinal) {
          finalTranscript +=
            (finalTranscript ? " " : "") +
            result[0].transcript.trim();
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript(
        [finalTranscript, interimTranscript.trim()]
          .filter(Boolean)
          .join(" ")
      );
    };

    recognition.onerror = (event) => {
      setListening(false);

      if (event.error === "not-allowed") {
        setError(
          "Microphone access was denied. Allow microphone access in your browser settings."
        );
      } else if (event.error === "language-not-supported") {
        setError(
          `Speech recognition for ${selectedLanguage.label} is not supported by this browser or device. You can type your description instead.`
        );
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        setError(
          `Speech recognition error: ${event.error}. You can type your description instead.`
        );
      }
    };

    recognition.onend = () => {
      setListening(false);

      setStatus((previous) =>
        previous ||
        "Recording stopped. Review your transcript before generating."
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
      setError(
        "Could not start voice recording. Please try again or type your description."
      );
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (window.profileRecognition) {
      window.profileRecognition.stop();
    }

    setListening(false);
  };

  // Generate structured profile using the backend Gemini endpoint
  const generateProfile = async () => {
    if (!transcript.trim()) {
      setError(
        "Please speak or type a description of your work first."
      );
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

      if (
        !Number.isFinite(experience === "" ? 0 : experience) ||
        (experience !== "" &&
          (experience < 0 || experience > 80))
      ) {
        throw new Error(
          "The AI returned an invalid experience value. Please try generating the profile again."
        );
      }

      setProfile({
        primarySkill:
          typeof data.primarySkill === "string"
            ? data.primarySkill
            : "",
        skills: Array.isArray(data.skills)
          ? data.skills.filter(
              (item) => typeof item === "string"
            )
          : [],
        experienceYears: experience,
        city:
          typeof data.city === "string" ? data.city : "",
        serviceAreas: Array.isArray(data.serviceAreas)
          ? data.serviceAreas.filter(
              (item) => typeof item === "string"
            )
          : [],
        profileSummary:
          typeof data.profileSummary === "string"
            ? data.profileSummary
            : "",
      });

      setMissingInformation(
        Array.isArray(data.missingInformation)
          ? data.missingInformation.filter(
              (item) => typeof item === "string"
            )
          : []
      );

      setGenerated(true);

      setStatus(
        "Profile generated! Review the details and correct any mistakes before saving."
      );
    } catch (err) {
      console.error("Profile generation error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not generate your profile. Check your login, connection, and backend AI configuration."
      );
    } finally {
      setGenerating(false);
    }
  };

  // Update an individual profile field
  const updateField = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Convert comma-separated input into an array
  const updateList = (field, value) => {
    updateField(
      field,
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    );
  };

  // Save worker-confirmed profile
  const saveProfile = async () => {
    if (!profile.primarySkill.trim()) {
      setError("Please enter your main skill before saving.");
      return;
    }

    const experience =
      profile.experienceYears === "" ||
      profile.experienceYears === null ||
      profile.experienceYears === undefined
        ? null
        : Number(profile.experienceYears);

    if (
      experience !== null &&
      (!Number.isFinite(experience) ||
        experience < 0 ||
        experience > 80)
    ) {
      setError(
        "Please enter a valid experience between 0 and 80 years."
      );
      return;
    }

    if (
      profile.skills.some(
        (skill) => typeof skill !== "string"
      ) ||
      profile.serviceAreas.some(
        (area) => typeof area !== "string"
      )
    ) {
      setError("Please check your skills and service areas.");
      return;
    }

    setSaving(true);
    setError("");
    setStatus("");

    try {
      await API.post("/ai-profile/save", {
        ...profile,
        experienceYears: experience,
        preferredLanguage: language,
      });

      setStatus(
        "Your profile has been saved successfully! Your confirmed details are now stored in your account."
      );
    } catch (err) {
      console.error("Profile saving error:", err);

      setError(
        err.response?.data?.message ||
          "Could not save your profile. Please log in and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setTranscript("");
    setProfile(createEmptyProfile());
    setMissingInformation([]);
    setGenerated(false);
    setError("");
    setStatus("");
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-7 text-white sm:px-8">
          <div className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm">
            AI-Powered Worker Assistant
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Vaani — Rozgaar Saathi
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
            Speak in your preferred language. AI helps organize
            your work experience into a professional profile
            that you can review and save.
          </p>
        </div>

        <div className="space-y-6 p-5 sm:p-8">
          {/* Language selection */}
          <div>
            <label
              htmlFor="profile-language"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Choose your language
            </label>

            <select
              id="profile-language"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                setStatus("");
                setError("");
              }}
              disabled={listening || generating || saving}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {LANGUAGES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-gray-500">
              Speech recognition availability depends on your
              browser, device, and selected language.
            </p>
          </div>

          {/* Voice transcript */}
          <div>
            <label
              htmlFor="work-description"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Tell us about your work
            </label>

            <textarea
              id="work-description"
              value={transcript}
              onChange={(event) => setTranscript(event.target.value)}
              placeholder="Example: I am a plumber with 8 years of experience. I work on residential plumbing, concealed piping and sanitary fittings in Mysuru."
              rows={5}
              disabled={generating || saving}
              className="w-full resize-y rounded-lg border border-gray-300 p-4 leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-2 text-xs text-gray-500">
              Mention your skills, experience, city, and service
              areas. Review the transcription for mistakes.
            </p>
          </div>

          {/* Recording and generation buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {!listening ? (
              <button
                type="button"
                onClick={startRecording}
                disabled={generating || saving}
                className="flex-1 rounded-lg border border-blue-600 px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                🎙️ Speak About My Work
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="flex-1 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                ⏹ Stop Recording
              </button>
            )}

            <button
              type="button"
              onClick={generateProfile}
              disabled={
                !transcript.trim() ||
                generating ||
                listening ||
                saving
              }
              className="flex-1 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating
                ? "Generating Profile..."
                : "✨ Generate My Profile"}
            </button>
          </div>

          {/* Status */}
          {status && (
            <div
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800"
            >
              {status}
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          )}

          {/* Generated profile */}
          {generated && (
            <div className="space-y-5 border-t border-gray-200 pt-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Review Your AI-Generated Profile
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  AI-generated details may contain mistakes.
                  Correct them before saving.
                </p>
              </div>

              {/* Missing information */}
              {missingInformation.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <h3 className="font-semibold text-amber-900">
                    Information to confirm
                  </h3>

                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800">
                    {missingInformation.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Primary skill */}
              <div>
                <label
                  htmlFor="primary-skill"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Main Skill *
                </label>

                <input
                  id="primary-skill"
                  value={profile.primarySkill}
                  onChange={(event) =>
                    updateField("primarySkill", event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Plumber"
                />
              </div>

              {/* Additional skills */}
              <div>
                <label
                  htmlFor="skills"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Additional Skills
                </label>

                <input
                  id="skills"
                  value={profile.skills.join(", ")}
                  onChange={(event) =>
                    updateList("skills", event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                  placeholder="Concealed piping, sanitary fittings"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Separate skills with commas.
                </p>
              </div>

              {/* Experience */}
              <div>
                <label
                  htmlFor="experience"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Years of Experience
                </label>

                <input
                  id="experience"
                  type="number"
                  min="0"
                  max="80"
                  step="0.5"
                  value={profile.experienceYears}
                  onChange={(event) =>
                    updateField(
                      "experienceYears",
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                  placeholder="Leave blank if unknown"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Leave blank if you haven't provided this information.
                </p>
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  City
                </label>

                <input
                  id="city"
                  value={profile.city}
                  onChange={(event) =>
                    updateField("city", event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Mysuru"
                />
              </div>

              {/* Service areas */}
              <div>
                <label
                  htmlFor="service-areas"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Service Areas
                </label>

                <input
                  id="service-areas"
                  value={profile.serviceAreas.join(", ")}
                  onChange={(event) =>
                    updateList("serviceAreas", event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Gokulam, Vijayanagar, Hebbal"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Enter only areas where you actually provide services.
                </p>
              </div>

              {/* Professional summary */}
              <div>
                <label
                  htmlFor="profile-summary"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Professional Summary
                </label>

                <textarea
                  id="profile-summary"
                  rows={5}
                  value={profile.profileSummary}
                  onChange={(event) =>
                    updateField(
                      "profileSummary",
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 p-4 leading-6 focus:border-blue-500 focus:outline-none"
                  placeholder="Your professional summary will appear here."
                />
              </div>

              {/* Save and reset */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving || generating}
                  className="flex-1 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving Profile..."
                    : "💾 Confirm & Save Profile"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving || generating || listening}
                  className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Start Again
                </button>
              </div>

              <p className="text-xs leading-5 text-gray-500">
                Your profile is saved only after you select Confirm
                & Save Profile. AI-generated information is not
                independent verification of identity, qualifications,
                or service locations.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}