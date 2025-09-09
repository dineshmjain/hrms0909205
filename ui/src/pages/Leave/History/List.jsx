import React, { useEffect, useState, useMemo } from "react";
import Header from "../../../components/header/Header";
import Filter from "../../../components/Filter/Filter";
import Table from "../../../components/Table/Table";
import { useDispatch, useSelector } from "react-redux";
import { useCheckEnabledModule } from "../../../hooks/useCheckEnabledModule";
import { useNavigate } from "react-router-dom";

const List = () => {
    const {
    leaveHistoryList,
    loading: LeaveLoading,
    totalRecord,
    pageNo,
    limit,
  } = useSelector((state) => state.leave);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const checkMoudles = useCheckEnabledModule();
    const [showFilters, setShowFilters] = useState(true);
    const [selectedFilters, setSelectedFilters] = useState({
      orgIds: [],
      branchIds: "",
      departmentIds: "",
      designationIds: "",
      employeeIds: [],
    });
     const getLeaveHistoryList = (params) => {
        let updatedParams = {
          ...params,
        };
        if (checkMoudles("history", "r")) {
          updatedParams = { ...updatedParams };
        }
        // dispatch(""(updatedParams));
      };
      const labels = {
        firstName: {
          DisplayName: "Employee",
          type: "object",
          objectName: "userDetails",
        },
      }
    return (
       <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
      <Header
         isButton={false}
        headerLabel={"Leave Request History"}
        subHeaderLabel={"Overview of Your Employees Leave History"}
      />
        <div className="bg-white p-4 rounded-md shadow-hrms">
        <div className="text-gray-700 font-semibold mt-0 text-[14px] mb-1">Filters</div>
        <Filter
          showFilters={showFilters}
          selectedFilters={selectedFilters}
          onSet={(data) => {
            let { ...rest } = data;
            getLeaveHistoryList({
              page: 1,
              limit: 10
            });
          }}
          setSelectedFilters={setSelectedFilters}
          pageName={"leavehistory"}
        />
      </div>
        <div className="">
              <Table
                tableName="Leave History"
                tableJson={leaveHistoryList}
                isLoading={LeaveLoading}
                labels={labels}
                // onRowClick={approveReject}
                // actions={actions}
                paginationProps={{
                  totalRecord,
                  pageNo,
                  limit,
                  onDataChange: (page, limit, name = "") => {
                    getLeaveHistoryList({ page, limit });
                  },
                }}
              />
            </div>
      </div>
  )
};


export default List;