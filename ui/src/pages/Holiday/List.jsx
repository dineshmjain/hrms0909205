import React, { useEffect, useState, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table/Table";
import { usePrompt } from "../../context/PromptProvider";
import { MdModeEditOutline } from "react-icons/md";
import { Button, Chip } from "@material-tailwind/react";
import Header from "../../components/header/Header";
import toast from "react-hot-toast";
import {
  HolidayListAction,
  HolidayEditAction,
} from "../../redux/Action/Holiday/holiday";
import FilterPanel from "./FilterPanel/FilterPanel";

const List = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showPrompt, hidePrompt } = usePrompt();
  const [filterType, setFilterType] = useState("myOrg");
  const [orgFilters, setOrgFilters] = useState({});
  const [page, setPage] = useState(1);

  // Memoize table headers
  const TableHeaders = useMemo(
    () => ["Name", "Created By", "Created At", "Status", "Actions"],
    []
  );
  const includeKeys = [];
  // Redux state
  const { holidays, loading, error, pageNo, limit, totalRecord } = useSelector(
    (state) => state?.holidays || {}
  );

  const getHolidayList = (params) => {
    dispatch(HolidayListAction(params));
  };

  useEffect(() => {
    if (!orgFilters) return;


    const params = {
      page,
      limit,
      ...orgFilters,
    };

    console.log('ORG FILTERS', orgFilters)

    getHolidayList(params);
  }, [orgFilters, page]);

  // Navigation functions
  const addButton = () => navigate("/holidays/add");
  const editButton = (subOrg) => {
    if (subOrg.isActive == false) {
      return toast.error("Cannot Edit Please Activate");
    } else {
      navigate("/holidays/edit", { state: subOrg });
    }
  };

  const confirmUpdate = (data) => {
    if (!data) return;
    const payload = {
      // params: { id: data._id },
      // body: {
      // name: data.name,
      // location: data.location,
      _id: data._id,
      isActive: !data.isActive,
      // },
    };
    dispatch(HolidayEditAction(payload))
      .then(({ payload }) => {
        if (payload?.status == 200) {
          getHolidayList({ page: pageNo, limit: limit, year: '2025' });
        }
      })
      .catch((err) => toast.error("Assignment failed"));
    hidePrompt();
  };

  const handleShowPrompt = (data) => {
    showPrompt({
      heading: "Are you sure?",
      message: (
        <span>
          Are you sure you want to{" "}
          <b>{data?.isActive ? `Deactivate` : `Activate`} </b> the{" "}
          <b>{data.name}</b> Holiday?
        </span>
      ),
      buttons: [
        {
          label: "Yes",
          type: 1,
          onClick: () => {
            confirmUpdate(data);
          },
        },
        {
          label: "No",
          type: 0,
          onClick: () => {
            return hidePrompt();
          },
        },
      ],
    });
  };

  // Define table actions
  const actions = [
    {
      title: "Edit",
      text: <MdModeEditOutline className="w-5 h-5" />,
      onClick: (branch) => editButton(branch),
    },
    ,
  ];

  const holidayTypeMap = {
    public: "Public Holiday",
    restricted: "Restricted Holiday",
    optional: "Optional Holiday",
  };

  const durationMap = {
    "full-day": "Full Day",
    "half-day": "Half Day",
  };

  const labels = {
    name: {
      DisplayName: "Name",
    },
    date: {
      DisplayName: "Date",
      type: "date",
      format: "DD-MM-YYYY",
    },
    holidayType: {
      DisplayName: "Holiday Type",
      type: "function",
      data: (data) => holidayTypeMap[data?.holidayType] || data?.holidayType,
    },

    description: {
      DisplayName: "Description",
    },

    duration: {
      DisplayName: "Holiday Duration",
      type: "function",
      data: (data) => durationMap[data?.duration] || data?.duration,
    },

    isActive: {
      DisplayName: "Status",
      type: "function",
      data: (data, idx, subData, subIdx) => {
        return (
          <div className="flex justify-center items-center gap-2" key={idx}>
            <Chip
              color={data?.isActive ? "green" : "red"}
              variant="ghost"
              value={data?.isActive ? "Active" : "Inactive"}
              className="cursor-pointer font-poppins"
              onClick={(e) => {
                e.stopPropagation();
                handleShowPrompt(data);
              }}
            />
          </div>
        );
      },
    },
    modifiedDate: {
      DisplayName: "Last Modified",
      type: "time",
      format: "DD-MM-YYYY HH:mm A",
    },
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
      <Header
        handleClick={addButton}
        buttonTitle={"Add"}
        headerLabel={"Holidays"}
        subHeaderLabel={"Overview of Your Organization Holidays"}
      />
      <div className="bg-white p-4 rounded-md shadow-hrms">
        <div className="text-gray-700 font-semibold mt-0 text-[14px] mb-1">
          Filters
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          {/* Organization / Client Filters */}
          <div className="flex gap-4 flex-wrap items-end">
            <FilterPanel
              type="list"
              filtersData={orgFilters}
              setFiltersData={setOrgFilters}
              filterType={filterType}
              setFilterType={setFilterType}
              setPage={setPage}
            />
          </div>
        </div>
      </div>

      <div className="">
        <Table
          tableName="Holidays"
          tableJson={holidays}
          labels={labels}
          onRowClick={editButton}
          actions={actions}
          paginationProps={{
            totalRecord,
            pageNo,
            limit,
            onDataChange: (page, limit, search = "") => {
              console.log('ORG FILTERS auuu', orgFilters)
              getHolidayList({ page, limit, search, ...orgFilters });
            },
          }}
        />
      </div>
    </div>
  );
};

export default List;
