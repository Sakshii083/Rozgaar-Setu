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
    <section className="bg-white py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-6">

        {/* HEADER */}

        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            {t("roles.sectionTitle")}
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            {t("roles.sectionDescription")}
          </p>
        </div>

        {/* ROLE CARDS */}

        <div className="mt-7 grid gap-4 md:grid-cols-3">

          {roles.map((role) => (
            <div
              key={role.key}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >

              {/* ICON */}

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-3xl">
                {role.icon}
              </div>

              {/* CONTENT */}

              <div className="min-w-0 flex-1">

                <h3 className="text-lg font-bold text-slate-900">
                  {t(`roles.${role.key}.title`)}
                </h3>

                <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-600">
                  {t(`roles.${role.key}.description`)}
                </p>

                <Link
                  to={role.link}
                  className="mt-2 inline-block rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  {t("roles.continue")} →
                </Link>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default RoleCards;