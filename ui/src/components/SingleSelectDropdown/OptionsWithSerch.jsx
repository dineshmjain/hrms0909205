import React, { useEffect, useState } from "react";
import {
  HiMiniMagnifyingGlass,
  HiMiniXMark,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
} from "react-icons/hi2";
import { IoMdAdd } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

const OptionsWithSerch = ({
  isOpen,
  initialData,
  showSerch,
  handleClick,
  extras,
  addRoute,
  inputName,
  feildName = "Name",
}) => {
  const [data, setData] = useState([]);
  const [serch, setSerch] = useState("");
  const nav = useNavigate();
  useEffect(() => {
    setData([...initialData]);
  }, [initialData]);

 useEffect(() => {
  const normalizedSearch = serch.trim().toLowerCase();

  if (normalizedSearch.length) {
    const filtered = initialData?.filter((item) => {
      const value = item?.[feildName];

      if (value && typeof value === "object") {
        // Combine firstName and lastName if available
        const fullName = `${value.firstName || ""} ${value.lastName || ""}`.trim().toLowerCase();
        return fullName.includes(normalizedSearch);
      }

      // Handle string or number values
      return String(value || "")
        .toLowerCase()
        .includes(normalizedSearch);
    });

    setData(filtered);
  } else {
    setData([...initialData]);
  }
}, [serch, initialData, feildName]);


  return (
    <div
      // className={`absolute top-[110%] shadow-sm left-0 z-30 bg-white  flex flex-col rounded-md bg-gray-50 text-gray-800  shadow-gray-800 w-full gap-2 transition-all ease-in-out duration-[.3s] overflow-hidden ${
      //   isOpen ? `max-h-[300px] gap-2 p-2 border-gray-500 border ` : "h-[0px] "
      // } `}
         className={`absolute top-[110%] max-h-[400px] left-0 z-30 flex flex-col px-1 rounded-md bg-background w-full gap-2 transition-all ease-in-out overflow-y-hidden duration-[.3s] ${
          isOpen ? `p-1 shadow-dropdown` : "h-[0px] p-0"
        }`}
    >
      {(showSerch || addRoute) && (
        <div className="w-full">
          {showSerch && (
            <div className="w-full rounded-md text-gray-800">
              <input
                type="text"
                className="p-1 px-2 border border-gray-400 rounded-md text-sm mb-2 w-full"
                placeholder="Search..."
                value={serch}
                onChange={(e) => setSerch(e.target.value)}
              />
              {/* {serch ? (
                <HiMiniXMark
                  className="w-6 h-6 maxsm:w-5 maxsm:h-5 cursor-pointer"
                  onClick={() => setSerch("")}
                />
              ) : (
                <HiMiniMagnifyingGlass className="w-6 h-6 maxsm:w-5 maxsm:h-5" />
              )} */}
            </div>
          )}
          {addRoute && (
            <Link
              className={` p-1 px-2 rounded-md border cursor-pointer transition-colors ease-in-out duration-100 border-gray-500 flex gap-2   items-center justify-center w-fit hover:bg-gray-500 hover:text-gray-100 ${
                showSerch || `w-full`
              }`}
              to={addRoute}
              target="_blank"
            >
              {" "}
              <IoMdAdd className="min-w-5 min-h-5 " />
              {!showSerch && (
                <span className="text-sm font-semibold">{`Add New`}</span>
              )}
            </Link>
          )}
        </div>
      )}
     <ul className="flex flex-col gap-1 max-h-[200px] overflow-y-scroll scrolls">
  {data?.map((route, idx) => {
    const label =
      typeof route?.[feildName] === "object" && route?.[feildName] !== null
        ? `${route?.[feildName]?.firstName || ""} ${route?.[feildName]?.lastName || ""}`.trim()
        : route?.[feildName];

    const extraLabel =
      extras && typeof route?.[extras] === "object"
        ? JSON.stringify(route?.[extras])
        : route?.[extras];

    return (
      <li
      className={`flex items-center gap-2 cursor-pointer border border-gray-100 bg-white px-1 py-2 hover:bg-primaryMedium hover:text-black`}
        // className="bg-white-100 cursor-pointer text-sm hover:bg-gray-300 flex gap-2 p-1 px-2 maxsm:w-full rounded-md border border-gray-500 text-gray-900 items-center"
        key={idx}
        onClick={() => {
          console.log('OptionsWithSerch clicked:', route);
          handleClick(route);
        }}
      >
        {label}
        {extraLabel && (
          <span
            className="text-sm font-medium text-gray-600 text-nowrap truncate"
            data-tooltip-id="my-tooltip"
            data-tooltip-content={` ${extraLabel}`}
            data-tooltip-class-name="z-10"
          >
            {" "}
            ({extraLabel})
          </span>
        )}
      </li>
    );
  })}
  {data?.length === 0 && (
    <span className="px-2 font-semibold text-center"> No Data Found </span>
  )}
</ul>

    </div>
  );
};

export default OptionsWithSerch;
