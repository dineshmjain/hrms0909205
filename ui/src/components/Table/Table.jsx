import React, { useCallback, useEffect, useRef, useState } from "react";
import TableFilters from "./TableFilters";
import TableWithPagination from "./TableWithPagination";
import "./Table.css";

const Table = ({
  showFilter = true,
  tableName = "table",
  filterData,
  tableJson,
  actions,
  labels,
  status,
  childerenRows,
  pagination,
  isLoading,
  hideSlNo = false,
  validate,
  infiniteScroll = false,
  handlleInfiniteScroll,
  uniqueRowKey = "_id",
  paginationProps,
  onRowClick,
  hideReload,
  hideColumns = false,
}) => {
  let initialHeaders = useRef([]);
  let initialChildHeaders = useRef([]);
  let initialTableData = useRef([]);
  const isFirstRender = useRef(true);
  const tableRef = useRef(null);
  //the main table data which is passed to the table component
  const [tableData, setTableData] = useState([]);
  //the table headers which must be displayed (as empty string means not to display)
  const [tableHeader, setTableHeader] = useState([]);
  //the table headers which must be displayed (as empty string means not to display)
  const [childHeader, setChildHeader] = useState(null);
  const [lockedIndex, setLockedIndex] = useState([]);
  const [globalSerch, setGlobalSerch] = useState("");

  const initialProps = useRef({
    numberOfRowsPerPage: 10,
    activePage: 0,
  });

  useEffect(() => {
    if (labels) {
      initialHeaders.current = Object.keys(labels);
      if (childerenRows) {
        initialChildHeaders.current = Object?.keys(childerenRows?.labels);
        setChildHeader([...initialChildHeaders?.current]);
      }
    } else {
      initialHeaders.current = Object?.keys(tableJson[0])?.map((data) => data);
      if (childerenRows) {
        initialChildHeaders.current = Object.keys(childerenRows?.labels);
        setChildHeader([...initialChildHeaders?.current]);
      }
    }
    let temp = [];
    let lockTemp = [];
    initialHeaders.current?.forEach((data) => {
      // exclude default unchecked labels
      temp?.push(!labels?.[data]?.DefaultUnchecked ? data : "");
      // add locked Header
      if (labels?.[data]?.locked) {
        lockTemp?.push(data);
      }
    }),
      setLockedIndex(() => {
        return [...lockTemp];
      });
    setTableHeader(() => {
      return [...temp];
    });
  }, [labels]);

  useEffect(() => {
    //storing acutal index in case of sort or search
    let tempData = tableJson?.map((data, idx) => {
      return { ...data, actualIdx: idx };
    });
    initialTableData.current = tempData;
    if (tempData?.length) {
      setTableData(tempData);
    } else {
      setTableData([]);
    }
  }, [tableJson]);

  // const exportToCSV = useCallback(() => {
  //   const table = tableRef.current;
  //   let csv = "";

  //   for (let row of table.rows) {
  //     let rowData = [];
  //     for (let cell of row.cells) {
  //       // Escape double quotes and wrap in quotes
  //       rowData.push(`"${cell.innerText.replace(/"/g, '""')}"`);
  //     }
  //     csv += rowData.join(",") + "\n";
  //   }

  //   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  //   const url = URL.createObjectURL(blob);

  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = `${tableName}.csv`;
  //   link.click();

  //   URL.revokeObjectURL(url); // Clean up
  // }, [tableRef]);

  const exportToCSV = useCallback(() => {
    const table = tableRef.current;
    let csv = "";
    if (!table) return;
    const headerRow = table.rows[0];
    const actionColIndexes = [];
    const headerData = [];
    for (let i = 0; i < headerRow.cells.length; i++) {
      const text = headerRow.cells[i].innerText.trim().toLowerCase();
      if (text === "actions") {
        actionColIndexes.push(i);
      } else {
        headerData.push(
          `"${headerRow.cells[i].innerText.replace(/"/g, '""')}"`
        );
      }
    }
    csv += headerData.join(",") + "\n";
    for (let r = 1; r < table.rows.length; r++) {
      const row = table.rows[r];
      const rowData = [];
      for (let c = 0; c < row.cells.length; c++) {
        if (!actionColIndexes.includes(c)) {
          rowData.push(`"${row.cells[c].innerText.replace(/"/g, '""')}"`);
        }
      }
      csv += rowData.join(",") + "\n";
    }
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${tableName}.csv`;
    link.click();
    URL.revokeObjectURL(url); // Clean up
  }, [tableRef]);

  return (
    <div className="flex flex-col w-full font-medium ">
      {showFilter && (
        <TableFilters
          filterData={filterData}
          setTableHeader={setTableHeader}
          tableHeader={tableHeader}
          initialHeaders={initialHeaders.current}
          initialTableData={initialTableData.current}
          setTableData={setTableData}
          labels={labels}
          initialChildHeaders={initialChildHeaders}
          childHeader={childHeader}
          setChildHeader={setChildHeader}
          childLabels={childerenRows?.labels}
          childerenRows={childerenRows}
          exportToCSV={exportToCSV}
          initialProps={initialProps?.current}
          paginationProps={paginationProps}
          globalSerch={globalSerch}
          setGlobalSerch={setGlobalSerch}
          hideReload={hideReload}
          hideColumns={hideColumns}
        />
      )}
      {validate && (
        <div className="w-full flex flex-col items-end ">
          <div className="flex items-center gap-2 text-sm font-medium">
            {" "}
            <div className="w-4 h-3 bg-red-300 border border-black"> </div>{" "}
            Invalid data
          </div>
        </div>
      )}
      {tableData && (
        <TableWithPagination
          tableData={tableData}
          tableHeader={tableHeader}
          initialTableData={initialTableData?.current}
          actions={actions}
          setTableData={setTableData}
          childHeader={childHeader}
          childerenRows={childerenRows}
          labels={labels}
          status={status}
          pagination={pagination}
          isLoading={isLoading}
          hideSlNo={hideSlNo}
          validate={validate}
          infiniteScroll={infiniteScroll}
          handlleInfiniteScroll={handlleInfiniteScroll}
          onRowClick={onRowClick}
          uniqueRowKey={uniqueRowKey}
          lockedIndex={lockedIndex}
          setLockedIndex={setLockedIndex}
          paginationProps={paginationProps}
          tableRef={tableRef}
          initialProps={initialProps?.current}
          globalSerch={globalSerch}
          isFirstRender={isFirstRender}
        />
      )}
    </div>
  );
};

export default React.memo(Table);
