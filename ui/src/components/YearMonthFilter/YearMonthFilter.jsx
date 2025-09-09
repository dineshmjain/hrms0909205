import React from "react";
import SingleSelectDropdown from "../SingleSelectDropdown/SingleSelectDropdown";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const YearMonthFilter = ({ selectedFilters, setSelectedFilters, allowFutureMonths = false, }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const generateYearList = (range = 20) => {
    const currentYear = new Date().getFullYear();
    const halfRange = Math.floor(range / 2); 
    return Array.from({ length: range }, (_, i) => {
      const year = currentYear - (halfRange - i); 
      return { id: year, name: String(year) };
    });
  };

  const generateMonthList = (selectedYear) =>
    Array.from({ length: 12 }, (_, i) => {
      const monthId = i + 1;
      const isFuture =
      !allowFutureMonths &&
      selectedYear === currentYear &&
      monthId > currentMonth;
 
      return {
        id: monthId,
        name: new Date(0, i).toLocaleString("default", { month: "long" }),
        disabled: isFuture,
      };
    });

  const handleYearChange = (data) => {
    setSelectedFilters((prev) => ({
      ...prev,
      year: data?.id,
      month: undefined, // Reset month when year changes
    }));
  };

  const handleMonthClick = (data) => {
    if (data.disabled) {
    !allowFutureMonths && toast.error("Cannot select a future month.");
    return;
  }

    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev, month: data?.id };
      // If year is not set, default to current year
      if (!prev.year) {
        updatedFilters.year = currentYear;
      }
      return updatedFilters;
    });
  };

  return (
    <div className="">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Year Dropdown */}
        <div className="w-40">
          <SingleSelectDropdown
            inputName="Year"
            selectedOption={selectedFilters?.year}
            listData={generateYearList()}
            selectedOptionDependency="id"
            fieldName="name"
            handleClick={handleYearChange}
            hideLabel
          />
        </div>

        {/* Month Dropdown */}
        <div className="w-40">
          <SingleSelectDropdown
            inputName="Month"
            selectedOption={selectedFilters?.month}
            listData={generateMonthList(selectedFilters?.year)}
            selectedOptionDependency="id"
            fieldName="name"
            handleClick={handleMonthClick}
            hideLabel
          />
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default YearMonthFilter;
