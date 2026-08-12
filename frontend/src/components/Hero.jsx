import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50">
      {/* Background decoration */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-100 blur-3xl opacity-60" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-100 blur-3xl opacity-50" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* LEFT */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Connecting local talent with local opportunities
            </div>

            <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl">
              Find the right work.
              <span className="block text-blue-600">
                Find the right people.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Rozgaar Setu connects skilled workers with employers based on
              <span className="font-semibold text-slate-800">
                {" "}skill, location, availability and expected wage.
              </span>
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/jobs"
                className="rounded-xl bg-blue-600 px-7 py-3.5 text-center font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Find Jobs →
              </Link>

              <Link
                to="/workers"
                className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-center font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Find Workers
              </Link>
            </div>

            {/* Trust points */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <span>✓ Skill based</span>
              <span>✓ Local opportunities</span>
              <span>✓ Simple hiring</span>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70">

              {/* Search header */}
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-500">
                  What are you looking for?
                </p>

                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-lg">
                      🔧
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        Plumber
                      </p>
                      <p className="text-sm text-slate-500">
                        Belgaum
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matching card */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700">
                      Recommended Match
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                      Skilled Plumber
                    </h3>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    Available
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-slate-400">
                      Experience
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      4+ Years
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs text-slate-400">
                      Expected wage
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      ₹600/day
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-white p-3">
                  <div>
                    <p className="text-xs text-slate-400">
                      Location
                    </p>
                    <p className="font-semibold text-slate-800">
                      📍 Belgaum
                    </p>
                  </div>

                  <span className="text-2xl">→</span>
                </div>
              </div>

              {/* Bottom message */}
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Simple. Local. Reliable.
                  </p>
                  <p className="text-xs text-slate-500">
                    Connect with opportunities that fit your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;