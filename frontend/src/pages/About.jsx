import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Navbar />

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="rounded-3xl bg-gradient-to-r from-[#173B57] via-[#1c4769] to-[#0F9D8A] px-6 py-12 text-center text-white sm:px-12 sm:py-16">
            <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold text-[#F4B942] uppercase">
              Our Purpose
            </span>
            <h1 className="mt-4 text-3xl font-black sm:text-5xl">
              About Rozgaar Setu
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
              Bridging the gap between India's informal skilled workforce and neighborhood employers through accessible technology and vernacular AI.
            </p>
          </div>

          {/* Mission & Problem Section */}
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#173B57] text-2xl text-white">
                🎯
              </div>
              <h2 className="mt-5 text-xl font-bold text-[#173B57]">
                The Challenge
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Millions of skilled tradespeople — plumbers, electricians, masons, carpenters, painters, and drivers — rely on daily wages and fragmented word-of-mouth networks. They often lose substantial portions of their earnings to middlemen and face prolonged periods of unemployment.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F9D8A] text-2xl text-white">
                💡
              </div>
              <h2 className="mt-5 text-xl font-bold text-[#173B57]">
                Our Solution
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Rozgaar Setu gives workers an effortless, voice-first digital identity in their native languages. Employers can immediately discover verified workers in their city, contact them directly with zero commission deductions, and offer dignified, timely employment.
              </p>
            </div>
          </div>

          {/* Core Pillars */}
          <div className="mt-12 rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-sm sm:p-12">
            <h2 className="text-2xl font-black text-[#173B57] text-center">
              Our Core Principles
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-xl bg-[#F7F9FC] p-5">
                <span className="text-2xl">🎙️</span>
                <h3 className="mt-2 text-base font-bold text-slate-900">
                  Voice Accessibility
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Using Vaani AI, workers speak naturally in Hindi, Kannada, Marathi, Telugu, or English without having to navigate complicated digital forms.
                </p>
              </div>

              <div className="rounded-xl bg-[#F7F9FC] p-5">
                <span className="text-2xl">🤝</span>
                <h3 className="mt-2 text-base font-bold text-slate-900">
                  Direct Connections
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  We believe in transparency. Phone numbers and WhatsApp links allow immediate, direct dialogue between worker and employer.
                </p>
              </div>

              <div className="rounded-xl bg-[#F7F9FC] p-5">
                <span className="text-2xl">⚖️</span>
                <h3 className="mt-2 text-base font-bold text-slate-900">
                  Fair Expected Wages
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Daily wage expectations and job budgets are published upfront, fostering mutual trust and honest agreements.
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/register"
                className="inline-block rounded-xl bg-[#173B57] px-8 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#0f2638]"
              >
                Join the Platform Today →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default About;
