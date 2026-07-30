import React from "react";

function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full md:w-96 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
    />
  );
}

export default SearchBar;