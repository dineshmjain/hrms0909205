import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
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
import { ShiftGetAction, ShiftCreateAction } from "../../../redux/Action/Shift/ShiftAction";
import { ShiftUpdateAction } from "../../../redux/Action/Shift/ShiftAction";
import SingleSelectDropdown from "../../../components/SingleSelectDropdown/SingleSelectDropdown";
import FormikInput from "../../../components/input/FormikInput";
import { BranchGetAction } from "../../../redux/Action/Branch/BranchAction";
import moment from "moment";
import { removeEmptyStrings } from "../../../constants/reusableFun";
const ShiftTab = ({ state }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkMoudles = useCheckEnabledModule();
  const [selectedClientBranch, setSelectedClientBranch] = useState({});
  const [shiftDetails, setShiftDetails] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const { showPrompt, hidePrompt } = usePrompt();
  const { clientBranchList = [] } = useSelector((state) => state.clientBranch || {});
  const { shiftList, loading, totalRecord, pageNo, limit } = useSelector(
    (state) => state?.shift
  );

  // Shift validation schema
  const getShiftValidationSchema = () => {
    return Yup.object({
      name: Yup.string().required("Shift name is required"),
      startTime: Yup.string().required("Start time is required"),
      endTime: Yup.string().required("End time is required"),
      reportingMinsBefore: Yup.number()
        .min(0, "Reporting time cannot be negative")
        .max(1440, "Reporting time cannot exceed 24 hours")
        .when("isReportingRequired", {
          is: true,
          then: (schema) => schema.required("Reporting time is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
    });
  };

  // Shift submit handler
  const handleShiftSubmit = async (values) => {
    // Validation
    if (!shiftDetails.shiftName || !shiftDetails.startTime || !shiftDetails.endTime) {
      toast.error("Please fill in all required fields (Shift Name, Start Time, End Time)");
      return;
    }
    
    if (shiftDetails.isReportingRequired && (!shiftDetails.reportingMinsBefore || shiftDetails.reportingMinsBefore <= 0)) {
      toast.error("Please enter a valid reporting time (minutes before shift starts)");
      return;
    }

    if (isEditMode) {
      // Edit mode - just log the data
      console.log("Edit Shift Data:", {
        editingShift,
        shiftDetails,
        payload: {
          clientId: state.clientId,
          clientMappedId: state._id,
          branchIds: shiftDetails.branch,
          name: shiftDetails.shiftName,
          startTime: shiftDetails.startTime,
          endTime: shiftDetails.endTime,
          reportTimeIn: shiftDetails?.isReportingRequired ? 
            moment(shiftDetails?.startTime, "HH:mm").subtract(shiftDetails?.reportingTime, "minutes").format("HH:mm") : null,
        }
      });
      toast.success("Edit shift logged successfully!");
      // Reset to add mode
      setIsEditMode(false);
      setEditingShift(null);
      setShiftDetails({ branch: "", shiftName: "", startTime: "", endTime: "", isReportingRequired: false, reportingMinsBefore: "" });
      return;
    }

    // Add mode - create new shift
    const newTime = moment(shiftDetails?.startTime, "HH:mm").subtract(shiftDetails?.reportingTime, "minutes").format("HH:mm");
    const payload = {
      clientId: state.clientId,
      clientMappedId: state._id,
      branchIds: shiftDetails.branch,
      name: shiftDetails.shiftName,
      startTime: shiftDetails.startTime,
      endTime: shiftDetails.endTime,
      reportTimeIn: shiftDetails?.isReportingRequired ? newTime : null,
    }
    console.log(payload, "payload to add shift");
    const cleanedData = removeEmptyStrings(payload);
    const result = await dispatch(ShiftCreateAction(cleanedData));
    const { meta, payload: resPayload } = result;
    debugger
    if (meta.requestStatus === 'fulfilled') {
      toast.success(resPayload?.message || 'Shift created successfully!');
      dispatch(ShiftGetAction({
        orgId: state._id, branchId: selectedClientBranch.branchId,
      }));
      // Reset all fields to empty
      setShiftDetails({ branch: "", shiftName: "", startTime: "", endTime: "", isReportingRequired: false, reportingMinsBefore: "" })
    }
  };

 useEffect(() => {
    if (state?._id) {
      dispatch(clientBranchListAction({ clientMappedId: state?._id }));
    }
  }, [dispatch, state?._id]);

  useEffect(() => {
    setSelectedClientBranch(null);
  }, [state?._id]);

  useEffect(() => {
    if (clientBranchList?.length > 0) {
      const first = clientBranchList[0];
      setSelectedClientBranch({ branchId: first._id, name: first.name });
    }
  }, [clientBranchList]);


  const getShiftList = (params) => {
    const json = {
      orgId: params?._id,
    }
    if (selectedClientBranch) {
      json.branchId = selectedClientBranch.branchId;
    }
    dispatch(ShiftGetAction(json));
  };



  useEffect(() => {
    if (selectedClientBranch) {
      getShiftList(state);
    }
  }, [selectedClientBranch]);

  const handleBranchSelect = (data) => {
    setSelectedClientBranch((prev) => ({
      ...prev,
      branchId: data?._id,
    }));
  };
  ;

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

    if (checkMoudles("client", "u") == false)
      return toast.error("You are Unauthorized to Edit Client Shift!");
    setIsEditMode(true);
    setEditingShift(rowData);    
    setShiftDetails({
      branch: rowData.branchId || [],
      shiftName: rowData.name || "",
      startTime: rowData.startTime || "",
      endTime: rowData.endTime || "",
      isReportingRequired: rowData.reportTimeIn ? true : false,
      reportingMinsBefore: rowData.reportingMinsBefore || ""
    });
    
    // Scroll to form
    const formElement = document.querySelector('.shift-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
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

  // useEffect(() => {
  //   getShiftList(state);
  // }, []);
  return (
    <>
      {" "}
      {/* <Header
        headerLabel={"Shifts" + " of " + state?.name}
        handleClick={addButton}
      /> */}

      {/* Add/Edit Shift Form */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 shift-form">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">
          {isEditMode ? "Edit Shift" : "Add New Shift"}
        </h4>
        <Formik
          initialValues={{
            clientId: state?._id || "",
            branchId: "",
            name: "",
            startTime: "",
            endTime: "",
            isReportingRequired: false,
            reportingMinsBefore: "",
            isActive: true
          }}
          validationSchema={getShiftValidationSchema()}
        >
          {({ values: shiftValues, setFieldValue: setShiftFieldValue, resetForm: resetShiftForm, isSubmitting: isShiftSubmitting }) => (
            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="w-[250px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client (Current)
                  </label>
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                    {state?.name || 'Current Client'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Shifts will be created for this client
                  </p>
                </div>
                <div className="mt-1">
                  <FormikInput
                    name="selectedBranches"
                    label="Select Branches"
                    inputType="multiDropdown"
                    selectedData={shiftDetails.branch}
                    data={clientBranchList}
                    Dependency="_id"
                    FeildName="name"
                    type={"object"}
                    InputName={"Branches"}
                    setSelectedData={(branches) => setShiftDetails(prev => ({ ...prev, branch: branches }))}
                    hideLabel
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <FormikInput
                  name="shiftName"
                  label="Shift Name"
                  inputType="input"
                  placeholder="e.g., Morning Shift"
                  editValue={shiftDetails.shiftName}
                  onChange={(e) =>
                    setShiftDetails((prev) => ({
                      ...prev,
                      shiftName: e.target.value,
                    }))
                  }
                />
                <FormikInput
                  name="startTime"
                  label="Start Time"
                  inputType="input"
                  type="time"
                  editValue={shiftDetails.startTime}
                  onChange={(e) =>
                    setShiftDetails((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                />

                <FormikInput
                  name="endTime"
                  label="End Time"
                  inputType="input"
                  type="time"
                  editValue={shiftDetails.endTime}
                  onChange={(e) =>
                    setShiftDetails((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex gap-6 items-center">
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shiftDetails.isReportingRequired}
                    onChange={(e) => {
                      setShiftDetails(prev => ({ ...prev, isReportingRequired: e.target.checked }))
                      // setShiftFieldValue("isReportingRequired", e.target.checked);
                      if (!e.target.checked) {
                        setShiftDetails(prev => ({ ...prev, reportingTime: "" }))
                        // setShiftFieldValue("reportingMinsBefore", "");reportingTime
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Is Reporting Time Required?
                  </span>
                </label>
              </div>
              {shiftDetails.isReportingRequired && (
                <div className="w-[250px]">
                  <FormikInput
                    name="reportingMinsBefore"
                    label="Minutes Before Shift Start"
                    inputType="input"
                    type="number"
                    placeholder="e.g., 15"
                    onChange={(e) =>
                      setShiftDetails((prev) => ({
                        ...prev,
                        reportingTime: e.target.value,
                      }))
                    }
                    editValue={shiftDetails.reportingTime}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Staff must report {shiftDetails.reportingTime || '___'} minutes before shift starts
                  </p>
                </div>
              )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditMode(false);
                      setEditingShift(null);
                      setShiftDetails({ branch: "", shiftName: "", startTime: "", endTime: "", isReportingRequired: false, reportingMinsBefore: "" });
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-semibold shadow-lg hover:shadow-xl"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  onClick={handleShiftSubmit}
                  className="flex items-center gap-2 px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditMode ? "Edit Shift" : "Add Shift"}
                </button>
              </div>
              </div>
          )}
        </Formik>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-3">
        <SingleSelectDropdown
          listData={clientBranchList ?? []}
          inputName="Client Branch"
          hideLabel={true}
          showTip={false}
          feildName="name"
          selectedOption={selectedClientBranch?.branchId}
          selectedOptionDependency={"_id"}
          handleClick={handleBranchSelect}
        />
      </div>
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
