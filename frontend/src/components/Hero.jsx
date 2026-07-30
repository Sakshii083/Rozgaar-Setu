function Hero() {
  return (
    <section className="bg-blue-50 px-6 py-20">
      <div className="mx-auto max-w-7xl grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-600">
            Trusted Local Work Matching
          </p>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Find work faster or hire the right people for the job.
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Rozgaar Setu connects workers and employers in one simple platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/jobs"
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Explore Jobs
            </a>
            <a
              href="/workers"
              className="rounded-lg border border-blue-600 px-5 py-3 font-semibold text-blue-600 hover:bg-blue-100"
            >
              Find Workers
            </a>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900">Why Rozgaar Setu?</h2>
          <ul className="mt-4 space-y-3 text-gray-600">
            <li>• Verified local opportunities</li>
            <li>• Fast hiring and onboarding</li>
            <li>• Simple, transparent matching</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Hero;