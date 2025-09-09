import React, { useEffect, useState, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table/Table";
import { usePrompt } from "../../context/PromptProvider";
import { MdModeEditOutline } from "react-icons/md";
import { Button, Chip } from "@material-tailwind/react";
import {
  BranchEditAction,
  BranchGetAction,
} from "../../redux/Action/Branch/BranchAction";
import Loader from "../Loader/Loader";
// import SingleSelectFIlter from "../../components/table/FilterComponents/DataFilterComponents/SingleSelectFIlter";
// import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
import {
  SubOrgEditAction,
  SubOrgListAction,
} from "../../redux/Action/SubOrgAction/SubOrgAction";
import Header from "../../components/header/Header";
import toast from "react-hot-toast";

const List = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showPrompt, hidePrompt } = usePrompt();
  // Memoize table headers
  const TableHeaders = useMemo(
    () => ["Name", "Created By", "Created At", "Status", "Actions"],
    []
  );
  const includeKeys = [];
  // Redux state
  const { subOrgs, loading, error, pageNo, limit, totalRecord } = useSelector(
    (state) => state?.subOrgs || {}
  );

  const getSubOrgList = (params) => {
    dispatch(SubOrgListAction(params));
  };

  // Navigation functions
  const addButton = () => navigate("/suborganization/add");
  const editButton = (subOrg) => {
    if (subOrg.isActive == false) {
      return toast.error("Cannot Edit Please Activate");
    } else {
      navigate("/suborganization/edit", { state: subOrg });
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
    dispatch(SubOrgEditAction(payload))
      .then(({ payload }) => {
        if (payload?.status == 200)
          getSubOrgList({ page: pageNo, limit: limit });
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
          <b>{data.name}</b> Sub Org?
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

  const labels = {
    name: {
      DisplayName: "Name",
    },
    type: {
      DisplayName: "Business Type",
    },

    firstName: {
      DisplayName: "Created By",
      type: "object",
      objectName: "createdByName",
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
    modifiedDate:{
      DisplayName: "Last Modified",
       type: "time",
       format: "DD-MM-YYYY HH:mm A",
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
      <Header
        handleClick={addButton}
        buttonTitle={"Add"}
        headerLabel={"Organizations"}
        subHeaderLabel={"Overview of Your Organizations"}
      />

      <div className="">
        <Table
          tableName="Organizations"
          tableJson={subOrgs}
          labels={labels}
          onRowClick={editButton}
          actions={actions}
          paginationProps={{
            totalRecord,
            pageNo,
            limit,
            onDataChange: (page, limit, search = "") => {
              getSubOrgList({ page, limit, search });
            },
          }}
        />
      </div>
    </div>
  );
};

export default List;
