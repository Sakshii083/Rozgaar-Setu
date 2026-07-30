import FeatureCard from "./FeatureCard";

function Features() {
  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      <h2 className="text-4xl font-bold text-center mb-10">
        Why Choose Rozgaar Setu?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          title="🤖 AI Resume Analyzer"
          description="Get AI-powered feedback to improve your resume."
        />

        <FeatureCard
          title="📍 Nearby Workers"
          description="Find skilled workers close to your location."
        />

        <FeatureCard
          title="💼 Real-Time Jobs"
          description="Apply for the latest full-time and part-time jobs."
        />

        <FeatureCard
          title="🔧 Skilled Workers"
          description="Hire trusted plumbers, electricians, drivers and more."
        />
        <FeatureCard
          title="🎤 Voice Search"
          description="Easily search for jobs and workers using voice commands."
        />
      </div>
    </section>
  );
}

export default Features;