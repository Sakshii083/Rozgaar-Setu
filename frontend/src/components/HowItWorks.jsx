import { useLanguage } from "../context/LanguageContext";

function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      number: "1",
      icon: "👤",
      title: t("howItWorks.step1Title") || "Create Profile or Post Job",
      description:
        t("howItWorks.step1Description") ||
        "Workers can speak their experience into Vaani AI; employers can post a job vacancy in 2 minutes.",
    },
    {
      number: "2",
      icon: "🔎",
      title: t("howItWorks.step2Title") || "Smart Discovery & Matching",
      description:
        t("howItWorks.step2Description") ||
        "Rozgaar Saathi connects you based on occupation, location, expected daily wage, and immediate availability.",
    },
    {
      number: "3",
      icon: "🤝",
      title: t("howItWorks.step3Title") || "Direct Contact & Fair Work",
      description:
        t("howItWorks.step3Description") ||
        "Direct one-click phone call or WhatsApp connection. Zero middleman fees, transparent wages, reliable work.",
    },
  ];

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#173B57]/10 px-4 py-1 text-xs font-bold text-[#173B57] uppercase">
            Simple 3-Step Process
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#173B57] sm:text-4xl">
            {t("howItWorks.title") || "How Rozgaar Setu Works"}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            {t("howItWorks.description") || "Transparent, accessible, and fast hiring designed for everyone."}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] p-6 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#173B57] text-xl font-bold text-white shadow-md">
                  {step.icon}
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#0F9D8A]">
                  Step {step.number}
                </p>

                <h3 className="mt-1 text-lg font-bold text-[#202938]">
                  {step.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
