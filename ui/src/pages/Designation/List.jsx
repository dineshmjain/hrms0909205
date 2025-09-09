import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table/Table";
import { usePrompt } from "../../context/PromptProvider";
import { MdModeEditOutline } from "react-icons/md";
import { Button, Chip } from "@material-tailwind/react";
import Loader from "../Loader/Loader";
import {
  DesignationEditAction,
  DesignationGetAction,
  DesignationStatusUpdateAction,
} from "../../redux/Action/Designation/DesignationAction";

import { toast } from "react-hot-toast";
import Header from "../../components/header/Header";
import Filter from "../../components/Filter/Filter";
import { removeEmptyStrings } from "../../constants/reusableFun";

const List = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showPrompt, hidePrompt } = usePrompt();
  let initialData = {
    branchId: "",
    subOrgId: "",
    departmentId: "",
  };
  const [selectedFilters, setSelectedFilters] = useState(() => {
    const data = window?.localStorage?.getItem("designationList");
    return data ? { ...JSON?.parse(data) } : { ...initialData };
  });
  // Memoize table headers
  const TableHeaders = useMemo(
    () => ["Name", "Created By", "Created At", "Status", "Actions"],
    []
  );

  // Redux state
  const { designationList, loading, totalRecord, limit, pageNo } = useSelector(
    (state) => state?.designation || {}
  );

  // useEffect(() => {
  //   getDesignationList();
  // }, [dispatch]);

  const getDesignationList = (params) => {
    let filters = {
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
    if (designation.isActive == false) {
      return toast.error("Cannot Edit Please Activate");
    } else {
      navigate("/designation/edit", { state: designation });
    }
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
          <b>{data?.isActive ? `Deactivate` : `Activate`} </b> the{" "}
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

  // Define table actions
  const actions = [
    {
      title: "Edit",
      text: <MdModeEditOutline className="w-5 h-5" />,
      onClick: (designation) => editButton(designation),
    },
  ];

  const labels = {
    name: {
      DisplayName: "Name",
    },
    isActive: {
      DisplayName: "Status",
      type: "function",
      data: (data, idx) => (
        <div className="flex justify-center items-center gap-2" key={idx}>
          <div className="flex justify-center items-center gap-2" key={idx}>
            <Chip
              color={data?.isActive ? "green" : "red"}
              variant="ghost"
              value={data?.isActive ? "Active" : "Inactive"}
              className="cursor-pointer font-poppins transition-all duration-300 ease-in-out "
              onClick={(e) => {
                e.stopPropagation();
                handleShowPrompt(data);
              }}
            />
          </div>
        </div>
      ),
    },
    modifiedDate: {
      DisplayName: "Last Modified",
      type: "time",
      format: "DD-MM-YYYY HH:mm A",
    }
  };

  // Optionally handle error display here

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
      <Header
        handleClick={addButton}
        buttonTitle={"Add"}
        headerLabel={"Designation"}
        subHeaderLabel={"Overview of Your Designation"}
      />
      {/* <div className="w-full bg-white p-4">
        <Filter
          pageName={"designation"}
          onSet={() => {
            getDesignationList({ page: pageNo, limit: limit });
          }}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
      </div> */}
      <div className="">
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
      </div>
    </div>
    // <div className="flex flex-col gap-4 p-2 w-full h-full">
    //   <div className="flex justify-between">
    //     <h6 className="font-semibold text-xl ">Designation List</h6>
    //     <Button size="sm" onClick={addButton} className="bg-pop">
    //       Add New Designation
    //     </Button>
    //   </div>

    //   <div>
    //     <Table
    //       tableName="Designation"
    //       tableJson={designationList}
    //       labels={labels}
    //       onRowClick={editButton}
    //       actions={actions}
    //     />
    //   </div>
    // </div>
  );
};

export default List;
