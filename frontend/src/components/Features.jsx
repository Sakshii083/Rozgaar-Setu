import { useLanguage } from "../context/LanguageContext";

function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: "🤖",
      title: "Rozgaar Saathi AI",
      description: "Describe your job or worker requirement in natural language using voice or text for intelligent matching.",
    },
    {
      icon: "🎙️",
      title: "Vaani AI Voice Profiles",
      description: "Workers can speak in regional languages to generate professional, structured profiles without manual typing.",
    },
    {
      icon: "📍",
      title: "Hyperlocal Search",
      description: "Find verified plumbers, electricians, carpenters, painters, and drivers situated right in your city.",
    },
    {
      icon: "💼",
      title: "Real-Time Job Openings",
      description: "Browse daily wage, part-time, full-time, and contract opportunities posted directly by local employers.",
    },
    {
      icon: "🌐",
      title: "Multilingual Experience",
      description: "Seamlessly switch between Hindi, Kannada, Marathi, Telugu, and English anytime across the portal.",
    },
    {
      icon: "⚡",
      title: "Zero-Intermediary Contact",
      description: "Direct one-click telephone calling and WhatsApp messaging between employers and skilled workers.",
    },
  ];

  return (
    <section className="bg-[#F7F9FC] py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#173B57]/10 px-4 py-1 text-xs font-bold text-[#173B57] uppercase">
            Platform Capabilities
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#173B57] sm:text-4xl">
            Why Choose Rozgaar Setu?
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Modern AI technology coupled with accessible design for India's local workforce.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7F9FC] text-2xl">
                {feat.icon}
              </div>
              <h3 className="mt-4 text-base font-bold text-[#202938]">
                {feat.title}
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
