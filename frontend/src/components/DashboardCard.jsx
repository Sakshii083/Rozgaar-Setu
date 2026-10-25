function DashboardCard({ title, value, icon, color = "text-[#173B57]" }) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">{title}</p>
          <h2 className={`mt-1.5 text-2xl font-black ${color}`}>
            {value}
          </h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7F9FC] text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
