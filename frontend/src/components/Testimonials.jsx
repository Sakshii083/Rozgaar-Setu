import { useLanguage } from "../context/LanguageContext";

function Testimonials() {
  const { t } = useLanguage();

  const trustPillars = [
    {
      icon: "🤝",
      title: "Direct Worker-Employer Connect",
      description:
        "No middleman cuts or commission deductions. Employers and workers connect directly via phone call or WhatsApp.",
    },
    {
      icon: "🎙️",
      title: "Vernacular Voice Accessibility",
      description:
        "Digital literacy should never be a barrier to employment. Workers can speak naturally in Hindi, Kannada, Marathi, Telugu, or English to create structured profiles.",
    },
    {
      icon: "📍",
      title: "Hyperlocal Matching",
      description:
        "Search and discover job openings and skilled professionals within your exact city, locality, and neighborhood.",
    },
    {
      icon: "⚖️",
      title: "Transparent Wages",
      description:
        "Clearly specified expected daily wages and job salaries help eliminate wage ambiguity before work begins.",
    },
  ];

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#0F9D8A]/10 px-4 py-1 text-xs font-bold text-[#0F9D8A] uppercase">
            Platform Values
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#173B57] sm:text-4xl">
            Built on Trust, Simplicity & Accessibility
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Rozgaar Setu is engineered to serve the everyday community — empowering blue-collar tradespeople and local businesses alike.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                {pillar.icon}
              </div>
              <h3 className="mt-4 text-base font-bold text-[#202938]">
                {pillar.title}
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
