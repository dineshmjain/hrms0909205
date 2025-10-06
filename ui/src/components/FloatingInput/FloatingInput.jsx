import React from "react";

export const FloatingInput = ({
  id,
  label,
  value,
  onChange,
  type = "text",
}) => (
  <div className="relative w-full">
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder=" "
      className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-gray-900 bg-white placeholder-transparent 
                 focus:outline-none focus:border-gray-900 transition-all duration-200"
    />
    <label
      htmlFor={id}
      className="absolute left-3 top-2 text-gray-500 text-sm bg-white px-1 transition-all duration-200
                 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                 peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-gray-900"
    >
      {label}
    </label>
  </div>
);
