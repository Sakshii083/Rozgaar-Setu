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
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <h2 className="text-4xl font-bold text-slate-900">
            {t("howItWorks.title")}
          </h2>

          <p className="mt-4 text-gray-600">
            {t("howItWorks.description")}
          </p>

        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">

          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-lg shadow-blue-200">
                {step.icon}
              </div>

              <div className="mx-auto mt-3 text-sm font-bold text-blue-600">
                {t("howItWorks.step")} {step.number}
              </div>

              <h3 className="mt-4 text-2xl font-semibold text-slate-900">
                {step.title}
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                {step.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;