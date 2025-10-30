import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table/Table";
import { usePrompt } from "../../context/PromptProvider";
import { MdModeEditOutline } from "react-icons/md";
import { Checkbox, Chip, Switch } from "@material-tailwind/react";
import {
  DesignationEditAction,
  DesignationGetAction,
} from "../../redux/Action/Designation/DesignationAction";
import { toast } from "react-hot-toast";
import Header from "../../components/header/Header";
import { removeEmptyStrings } from "../../constants/reusableFun";
import axiosInstance from "../../config/axiosInstance";

const List = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showPrompt, hidePrompt } = usePrompt();

  const initialData = {
    branchId: "",
    subOrgId: "",
    departmentId: "",
  };

  const [selectedFilters, setSelectedFilters] = useState(() => {
    const data = window?.localStorage?.getItem("designationList");
    return data ? { ...JSON?.parse(data) } : { ...initialData };
  });

  const [selectedFilterType, setSelectedFilterType] = useState("all");
  const [designationServiceList, setDesignationServiceList] = useState([]);
  const [loadingService, setLoadingService] = useState(false);

  // Redux state
  const { designationList, loading, totalRecord, limit, pageNo } = useSelector(
    (state) => state?.designation || {}
  );

  // Fetch data based on selected filter type
  useEffect(() => {
    if (selectedFilterType === "service") {
      getDesignationServiceList();
    } else {
      getDesignationList({ page: pageNo, limit: limit });
    }
  }, [selectedFilterType]);

  const getDesignationServiceList = async () => {
    setLoadingService(true);
    try {
      const { data } = await axiosInstance.post("/designation/get/asService");
      setDesignationServiceList(data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load designations");
    } finally {
      setLoadingService(false);
    }
  };

  const handleToggleService = async (designation) => {
    try {
      await axiosInstance.post("/designation/update/asService", {
        designationId: designation._id,
        isService: !designation.isService,
      });

      toast.success(
        `${designation.name} ${!designation.isService ? "enabled" : "disabled"}`
      );

      await getDesignationServiceList();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const getDesignationList = (params) => {
    const filters = {
      ...selectedFilters,
      category: "assigned",
      mapedData: "designation",
    };
    const updatedParams = removeEmptyStrings({ ...params, ...filters });
    dispatch(DesignationGetAction(updatedParams));
  };

  // Navigation functions
  const addButton = () => navigate("/designation/add");

  const editButton = (designation) => {
    if (designation.isActive === false) {
      return toast.error("Cannot Edit Please Activate");
    }
    navigate("/designation/edit", { state: designation });
  };

  const confirmUpdate = (data) => {
    if (!data) return;

    const payload = {
      designationId: data._id,
      isActive: !data.isActive,
    };

    dispatch(DesignationEditAction(payload))
      .then(() => getDesignationList({ page: pageNo, limit: limit }))
      .catch(() => toast.error("Update failed"));

    hidePrompt();
  };

  const handleShowPrompt = (data) => {
    showPrompt({
      heading: "Are you sure?",
      message: (
        <span>
          Are you sure you want to{" "}
          <b>{data?.isActive ? "Deactivate" : "Activate"} </b> the{" "}
          <b>{data.name}</b> designation?
        </span>
      ),
      buttons: [
        {
          label: "Yes",
          type: 1,
          onClick: () => confirmUpdate(data),
        },
        {
          label: "No",
          type: 0,
          onClick: () => hidePrompt(),
        },
      ],
    });
  };

  const handleChangeDesgType = (type) => {
    setSelectedFilterType(type);
  };

  // Define table actions
  const actions = [
    {
      title: "Edit",
      text: <MdModeEditOutline className="w-5 h-5" />,
      onClick: (designation) => editButton(designation),
    },
  ];

  // Labels for "All" view
  const labels = {
    name: {
      DisplayName: "Name",
    },
    isActive: {
      DisplayName: "Status",
      type: "function",
      data: (data, idx) => (
        <div className="flex justify-center items-center gap-2" key={idx}>
          <Chip
            color={data?.isActive ? "green" : "red"}
            variant="ghost"
            value={data?.isActive ? "Active" : "Inactive"}
            className="cursor-pointer font-poppins transition-all duration-300 ease-in-out"
            onClick={(e) => {
              e.stopPropagation();
              handleShowPrompt(data);
            }}
          />
        </div>
      ),
    },
    modifiedDate: {
      DisplayName: "Last Modified",
      type: "time",
      format: "DD-MM-YYYY HH:mm A",
    },
  };

  // Labels for "Service" view
  const labelServices = {
    name: {
      DisplayName: "Name",
    },
    isService: {
      DisplayName: "Service Status",
      type: "function",
      data: (designation, idx) => (
       <div>
                             <Checkbox
                          color="bg-primary"
                            //  title="designation.isService ?'Enabled':'Disabled'"
                             label={designation.isService ?'Enabled':'Disabled'}
                               checked={designation.isService}
                               onChange={() => handleToggleService(designation)}
                             />
                             {/* <span
                               className={`text-sm font-medium ${
                                 designation.isService
                                   ? "text-green-600"
                                   : "text-gray-500"
                               }`}
                             >
                               {designation.isService ? "Enabled" : "Disabled"}
                             </span> */}
                           </div>
      ),
    },
    // modifiedDate: {
    //   DisplayName: "Last Modified",
    //   type: "time",
    //   format: "DD-MM-YYYY HH:mm A",
    // },
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
      <Header
        handleClick={addButton}
        buttonTitle={"Add"}
        headerLabel={"Designation"}
        subHeaderLabel={"Overview of Your Designation"}
      />

      <div className="bg-white p-4 shadow-hrms rounded-md">
        <div className="text-gray-700 font-semibold mb-2 text-[14px]">
          Filters
        </div>
        <div className="inline-flex rounded-md overflow-hidden shadow my-3 border border-gray-200 mb-4">
          <button
            type="button"
            onClick={() => handleChangeDesgType("all")}
            className={`px-4 py-2 font-medium text-[12px] transition-all duration-150 ${
              selectedFilterType === "all"
                ? "bg-primary text-white"
                : "bg-white text-gray-900 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => handleChangeDesgType("service")}
            className={`px-4 py-2 font-medium text-[12px] transition-all duration-150 ${
              selectedFilterType === "service"
                ? "bg-primary text-white"
                : "bg-white text-gray-900 hover:bg-gray-100"
            }`}
          >
            Service
          </button>
        </div>
      </div>

      <div>
        {selectedFilterType === "all" ? (
          <Table
            tableName="Designation"
            tableJson={designationList}
            labels={labels}
            onRowClick={editButton}
            actions={actions}
            paginationProps={{
              totalRecord,
              pageNo,
              limit,
              onDataChange: (page, limit, name = "") => {
                getDesignationList({ page, limit, name });
              },
            }}
          />
        ) : (
          <Table
            tableName="Designation Service"
            tableJson={designationServiceList}
            labels={labelServices}
            // onRowClick={editButton}
            // actions={actions}
            loading={loadingService}
          />
        )}
      </div>
    </div>
  );
};

export default List;