import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { LuSkipBack, LuSkipForward } from "react-icons/lu";
import {
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiArrowUnsorted,
} from "react-icons/ti";
import { toast } from "react-hot-toast";
import ChildrenTable from "./ChildrenTable";
import { FaDownload, FaLock } from "react-icons/fa6";

import { dateSort, normalSort, objectSort } from "./sortingFucntions";

import GetTDbyType from "./CustomTableData/GetTDbyType";
import TooltipMaterial from "../TooltipMaterial/TooltipMaterial";
import { set } from "date-fns/set";
import TableSkeleton from "./TableSkeleton";

const TableWithPagination = ({
  tableData,
  setTableData,
  tableHeader,
  initialTableData,
  childerenRows,
  childHeader,
  actions = null,
  pagination = true,
  status,
  labels,
  isLoading,
  hideSlNo = false,
  validate = false,
  infiniteScroll,
  handlleInfiniteScroll,
  onRowClick,
  lockedIndex,
  setLockedIndex,
  tableRef,
  uniqueRowKey = "_id",
  paginationProps,
  initialProps,
  globalSerch,
  isFirstRender,
}) => {
  const [numberOfRowsPerPage, setNumberOfRowsPerPage] = useState(
    paginationProps?.limit || 10
  );
  const [activePage, setActivePage] = useState(
    paginationProps?.pageNo - 1 || 0
  );
  const [totalRecords, setTotalRecords] = useState(tableData?.length);
  const [pageData, setPageData] = useState(
    tableData?.slice(0, numberOfRowsPerPage)
  );
  const [NumberOfPages, setNumberOfPages] = useState(1);
  const [sortData, setSortData] = useState({});
  const [inputPageValue, setInputPageValue] = useState(0);
  const lastRowRef = useRef(null);

  const sortedTableData = useMemo(() => {
    let temp = [...initialTableData];

    if (Object?.keys(sortData)?.length === 0) return temp;

    const fieldType = labels?.[sortData?.name]?.type;

    if (fieldType === "object") {
      const ObjName = labels[sortData?.name]?.objectName;
      return objectSort(temp, sortData, labels, sortData.name, ObjName);
    }

    if (fieldType === "date" || fieldType === "time") {
      return dateSort(temp, sortData);
    }

    return normalSort(temp, sortData);
  }, [initialTableData, sortData]);

  useEffect(() => {
    setTableData([...sortedTableData]);
  }, [sortedTableData]);

  function handleSort(name) {
    if (sortData?.name == name) {
      if (sortData?.direction == 1) {
        setSortData({ name: name, direction: 0 });
      } else if (sortData?.direction == 0) {
        setSortData({});
      }
    } else {
      setSortData({ name: name, direction: 1 });
    }
  }

  // useEffect for frontend pagination
  useEffect(() => {
    setInputPageValue(activePage + 1);
    //if pagintaion disbaled show all data
    if (!pagination) {
      return setPageData(tableData);
    }
    // if handled by frontend then trim as per rows and pageNumber
    if (!paginationProps?.onDataChange) {
      setPageData(() => {
        const temp = tableData?.slice(
          activePage * numberOfRowsPerPage,
          activePage * numberOfRowsPerPage + numberOfRowsPerPage
        );
        return [...temp];
      });
    }
    if (totalRecords == 0 || numberOfRowsPerPage == 0) {
      return setNumberOfPages(1);
    }
    setNumberOfPages(Math.ceil(totalRecords / numberOfRowsPerPage));
  }, [activePage, numberOfRowsPerPage, tableData, initialTableData]);

  // // useEffect for backend pagination
  useEffect(() => {
    if (pagination && paginationProps?.onDataChange) {
      paginationProps?.onDataChange(
        activePage + 1,
        numberOfRowsPerPage,
        globalSerch
      );
    }
  }, [activePage, numberOfRowsPerPage]);

  // search handler
  useEffect(() => {
    // If search is handled by frontend
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const debounceTimeout = setTimeout(() => {
      if (pagination && paginationProps?.onDataChange) {
        if (activePage == 0) {
          paginationProps?.onDataChange(
            activePage + 1,
            numberOfRowsPerPage,
            globalSerch
          );
        } else {
          setActivePage(initialProps?.activePage);
        }
      }
    }, 500);
    return () => clearTimeout(debounceTimeout);
  }, [globalSerch]);

  // useEffect for backend pagination to set pageData & no of pages
  useEffect(() => {
    if (pagination && paginationProps?.totalRecord >= 0) {
      setPageData(tableData);
      setNumberOfPages(
        Math.ceil(paginationProps?.totalRecord / numberOfRowsPerPage)
      );
    }
  }, [tableData, initialTableData]);

  useEffect(() => {
    if (paginationProps?.pageNo) {
      if (paginationProps?.pageNo != activePage + 1) {
        setActivePage(paginationProps?.pageNo - 1);
      }
    }
  }, [paginationProps?.pageNo]);

  useEffect(() => {
    if (paginationProps?.limit) {
      if (paginationProps?.limit != numberOfRowsPerPage) {
        setNumberOfRowsPerPage(paginationProps?.limit);
      }
    }
  }, [paginationProps?.limit]);

  useEffect(() => {
    setTotalRecords(paginationProps?.totalRecord ?? tableData?.length);
  }, [paginationProps?.totalRecord, tableData]);

  //code to check if last row is visible or not and also set the new last row as last row ref
  // useEffect(() => {
  //   if (infiniteScroll) {
  //     const observer = new IntersectionObserver(
  //       (entries) => {
  //         const lastRow = entries[0];
  //         if (lastRow.isIntersecting) {
  //           console.log("Last row is visible");
  //           if (handlleInfiniteScroll) {
  //             handlleInfiniteScroll(); // Load more data
  //           }
  //         }
  //       },
  //       {
  //         root: null, // Use the viewport as the root
  //         threshold: 0.1, // Trigger when 10% of the last row is visible
  //       }
  //     );

  //     const currentLastRow = lastRowRef.current;

  //     if (currentLastRow) {
  //       observer.observe(currentLastRow);
  //     }

  //     // Cleanup observer when effect re-runs
  //     return () => {
  //       if (currentLastRow) {
  //         observer.unobserve(currentLastRow);
  //       }
  //     };
  //   }
  // }, [infiniteScroll]); // Re-run when tableData changes

  let validateBg = "";

  const handleLockClicked = (e, header) => {
    e.stopPropagation();
    const isLocked = lockedIndex?.includes(header);
    setLockedIndex((prev) => {
      if (isLocked) {
        return prev.filter((item) => item !== header);
      } else {
        return [...prev, header];
      }
    });
  };


  let totalCols = tableHeader?.length;
  totalCols += (actions ? 1 : 0) + (!hideSlNo ? 1 : 0);
  return (
    <div className="flex w-full flex-col items-start  gap-4 h-full justify-between 0">
      <div className="relative overflow-auto w-full   rounded-b-md shadow-hrms bg-tableBg group-hover:bg-tableBgHover  max-h-[500px] scrolls  ">
        <table
          className="w-full text-sm text-left rtl:text-right text-gray-900 relative"
          ref={tableRef}
        >
          <thead className="text-sm text-center sticky top-0 right-0 z-20 bg-popLight text-custom-head font-medium border-b border-gray-500">
            <tr className=" select-none">
              {!hideSlNo && (
                <th
                  scope="col"
                  className=" px-6 py-3 font-medium "
                  key={"slno"}
                >
                  SlNo
                </th>
              )}
              {tableHeader?.map((header, idx) => {
                const isLocked = lockedIndex?.includes(header);
                const LockedStyle = isLocked
                  ? `bg-primary text-gray-100 sticky left-0 z-10 right-0`
                  : ``;

                return (
                  header && (
                    <th
                      scope="col"
                      key={header}
                      className={` font-medium  hover:bg-primary hover:text-white  ${LockedStyle} `}
                    >
                      <div
                        className="w-full flex items-center px-2 py-3 gap-2 group text-nowrap justify-between cursor-pointer"
                        onClick={() => handleSort(header)}
                      >
                        <TooltipMaterial
                          content={isLocked ? "Unlock Column" : "Lock Column"}
                        >
                          <div
                            className=""
                            onClick={(e) => handleLockClicked(e, header)}
                          >
                            <FaLock
                              className={`w-3 h-3 opacity-0  ${
                                isLocked
                                  ? `opacity-100 `
                                  : `group-hover:opacity-50 maxsm:opacity-30`
                              }`}
                            />
                          </div>
                        </TooltipMaterial>
                        <span className="tracking-widest w-min truncate">
                          {labels
                            ? labels[header]?.DisplayName
                            : header?.split("_").join(" ")}
                        </span>
                        {sortData?.name == header ? (
                          sortData?.direction == 1 ? (
                            <TiArrowSortedUp className="w-4 h-4 " />
                          ) : (
                            <TiArrowSortedDown className="w-4 h-4 " />
                          )
                        ) : (
                          <TiArrowUnsorted className="w-4 h-4 " />
                        )}
                      </div>
                    </th>
                  )
                );
              })}
              {childHeader?.map(
                (header, idx) =>
                  header && (
                    <th scope="col" className=" " key={idx}>
                      <div className="w-full flex items-center px-6 py-3 text-nowrap justify-center cursor-pointer font-medium ">
                        <span>
                          {childerenRows?.labels
                            ? childerenRows?.labels[header]?.DisplayName
                            : header?.split("_").join(" ")}
                        </span>
                      </div>
                    </th>
                  )
              )}
              {actions && (
                <th
                  scope="col"
                  className="px-6 py-3 text-nowrap bg-popLight text-custom-head font-medium hover:bg-primary hover:text-white"
                  key={`actions`}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          {childerenRows ? (
            <ChildrenTable
              numberOfRowsPerPage={numberOfRowsPerPage}
              activePage={activePage}
              pageData={pageData}
              tableHeader={tableHeader}
              status={status}
              labels={labels}
              childHeader={childHeader}
              childerenRows={childerenRows}
              actions={actions}
              renderTableData={renderTableData}
              hideSlNo={hideSlNo}
            />
          ) : (
            // uncommment when skeleton loader is required
            // isLoading ? (
            //   <TableSkeleton cols={totalCols} rows={5} />
            // ) :
            <tbody className="bg-tableBg group-hover:bg-tableBgHover  ">
              {pageData?.map((data, idx) => {
                if (validate) {
                  validateBg = ``;
                  if (data?.isInvalid) {
                    validateBg = "bg-red-300 hover:bg-red-400 text-gray-800";
                  } else {
                    tableHeader?.forEach((header, Hidx) => {
                      if (!data?.[header]) {
                        validateBg =
                          "bg-red-300 hover:bg-red-400 text-gray-800";
                      }
                    });
                  }
                }
                return (
                  <tr
                    key={idx}
                    className={` text-gray-900  group text-center text-nowrap border-b border-gray-300 hover:bg-tableBg group-hover:bg-tableBgHoverHover  divide-gray-500 ${validateBg} ${
                      onRowClick && `cursor-pointer`
                    }`}
                    ref={
                      infiniteScroll && pageData?.length - 1 == idx
                        ? lastRowRef
                        : null
                    }
                    onClick={() => {
                      if (onRowClick) {
                        onRowClick(data, data?.actualIdx);
                      }
                    }}
                  >
                    {!hideSlNo && (
                      <td
                        key={"slno"}
                        className={`px-4 py-2 maxsm:px-2 maxsm:py-2 bg-tableBg group-hover:bg-tableBgHover font-normal `}
                      >
                        <span className={`px-2 p-1 rounded-sm `}>
                          {activePage * numberOfRowsPerPage + idx + 1}
                        </span>
                      </td>
                    )}
                    {tableHeader?.map((header, hidx) => {
                      const dataName = data?.[header];
                      let bg = "";
                      if (status?.[header]) {
                        bg = status[header][dataName];
                      }

                      return (
                        header && (
                          <GetTDbyType
                            key={hidx}
                            data={data}
                            labels={labels}
                            bg={bg}
                            header={header}
                            idx={idx}
                            lockedIndex={lockedIndex}
                          />
                        )
                      );
                    })}

                    {actions && (
                      <td
                        key={"action"}
                        className="  flex divide-x-2 divide-gray-300  text-nowrap justify-center px-6 py-4 maxsm:px-2 maxsm:py-2  items-center group-hover:bg-tableBgHover bg-tableBg font-normal"
                      >
                        {actions?.map((action, aidx) => {
                          return (
                            <TooltipMaterial
                              content={action?.title}
                              className="flex items-center justify-center h-full flex-1 "
                              key={`${action?.title}-${data?._id || aidx} `}
                            >
                              <span
                                key={`${action?.title}-${data?._id || aidx} `}
                                className="cursor-pointer  flex items-center justify-center h-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action?.onClick(data, data?.actualIdx);
                                }}
                              >
                                {/* {action?.text} */}
                                {typeof action?.text === "function"
                                  ? action?.text(data)
                                  : action?.text}
                              </span>
                            </TooltipMaterial>
                          );
                        })}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>

        {tableData?.length == 0 && !isLoading && (
          <div className="w-full text-center flex items-center justify-center text-lg font-semibold p-2">
            No data found
          </div>
        )}
      </div>
      {pagination && (
        <div className="flex gap-2 w-full items-center justify-between maxsm:flex-col bg-white p-2 rounded-md shadow-hrms">
          <div className="text-sm text-gray-700">
            {isLoading
              ? `Loading Data...`
              : ` Showing Data from ${activePage * numberOfRowsPerPage + 1} - 
            ${activePage * numberOfRowsPerPage + pageData?.length} of 
            ${totalRecords}`}
          </div>

          <div className="flex gap-2 flex-wrap justify-end maxsm:w-full maxsm:justify-start">
            <TooltipMaterial content="First Page">
              <button
                disabled={activePage === 0}
                className="p-1 rounded-md aspect-square bg-popLight hover:shadow-hrms cursor-pointer text-black-900 disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-white disable:shadow-none disabled:hover:shadow-none w-8 h-8 flex items-center justify-center"
                onClick={() => setActivePage(0)}
              >
                <LuSkipBack className="w-4 h-4" />
              </button>
            </TooltipMaterial>
            <TooltipMaterial content="Previous Page">
              <button
                disabled={activePage === 0}
                className="p-1 rounded-md aspect-square bg-popLight hover:shadow-hrms cursor-pointer text-black-900 disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-white disable:shadow-none disabled:hover:shadow-none w-8 h-8 flex items-center justify-center"
                onClick={() => setActivePage(activePage - 1)}
              >
                <IoIosArrowBack className="w-4 h-4" />
              </button>
            </TooltipMaterial>

            <TooltipMaterial content="Page No">
              <input
                type="number"
                className="text-center rounded-md-2 h-8 rounded-md bg-popLight hover:shadow-hrms shadow-hrms"
                min={1}
                max={NumberOfPages}
                value={parseInt(inputPageValue)}
                onChange={(e) => {
                  if (e.target.value == 0) {
                    return setInputPageValue("");
                  }
                  if (e.target.value <= NumberOfPages) {
                    return setActivePage(parseInt(e.target.value) - 1);
                  } else {
                    setInputPageValue(activePage + 1);
                    return toast.error(
                      `Page number must be less than ${NumberOfPages}`
                    );
                  }
                }}
              />
            </TooltipMaterial>
            <TooltipMaterial content="Next Page">
              <button
                disabled={activePage >= NumberOfPages - 1}
                className="p-1 rounded-md aspect-square bg-popLight hover:shadow-hrms cursor-pointer text-black-900 disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-white disable:shadow-none disabled:hover:shadow-none w-8 h-8 flex items-center justify-center"
                onClick={() => {
                  setActivePage(activePage + 1);
                }}
              >
                <IoIosArrowForward className="w-4 h-4" />
              </button>
            </TooltipMaterial>
            <TooltipMaterial content="Last Page">
              <button
                disabled={activePage >= NumberOfPages - 1}
                className="p-1 rounded-md aspect-square bg-popLight hover:shadow-hrms cursor-pointer text-black-900 disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-white disable:shadow-none disabled:hover:shadow-none w-8 h-8 flex items-center justify-center"
                onClick={() => setActivePage(NumberOfPages - 1)}
              >
                <LuSkipForward className="w-4 h-4" />
              </button>
            </TooltipMaterial>
            <TooltipMaterial content="Rows per page" className="ml-auto">
              <select
                name="NumberOfRows"
                className="bg-popLight  rounded-md h-8 px-2"
                value={numberOfRowsPerPage}
                onChange={(e) => {
                  setNumberOfRowsPerPage(parseInt(e.target.value));
                  setActivePage(0);
                }}
              >
                <option value={10} disabled={totalRecords < 10}>
                  10
                </option>
                <option value={25} disabled={!(totalRecords > 10)}>
                  25
                </option>
                <option value={50} disabled={!(totalRecords > 25)}>
                  50
                </option>
                <option value={100} disabled={!(totalRecords > 50)}>
                  100
                </option>
              </select>
            </TooltipMaterial>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableWithPagination;
