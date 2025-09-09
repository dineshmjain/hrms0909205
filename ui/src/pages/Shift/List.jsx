import React, { useEffect, useState, useMemo, useRef, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table/Table";
import { usePrompt } from "../../context/PromptProvider";
import { MdModeEditOutline } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { Chip, Typography } from "@material-tailwind/react";
import Loader from "../Loader/Loader";
import { ShiftActivateAction, ShiftGetAction } from "../../redux/Action/Shift/ShiftAction";
import Header from "../../components/header/Header";
import OrganizationFilter from "../../components/Filter/organizationFilter";
import toast from "react-hot-toast";
import { ShiftUpdateAction } from '../../redux/Action/Shift/ShiftAction';
import { removeEmptyStrings } from '../../constants/reusableFun';
import CopyOnClick from "../../components/CopyonClick/CopyOnClick";
import AssignShift from "./AssignShift";
import { Formik, Form } from 'formik';

// TODO: Add or remove correct actions as needed
// import { BranchEditAction } from "../../redux/Action/Branch/BranchAction"; // Uncomment if used
// import { DepartmentGetAction } from "../../redux/Action/Department/DepartmentAction"; // Uncomment if needed

const List = ({ state }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showPrompt, hidePrompt } = usePrompt();
  const filterRef = useRef();
  const [openSidebar, setOpenSidebar] = useState(false);

  const [hasLoadedClient, setHasLoadedClient] = useState(false);
  const [selectedFilterType, setFilterType] = useState(() => {
    return localStorage.getItem("shift_selectedFilterType") || "myOrg";
  });
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedClient, setSelectedClient] = useState({
    clientId: "",
    clientName: "",
    clientBranch: [],
    clientMappedId: ""
  });

  const { shiftList = [], loading, totalRecord,
    pageNo,
    limit, } = useSelector(
      (state) => state?.shift || {}
    );

  // useEffect(() => {
  //   if (state?.clientId && state?.clientMappedId) {
  //     setSelectedClient({
  //       clientId: state.clientId,
  //       clientMappedId: state.clientMappedId
  //     });
  //     setFilterType("clientOrg");
  //     getShiftList({ page: pageNo, limit: limit })
  //   }
  // }, [state?.clientId, state?.clientMappedId]);

  useEffect(() => {
    localStorage.setItem("shift_selectedFilterType", selectedFilterType);
  }, [selectedFilterType]);

  const getShiftList = (params) => {
    let Params = {
      ...params,
    };
    const updatedParams = {};
    if (selectedFilterType === "clientOrg" && selectedClient?.clientMappedId) {
      updatedParams["orgId"] = selectedClient.clientMappedId;
    }
    let finalParams = { ...Params, ...updatedParams };
    dispatch(ShiftGetAction(finalParams));
  };

  const addButton = () => {
    setSelectedClient({
      clientId: selectedClient.clientId,
      clientName: selectedClient.name,
      clientMappedId: selectedClient.clientMappedId
    })
    navigate("/shift/add", {
      state: {
        clientId: selectedClient.clientId,
        clientMappedId: selectedClient._id
      }
    })
  }

  const assignShift = (shift) => {
    setSelectedShift(shift)
    setOpenSidebar(true)
  }

  const editButton = (shift) => {
    if (shift?.isActive == false) {
      return toast.error("Cannot Edit Please Activate");
    } else {
      setSelectedClient({
        clientId: selectedClient.clientId,
        clientName: selectedClient.name,
        clientMappedId: selectedClient.clientMappedId
      })
      navigate("/shift/edit", {
        state: {
          ...shift,
          ...selectedClient,
           selectedFilterType, // Pass the selectedFilterType
        }
      })
    }
  }

  const handleShowPrompt = (data) => {
    showPrompt({
      heading: "Are you sure?",
      message: (
        <span>
          Are you sure you want to{" "}
          <b>{data?.isActive ? "Deactivate" : "Activate"}</b> the{" "}
          <b>{data.name}</b> shift?
        </span>
      ),
      buttons: [
        {
          label: "Yes",
          type: 1,
          onClick: () => {
            confirmUpdate(data);
          }
        },
        {
          label: "No",
          type: 0,
          onClick: hidePrompt
        }
      ]
    });
  };

  //   const confirmUpdate = async(data) => {
  //     if (!data) return;
  //   try {
  //     const payload = {
  //       "isActive": !data.isActive,
  //     };
  //       if (selectedFilterType === "clientOrg" && selectedClient?.clientId) {
  //       payload["orgId"] = selectedClient.clientId;
  //     }  
  //     await dispatch(ShiftUpdateAction(removeEmptyStrings(payload)))
  //     .then(() => {
  //         getPolicyList({ page: pageNo, limit: limit });
  //       })
  //       .catch((err) => toast.error("Assignment failed"));

  //     hidePrompt();
  //   }
  // }
  const confirmUpdate = (data) => {
    if (!data) return;
    const payload = {
      "shiftId": data._id,
      "isActive": !data.isActive,
    };
    // if (selectedFilterType === "clientOrg" && selectedClient?.clientId) {
    //   payload["clientId"] = selectedClient.clientId;
    // }

    dispatch(ShiftActivateAction(payload))
      .then((response) => {
        toast.success(`Shift ${data?.isActive ? "Deactivated" : "Activated"} Successfully`);
        getShiftList({ page: pageNo, limit: limit })
      })
      .catch((err) => toast.error("failed"));
    hidePrompt();
  };

  const actions = [
    {
      title: "Edit",
      text: <MdModeEditOutline className="w-5 h-5" />,
      onClick: editButton
    },
    {
      title: "Assign Employees To Shift",
      text: <FaUserPlus className="w-5 h-5" />,
      onClick: assignShift
    }
  ];

  useEffect(() => {
    if (selectedFilterType == "clientOrg" && selectedClient?.clientId !== "") {
      getShiftList({ page: pageNo, limit: limit });
    }
    if (selectedFilterType == "myOrg") {
      getShiftList({ page: pageNo, limit: limit });
    }
  }, [selectedFilterType, selectedClient]);

  const handleCloseSidebar = () => {
    setOpenSidebar(false);
    setSelectedShift([])
  };

  const labels = {
    name: {
      DisplayName: "Name",
      type: "function",
      data: (data) => {
        const getInitials = (name) => {
          if (!name) return "";
          const words = name.trim().split(/\s+/);
          return words.length > 1
            ? `${words[0][0]}${words[1][0]}`.toUpperCase()
            : words[0][0].toUpperCase();
        };
        return (
          <div className="flex items-center gap-2">
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
            <CopyOnClick text={data?.name} className={`px-2 p-1 rounded-sm ${data?.name < 0 ? "text-red-500" : ""}`}>
              <span className="text-sm">{data?.name}</span></CopyOnClick>
          </div>
        );
      }
    },
    startTime: { DisplayName: "Start Time" },
    endTime: { DisplayName: "End Time" },
    firstName: {
      DisplayName: "Created By",
      type: "object",
      objectName: "createdBy"
    },
    isActive: {
      DisplayName: "Status",
      type: "function",
      data: (data) => (
        <div className="flex justify-center items-center gap-2">
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
      )
    },
    modifiedDate: {
      DisplayName: "Last Modified",
      type: "time",
      format: "DD-MM-YYYY HH:mm A"
    }
  };
console.log(selectedClient,"selectedClient");

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
      <div
        className={`fixed sidebar overflow-y-scroll scrolls z-30 rounded-lg 
           w-[30vw] shadow-2xl transition-all ease-in-out duration-[.3s] top-[48px]  ${openSidebar ? `right-[-10px] visible` : `right-[-3000px]`
          } rounded-sm bg-white z-10 overflow-hidden`}
        ref={filterRef}
      >
        <Formik>
          {({ submitForm, values }) => (
            <>
              <Form>
              <AssignShift
                selectedClient={selectedClient}
                selectedShift={selectedShift}
                selectedfilter={selectedFilterType}
                closeSidebar={handleCloseSidebar} />
              </Form>
            </>
          )}
        </Formik>
      </div>
      <Header
        handleClick={addButton}
        buttonTitle="Add"
        headerLabel="Shift"
        subHeaderLabel="Overview of Your Shift"
      />

      <div className="bg-white p-4 shadow-hrms rounded-md">
        <div className="text-gray-700 font-semibold mb-2 text-[14px]">
          Filters
        </div>
        <OrganizationFilter
          selectedFilterType={selectedFilterType}
          setFilterType={setFilterType}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          setHasLoadedClient={setHasLoadedClient}
          hasLoadedClient={hasLoadedClient}
        />
      </div>

      {(selectedFilterType === 'myOrg' ||
        (selectedFilterType === 'clientOrg' && !!selectedClient.clientId)) && (
        <div>
        <Table
          tableName="Shift"
          tableJson={shiftList}
          labels={labels}
          onRowClick={editButton}
          actions={actions}
          paginationProps={{
            totalRecord: totalRecord,
            pageNo: pageNo,
            limit: limit,
            onDataChange: (page, limit, name = "") => {
              getShiftList({ page, limit, name });
            },
          }}
        />
      </div>
       )}
    </div>
  );
};

export default List;
