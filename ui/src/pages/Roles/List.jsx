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
import { RoleGetAction } from "../../redux/Action/Roles/RoleAction";
import toast from "react-hot-toast";

const List = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showPrompt, hidePrompt } = usePrompt();
  // Memoize table headers


  const { rolesList,loading } = useSelector((state) => state?.roles)
  useEffect(() => {
    getRolesList()
  },[dispatch])

  const getRolesList = () => {
    const updatedParams = {orgLevel:true};
    console.log('shift ca')
    dispatch(RoleGetAction(updatedParams));
  };

  // Navigation functions
  const addButton = () => navigate("/roles/add");
  const editButton = (branch) => {
     if (branch.isActive == false) {
      return toast.error("Cannot Edit Please Activate")
    }
    else {
      navigate("/roles/edit", { state: branch });
    }
  }

  const confirmUpdate = (data) => {
    if (!data) return;
    const payload = {
      params: { id: data._id },
      body: {
        name: data.name,
        location: data.location,
        isActive: !data.isActive,
      },
    };
    dispatch(BranchEditAction(payload))
      .then(getDepartmentList)
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

    firstName: {
      DisplayName: "Created By",
      type: "object",
      objectName: "createdBy",
    },
    isActive: {
      DisplayName: "Status",
      type: "function",
      data: (data, idx, subData, subIdx) => {
        return (
          <div className="flex justify-center items-center gap-2" key={idx}>
            <Chip
              color={data?.status ? "green" : "red"}
              variant="ghost"
              value={data?.status ? "Active" : "Inactive"}
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
    }
  };

  // Conditional rendering
  if (loading) return <Loader />;

  return (
    

    <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
      <Header handleClick={addButton} buttonTitle={"Add"} headerLabel={'Role'} subHeaderLabel={'Overview of Your Roles'} />

      <div className="">
        <Table
          tableName="Roles"
          tableJson={rolesList}
          labels={labels}
          onRowClick={editButton}
          actions={actions}

        />
      </div>
    </div>
  );
};

export default List;
