import React, { useEffect, useState, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "../../components/Table/Table";
import { usePrompt } from "../../context/PromptProvider";
import { MdModeEditOutline } from "react-icons/md";
import { Button, Chip } from "@material-tailwind/react";
import {
  BranchGetAction,
  BranchStatusUpdateAction,
} from "../../redux/Action/Branch/BranchAction";
import Loader from "../Loader/Loader";

import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
import { SubOrgListAction } from "../../redux/Action/SubOrgAction/SubOrgAction";
import toast from "react-hot-toast";
import Header from "../../components/header/Header";
import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";
import { PiXBold } from "react-icons/pi";
import moment from "moment";
const List = () => {
  const [subOrg, setSubOrg] = useState(() => {
    const data = window?.localStorage?.getItem("branchList");
    return data ? JSON.parse(data) : "";
  });
  const isFirstRender = useRef(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkMoudles = useCheckEnabledModule();
  const { showPrompt, hidePrompt } = usePrompt();

  const { subOrgs, loading, error } = useSelector(
    (state) => state?.subOrgs || {}
  );

  const getSubOrgList = () => {
    const updatedParams = {};
    dispatch(SubOrgListAction(updatedParams));
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
    dispatch(BranchGetAction(updatedParams));
  };

  // Navigation functions
  const addButton = () => {
    if (checkMoudles("branch", "c") == false)
      return toast.error("You are Unauthorized to Create Branch!");

    navigate("/branch/add");
  };
  const editButton = (subOrg) => {
    if (subOrg?.isActive == false) {
      return toast.error("Cannot Edit Please Activate");
    } else {
      navigate("/branch/edit?tab=kyc", { state: subOrg });
    }
  };

  const confirmUpdate = (data) => {
    if (!data) return;
    const payload = {
      branchId: data._id,
      status: !data.isActive,
    };
    dispatch(BranchStatusUpdateAction(payload))
      .then(() => {
        getBranchList({ page: pageNo, limit: limit });
      })
      .catch((err) => toast.error("Assignment failed"));
    hidePrompt();
  };

  const {
    branchList,
    loading: branchLoading,
    totalRecord,
    pageNo,
    limit,
  } = useSelector((state) => state.branch);

  
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

  const handleChange = (data) => {
    setSubOrg(data?._id);
  };
  

  const handleClear = () => {
    setSubOrg("");
    // getBranchList({ page: 1, limit: 10 });
  };

  useEffect(() => {
  if (subOrg === "") {
    getBranchList({ page: 1, limit: 10 });
  }
}, [subOrg]);

  console.log(branchList, "what i sthe list hererer");

  // Define table actions
  const actions = [
    {
      title: "Edit",
      text: <MdModeEditOutline className="w-5 h-5" />,
      // disabled: (branch) => branch.status == "INACTIVE",
      onClick: (branch) => {
        if (checkMoudles("branch", "u") == false)
          return toast.error("You are Unauthorized to Edit Branch!");
        editButton(branch);
      },
    },

    ,
  ]; 
  const processedBranchList = branchList?.map((item) => ({
    ...item,
    createdByFullName: `${item?.createdByName?.firstName || ""} ${
      item?.createdByName?.lastName || ""
    }`.trim(),
  }));
  const labels = {
    name: {
      DisplayName: "Name",
    },
    city: {
      DisplayName: "Village/City",
      type: "object",
      objectName: "address",
    },
    state: {
      DisplayName: "State",
      type: "object",
      objectName: "address",
    },
    // pincode: {
    //   DisplayName: "Pincode",
    //   type: "object",
    //   objectName: "address",
    // },
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
                if (checkMoudles("branch", "d") == false)
                  return toast.error(
                    "You are Unauthorized to Activate/Deactivate Branch!"
                  );
                handleShowPrompt(data);
              }}
            />
          </div>
        );
      },
    },
    modifiedDate: {
      DisplayName: "Last Modified",
      type: "function",
      data: (data) => {
        const raw = data?.modifiedDate;
        const formatted = raw
          ? moment(raw).local().format("DD-MM-YYYY hh:mm A")
          : "N/A";
        // console.log("Raw Modified Date:", raw);
        // console.log("Formatted Modified Date:", formatted);

        return formatted;
      },
    },
  };

  useEffect(() => {
    getSubOrgList();
  }, [dispatch]);

  useEffect(() => {
    // dont call api on render 1st render only on subOrgChange
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window?.localStorage?.setItem("branchList", JSON.stringify(subOrg));
    if (subOrg) {
      getBranchList({ page: 1, limit: 10 });
    }
  }, [subOrg]);

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
      <Header
        handleClick={addButton}
        buttonTitle={"Add"}
        headerLabel={"Branches"}
        subHeaderLabel={"Overview of Your Branches"}
      />

      {checkMoudles("suborganization", "r") && (
        <div className="w-full bg-white p-4 rounded-md shadow-hrms">
          <div className="text-gray-700 font-semibold mb-2 mt-0 text-[14px] mb-1">
            Filters
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="sm:w-72">
              <SingleSelectDropdown
                listData={subOrgs}
                // addRoute={checkMoudles("suborganization", "c") && "/subOrg/add"}
                feildName="name"
                hideLabel={true}
                showTip={true}
                showSerch={true}
                handleClick={(selected) => handleChange(selected)}
                selectedOption={subOrg}
                selectedOptionDependency={"_id"}
                inputName="Select Organization"
              />
            </div>
            <div>
              <button
                className="flex items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-popLight shadow-none text-popfont-medium px-2 py-2 rounded-md hover:bg-popMedium hover:shadow-none text-sm"
                onClick={handleClear}
              >
                clear
                <PiXBold className="w-4 h-4 cursor-pointer" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="">
        <Table
          tableName="Branch"
          tableJson={branchList}
          isLoading={branchLoading}
          labels={labels}
          onRowClick={editButton}
          actions={actions}
          paginationProps={{
            totalRecord,
            pageNo,
            limit,
            onDataChange: (page, limit, name = "") => {
              getBranchList({ page, limit, name });
            },
          }}
        />
      </div>
    </div>
  );
};

export default List;
