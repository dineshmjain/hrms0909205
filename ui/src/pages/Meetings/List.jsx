import React, { useEffect, useState, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table/Table";
import { usePrompt } from "../../context/PromptProvider";
import { MdModeEditOutline } from "react-icons/md";
import { Button, Chip } from "@material-tailwind/react";
import { BranchEditAction, BranchGetAction } from "../../redux/Action/Branch/BranchAction";
import Loader from "../Loader/Loader";
// import SingleSelectFIlter from "../../components/table/FilterComponents/DataFilterComponents/SingleSelectFIlter";
import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";

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
 const { branchList, loading, error } = useSelector(
     (state) => state?.branch ||{}
   );

  useEffect(() => {
    getBranchList();
  }, [dispatch]);

  const getBranchList = () => {
    const updatedParams = {};
    dispatch(BranchGetAction(updatedParams));
  };

  // Navigation functions
  const addButton = () => navigate("/meetings/add");
  const editButton = (lead) => navigate("/meetings/edit", { state: lead });

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
      .then(getBranchList)
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
          <b>{data.name}</b> Client?
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
    comment:{   DisplayName: "Comment",},
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
          </div>
        );
      },
    },
  };

  // Conditional rendering
  if (loading) return <Loader />;
  // if (error) return <Typography color="red">Error: {error}</Typography>;

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full">
      <div className="flex justify-between">
        {" "}
        <h6 className="font-semibold text-xl ">Meetings</h6>{" "}
        <Button size="sm" onClick={addButton} className="bg-pop" >
          Create Meeting
        </Button>
      </div>
      <div>
        <div className="w-72">
        <SingleSelectDropdown  hideLabel={true}
                  showTip={false}  inputName="Select Sub Organization"/>
        </div>
      </div>

      <div className="">
        <Table
          tableName="Branch"
          tableJson={branchList}
          labels={labels}
          onRowClick={editButton}
          actions={actions}
          
        />
      </div>
    </div>
  );
};

export default List;
