import React, { useEffect, useState } from "react";

const InputFilter = ({ filter, updateFilter, idx }) => {
  
  
  return (
    <div className="flex flex-col gap-1 text-sm">
      <label htmlFor="">
        {filter?.DisplayName||filter?.feildName[0].toUpperCase() + filter?.feildName.slice(1)}
      </label>
      <input
        type="text"
        value={filter?.value}
        className="px-2 p-1 rounded-sm text-black bg-gray-200 placeholder-gray-800  "
        placeholder={`Search ${filter?.DisplayName||filter?.feildName}`}
        onChange={(e) => updateFilter(idx, e.target.value)}
      />
    </div>
  );
};

export default InputFilter;
