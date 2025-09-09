import React, { useEffect, useState, useMemo } from "react";
import Table from "../../components/Table/Table";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button, Chip, Typography } from "@material-tailwind/react";
Button;

import Loader from "../Loader/Loader";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { usePrompt } from "../../context/PromptProvider";
import { clientListAction } from "../../redux/Action/Client/ClientAction";
import { ClientStatusUpdateAction } from "../../redux/Action/Client/ClientAction";

const List = ({ state }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showPrompt, hidePrompt } = usePrompt();

  // Redux state
  const { clientList, loading, error, totalRecord, pageNo, limit } =
    useSelector((state) => state.client);

  const getClientList = (params) => {
    dispatch(clientListAction({ ...params, clientId: state?._id }));
  };

  // Navigation functions
  const addButton = () => navigate("/client/add");
  const editButton = (data) => {
    if (data.isActive == false) {
      return toast.error("Cannot Edit Please Activate");
    } else {
      navigate("/client/edit", { state: data });
    }
  };
  const importButton = () => navigate("/client/import");

  const confirmUpdate = (data) => {
    if (!data) return;
    const payload = {
      clientId: data.clientId,
      status: !data.isActive,
    };
    dispatch(ClientStatusUpdateAction(payload))
      .then(() => {
        getClientList({ page: pageNo, limit: limit });
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
      DisplayName: "Client Org Name",
    },
    type: {
      DisplayName: "Client Business Type",
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
    modifiedDate: {
      DisplayName: "Last Modified",
      type: "time",
      format: "DD-MM-YYYY HH:mm A",
    },
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full">
      <div className="flex justify-between p-2">
        <div>
          <Typography className="text-gray-900 font-semibold text-[18px] capitalize  ">
            Client List
          </Typography>
          <Typography className="text-[#6c6c6c] font-medium text-[14px] capitalize ">
            Overview Of Your Clients
          </Typography>
        </div>
        <div className="gap-3 flex">
          <button
            size="sm"
            className="flex h-10 items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-primary shadow-none text-popfont-medium text-white px-2 py-2 rounded-md hover:bg-primaryLight hover:shadow-none text-sm hover:text-primary"
            onClick={addButton}
          >
            Add New Client
          </button>
          <button
            size="sm"
            className="flex h-10 items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-primary shadow-none text-popfont-medium text-white px-2 py-2 rounded-md hover:bg-primaryLight hover:shadow-none text-sm hover:text-primary"
            onClick={importButton}
          >
            Import Client
          </button>
        </div>
      </div>

      <div className="">
        <Table
          tableName="Client"
          tableJson={clientList}
          labels={labels}
          onRowClick={editButton}
          isLoading={loading}
          actions={actions}
          paginationProps={{
            totalRecord,
            pageNo,
            limit,
            onDataChange: (page, limit, search = "") => {
              getClientList({ page, limit, search });
            },
          }}
        />
      </div>
    </div>
  );
};

export default List;
