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
  feildName = "Name",
}) => {
  const [data, setData] = useState([]);
  const [serch, setSerch] = useState("");
  const nav = useNavigate();
  useEffect(() => {
    setData([...initialData]);
  }, [initialData]);

  useEffect(() => {
    if (serch.length) {
      setData((prev) => {
        const temp = [
          ...initialData?.filter((tempData) => {
            if (
              tempData[feildName].toLowerCase().includes(serch.toLowerCase())
            ) {
              return tempData;
            }
          }),
        ];

        return [...temp];
      });
    } else {
      setData([...initialData]);
    }
  }, [serch]);

  return (
    <div
      className={`absolute top-[110%] shadow-sm left-0 z-40  flex flex-col rounded-md bg-gray-50 text-gray-800  shadow-gray-800 w-full gap-2 transition-all ease-in-out duration-[.3s] overflow-hidden ${
        isOpen ? `max-h-[300px] gap-2 p-2 border-gray-500 border ` : "h-[0px] "
      } `}
    >
      {(showSerch || addRoute) && (
        <div className="w-full flex gap-2">
          {showSerch && (
            <div className="w-full p-1 px-2 rounded-md bg-background text-gray-800 border-gray-500 border flex items-center justify-between">
              <input
                type="text"
                className="w-full outline-none bg-white"
                placeholder={`Search from list`}
                value={serch}
                onChange={(e) => setSerch(e.target.value)}
              />
              {serch ? (
                <HiMiniXMark
                  className="w-6 h-6 maxsm:w-5 maxsm:h-5 cursor-pointer"
                  onClick={() => setSerch("")}
                />
              ) : (
                <HiMiniMagnifyingGlass className="w-6 h-6 maxsm:w-5 maxsm:h-5" />
              )}
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
      <ul className="flex flex-col gap-2 max-h-[200px]  overflow-y-scroll  scrolls  ">
        {data?.map((route, idx) => {
          return (
            <li
              className=" bg-white-100  cursor-pointer text-sm hover:font-bold  flex gap-2  p-1 px-2   maxsm:w-full rounded-md border border-gray-500 text-gray-900 items-center"
              key={idx}
              onClick={() => handleClick(route)}
            >
              {route[feildName]}
              {extras && route[extras] && (
                <span
                  className="text-sm font-medium text-gray-600 text-nowrap truncate"
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content={` ${route?.[extras] || ``}`}
                  data-tooltip-class-name="z-10"
                >
                  {" "}
                  ({route[extras]})
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OptionsWithSerch;
