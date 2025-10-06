import React, { useEffect, useState, useMemo } from "react";
import Header from "../../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table/Table";
import {
  LeavePolicyGetAction,
  LeavePolicyStatusUpdateAction,
} from "../../../redux/Action/Leave/LeaveAction";
import { MdModeEditOutline } from "react-icons/md";
import { use } from "react";
import { useCheckEnabledModule } from "../../../hooks/useCheckEnabledModule";
import { usePrompt } from "../../../context/PromptProvider";
import { Button, Chip } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { removeEmptyStrings } from "../../../constants/reusableFun";

const List = () => {
  const navigate = useNavigate();
  const addButton = () => navigate("/policy/add");
  const dispatch = useDispatch();
  const checkMoudles = useCheckEnabledModule();
  const { showPrompt, hidePrompt } = usePrompt();

  const {
    PolicyList,
    loading: LeaveLoading,
    totalRecord,
    pageNo,
    limit,
  } = useSelector((state) => state.leave);

  const getPolicyList = (params) => {
    let finalParams = {};
    let updatedParams = {
      page: params.page,
      limit: params.limit,
      search: params.name,
    };
    if (checkMoudles("policy", "r")) {
      finalParams = removeEmptyStrings({ ...updatedParams });
    }
    dispatch(LeavePolicyGetAction(finalParams));
  };

  // useEffect(() => {
  //   getPolicyList();
  // }, [dispatch]);

  console.log(PolicyList, "what i sthe list hererer");
  const handleShowPrompt = (data) => {
    showPrompt({
      heading: "Are you sure?",
      message: (
        <span>
          Are you sure you want to{" "}
          <b>{data?.isActive ? `Deactivate` : `Activate`} </b> the{" "}
          <b>{data.name}</b> Branch ?
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

  const confirmUpdate = (data) => {
    if (!data) return;
    const payload = {
      _id: data._id,
      isActive: data.isActive ? false : true,
    };
    dispatch(LeavePolicyStatusUpdateAction(payload))
      .then(() => {
        getPolicyList({ page: pageNo, limit: limit, name: "" });
      })
      .catch((err) => toast.error("Assignment failed"));
    hidePrompt();
  };

  const labels = {
    leavePolicyName: {
      DisplayName: "Name",
    },
    // genderEligibility: {
    //   DisplayName: "Gender",
    // },
    noOfDays: {
      DisplayName: "No Of Days",
    },
    type: {
      DisplayName: "Cycle Type",
      type: "object",
      objectName: "cycle",
    },

    creditedDay: {
      DisplayName: "Credited Day",
      type: "object",
      objectName: "cycle",
    },
    creditedMonth: {
      DisplayName: "Credited Month",
      type: "object",
      objectName: "cycle",
    },
    policyFeatures: {
      DisplayName: "Policy Handling",
      type: "function",
      data: (row) => {
        const features = [];

        if (row.carryForwardEnabled) {
          features.push(`Carry Forward: Yes (${row.carryForwardCycle})`);
        }

        if (row.salaryConversionEnabled) {
        features.push(`Salary Conversion: Yes (${row.salaryConversionCycle})`);
        }

        if (row.isExpiredLeaveAtMonthEnd) {
          features.push("Expiry: Expires at Month End");
        }

        // Join only the true values with a pipe separator
        return features.join(" | ") || "-"; // "-" if nothing is true
      },
    },

    // eligibleNoOfDays: {
    //   DisplayName: "Eligible Days",
    // },
    modifiedDate: {
      DisplayName: "Last Modified",
      type: "time",
      format: "DD-MM-YYYY HH:mm A",
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
                if (checkMoudles("policy", "d") == false)
                  return toast.error(
                    "You are Unauthorized to Activate/Deactivate POlicy!"
                  );
                handleShowPrompt(data);
              }}
            />
          </div>
        );
      },
    },
  };
  const actions = [
    {
      title: "Edit",
      text: <MdModeEditOutline className="w-5 h-5" />,
      onClick: (policy) => {
        if (checkMoudles("policy", "u") == false)
          return toast.error("You are Unauthorized to Edit Policy!");
        editButton(policy);
      },
    },
  ];
  const editButton = (leave) => {
    if (leave?.isActive == false) {
      return toast.error("Cannot Edit Please Activate");
    } else {
      navigate("/policy/edit", { state: leave });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
      <Header
        handleClick={addButton}
        buttonTitle={"Add"}
        headerLabel={"Leave Policy"}
        subHeaderLabel={"Overview of Your Policy"}
      />
      <div className="">
        <Table
          tableName="Policy"
          tableJson={PolicyList}
          isLoading={LeaveLoading}
          labels={labels}
          onRowClick={editButton}
          actions={actions}
          paginationProps={{
            totalRecord,
            pageNo,
            limit,
            onDataChange: (page, limit, name = "") => {
              getPolicyList({ page, limit, name });
            },
          }}
        />
      </div>
    </div>
  );
};

export default List;
