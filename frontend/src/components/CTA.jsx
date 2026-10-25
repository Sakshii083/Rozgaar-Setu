import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function CTA() {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-br from-[#173B57] via-[#1a4465] to-[#0F9D8A] py-14 text-white">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#F4B942] uppercase">
          Empowering Communities
        </span>

        <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Ready to Connect with Local Opportunities?
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-200">
          Whether you are looking for daily wage work, skilled contract opportunities, or hiring plumbers, electricians, carpenters, and drivers — Rozgaar Setu bridges the gap.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/jobs"
            className="rounded-xl bg-[#F4B942] px-6 py-3.5 text-sm font-bold text-[#202938] shadow-lg transition hover:bg-[#dca029]"
          >
            {t("hero.findJobs")}
          </Link>

          <Link
            to="/workers"
            className="rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            {t("hero.findWorkers")}
          </Link>

          <Link
            to="/voice-profile"
            className="rounded-xl bg-[#0F9D8A] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#0b7c6d]"
          >
            🎙️ Build Profile with Vaani AI
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTA;
