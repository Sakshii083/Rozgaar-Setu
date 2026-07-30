function AIFeatures() {
  const features = [
    {
      icon: "📄",
      title: "AI Resume Analyzer",
      description:
        "Upload your resume and get ATS score, missing skills and improvement suggestions.",
    },
    {
      icon: "🎯",
      title: "AI Job Recommendation",
      description:
        "Get personalized job recommendations based on your profile and skills.",
    },
    {
      icon: "📝",
      title: "AI Resume Builder",
      description:
        "Create a professional resume in minutes without any design experience.",
    },
    {
      icon: "🎤",
      title: "AI Interview Practice",
      description:
        "Practice interview questions with AI and improve your confidence.",
    },
  ];

  return (
    <section className="bg-slate-100 py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          AI Career Tools
        </h2>

        <p className="text-center text-gray-600 mt-4">
          Smart tools to help every job seeker succeed.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition"
            >
              <div className="text-5xl">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mt-5">
                {feature.title}
              </h3>

              <p className="text-gray-600 mt-4">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default AIFeatures;