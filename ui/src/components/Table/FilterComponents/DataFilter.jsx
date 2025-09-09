import React, { useEffect, useState } from "react";
import InputFilter from "./DataFilterComponents/InputFilter";
import SingleSelectFIlter from "./DataFilterComponents/SingleSelectFIlter";
import { HiXMark } from "react-icons/hi2";

const DataFilter = ({ filterData, setTableData, initialTableData,setShowFilter }) => {
  const [filters, setFilters] = useState(filterData);
  const updateFilter = (idx, value) => {
    setFilters((prev) => {
      let updatedFilter = [...prev];
      let tempFilter = { ...updatedFilter[idx] };
      tempFilter.value = value;
      updatedFilter[idx] = { ...tempFilter };
      return [...updatedFilter];
    });
  };
  const handleReset = () => {
    setFilters(filterData);
    setTableData([...initialTableData]);
  };
  const handleSave = () => {
    const updatedTableData = [
      ...initialTableData.filter((row, idx) => {
        let didMatch = false;

        if (
          row[filters[0]?.feildName]
            .toString()
            .toLowerCase()
            .includes(filters[0]?.value.toLocaleLowerCase())
        ) {
          didMatch = true;
        }
        return didMatch;
      }),
    ];
    setTableData([...updatedTableData]);
  };

  function renderFilter(filter, idx, updateFilter) {
    switch (filter?.filterType) {
      case "input":
        return (
          <InputFilter
            filter={filter}
            key={idx}
            updateFilter={(idx, value) => updateFilter(idx, value)}
            idx={idx}
          />
        );
      case "singleSelect":
        return (
          <SingleSelectFIlter
            filter={filter}
            key={idx}
            updateFilter={(idx, value) => updateFilter(idx, value)}
            idx={idx}
          />
        );
      default:
        return <></>;
    }
  }
  return (
    <>
      
      <div className="flex flex-col gap-2 p-2 overflow-scroll w-full">
        {filters?.map((filter, idx) => {
          return renderFilter(filter, idx, updateFilter);
        })}
        <div className="flex gap-2 self-end">
          <button
            className="px-2 p-1 bg-gray-400 rounded-md"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="px-2 p-1 bg-gray-500 rounded-md"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default DataFilter;
