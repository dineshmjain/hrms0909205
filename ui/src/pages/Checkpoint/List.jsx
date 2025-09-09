import React, { useEffect, useState } from "react";
import { usePrompt } from "../../context/PromptProvider";
import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
import Table from "../../components/Table/Table";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clientListAction } from "../../redux/Action/Client/ClientAction";
import Header from "../../components/header/Header";
import {
  checkPointListAction,
  checkPointupdateAction,
} from "../../redux/Action/Checkpoint/CheckpointAction";
import { MdModeEditOutline } from "react-icons/md";
import { Chip } from "@material-tailwind/react";
import { clientBranchListAction } from "../../redux/Action/ClientBranch/ClientBranchAction";
import { PiXBold } from "react-icons/pi";

const List = () => {
  const initialFilter = {
    clientMappedId: "",
    branchId: "",
  };
  const [selectedFilter, setSelectedFilter] = useState({
    ...initialFilter,
  });

  const clientList = useSelector((state) => state?.client?.clientList);
  const clientBranchList = useSelector(
    (state) => state?.clientBranch?.clientBranchList
  );
  const {
    checkpoint: checkpointList,
    loading,
    totalRecords,
  } = useSelector((state) => state?.checkpoint);

  const nav = useNavigate();
  const dispatch = useDispatch();
  const { showPrompt, hidePrompt } = usePrompt();

  const handleEdit = (data) => {
    nav("../edit", { state: { data: data } });
  };

  const handleRemoveElement = (idx, name) => {
    // console.log(idx, name);

    setSelectedMedia((prev) => {
      let temp = [...prev[name]];
      temp?.splice(idx, 1);
      return {
        ...prev,
        [name]: [...temp],
      };
    });
  };

  const actions = [
    {
      title: "Edit",
      text: <MdModeEditOutline className="w-5 h-5 " />,
      onClick: (data, title) => handleEdit(data),
    },
  ];

  const labels = {
    name: {
      DisplayName: "Checkpoint Name",
    },
    FloorNo: {
      DisplayName: "Floor No",
      type: "object",
      objectName: "address",
    },
    BuildingName: {
      DisplayName: "Building Name",
      type: "object",
      objectName: "address",
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
    }
  };

  const confirmUpdate = (data) => {
    let body = {
      checkpointId: data?._id,
      isActive: !data?.isActive,
    };
    dispatch(checkPointupdateAction(body ))?.then(({ payload }) => {
      if (payload?.status === 200) {
        hidePrompt();
        dispatch(
          checkPointListAction({
            clientMappedId: selectedFilter?.clientMappedId,
          })
        );
      }
    });
  };

  const handleShowPrompt = (data) => {
    showPrompt({
      heading: "Are you sure?",
      message: (
        <span>
          Are you sure you want to{" "}
          <b>{data?.isActive ? `Deactivate` : `Activate`} </b>{" "}
          <b>{data.name}</b> Checkpoint ?
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
   const handleClear = ()=>{
    setSelectedFilter({...initialFilter});
  }

  useEffect(() => {
    let data = JSON.parse(window?.localStorage?.getItem("checkPointList"));
    if (data) {
      setSelectedFilter(data);
    }
    if (data?.clientMappedId) {
      dispatch(
        clientBranchListAction({ clientMappedId: data?.clientMappedId })
      );
    }
  }, []);

  useEffect(() => {
    dispatch(clientListAction());
  }, [dispatch]);

  useEffect(() => {
    window?.localStorage?.setItem(
      "checkPointList",
      JSON.stringify(selectedFilter)
    );
    if (selectedFilter?.branchId) {
      dispatch(
        checkPointListAction({
          ...selectedFilter,
        })
      );
    }
  }, [selectedFilter]);

  return (
  <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
      <Header
        headerLabel={"Checkpoint List"}
        subHeaderLabel={"List of all checkpoints"}
        handleClick={() => {
          nav("../create");
        }}
      />
      <div className="w-full bg-white p-4 rounded-md shadow-hrms">
        <div className="text-gray-700 font-semibold mb-2 mt-0 text-[14px] mb-1">
          Filters
        </div>
        <div className="flex flex-wrap mt-4 gap-4">
          <div className="sm:w-60">
            <SingleSelectDropdown
                  listData={clientList ?? []}
              inputName="Client"
              hideLabel={true}
              feildName="name"
              selectedOptionDependency={"_id"}
              selectedOption={selectedFilter?.clientMappedId}
              handleClick={(data) => {
                setSelectedFilter({ ...initialFilter, clientMappedId: data?._id });
                dispatch(clientBranchListAction({ clientMappedId: data?._id }));
              }}
            />
          </div>
          <div className="sm:w-60">
            <SingleSelectDropdown
                  listData={clientBranchList ?? []}
              inputName="Client Branch"
              hideLabel={true}
              showTip={false}
              feildName="name"
              selectedOption={selectedFilter?.branchId}
              selectedOptionDependency={"_id"}
              handleClick={(data) => {
                setSelectedFilter((prev) => {
                  return { ...prev, branchId: data?._id };
                });
              }}
            />
          </div>
          <div>
            <button className="flex items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-popLight shadow-none text-popfont-medium px-2 py-2 rounded-md hover:bg-popMedium hover:shadow-none text-sm" onClick={handleClear}>clear<PiXBold className="w-4 h-4 cursor-pointer" />
            </button>
          </div>
        </div>
      </div>
      <Table
        tableJson={checkpointList || []}
        labels={labels}
        actions={actions}
        onRowClick={(data) => {
          handleEdit(data);
        }}
        loading={loading}
      />

    </div>
  );
};

export default List;
