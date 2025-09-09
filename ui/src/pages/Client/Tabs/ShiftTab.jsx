import React, { useEffect } from "react";
import Header from "../../../components/header/Header";
import Table from "../../../components/Table/Table";
import { Chip, Typography } from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { clientBranchListAction } from "../../../redux/Action/ClientBranch/ClientBranchAction";
import { useNavigate } from "react-router-dom";
import { MdModeEditOutline } from "react-icons/md";
import { useCheckEnabledModule } from "../../../hooks/useCheckEnabledModule";
import toast from "react-hot-toast";
import { usePrompt } from "../../../context/PromptProvider";
import { ShiftGetAction } from "../../../redux/Action/Shift/ShiftAction";
import { ShiftUpdateAction } from "../../../redux/Action/Shift/ShiftAction";

const ShiftTab = ({ state }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkMoudles = useCheckEnabledModule();
  const { showPrompt, hidePrompt } = usePrompt();
  const { shiftList, loading, totalRecord, pageNo, limit } = useSelector(
    (state) => state?.shift
  );

  const getShiftList = (params) => {
    console.log("params:", state);
    
    dispatch(ShiftGetAction({ orgId: params?._id }));
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
      return toast.error("You are Unauthorized to Create Client Shift!");

    navigate("/shift/add", {
      state: { clientId: state?.clientId, clientMappedId: state?._id },
    });
  };
  const editButton = (rowData) => {
    console.log(rowData);

    if (checkMoudles("client", "c") == false)
      return toast.error("You are Unauthorized to Create Client Shift!");

    navigate("/shift/edit", {
      state: {
        clientId: state?.clientId,
        clientMappedId: state?.clientMappedId,
        ...rowData,
      },
    });
  };
  const confirmUpdate = (data) => {
    if (!data) return;
    const payload = {
      shiftId: data._id,
      clientMappedId: data.clientMappedId,
      isActive: !data.isActive,
    };

    dispatch(ShiftUpdateAction(payload))
      .then(() => {
        getShiftList({
          page: pageNo,
          limit: limit,
          clientMappedId: data.clientMappedId, // Will be passed as orgId in getShiftList
        });
      })
      .catch(() => toast.error("Assignment failed"));
    hidePrompt();
  };
  const handleShowPrompt = (data) => {
    showPrompt({
      heading: "Are you sure?",
      message: (
        <span>
          Are you sure you want to{" "}
          <b className="font-bold text-gray-700">
            {data?.isActive ? `Deactivate` : `Activate`}{" "}
          </b>{" "}
          the <b className="font-bold text-gray-700">{data.name}</b> ?
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
      DisplayName: "Name",
      type: "function",
      data: (data, idx, subData, subIdx) => {
        function getInitials(name) {
          if (!name) return "";

          const words = name.trim().split(/\s+/);
          if (words.length === 1) {
            return words[0][0].toUpperCase();
          }

          return words[0][0].toUpperCase() + words[1][0].toUpperCase();
        }
        return (
          <div className="flex items-center gap-2" key={idx}>
            <div
              className="h-7 w-7 rounded-md flex items-center justify-center"
              style={{ backgroundColor: data?.bgColor }}
            >
              <Typography
                className="text-xs font-semibold"
                style={{ color: data?.textColor }}
              >
                {getInitials(data?.name)}
              </Typography>
            </div>

            <span className="text-sm">{data?.name}</span>
          </div>
        );
      },
    },
    startTime: {
      DisplayName: "Start Time",
    },
    endTime: {
      DisplayName: "End Time",
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
  };

  useEffect(() => {
    getShiftList(state);
  }, []);
  return (
    <>
      {" "}
      <Header
        headerLabel={"Shifts" + " of " + state?.name}
        handleClick={addButton}
      />
      <Table
        tableJson={shiftList}
        labels={labels}
        uniqueRowKey="_id"
        tableName="Shifts"
        actions={actions}
      />
    </>
  );
};

export default ShiftTab;
