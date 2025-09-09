import React from "react";

const SingleSelectFIlter = ({ filter, updateFilter, idx }) => {
  return (
    <div className="flex flex-col gap-1 text-sm w-full">
      <label htmlFor="">
        {filter?.DisplayName ||
          filter?.feildName[0].toUpperCase() + filter?.feildName.slice(1)}
      </label>
      <SingleSelectDropdown
        listData={filter?.list}
        tailwindCss={'w-full bg-gray-200'}

        handleClick={(e) => updateFilter(idx, e.target.value)}
      />
      
    </div>
  );
};

export default SingleSelectFIlter;
