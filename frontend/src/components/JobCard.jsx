import { applyJob } from "../api/applicationApi";

function JobCard({ job }) {

  const handleApply = async () => {
    try {
      const res = await applyJob(job._id);

      alert(res.data.message);

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }
  };

  return (
    <div className="border rounded-xl p-6 shadow hover:shadow-lg transition">

      <div className="flex justify-between">

        <div>

          <h2 className="text-2xl font-bold text-blue-700">
            {job.title}
          </h2>

          <p className="text-gray-500 mt-1">
            📍 {job.city}
          </p>

        </div>

        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full h-fit">
          {job.jobType}
        </span>

      </div>

      <p className="mt-5 text-gray-600">
        {job.description}
      </p>

      <div className="grid grid-cols-2 gap-6 mt-6">

        <div>

          <p className="text-sm text-gray-500">
            Skill
          </p>

          <p className="font-semibold">
            {job.skill}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Salary
          </p>

          <p className="font-semibold text-green-700">
            ₹ {job.salary}
          </p>

        </div>

      </div>

      <div className="mt-6 flex justify-between items-center">

        <div>

          <p className="text-sm text-gray-500">
            Employer
          </p>

          <p className="font-semibold">
            {job.employer?.name}
          </p>

        </div>

        <button
          onClick={handleApply}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Apply
        </button>

      </div>

    </div>
  );
}

export default JobCard;