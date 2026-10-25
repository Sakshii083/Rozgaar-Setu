import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Footer() {
  const { t, language, changeLanguage } = useLanguage();

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
              Connecting local skilled workers with neighborhood employers. Built for community empowerment, fair daily wages, and transparent hiring.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-300">
              <span className="inline-block h-2 w-2 rounded-full bg-[#0F9D8A]"></span>
              <span>Local Opportunities • Direct Connections</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F4B942]">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-300 transition hover:text-white">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-slate-300 transition hover:text-white">
                  {t("nav.jobs")}
                </Link>
              </li>
              <li>
                <Link to="/workers" className="text-slate-300 transition hover:text-white">
                  {t("nav.workers")}
                </Link>
              </li>
              <li>
                <Link to="/employers" className="text-slate-300 transition hover:text-white">
                  Find Employers
                </Link>
              </li>
              <li>
                <Link to="/worker-register" className="text-slate-300 transition hover:text-white">
                  Worker Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Tools */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F4B942]">
              AI Assistants
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/#sathi" className="text-slate-300 transition hover:text-white">
                  🤖 Rozgaar Saathi (Voice Search)
                </Link>
              </li>
              <li>
                <Link to="/voice-profile" className="text-slate-300 transition hover:text-white">
                  🎙️ Vaani AI (Voice Profile)
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 transition hover:text-white">
                  About Rozgaar Setu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 transition hover:text-white">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Languages & Accessibility */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F4B942]">
              Vernacular Support
            </h3>
            <p className="mt-4 text-xs text-slate-300">
              Rozgaar Setu supports Indian vernacular languages for easy access:
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

            <p className="mt-4 text-xs text-slate-400">
              Designed for desktop, tablets, and mobile smartphones.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col items-center justify-between gap-4 sm:flex-row text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Rozgaar Setu. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-slate-200">About</Link>
            <Link to="/contact" className="hover:text-slate-200">Contact</Link>
            <Link to="/jobs" className="hover:text-slate-200">Jobs</Link>
            <Link to="/workers" className="hover:text-slate-200">Workers</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
