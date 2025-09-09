import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table/Table";
import { usePrompt } from "../../context/PromptProvider";
import { MdModeEditOutline } from "react-icons/md";
import { Button, Chip } from "@material-tailwind/react";
import {
  DepartmentEditAction,
  DepartmentGetAction,
} from "../../redux/Action/Department/DepartmentAction";
import Header from "../../components/header/Header";
import Filter from "../../components/Filter/Filter";
import toast from "react-hot-toast";
import { useState } from "react";
import { removeEmptyStrings } from "../../constants/reusableFun";

const List = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showPrompt, hidePrompt } = usePrompt();
  const [selectedFilters, setSelectedFilters] = useState({
    subOrgId: "",
    branchId: "",

  });

  const { departmentList, loading, totalRecord, pageNo, limit } = useSelector(
    (state) => state?.department
  );
  // useEffect(() => {
  //   getDepartmentList();
  // }, [dispatch]);

  const getDepartmentList = async (params = {}) => {
    try {
      let filters = {
        ...selectedFilters,
        category: "assigned",
        mapedData: "department",
      };
      const updatedParams = removeEmptyStrings({ ...params, ...filters });

      await dispatch(DepartmentGetAction(updatedParams));
    } catch (error) {
      return error;
    }
  };

  // Navigation functions
  const addButton = () => navigate("/department/add");
  const editButton = (branch) => {
    if (branch.isActive == false) {
      return toast.error("Cannot Edit Please Activate");
    } else {
      navigate("/department/edit", { state: branch });
    }
  };

  const confirmUpdate = (data) => {
    if (!data) return;
    const payload = {
      departmentId: data._id,
      isActive: !data.isActive,
    };
    dispatch(DepartmentEditAction(payload))
      .then(() => getDepartmentList({ page: pageNo, limit: limit }))
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
          <b>{data.name}</b> Branch?
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
      DisplayName: "Name",
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
                  handleShowPrompt(data);
                }}
              />
            </div>
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

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
      <Header
        handleClick={addButton}
        buttonTitle={"Add"}
        headerLabel={"Department"}
        subHeaderLabel={"Overview of Your Department"}
      />
      {/* <div className="w-full bg-white p-4">
        <Filter
          pageName={"department"}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          onSet={() => {
            getDepartmentList({ page: 1, limit: 10 });
          }}
        />
      </div> */}

      <div className="">
        <Table
          tableName="Department"
          tableJson={departmentList}
          labels={labels}
          onRowClick={editButton}
          isLoading={loading}
          paginationProps={{
            totalRecord,
            pageNo,
            limit,
            onDataChange: (page, limit, name = "") => {
              getDepartmentList({ page, limit, name });
            },
          }}
          actions={actions}
        />
      </div>
    </div>
  );
};

export default List;
