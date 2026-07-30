function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Choose Your Role",
      description:
        "Register as a Skilled Worker, Professional, or Employer.",
    },
    {
      number: "2",
      title: "Create Your Profile",
      description:
        "Add your skills, experience, location, or company details.",
    },
    {
      number: "3",
      title: "Connect & Grow",
      description:
        "Employers hire talent, workers find jobs, and professionals use AI tools.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          How Rozgaar Setu Works
        </h2>

        <p className="text-center text-gray-600 mt-4">
          Get started in just three simple steps.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-14">

          {steps.map((step) => (
            <div
              key={step.number}
              className="text-center p-8 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                {step.number}
              </div>

              <h3 className="text-2xl font-semibold mt-6">
                {step.title}
              </h3>

              <p className="text-gray-600 mt-4">
                {step.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;