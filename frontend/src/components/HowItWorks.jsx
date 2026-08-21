import { useLanguage } from "../context/LanguageContext";

function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      number: "1",
      icon: "👤",
      title: t("howItWorks.step1Title"),
      description: t("howItWorks.step1Description"),
    },
    {
      number: "2",
      icon: "🔎",
      title: t("howItWorks.step2Title"),
      description: t("howItWorks.step2Description"),
    },
    {
      number: "3",
      icon: "🤝",
      title: t("howItWorks.step3Title"),
      description: t("howItWorks.step3Description"),
    },
  ];

  return (
    <section className="bg-white py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-6">

        {/* HEADER */}

        <div className="text-center">

          <h2 className="text-3xl font-bold text-slate-900">
            {t("howItWorks.title")}
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            {t("howItWorks.description")}
          </p>

        </div>

        {/* STEPS */}

        <div className="mt-7 grid gap-4 md:grid-cols-3">

          {steps.map((step) => (
            <div
              key={step.number}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              {/* ICON */}

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-md">
                {step.icon}
              </div>

              {/* CONTENT */}

              <div className="min-w-0">

                <p className="text-xs font-bold text-blue-600">
                  {t("howItWorks.step")} {step.number}
                </p>

                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-600">
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