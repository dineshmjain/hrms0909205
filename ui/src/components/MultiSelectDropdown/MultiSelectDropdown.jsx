import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown, IoMdAdd } from "react-icons/io";
import { RiCheckboxFill } from "react-icons/ri";
import { MdOutlineIndeterminateCheckBox } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";

const MultiSelectDropdown = ({
  data = [],
  FeildName = "name",
  InputName,
  handleChange,
  type,
  Dependency = FeildName,
  tailwindCss,
  addRoute,
  selectedData = [],
  setFieldName,
  hideLabel = false,
  disabled = false,
  setSelectedData,
  inputError,
  afterChange,
  onClose,
  showTip = true,
  selectType = "multiple", // "single" or "multiple"
  enableSearch = true, // NEW PROP to toggle search
}) => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [wasChanged, setWasChanged] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const { pathname } = useLocation()
  const pathsWithoutStyling = ['/holidays/add', '/holidays/edit', '/shift/list']
  const [dropUp, setDropUp] = useState(false);

  useEffect(() => {
  if (isOpen && dropdownRef.current) {
    const rect = dropdownRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const dropdownHeight = 300; // or whatever max height you use

    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setDropUp(true);
    } else {
      setDropUp(false);
    }
  }
}, [isOpen]);


  const nav = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen && onClose) {
      onClose(wasChanged);
      setWasChanged(false);
      setSearchQuery(""); // Clear search on close
    }
  }, [isOpen]);

  const isAllSelected =
    Array.isArray(selectedData) && selectedData?.length === data?.length;

  const dataToShow =
    selectType === "single"
      ? type === "object"
        ? Object.values(
          data.find((d) => d?.[Dependency] === selectedData)?.[FeildName] || {}
        ).join(" ")
        : data.find((d) => d?.[Dependency] === selectedData)?.[FeildName] || InputName
      : data
        .filter((sub) => Array.isArray(selectedData) && selectedData.includes(sub?.[Dependency]))
        .map((sub) =>
          type === "object"
            ? Object.values(sub?.[FeildName] || {})?.join(" ")
            : sub?.[FeildName]
        )
        .join(" , ");

  const onChange = (e, data, subIdx) => {
    const { checked } = e.target;
    setWasChanged(true);
    const currentSelectedData = Array.isArray(selectedData) ? selectedData : [];

    if (selectType === "single") {
      if (!setFieldName) {
        setSelectedData(data?.[Dependency]);
      } else {
        setSelectedData((prev) => ({
          ...prev,
          [setFieldName]: data?.[Dependency],
        }));
      }
    } else {
      if (checked) {
        if (!setFieldName) {
          setSelectedData([...currentSelectedData, data?.[Dependency]]);
        } else {
          setSelectedData((prev) => ({
            ...prev,
            [setFieldName]: [...currentSelectedData, data?.[Dependency]],
          }));
        }
      } else {
        if (!setFieldName) {
          setSelectedData((prev) =>
            prev?.filter((d) => d !== data?.[Dependency])
          );
        } else {
          setSelectedData((prev) => {
            const updated = prev?.[setFieldName]?.filter(
              (d) => d !== data?.[Dependency]
            );
            return { ...prev, [setFieldName]: updated };
          });
        }
      }
    }

    afterChange && afterChange(e, data, subIdx);
  };

  const handleSelectAll = () => {
    const allData = data.map((item) => item[Dependency]);
    if (!setFieldName) return setSelectedData(allData);
    setSelectedData((prev) => ({
      ...prev,
      [setFieldName]: allData,
    }));
  };

  const handleUnSelectAll = () => {
    if (!setFieldName) return setSelectedData([]);
    setSelectedData((prev) => ({
      ...prev,
      [setFieldName]: [],
    }));
  };

  // Filter data based on search
  const filteredData = data?.filter((item) => {
    const label =
      type === "object"
        ? Object.values(item?.[FeildName] || {})?.join(" ")
        : item?.[FeildName];
    return label?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div
      className={`flex flex-col gap-2 ${pathsWithoutStyling.includes(pathname) ? '' : 'w-[250px]'}  maxsm:w-full relative text-sm h-min`}
      ref={dropdownRef}
    >
      {InputName && !hideLabel && (
        <label
          htmlFor="route"
          className="font-medium capitalize text-gray-800"
        >
          {InputName}
        </label>
      )}
      <div
        name="Feature"
        className={`relative h-[40px] px-3 maxsm:w-full select-none rounded-md border cursor-pointer bg-white flex font-normal items-center justify-between ${tailwindCss} ${inputError?.error
          ? `outline-double outline-red-800`
          : isOpen
            ? `border-gray-700`
            : `border-gray-400`
          }`}
        onClick={() => {
          !disabled && setIsOpen((prev) => !prev);
        }}
      >
        {showTip && (isOpen || selectedData?.length > 0 || selectedData) && (

          <span className="absolute -top-[8px] left-3 px-1 text-[11px] text-gray-600 capitalize bg-white">
            {InputName}
          </span>
         )} 

        <div
          className={`max-w-[250px] overflow-hidden truncate ${
            selectedData?.length === 0
              ? `text-gray-600`
              : `text-gray-900`
          }`}
        >
          {(selectedData?.length === 0 && InputName) || dataToShow}
        </div>

        <IoIosArrowDown
          className={`min-w-4 min-h-4 transition-all ease-in-out duration-[.3s] ${isOpen && "rotate-180"
            }`}
        />
      </div>

      {/* Dropdown */}
      <div
        className={`absolute z-30 flex flex-col px-1 rounded-md bg-background w-full gap-2 transition-all ease-in-out overflow-y-hidden duration-[.3s]
          ${isOpen ? `p-1 shadow-dropdown` : "h-[0px] p-0"}
          ${dropUp ? "bottom-[110%]" : "top-[110%]"}
        `}
      >

        {/* Search Input */}
        {isOpen && enableSearch && (
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-1 px-2 border border-gray-400 rounded-md text-sm mb-2"
          />
        )}

        <div className="flex gap-2 w-full">
          {selectType === "multiple" && (
            <span
              className="hover:underline cursor-pointer shadow-md bg-white rounded-md p-1 px-2 text-center w-full flex gap-2 items-center justify-center py-2"
              onClick={() =>
                isAllSelected ? handleUnSelectAll() : handleSelectAll()
              }
            >
              {isAllSelected ? (
                <MdOutlineIndeterminateCheckBox className="w-5 h-5" />
              ) : (
                <RiCheckboxFill className="w-5 h-5" />
              )}
              {isAllSelected ? `Unselect` : `Select`} all
            </span>
          )}
          {addRoute && (
            <Link
              className="p-1 px-2 rounded-md border cursor-pointer transition-colors ease-in-out duration-100 border-gray-500 flex gap-2 items-center justify-center w-fit hover:bg-gray-500 hover:text-gray-100"
              to={addRoute}
              target="_blank"
            >
              <IoMdAdd className="min-w-5 min-h-5" />
            </Link>
          )}
        </div>

        <div className="flex flex-col max-h-[150px] gap-1 w-full overflow-y-scroll scrolls">
          {filteredData?.map((sub, subIdx) => {
            // const isSelected =
            //   selectType === "single"
            //     ? selectedData === sub?.[Dependency]
            //     : selectedData?.includes(sub?.[Dependency]);
            const isSelected = selectType === "single"
              ? selectedData === sub?.[Dependency]
              : Array.isArray(selectedData) && selectedData?.includes(sub?.[Dependency]);


            return (
              <label
                htmlFor={`${sub?.[FeildName]}-${subIdx}`}
                className={`flex items-center gap-2 cursor-pointer border border-gray-100 bg-white px-1 py-2 ${isSelected ? `bg-primary border-b-primary` : `border-b-transparent`} hover:bg-primaryMedium hover:text-black`}
                key={subIdx}
              >
                <input
                  type={selectType === "single" ? "radio" : "checkbox"}
                  name={selectType === "single" ? "SingleSelectGroup" : "IsEnabled"}
                  className="ui-checkbox "
                  id={`${sub?.[FeildName]}-${subIdx}`}
                  checked={isSelected}
                  onChange={(e) =>
                    handleChange
                      ? handleChange(e, sub, subIdx)
                      : onChange(e, sub, subIdx)
                      //  ? (() => {
                      //   handleChange(e, sub, subIdx);
                      //   setIsOpen(false);
                      // })()
                      // : (() => {onChange(e, sub, subIdx)
                      // setIsOpen(false);
                      // })()
                  }
                />
                {type === "object"
                  ? Object?.values(sub?.[FeildName] || [])?.join(" ")
                  : sub?.[FeildName]}
              </label>
            );
          })}
          {filteredData?.length === 0 && (
            <span className="px-2 font-semibold text-gray-600 text-center">
              No Data Found
            </span>
          )}
        </div>
      </div>

      {inputError?.error && (
        <span className="text-red-700 -mt-[5px]">{inputError?.message}</span>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
