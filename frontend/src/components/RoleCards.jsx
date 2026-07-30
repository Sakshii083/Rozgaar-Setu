import { Link } from "react-router-dom";

function RoleCards() {
  const roles = [
    {
      title: "Skilled Worker",
      icon: "👷",
      description:
        "Find nearby work as a plumber, electrician, carpenter, painter, driver and more.",
      link: "/worker-register",
    },
    {
      title: "Professional Job Seeker",
      icon: "👨‍🎓",
      description:
        "Apply for internships, part-time and full-time jobs with AI career support.",
      link: "/register",
    },
    {
      title: "Employer",
      icon: "🏢",
      description:
        "Hire skilled workers and professionals quickly from one platform.",
      link: "/register",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center">
          Choose Your Role
        </h2>

        <p className="text-center text-gray-600 mt-4">
          Rozgaar Setu is built for everyone.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {roles.map((role) => (
            <div
              key={role.title}
              className="rounded-2xl border p-8 shadow-sm hover:shadow-xl transition duration-300"
            >
              <div className="text-5xl">{role.icon}</div>

              <h3 className="text-2xl font-bold mt-5">
                {role.title}
              </h3>

              <p className="mt-4 text-gray-600">
                {role.description}
              </p>

              <Link
                to={role.link}
                className="inline-block mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
              >
                Continue
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RoleCards;