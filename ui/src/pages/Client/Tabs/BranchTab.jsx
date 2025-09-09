import React, { useEffect } from "react";
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
const BranchTab = ({ state }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkMoudles = useCheckEnabledModule();
  const { showPrompt, hidePrompt } = usePrompt();
  const { clientBranchList, loading, totalRecord } = useSelector(
    (state) => state?.clientBranch
  );
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
        editButton(branch);
      },
    },
  ];
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
  const getBranchList = (params) => {
    let updatedParams = {
      mapedData: "branch",
      orgLevel: true,
      ...params,
    };

    if (checkMoudles("suborganization", "r")) {
      updatedParams = { ...updatedParams, subOrgId: subOrg };
    }
    dispatch(clientBranchListAction(updatedParams));
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
      {" "}
      <Header
        headerLabel={"Branch" + " of " + state?.name}
        handleClick={addButton}
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
