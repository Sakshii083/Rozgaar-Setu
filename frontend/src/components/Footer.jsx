import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Footer({ compact = false }) {
  const { t, language, changeLanguage } = useLanguage();

  if (compact) {
    return (
      <footer className="border-t border-[#DCE6EF] bg-white py-1.5 px-4 sm:px-6 text-xs text-[#64748B] shrink-0">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#173B57]">Rozgaar Setu</span>
            <span>•</span>
            <span className="text-[11px]">{t("footer.tagline") || t("nav.tagline") || "Local Skills. Local Opportunities."}</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-[11px]">📞 {t("footer.helpline") || "Helpline: 1800-ROZGAAR"}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#173B57]">
            <Link to="/about" className="hover:text-[#0F9D8A]">{t("footer.about") || "About"}</Link>
            <Link to="/contact" className="hover:text-[#0F9D8A]">{t("footer.contact") || "Contact"}</Link>
            <Link to="/jobs" className="hover:text-[#0F9D8A]">{t("nav.jobs") || "Find Jobs"}</Link>
            <Link to="/workers" className="hover:text-[#0F9D8A]">{t("nav.workers") || "Find Workers"}</Link>
            <span className="text-slate-400">|</span>
            <span className="text-[11px] text-[#64748B]">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-[#E2E8F0] bg-[#173B57] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F9D8A] text-lg font-bold text-white shadow-md">
                R
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Rozgaar<span className="text-[#F4B942]"> Setu</span>
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              {t("hero.description")}
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-300">
              <span className="inline-block h-2 w-2 rounded-full bg-[#0F9D8A]"></span>
              <span>{t("nav.tagline") || "Local Opportunities • Direct Connections"}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F4B942]">
              {t("common.explore") || "Explore"}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-300 transition hover:text-white">
                  {t("nav.home") || "Home"}
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-slate-300 transition hover:text-white">
                  {t("nav.jobs") || "Find Jobs"}
                </Link>
              </li>
              <li>
                <Link to="/workers" className="text-slate-300 transition hover:text-white">
                  {t("nav.workers") || "Find Workers"}
                </Link>
              </li>
              <li>
                <Link to="/worker-register" className="text-slate-300 transition hover:text-white">
                  {t("nav.registerWorker") || "Worker Registration"}
                </Link>
              </li>
              <li>
                <Link to="/post-job" className="text-slate-300 transition hover:text-white">
                  {t("nav.postJob") || "Post Job"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F4B942]">
              {t("footer.helpSupport") || "Help & Support"}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="text-slate-300 transition hover:text-white">
                  {t("footer.about") || "About Rozgaar Setu"}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 transition hover:text-white">
                  {t("footer.contact") || "Helpline & Support"}
                </Link>
              </li>
              <li className="pt-2 text-xs text-slate-300">
                <span className="block font-bold text-white">📞 {t("footer.helpline") || "Toll-Free Helpline"}:</span>
                <span>1800-ROZGAAR (1800-769-4227)</span>
              </li>
              <li className="text-xs text-slate-300">
                <span className="block font-bold text-white">✉️ {t("footer.emailSupport") || "Email Support"}:</span>
                <span>support@rozgaarsetu.in</span>
              </li>
            </ul>
          </div>

          {/* Languages & Accessibility */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F4B942]">
              {t("nav.language") || "Vernacular Support"}
            </h3>
            <p className="mt-4 text-xs text-slate-300">
              {t("footer.vernacularDesc") || "Rozgaar Setu supports Indian vernacular languages for easy access:"}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { code: "en", label: "English" },
                { code: "hi", label: "हिन्दी" },
                { code: "kn", label: "ಕನ್ನಡ" },
                { code: "mr", label: "मराठी" },
                { code: "te", label: "తెలుగు" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    language === lang.code
                      ? "bg-[#0F9D8A] text-white font-bold"
                      : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col items-center justify-between gap-4 sm:flex-row text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Rozgaar Setu. {t("footer.copyright") || "All rights reserved."}</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-slate-200">{t("footer.about") || "About"}</Link>
            <Link to="/contact" className="hover:text-slate-200">{t("footer.contact") || "Contact"}</Link>
            <Link to="/jobs" className="hover:text-slate-200">{t("nav.jobs") || "Jobs"}</Link>
            <Link to="/workers" className="hover:text-slate-200">{t("nav.workers") || "Workers"}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
