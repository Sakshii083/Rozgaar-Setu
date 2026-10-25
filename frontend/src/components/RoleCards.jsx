import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function RoleCards() {
  const { t } = useLanguage();

  const roles = [
    {
      key: "worker",
      icon: "👷",
      title: "Skilled & Daily Wage Workers",
      description: "Find local jobs as a plumber, electrician, carpenter, painter, driver, mason or cook. No agent fees.",
      primaryAction: { text: "Register as Worker", link: "/worker-register" },
      secondaryAction: { text: "Use Vaani Voice AI", link: "/voice-profile" },
      badge: "For Job Seekers",
    },
    {
      key: "employer",
      icon: "🏢",
      title: "Employers & Contractors",
      description: "Post requirements for daily wage workers, residential technicians, or full-time site crews in minutes.",
      primaryAction: { text: "Post a Job", link: "/register" },
      secondaryAction: { text: "Browse Workers", link: "/workers" },
      badge: "For Hirers",
    },
    {
      key: "professional",
      icon: "👨‍🎓",
      title: "Career & Trade Professionals",
      description: "Discover verified trade opportunities and manage employment applications with an intuitive dashboard.",
      primaryAction: { text: "Get Started", link: "/register" },
      secondaryAction: { text: "Explore Jobs", link: "/jobs" },
      badge: "For Professionals",
    },
  ];

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#0F9D8A]/10 px-4 py-1 text-xs font-bold text-[#0F9D8A] uppercase">
            Tailored For Your Needs
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#173B57] sm:text-4xl">
            Choose Your Path on Rozgaar Setu
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Dedicated portals and tools built specifically for local workers and neighborhood employers.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {roles.map((role) => (
            <div
              key={role.key}
              className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-[#F7F9FC] p-6 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-xs">
                    {role.icon}
                  </div>
                  <span className="rounded-full bg-[#173B57]/10 px-3 py-1 text-[11px] font-bold text-[#173B57]">
                    {role.badge}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#202938]">
                  {role.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {role.description}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-2 pt-4 border-t border-slate-200">
                <Link
                  to={role.primaryAction.link}
                  className="rounded-xl bg-[#173B57] px-4 py-2.5 text-center text-xs font-bold text-white shadow-xs transition hover:bg-[#0f2638]"
                >
                  {role.primaryAction.text} →
                </Link>

                <Link
                  to={role.secondaryAction.link}
                  className="rounded-xl border border-[#0F9D8A] bg-white px-4 py-2 text-center text-xs font-bold text-[#0F9D8A] transition hover:bg-[#0F9D8A]/10"
                >
                  {role.secondaryAction.text}
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
