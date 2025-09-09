import React from "react";

const MultiSelectRadio = ({ list = [], checked, onChange }) => {
  return (
    <div className="flex items-center self-center justify-start">
      {list.map((value, idx) => {
        let rounded =
          idx === 0
            ? "rounded-s-lg"
            : idx === list.length - 1
            ? "rounded-e-lg"
            : "";
        return (
          <div key={idx} className="w-full">
            <input
              type="radio"
              name="tab"
              id={value}
              value={value}
              checked={checked === value}
              onChange={() => onChange(value)}
              className="hidden peer"
            />
            <label
              htmlFor={value}
              className={`px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-400 
                hover:bg-gray-300 peer-checked:bg-primaryLight cursor-pointer peer-checked:text-pop 
                capitalize ${rounded}`}
            >
              {value}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default MultiSelectRadio;