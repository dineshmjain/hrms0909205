import React, { useEffect, useRef, useState } from "react";
import { IoIosCheckbox } from "react-icons/io";
import { IoFilter, IoReload } from "react-icons/io5";
import { MdFilterAlt } from "react-icons/md";
import HeaderFilter from "./FilterComponents/HeaderFilter";
import DataFilter from "./FilterComponents/DataFilter";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { checkDataFucntion } from "./FilterComponents/dataTypeSerchValidations";
import { FaCheckSquare, FaPen } from "react-icons/fa";
import {
  PiArrowClockwise,
  PiColumnsPlusRight,
  PiFileCsv,
  PiXBold,
} from "react-icons/pi";
import TootlipMaterial from "../TooltipMaterial/TooltipMaterial";

const TableFilters = ({
  paginationProps,
  initialProps,
  setTableHeader,
  tableHeader,
  initialHeaders,
  initialTableData,
  setTableData,
  filterData,
  labels,
  initialChildHeaders,
  childHeader,
  setChildHeader,
  childLabels,
  childerenRows,
  exportToCSV,
  globalSerch,
  setGlobalSerch,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState(0);
  const filterRef = useRef();

  const handleClickOutside = (event) => {
    if (filterRef.current && !filterRef.current.contains(event.target)) {
      setShowFilter(false);
    }
  };

  const clearSearch = () => {
    setGlobalSerch("");
    setTableData([...initialTableData]);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchByFrontend = () => {
    if (globalSerch.length > 0) {
      const updatedTableData = [
        ...initialTableData.filter((row, idx) => {
          let didMatch = false;
          tableHeader?.map((feild) => {
            if (checkDataFucntion(labels, row, feild, globalSerch)) {
              didMatch = true;
            }
          });
          if (row[childerenRows?.name]) {
            row[childerenRows?.name]?.map((child) => {
              return childHeader?.map((cFeild) => {
                if (
                  checkDataFucntion(
                    childerenRows?.labels,
                    child,
                    cFeild,
                    globalSerch
                  )
                ) {
                  didMatch = true;
                }
              });
            });
          }
          return didMatch;
        }),
      ];

      setTableData([...updatedTableData]);
    } else {
      setTableData([...initialTableData]);
    }
  };

  useEffect(() => {
    if (!paginationProps?.onDataChange) {
      handleSearchByFrontend();
    }
  }, [globalSerch]);
  return (
    <div className="flex justify-between w-full items-center  gap-2 select-none bg-white p-2 rounded-t-md shadow-hrms">
      <div
        className="px-3 p-2 rounded-full  maxsm:flex-1  bg-white  text-sm flex items-center w-[400px]  
      border border-gray-500"
      >
        <input
          type="text"
          value={globalSerch}
          className=" bg-transparent focus:outline-none placeholder-gray-400 flex-1"
          placeholder={`Search`}
          onChange={(e) => setGlobalSerch(e.target.value)}
        />
        {globalSerch.length == 0 ? (
          <HiMagnifyingGlass className="w-4 h-4 cursor-pointer text-gray-500 " />
        ) : (
          <PiXBold
            className="w-4 h-4 cursor-pointer text-gray-500 "
            onClick={clearSearch}
          />
        )}
      </div>
      <div className="flex items-center gap-2 ">
        {paginationProps?.onDataChange && (
          <TootlipMaterial content={"Reload Data"} placement="top">
            <div
              className={`flex items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-popLight shadow-none text-popfont-medium px-2 py-2 rounded-md hover:bg-popMedium hover:shadow-none text-xs `}
              onClick={() =>
                paginationProps?.onDataChange(
                  paginationProps?.pageNo || 1,
                  paginationProps?.limit || 10,
                  globalSerch
                )
              }
            >
              <span className="maxsm:hidden"> Reload</span>{" "}
              <PiArrowClockwise className={`w-6 h-6 cursor-pointer `} />
            </div>
          </TootlipMaterial>
        )}
        <TootlipMaterial content={"Export to CSV"} placement="top">
          <div
            className="flex items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-popLight shadow-none text-popfont-medium px-2 py-2 rounded-md hover:bg-popMedium hover:shadow-none text-xs"
            onClick={exportToCSV}
          >
            <span className="maxsm:hidden"> Export CSV</span>{" "}
            <PiFileCsv className="w-6 h-6 cursor-pointer" />
          </div>
        </TootlipMaterial>
        <div
          className="flex items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-popLight shadow-none text-popfont-medium px-2 py-2 rounded-md hover:bg-popMedium hover:shadow-none text-xs"
          onClick={() => setShowFilter((prev) => !prev)}
        >
          <span className="maxsm:hidden">Columns</span>
          <PiColumnsPlusRight className="w-6 h-6 cursor-pointer" />
        </div>
      </div>

      <div
        className={`fixed sidebar  overflow-y-scroll scrolls z-30 min-w-[300px] rounded-lg  maxsm:min-w-[300px] shadow-hrms   transition-all ease-in-out duration-[.3s] top-[48px]  ${
          showFilter ? `right-[-10px]` : `right-[-1000px]`
        } rounded-sm bg-slate-700 z-10 flex overflow-hidden`}
        ref={filterRef}
      >
        {/* left tab */}
        <div className=" bg-gray-900 min-w-[10px] min-h-full flex items-center   flex-col gap-3 py-1 ">
          {/* <FaCheckSquare
            className={` w-5 h-5  text-white cursor-pointer    ${
              filterType == 0 && "text-white-100"
            }`}
            onClick={() => setFilterType(0)}
          /> */}

          {filterData && (
            <MdFilterAlt
              className={` w-6 h-6   text-slate-300 cursor-pointer    ${
                filterType == 1 && "text-slate-100"
              }`}
              onClick={() => setFilterType(1)}
            />
          )}
        </div>
        {/* right tab */}
        <div className="flex-1 bg-gray-200   flex flex-col  divide-y   divide-gray-400 ">
          <div className="flex w-full justify-between items-center px-2">
            <p className="p-1 px-2 font-semibold ">
              {filterType ? `Data` : `Header`} Filter
            </p>
            <HiXMark
              className="w-5 h-5 cursor-pointer"
              onClick={() => setShowFilter(false)}
            />
          </div>
          {filterType == 0 ? (
            <HeaderFilter
              initialHeaders={initialHeaders}
              tableHeader={tableHeader}
              setTableHeader={setTableHeader}
              labels={labels}
              initialChildHeaders={initialChildHeaders}
              childHeader={childHeader}
              setChildHeader={setChildHeader}
              childLabels={childLabels}
              setShowFilter={setShowFilter}
            />
          ) : (
            <DataFilter
              filterData={filterData}
              setTableData={setTableData}
              initialTableData={initialTableData}
              setShowFilter={setShowFilter}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TableFilters;
