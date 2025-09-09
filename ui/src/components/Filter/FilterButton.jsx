import React from "react";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";

const Filterbutton = ({ showFilters, setShowFilters }) => {
  return (
    <button
      className="flex items-center hover:gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-primary shadow-none text-popfont-medium text-white px-2 py-2 rounded-md hover:bg-primaryLight hover:shadow-none text-sm hover:text-primary h-fit group "
      onClick={() => setShowFilters((prev) => !prev)}
    >
      <span className="max-w-0 truncate sm:group-hover:max-w-[100px]  transition-all duration-300">
        {showFilters ? "Hide " : "Show "}
        Filters
      </span>
      {!showFilters ? (
        <MdFilterAlt className="w-4 h-4" />
      ) : (
        <MdFilterAltOff className="w-4 h-4" />
      )}
    </button>
  );
};

export default Filterbutton;
