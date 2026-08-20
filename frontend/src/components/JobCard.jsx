import { applyJob } from "../api/applicationApi";
import { useLanguage } from "../context/LanguageContext";

function JobCard({ job }) {
  const { t } = useLanguage();

  const handleApply = async () => {
    try {
      const res = await applyJob(job._id);

      alert(
        res.data.message ||
          t("workerDashboard.applicationSubmitted")
      );

    } catch (error) {

      alert(
        error.response?.data?.message ||
          t("workerDashboard.applyError")
      );

    }
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow transition hover:shadow-lg">

      <div className="flex justify-between gap-4">

        <div>

          <h2 className="text-2xl font-bold text-blue-700">
            {job.title}
          </h2>

          <p className="mt-1 text-gray-500">
            📍 {job.city}
          </p>

        </div>

        <span className="h-fit rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
          {job.jobType}
        </span>

      </div>

      <p className="mt-5 text-gray-600">
        {job.description}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-6">

        <div>

          <p className="text-sm text-gray-500">
            {t("jobs.skill")}
          </p>

          <p className="font-semibold">
            {job.skill}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            {t("jobs.salary")}
          </p>

          <p className="font-semibold text-green-700">
            ₹ {job.salary}
          </p>

        </div>

      </div>

      <div className="mt-6 flex items-center justify-between gap-4">

        <div>

          <p className="text-sm text-gray-500">
            {t("jobs.employer")}
          </p>

          <p className="font-semibold">
            {job.employer?.name ||
              t("jobs.notAvailable")}
          </p>

        </div>

        <button
          type="button"
          onClick={handleApply}
          className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          {t("jobs.applyNow")}
        </button>

      </div>

    </div>
  );
}

export default JobCard;