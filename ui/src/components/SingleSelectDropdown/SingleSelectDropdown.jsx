import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import OptionsWithSerch from "./OptionsWithSerch";
import { toast } from "react-hot-toast";

const SingleSelectDropdown = ({
  inputName = "",
  listData = [],
  selectedOption,
  handleClick,
  selectedOptionDependency,
  feildName = "name",
  extras,
  showTip = true,
  showSerch = true,
  globalCss = "",
  customLabelCss = {},
  handleError,
  tailwindCss = "",
  hideLabel = false,
  inputError,
  negativeValue = "",
  addRoute,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const findName = (selectedVal, name) => {
  const match = listData.find(
    (item) => item[selectedOptionDependency] === selectedVal
  );

  if (!match) return null;

  const value = match[name];

  // If value is object like { firstName, lastName }
  if (typeof value === "object" && value !== null) {
    const { firstName = "", lastName = "" } = value;
    return `${firstName} ${lastName}`.trim();
  }

  // Otherwise return primitive value
  return value;
};


  const handleToggle = () => {
    if (!handleError) {
      setIsOpen((prev) => !prev);
    } else {
      if (handleError["triggerOn"]) {
        setIsOpen((prev) => !prev);
      } else {
        toast.error(handleError["error"]);
      }
    }
  };

const renderSelectedValue = () => {
  if (selectedOption !== negativeValue && selectedOption) {
    if (selectedOptionDependency) {
      const label = findName(selectedOption, feildName);
      const extra = extras ? findName(selectedOption, extras) : null;

      return (
        <>
          <span>{typeof label === "object" ? "" : label}</span>
          {extra && typeof extra !== "object" && (
            <span className="text-sm text-gray-700"> ({extra})</span>
          )}
        </>
      );
    }
    return selectedOption;
  }
  return inputName;
};


  return (
    <div
      className={`flex flex-col  maxsm:w-full relative gap-2 text-sm ${globalCss}`}
      ref={dropdownRef}
    >
      {!hideLabel && inputName && (
        <label
          htmlFor={inputName}
          className="font-medium text-sm text-gray-900 capitalize"
          style={customLabelCss}
        >
          {inputName}:
        </label>
      )}

      <button
        type="button"
        name={inputName}
        onClick={handleToggle}
        disabled={disabled}
        className={` p-2.5 maxsm:w-full  flex items-center justify-between transition-all relative rounded-md
         ${tailwindCss
            ?.includes("bg-")
            ? tailwindCss
            : "bg-white"
          }
         ${disabled
            ? "bg-white border-white cursor-not-allowed shadow-none border-none"
            : tailwindCss?.includes("bg-")
            ? tailwindCss
            : "bg-white"}
         ${!disabled
            ? "cursor-pointer border shadow-sm"
            : ""}
         ${inputError?.error
            ? "border-1 border-red-800"
            : isOpen
            ? "border-gray-800"
            : "border-gray-400"
          } ${tailwindCss}`}
      >
        {showTip && !disabled && (isOpen || selectedOption) && (
          <span className="absolute -top-[10px] left-3 px-1 text-[11px] text-gray-600 capitalize bg-white">
            {inputName}
          </span>
        )}

        <span
          className={`truncate text-start w-[200px] ${selectedOption ? "text-gray-800" : "text-gray-600 capitalize"
            }`}
        >
          {renderSelectedValue()}
        </span>

        {!disabled && (<IoIosArrowDown
          className={`w-4 h-4 transform transition-transform ${isOpen ? "rotate-180" : ""
            }`}
        />)}
      </button>

      {!disabled && (
        <OptionsWithSerch
          extras={extras}
          isOpen={isOpen}
          showSerch={showSerch}
          feildName={feildName}
          initialData={listData}
          addRoute={addRoute}
          inputName={inputName}
          handleClick={(data) => {
            handleClick(data);
            setIsOpen(false);
          }}
        />
      )}

      {inputError?.error && (
        <span className="text-red-700 text-sm font-medium -mt-[5px]">
          {inputError?.message}
        </span>
      )}
    </div>
  );
};

export default SingleSelectDropdown;