function SearchBar({
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="relative w-full md:w-96">

      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
        🔍
      </span>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

    </div>
  );
}

export default SearchBar;