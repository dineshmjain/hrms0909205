import React, { useState, useEffect } from "react";
import Header from "../../../components/header/Header";
import Table from "../../../components/Table/Table";
import { Chip } from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { clientBranchListAction } from "../../../redux/Action/ClientBranch/ClientBranchAction";
import { useNavigate } from "react-router-dom";
import { MdModeEditOutline } from "react-icons/md";
import { useCheckEnabledModule } from "../../../hooks/useCheckEnabledModule";
import toast from "react-hot-toast";
import { usePrompt } from "../../../context/PromptProvider";
import { ClientBranchStatusUpdateAction } from "../../../redux/Action/Client/ClientAction";
import { Dialog, DialogBody, DialogHeader, IconButton } from '@material-tailwind/react';
import { HiOutlineXMark } from "react-icons/hi2";
import KYC from "./KYC";
const BranchTab = ({ state }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkMoudles = useCheckEnabledModule();
  const { showPrompt, hidePrompt } = usePrompt();
  const { clientBranchList, loading, totalRecord } = useSelector(
    (state) => state?.clientBranch
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [branchName, setBranchName] = useState({});
  const [isBranchEdit, setIsBranchEdit] = useState(false);
  const { pageNo, limit } = useSelector((state) => state.clientBranch);

  const getClientBranchList = (params) => {
    dispatch(clientBranchListAction({ ...params, clientMappedId: state?._id }));
  };

  const actions = [
    {
      title: "Edit",
      text: <MdModeEditOutline className="w-5 h-5" />,
      onClick: (branch) => {
        if (checkMoudles("client", "u") == false)
          return toast.error("You are Unauthorized to Edit Client Branch!");
        // editButton(branch);
        editClientButton(branch);
      },
    },
  ];

    const closeDialog = () => {
    setOpenDialog(false);
  }

  const addClientBranch = () => {
    setIsBranchEdit(false)
    setBranchName({ name: "", value: "" });
    setOpenDialog(true);
  }

  const submitCreate = async () => {
    const responseData = removeEmptyStrings({
      clientMappedId: state?._id,
      clientId: state?.clientId,
      name: branchName.name,
    });
    console.log(responseData);
    const response = await dispatch(clientBranchCreateAction(responseData));
    setOpenDialog(false);
    if (response?.meta?.requestStatus === "fulfilled") {
      dispatch(clientBranchListAction({ clientMappedId: state?._id }));
    }
  }

  const editClientButton = async (rowData) => {
    setIsBranchEdit(true)
    setOpenDialog(true);
    setBranchName({ name: rowData?.name, value: rowData?._id });
  };

  const submitEdit = async () => {
    const responseData = removeEmptyStrings({
      subOrgId: state?._id,
      id: branchName.value,
      name: branchName.name,
    });
    console.log(responseData);
    const response = await dispatch(BranchEditAction(responseData));
    setOpenDialog(false);
    if (response?.meta?.requestStatus === "fulfilled") {
      dispatch(clientBranchListAction({ clientMappedId: state?._id }));
    }
  }

  const addButton = () => {
    if (checkMoudles("client", "c") == false)
      return toast.error("You are Unauthorized to Create Client Branch!");

    navigate("../../branch/add", {
      state: { clientId: state?.clientId, clientMappedId: state?._id },
    });
  };

  const editButton = (rowData) => {
    console.log(rowData);

    if (checkMoudles("client", "c") == false)
      return toast.error("You are Unauthorized to Create Client Branch!");

    navigate("/branch/edit?tab=kyc", { state: rowData });
  };

  const confirmUpdate = (data) => { 
    if (!data) return;
    const payload = {
      clientMappedId: data.clientMappedId,
      id: data._id,
      status: !data.isActive,
    };
    dispatch(ClientBranchStatusUpdateAction(payload))
      .then(() => {
        getClientBranchList({ page: pageNo, limit: limit });
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

  const labels = {
    name: {
      DisplayName: "Branch Name",
    },
    // city: {
    //   DisplayName: "Village/City",
    //   type: "object",
    //   objectName: "address",
    // },
    // state: {
    //   DisplayName: "State",
    //   type: "object",
    //   objectName: "address",
    // },
    firstName: {
      DisplayName: "Created By",
      type: "object",
      objectName: "createdBy.name",
      keyName: "firstName",
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
                  if (checkMoudles("branch", "d") == false)
                    return toast.error(
                      "You are Unauthorized to Activate/Deactivate Branch!"
                    );
                  handleShowPrompt(data);
                }}
              />
            </div>
          </div>
        );
      },
    },
  };

  useEffect(() => {
    getClientBranchList();
  }, []);
  return (
    <>
      <Dialog open={openDialog} size='xl'>        
         <DialogHeader className="flex justify-between">
          <h3 className="text-lg font-semibold">{isBranchEdit == true ? "Edit" : "Add"} Branch</h3>
          <HiOutlineXMark onClick={closeDialog} />
        </DialogHeader>
        <DialogBody >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Branch Name
          </label>
          <input
            id="searchInput"
            type="text"
            value={branchName.name}
            className={`border-2 border-gray-400 mr-2 rounded-md w-[250px] p-2`}
            placeholder="Enter Branch Name"
            onChange={(e) => {
              setBranchName(prev => ({ ...prev, name: e.target.value }));
            }}
          />
          <KYC />
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="bg-green-700 text-white px-4 py-1 rounded-md h-fit"
              onClick={isBranchEdit ? submitEdit : submitCreate}
            >
              Submit
            </button>
            <button
              className="bg-red-700 text-white px-4 py-1 rounded-md h-fit"
              onClick={closeDialog}
            >
              Cancel
            </button>
          </div>
        </DialogBody>
      </Dialog>
      {" "}
      <Header
        headerLabel={"Branch" + " of " + state?.name}
        handleClick={addClientBranch}
      />
      <Table
        tableJson={clientBranchList}
        labels={labels}
        uniqueRowKey="_id"
        tableName="Branch"
        actions={actions}
        onRowClick={editButton}
      />
    </>
  );
};

export default BranchTab;
