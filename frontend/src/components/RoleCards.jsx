import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function RoleCards() {
  const { t } = useLanguage();

  const roles = [
    {
      key: "worker",
      icon: "👷",
      link: "/worker-register",
    },
    {
      key: "professional",
      icon: "👨‍🎓",
      link: "/register",
    },
    {
      key: "employer",
      icon: "🏢",
      link: "/register",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-center text-4xl font-bold text-slate-900">
          {t("roles.sectionTitle")}
        </h2>

        <p className="mt-4 text-center text-gray-600">
          {t("roles.sectionDescription")}
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">

          {roles.map((role) => (
            <div
              key={role.key}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="text-5xl">
                {role.icon}
              </div>

              <h3 className="mt-5 text-2xl font-bold text-slate-900">
                {t(`roles.${role.key}.title`)}
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                {t(`roles.${role.key}.description`)}
              </p>

              <Link
                to={role.link}
                className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                {t("roles.continue")}
              </Link>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default RoleCards;