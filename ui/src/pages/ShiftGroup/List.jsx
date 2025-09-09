import React, { useEffect, useState, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table/Table";
import { usePrompt } from "../../context/PromptProvider";
import { MdModeEditOutline } from "react-icons/md";
import { Button, Chip } from "@material-tailwind/react";
import Loader from "../Loader/Loader";
import { DepartmentGetAction } from "../../redux/Action/Department/DepartmentAction";
import Header from "../../components/header/Header";
import { ShiftGetAction } from "../../redux/Action/Shift/ShiftAction";
import { ShiftGroupGetApi } from "../../apis/ShiftGroup/ShiftGroup";
import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";
import { removeEmptyStrings } from "../../constants/reusableFun";
import { ShiftGroupGetAction } from "../../redux/Action/ShiftGroup/ShiftGroupAction";


const List = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkMoudles = useCheckEnabledModule();
  const { showPrompt, hidePrompt } = usePrompt();


  // Redux state
  const {
    shiftGroupList,
    loading,
    totalRecord,
    pageNo,
    limit } = useSelector((state) => state.shift)

  const getshiftGroupList = (params) => {
    let finalParams = {}
    let updatedParams = {
      page: params.page,
      limit: params.limit,
      search: params.name
    };
    if (checkMoudles("shift", "r")) {
      finalParams = removeEmptyStrings({ ...updatedParams });
    }
    dispatch(ShiftGroupGetAction(finalParams));
  };

  // Navigation functions
  const addButton = () => navigate("/shiftgroup/add");
  const editButton = (branch) => navigate("/shiftgroup/edit", { state: branch });

  const confirmUpdate = (data) => {
  };

  const handleShowPrompt = (data) => {
    showPrompt({
      heading: "Are you sure?",
      message: (
        <span>
          Are you sure you want to{" "}
          <b>{data?.isActive ? `Deactivate` : `Activate`} </b> the{" "}
          <b>{data.name}</b> Branch?
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
    // isActive: {
    //   DisplayName: "Status",
    //   type: "function",
    //   data: (data, idx, subData, subIdx) => {
    //     return (
    //       <div className="flex justify-center items-center gap-2" key={idx}>
    //         <Chip
    //           color={data?.isActive ? "green" : "red"}
    //           variant="ghost"
    //           value={data?.isActive ? "Active" : "Inactive"}
    //           className="cursor-pointer font-poppins"
    //           onClick={(e) => {
    //             e.stopPropagation();
    //             handleShowPrompt(data);
    //           }}
    //         />
    //       </div>
    //     );
    //   },
    // },
    weekOff: {
      DisplayName: "WeekOff",
    }
  };

  return (

    <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
      <Header handleClick={addButton} buttonTitle={"Add"} headerLabel={'Shift'} subHeaderLabel={'Overview of Your Shift'} />
      <div className="">
        <Table
          tableName="ShiftPatterns"
          tableJson={shiftGroupList}
          isLoading={loading}
          labels={labels}
          onRowClick={editButton}
          actions={actions}
          paginationProps={{
            totalRecord: totalRecord,
            pageNo: pageNo,
            limit: limit,
            onDataChange: (page, limit, name = "") => {
              getshiftGroupList({ page, limit, name });
            },
          }}
        />
      </div>
    </div>
  );
};

export default List;
