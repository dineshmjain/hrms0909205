import React from "react";
import SingleSelectDropdown from "../SingleSelectDropdown/SingleSelectDropdown";

const DateStatusFilter = ({
  selectedFilters,
  setSelectedFilters,
  statusOptions = [
    // { id: "", name: "All" },
    { id: "approved", name: "Approved" },
    { id: "pending", name: "Pending" },
    { id: "rejected", name: "Rejected" },
  ],
}) => {
  const handleDateChange = (event) => {
    const dateValue = event.target.value;
    setSelectedFilters((prev) => ({
      ...prev,
      date: dateValue,
    }));
  };

  const handleStatusChange = (data) => {
    setSelectedFilters((prev) => ({
      ...prev,
      statusType: data?.id || "",
    }));
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">
      {/* Date Picker with Floating Label */}
      <div className="relative w-40">
        <input
          type="date"
          value={selectedFilters?.date || ""}
          onChange={handleDateChange}
          className="border border-gray-300 rounded-md p-2 w-full text-sm peer"
        />
        <label
          className={`absolute left-2 top-1 text-gray-500 text-xs transition-all
            ${selectedFilters?.date ? "text-[10px] -top-2 bg-white px-1" : ""}`}
        >
          {/* Date */}
        </label>
      </div>

      {/* Approval Status Dropdown with Floating Label */}
      <div className="relative w-40">
        <SingleSelectDropdown
          inputName="Approval Status"
          selectedOption={selectedFilters?.statusType}
          listData={statusOptions}
          selectedOptionDependency="id"
          fieldName="name"
          handleClick={handleStatusChange}
          hideLabel={true} // hide internal label
        />
        <label
          className={`absolute left-2 top-1 text-gray-500 text-xs transition-all
            ${
              selectedFilters?.statusType
                ? "text-[10px] -top-2 bg-white px-1"
                : ""
            }`}
        >
          {/* Approval Status */}
        </label>
      </div>
    </div>
  );
};

export default DateStatusFilter;
