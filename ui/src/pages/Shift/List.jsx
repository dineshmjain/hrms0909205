import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { json, useNavigate, useLocation } from "react-router-dom";
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
import { BranchGetAction } from "../../redux/Action/Branch/BranchAction";
import { clientBranchListAction } from "../../redux/Action/ClientBranch/ClientBranchAction";
import { SubOrgListAction } from "../../redux/Action/SubOrgAction/SubOrgAction";
import { clientListAction } from "../../redux/Action/Client/ClientAction";
import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
import MultiSelectDropdown from "../../components/MultiSelectDropdown/MultiSelectDropdown";

// TODO: Add or remove correct actions as needed
// import { BranchEditAction } from "../../redux/Action/Branch/BranchAction"; // Uncomment if used
// import { DepartmentGetAction } from "../../redux/Action/Department/DepartmentAction"; // Uncomment if needed

const List = ({ state }) => {

  const initialFilter = {
    clientMappedId: "",
    branchId: "",
  };
  
  // Load persisted state from localStorage
  const loadPersistedState = () => {
    const saved = localStorage.getItem('shiftListFilterState');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      selectedFilterType: "myOrg",
      selectedBranch: "",
      selectedFilter: { ...initialFilter },
      selectedClient: {
        clientId: "",
        clientName: "",
        clientBranch: [],
        clientMappedId: ""
      }
    };
  };

  const [selectedFilter, setSelectedFilter] = useState(loadPersistedState().selectedFilter);
  const [selectedFilterType, setFilterType] = useState(loadPersistedState().selectedFilterType);
  const [selectedBranch, setSelectedBranch] = useState(loadPersistedState().selectedBranch);
  const [selectedClient, setSelectedClient] = useState(loadPersistedState().selectedClient);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showPrompt, hidePrompt } = usePrompt();
  const filterRef = useRef();
  const [openSidebar, setOpenSidebar] = useState(false);
  const { clientList } = useSelector((state) => state?.client);
  const { branchList } = useSelector((state) => state.branch || {});
  const { clientBranchList = [] } = useSelector((state) => state.clientBranch || {});
  const user = useSelector((state) => state?.user?.user);

  const [selectedShift, setSelectedShift] = useState("");

  const { shiftList = [], loading, totalRecord,
    pageNo,
    limit, } = useSelector(
      (state) => state?.shift || {}
    );

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      selectedFilterType,
      selectedBranch,
      selectedFilter,
      selectedClient
    };
    localStorage.setItem('shiftListFilterState', JSON.stringify(stateToSave));
    localStorage.setItem("shift_selectedFilterType", selectedFilterType);
  }, [selectedFilterType, selectedBranch, selectedFilter, selectedClient]);

  // Fetch initial lists on mount
  useEffect(() => {
    dispatch(BranchGetAction());
    dispatch(clientListAction());
  }, [dispatch]);

  // Auto-select first branch for myOrg if none selected and branches are loaded
  useEffect(() => {
    if (selectedFilterType === "myOrg" && !selectedBranch && branchList && branchList.length > 0) {
      const firstBranchId = branchList[0]._id;
      setSelectedBranch(firstBranchId);
    }
  }, [selectedFilterType, selectedBranch, branchList]);

  // Fetch client branches if needed (e.g., on load for clientOrg)
  useEffect(() => {
    if (selectedFilterType === "clientOrg" && selectedFilter.clientMappedId) {
      dispatch(clientBranchListAction({ clientMappedId: selectedFilter.clientMappedId }));
    }
  }, [selectedFilterType, selectedFilter.clientMappedId]);

  // Clear selections when filter type changes
  useEffect(() => {
    if (selectedFilterType === "myOrg") {
      setSelectedFilter({ ...initialFilter });
      setSelectedClient({
        clientId: "",
        clientName: "",
        clientBranch: [],
        clientMappedId: ""
      });
    } else if (selectedFilterType === "clientOrg") {
      setSelectedBranch("");
    }
  }, [selectedFilterType]);

  // Fetch shifts when selections or pagination changes
  useEffect(() => {
    if (selectedFilterType === "myOrg" && selectedBranch) {
      getShiftList({ page: pageNo, limit: limit });
    } else if (selectedFilterType === "clientOrg" && selectedFilter?.clientMappedId && selectedFilter?.branchId) {
      getShiftList({ page: pageNo, limit: limit });
    }
  }, [selectedFilterType, selectedBranch, selectedFilter.clientMappedId, selectedFilter.branchId, pageNo, limit]);

  const getShiftList = (params) => {
    let Params = {
      ...params,
    };
    const updatedParams = {};
    if (selectedFilterType === "myOrg" && selectedBranch) {
      updatedParams["orgId"] = user.orgId;
      updatedParams["branchId"] = selectedBranch;
    }
    if (selectedFilterType === "clientOrg" && selectedFilter?.clientMappedId && selectedFilter?.branchId) {
      updatedParams["orgId"] = selectedFilter.clientMappedId;
      updatedParams["branchId"] = selectedFilter.branchId;
    }
    let finalParams = { ...Params, ...updatedParams };
    dispatch(ShiftGetAction(finalParams));
  };

  const addButton = () => {
    navigate("/shift/add", {
      state: {
        clientId: selectedClient.clientId,
        clientMappedId: selectedClient.clientMappedId
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
      navigate("/shift/edit", {
        state: {
          ...shift,
          ...selectedClient,
          selectedFilterType,
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

  const confirmUpdate = (data) => {
    if (!data) return;
    const payload = {
      "shiftId": data._id,
      "isActive": !data.isActive,
    };

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


  const handleCloseSidebar = () => {
    setOpenSidebar(false);
    setSelectedShift([])
  };

  const labels = {
    branchName:{
      DisplayName: "Branch Name",
      type:"object",
      objectName:"branchDetails"
    },
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
  };

  const showTable = (selectedFilterType === 'myOrg' && selectedBranch) ||
    (selectedFilterType === 'clientOrg' && selectedFilter?.clientMappedId && selectedFilter?.branchId);

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
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-3">
          {selectedFilterType === "myOrg" && (
            <>
              <SingleSelectDropdown
                listData={branchList ?? []}
                inputName="Branch"
                hideLabel={true}
                feildName="name"
                selectedOptionDependency={"_id"}
                selectedOption={selectedBranch}
                handleClick={(data) => {
                 setSelectedBranch(data?._id)
                }}
              />
            </>
          )}
          {selectedFilterType === "clientOrg" && (
            <>
              <SingleSelectDropdown
                listData={clientList ?? []}
                inputName="Client"
                hideLabel={true}
                feildName="name"
                selectedOptionDependency={"_id"}
                selectedOption={selectedFilter?.clientMappedId}
                handleClick={(data) => {
                  setSelectedFilter({ ...initialFilter, clientMappedId: data?._id });
                  setSelectedClient({
                    clientId: data?._id,
                    clientName: data?.name,
                    clientBranch: [],
                    clientMappedId: data?._id
                  });
                  dispatch(clientBranchListAction({ clientMappedId: data?._id }));
                }}
              />
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

            </>
          )}
        </div>
      </div>

      {showTable && (
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