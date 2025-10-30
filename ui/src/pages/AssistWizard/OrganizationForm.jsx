import React, { useState, useEffect } from "react";
import { Typography, Input, Button, Chip } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
import Address from "../../components/Address/Address";
import { useDispatch } from "react-redux";
import { MdModeEditOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { usePrompt } from "../../context/PromptProvider";
import {
  GetOrganizationDetailsAction,
  GetBranchCreationAction,
} from "../../redux/Action/Wizard/WizardAction";

import { BranchCreateAction } from "../../redux/Action/Branch/BranchAction";
import {
  BranchGetAction,
  BranchEditAction,
  BranchStatusUpdateAction,
} from "../../redux/Action/Branch/BranchAction";
import { SubOrgEditAction } from "../../redux/Action/SubOrgAction/SubOrgAction";
import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";
import Table from "../../components/Table/Table";
import { SubOrgListAction } from "../../redux/Action/SubOrgAction/SubOrgAction";
const OrganizationForm = ({
  formData,
  handleInputChange,
  listData,
  typeOfIndustryList,
  setFinalData,
  setFormValidity,
  state,
  handleAdd,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.user);

  const checkMoudles = useCheckEnabledModule();
  const { showPrompt, hidePrompt } = usePrompt();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubOrg, setIsSubOrg] = useState(false);
  const [orgDetails, setOrgDetails] = useState(null);
  const [branchList, setBranchList] = useState([]);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [addressKey, setAddressKey] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false); // Track if we're in edit mode
  const [editingBranchId, setEditingBranchId] = useState(null); // Track which branch is being edited
  const [isBranchNameTouched, setIsBranchNameTouched] = useState(false);

  // Fetch organization details when component mounts
  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      setIsLoading(true);
      try {
        const result = await dispatch(GetOrganizationDetailsAction());
        if (GetOrganizationDetailsAction.fulfilled.match(result)) {
          const orgData = result.payload?.data;
          console.log("Organization structure:", orgData.structure);

          if (orgData) {
            setOrgDetails(orgData);
            // setIsSubOrg(
            //   orgData.structure === "group" ||
            //     orgData.structure === "organization"
            // );
            handleInputChange("orgName", orgData.name || "");
            handleInputChange("orgTypeId", orgData.orgTypeId || "");
            handleInputChange("structure", orgData.structure || "");
            handleInputChange("orgId", orgData._id || "");
            clearBranchForm();

            // Fetch branch list initially
            fetchBranchList(orgData._id);
          }
        }
      } catch (error) {
        console.error("Error fetching organization details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrganizationDetails();
  }, [dispatch]);

  // Fetch branch list function
  const fetchBranchList = async (orgId) => {
    try {
      const branchAction = await dispatch(
        BranchGetAction({
          orgId,
          mapedData: "branch",
          orgLevel: true,
        })
      );

      console.log("BranchGetAction payload:", branchAction.payload);

      if (BranchGetAction.fulfilled.match(branchAction)) {
        setBranchList(branchAction.payload?.data || []);
      } else {
        console.log("BranchGetAction not fulfilled:", branchAction);
        setBranchList([]);
      }
    } catch (error) {
      console.error("Error fetching branch list:", error);
      setBranchList([]);
    }
  };

  // Handle Update for Group structure
  const handleUpdate = async () => {
    if (!orgDetails?._id) {
      toast.error("Organization ID not found");
      return;
    }
    try {
      const payload = { _id: orgDetails._id, name: formData.orgName };
      if (isSubOrg && formData.groupName)
        payload.groupName = formData.groupName;

      const result = await dispatch(SubOrgEditAction(payload));
      if (SubOrgEditAction.fulfilled.match(result)) {
        toast.success("Organization updated successfully!");
      } else {
        toast.error(result.payload?.message || "Failed to update organization");
      }
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error("Something went wrong while updating");
    }
  };

  const convertTo12HourFormat = (time24) => {
    if (!time24) return "";

    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;

    return `${String(hours12).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )} ${period}`;
  };
  const addMinutesToTime = (time, minutes) => {
    if (!time || !minutes) return time;

    const [hours, mins] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + mins + Number(minutes);

    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;

    return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(
      2,
      "0"
    )}`;
  };

  // Helper function to subtract minutes from time (HH:MM format)
  const subtractMinutesFromTime = (time, minutes) => {
    if (!time || !minutes) return time;

    const [hours, mins] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + mins - Number(minutes);

    // Handle negative values (previous day)
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }

    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;

    return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(
      2,
      "0"
    )}`;
  };

  const formatMonthYear = (monthYearString) => {
    if (!monthYearString) return "";
    const date = new Date(monthYearString + "-01");
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };
  // ✅ Just update this useEffect to set isSubOrg
  useEffect(() => {
    const hasSubOrgPermission = user?.modules?.["suborganization"]?.r;

    console.log("User:", user);
    console.log("User Modules:", user?.modules);
    console.log("SubOrganization Read Permission:", hasSubOrgPermission);

    // ✅ Set isSubOrg based on permission
    setIsSubOrg(hasSubOrgPermission || false);

    if (hasSubOrgPermission) {
      console.log("SubOrganization read permission granted");
      dispatch(SubOrgListAction());
    } else {
      console.log("SubOrganization read permission denied");
    }
  }, [dispatch, user]);
  // Clear all branch form fields
  const clearBranchForm = () => {
    const fieldsToClear = {
      name: "",
      startTime: "",
      endTime: "",
      maxIn: "",
      minOut: "",
      salaryCycle: { startDay: "", endDay: "" },
      financialYear: { startDate: "", endDate: "" },
      weekOff: [],
    };

    Object.entries(fieldsToClear).forEach(([key, value]) => {
      handleInputChange(key, value);
    });

    setFinalData({
      address: {},
      geoLocation: {},
      geoJson: {},
    });

    setAddressKey((prev) => prev + 1);
    setIsEditMode(false);
    setEditingBranchId(null);
    setIsBranchNameTouched(false);
  };

  const handleAddBranch = async () => {
    // Validate required fields
    if (!formData.orgTypeId) {
      toast.error("Please select a Business Type before proceeding");
      return;
    }
    if (!state.address || Object.keys(state.address).length === 0) {
      toast.error("Please fill in the address correctly");
      return;
    }

    setIsAddingBranch(true);
    try {
      // Calculate grace period times in HH:mm format
      const actualMaxIn = addMinutesToTime(formData.startTime, formData.maxIn);
      const actualMinOut = subtractMinutesFromTime(
        formData.endTime,
        formData.minOut
      );

      const branchPayload = {
        name: formData.name || formData.orgName,
        address: state.address,
        geoLocation: state.geoLocation,
        geoJson: state.geoJson,
        timeSettingType: formData.timeSettingType || "startEnd",
        startTime: formData.startTime,
        endTime: formData.endTime,
        maxIn: actualMaxIn, //  Send as time format (e.g., "10:10")
        minOut: actualMinOut, //  Send as time format (e.g., "15:45")
        salaryCycle: {
          startDay: Number(formData.salaryCycle.startDay) || 1,
          endDay: Number(formData.salaryCycle.endDay) || 30,
        },
        financialYear: {
          startDate: formData.financialYear.startDate,
          endDate: formData.financialYear.endDate,
        },
        weekOff: formData.weekOff || [],
      };

      const branchAction = await dispatch(BranchCreateAction(branchPayload));

      if (BranchCreateAction.fulfilled.match(branchAction)) {
        toast.success("Branch created successfully!");
        handleInputChange("branchId", branchAction.payload?.data?._id);

        // Clear form
        clearBranchForm();

        // Fetch updated branch list
        await fetchBranchList(orgDetails._id);

        if (handleAdd) handleAdd();
      } else {
        toast.error(branchAction.payload?.message || "Failed to create branch");
      }
    } catch (error) {
      console.error("Error creating branch:", error);
      toast.error("Something went wrong while creating branch");
    } finally {
      setIsAddingBranch(false);
    }
  };

  // Handle Update Branch
  const handleUpdateBranch = async () => {
    // Validate required fields
    if (!formData.orgTypeId) {
      toast.error("Please select a Business Type before proceeding");
      return;
    }
    if (!state.address || Object.keys(state.address).length === 0) {
      toast.error("Please fill in the address correctly");
      return;
    }
    if (!editingBranchId) {
      toast.error("No branch selected for editing");
      return;
    }

    setIsAddingBranch(true);
    try {
      //  For UPDATE: Send as NUMBERS (minutes), not time format
      const branchPayload = {
        id: editingBranchId,
        name: formData.name,
        address: state.address,
        geoLocation: state.geoLocation,
        geoJson: state.geoJson,
        timeSettingType: formData.timeSettingType || "startEnd",
        startTime: formData.startTime,
        endTime: formData.endTime,
        maxIn: Number(formData.maxIn) || 0, // Send as NUMBER (minutes)
        minOut: Number(formData.minOut) || 0, //  Send as NUMBER (minutes)
        salaryCycle: {
          startDay: Number(formData.salaryCycle.startDay) || 1,
          endDay: Number(formData.salaryCycle.endDay) || 30,
        },
        financialYear: {
          startDate: formData.financialYear.startDate,
          endDate: formData.financialYear.endDate,
        },
        weekOff: formData.weekOff || [],
      };

      const branchAction = await dispatch(BranchEditAction(branchPayload));

      if (BranchEditAction.fulfilled.match(branchAction)) {
        toast.success("Branch updated successfully!");

        // Clear form
        clearBranchForm();

        // Fetch updated branch list
        await fetchBranchList(orgDetails._id);

        if (handleAdd) handleAdd();
      } else {
        toast.error(branchAction.payload?.message || "Failed to update branch");
      }
    } catch (error) {
      console.error("Error updating branch:", error);
      toast.error("Something went wrong while updating branch");
    } finally {
      setIsAddingBranch(false);
    }
  };

  const calculateMinutesDifference = (time1, time2) => {
    if (!time1 || !time2) return 0;

    const [hours1, mins1] = time1.split(":").map(Number);
    const [hours2, mins2] = time2.split(":").map(Number);

    const totalMins1 = hours1 * 60 + mins1;
    const totalMins2 = hours2 * 60 + mins2;

    return Math.abs(totalMins2 - totalMins1);
  };

  const handleEditBranch = async (branch) => {
    // Check permission
    if (checkMoudles("branch", "u") === false) {
      return toast.error("You are Unauthorized to Edit Branch!");
    }

    if (branch?.isActive === false) {
      return toast.error("Cannot Edit. Please Activate Branch First");
    }

    // Set edit mode
    setIsEditMode(true);
    setEditingBranchId(branch._id);

    //  Check if maxIn/minOut are in time format or minutes
    const isMaxInTimeFormat =
      typeof branch.maxIn === "string" && branch.maxIn.includes(":");
    const isMinOutTimeFormat =
      typeof branch.minOut === "string" && branch.minOut.includes(":");

    //  Convert time format back to minutes for form inputs
    const maxInMinutes = isMaxInTimeFormat
      ? calculateMinutesDifference(branch.startTime, branch.maxIn)
      : branch.maxIn;

    const minOutMinutes = isMinOutTimeFormat
      ? calculateMinutesDifference(branch.minOut, branch.endTime)
      : branch.minOut;

    // Populate form fields
    handleInputChange("name", branch.name);
    handleInputChange("startTime", branch.startTime);
    handleInputChange("endTime", branch.endTime);
    handleInputChange("maxIn", maxInMinutes); // ✅ Store as minutes for the form
    handleInputChange("minOut", minOutMinutes); // ✅ Store as minutes for the form
    handleInputChange("salaryCycle", branch.salaryCycle || {});
    handleInputChange("financialYear", branch.financialYear || {});
    handleInputChange("weekOff", branch.weekOff || []);
    handleInputChange("branchId", branch._id);

    setFinalData({
      address: branch.address,
      geoLocation: branch.geoLocation,
      geoJson: branch.geoJson,
    });

    // Update address key to force Address component to re-render with new data
    setAddressKey((prev) => prev + 1);

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const result = await dispatch(BranchEditAction(branch._id));
      if (BranchEditAction.fulfilled.match(result)) {
        console.log("Branch details fetched successfully", result.payload);
      }
    } catch (error) {
      console.error("Error fetching branch details:", error);
    }
  };
  // Handle Cancel Edit
  const handleCancelEdit = () => {
    clearBranchForm();
    toast.info("Edit cancelled");
  };

  // Handle branch status update
  const confirmUpdate = async (data) => {
    if (!data) return;

    const payload = {
      branchId: data._id,
      status: !data.isActive,
    };

    try {
      await dispatch(BranchStatusUpdateAction(payload));
      await fetchBranchList(orgDetails._id);
      toast.success(
        `Branch ${data.isActive ? "deactivated" : "activated"} successfully`
      );
    } catch (err) {
      toast.error("Status update failed");
    }
    hidePrompt();
  };

  const handleShowPrompt = (data) => {
    // Check permission
    if (checkMoudles("branch", "d") === false) {
      return toast.error("You are Unauthorized to Activate/Deactivate Branch!");
    }

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

  return (
    <div className="flex flex-col w-full space-y-10">
      <div className="flex flex-col w-full p-2 md:p-8 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg space-y-6 transition-all duration-300 border border-primary/40">
        <Typography className="text-primary mb-2 font-semibold text-[18px] capitalize">
          {isSubOrg ? "Group Details" : "Organization Details"}
        </Typography>

        {isLoading ? (
          <div className="text-center py-8">
            <Typography>Loading organization details...</Typography>
          </div>
        ) : (
          <>
            {/* Organization/Group Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {formData.structure === "group" && (
                <div className="col-span-1 md:col-span-2">
                  <Input
                    size="md"
                    label="Group Name"
                    placeholder="e.g., MWB Group"
                    value={formData.groupName || ""}
                    className="bg-white text-gray-900 rounded-md"
                    onChange={(e) =>
                      handleInputChange("groupName", e.target.value)
                    }
                  />
                </div>
              )}
              <div className="col-span-1 md:col-span-2">
                <Input
                  size="md"
                  label="Organization Name"
                  placeholder="e.g., MWB Technologies"
                  value={formData.orgName || ""}
                  className="bg-white text-gray-900 rounded-md"
                  onChange={(e) => handleInputChange("orgName", e.target.value)}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <SingleSelectDropdown
                  feildName="name"
                  listData={typeOfIndustryList}
                  inputName="Business Type"
                  selectedOptionDependency="_id"
                  selectedOption={formData?.orgTypeId}
                  handleClick={(value) =>
                    handleInputChange("orgTypeId", value._id)
                  }
                  hideLabel={true}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                color="green"
                size="md"
                className="rounded-xl px-6 py-2"
                onClick={handleUpdate}
              >
                Update
              </Button>
            </div>

            {/* Branch Section */}
            <div className="mt-2">
              <div className="flex justify-between items-center mb-4">
                <Typography className="text-primary font-semibold text-[18px] capitalize">
                  Branch Details
                </Typography>
                {isEditMode && (
                  <Chip
                    color="blue"
                    variant="ghost"
                    value="Edit Mode"
                    className="font-poppins"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <Input
                    size="md"
                    label="Branch Name"
                    placeholder="e.g., Mumbai Branch"
                    value={
                      isBranchNameTouched
                        ? formData.name
                        : branchList.length === 0
                        ? formData.orgName
                        : formData.name
                    }
                    className="bg-white text-gray-900 rounded-md"
                    onChange={(e) => {
                      setIsBranchNameTouched(true);
                      handleInputChange("name", e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Address
                    key={addressKey}
                    defaultAddressType="Branch Address"
                    state={state}
                    onChange={(data) => {
                      console.log("Address changed:", data);
                      setFinalData((prev) => ({ ...prev, ...data }));
                    }}
                    onValidate={(isValid) =>
                      setFormValidity((prev) => ({ ...prev, address: isValid }))
                    }
                  />
                </div>
              </div>

              <Typography className="text-primary mb-4 mt-6 font-medium text-[14px] capitalize">
                Branch Timings
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Input
                  size="md"
                  label="Start Time"
                  type="time"
                  value={formData.startTime || ""}
                  className="bg-white text-gray-900 rounded-md"
                  onChange={(e) =>
                    handleInputChange("startTime", e.target.value)
                  }
                />

                <Input
                  size="md"
                  label="End Time"
                  type="time"
                  value={formData.endTime || ""}
                  className="bg-white text-gray-900 rounded-md"
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                />

                <Input
                  size="md"
                  label="Grace In (Minutes)"
                  placeholder="Enter minutes"
                  type="number"
                  min="0"
                  value={formData.maxIn || ""}
                  className="bg-white text-gray-900 rounded-md"
                  onChange={(e) => handleInputChange("maxIn", e.target.value)}
                />

                <Input
                  size="md"
                  label="Grace Out (Minutes)"
                  placeholder="Enter minutes"
                  type="number"
                  min="0"
                  value={formData.minOut || ""}
                  className="bg-white text-gray-900 rounded-md"
                  onChange={(e) => handleInputChange("minOut", e.target.value)}
                />
              </div>

              {/* Salary Cycle */}
              <div className="col-span-1 md:col-span-2 mt-6">
                <Typography className="text-primary mb-4 font-medium text-[14px] capitalize">
                  Salary Cycle
                </Typography>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    size="md"
                    label="Salary Cycle Start Day"
                    placeholder="e.g., 25"
                    type="number"
                    min="1"
                    max="31"
                    value={formData.salaryCycle?.startDay || ""}
                    className="bg-white text-gray-900 rounded-md"
                    onChange={(e) =>
                      handleInputChange("salaryCycle", {
                        ...formData.salaryCycle,
                        startDay: e.target.value,
                      })
                    }
                  />

                  <Input
                    size="md"
                    label="Salary Cycle End Day"
                    placeholder="e.g., 24"
                    type="number"
                    min="1"
                    max="31"
                    value={formData.salaryCycle?.endDay || ""}
                    className="bg-white text-gray-900 rounded-md"
                    onChange={(e) =>
                      handleInputChange("salaryCycle", {
                        ...formData.salaryCycle,
                        endDay: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Financial Year - Month Dropdowns */}
              <div className="col-span-1 md:col-span-2 mt-6">
                <Typography className="text-primary mb-4 font-medium text-[14px] capitalize">
                  Financial Year
                </Typography>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    size="md"
                    label="Start Month & Year"
                    type="month"
                    value={formData.financialYear?.startDate || ""}
                    className="bg-white text-gray-900 rounded-md"
                    onChange={(e) =>
                      handleInputChange("financialYear", {
                        ...formData.financialYear,
                        startDate: e.target.value,
                      })
                    }
                  />

                  <Input
                    size="md"
                    label="End Month & Year"
                    type="month"
                    value={formData.financialYear?.endDate || ""}
                    className="bg-white text-gray-900 rounded-md"
                    onChange={(e) =>
                      handleInputChange("financialYear", {
                        ...formData.financialYear,
                        endDate: e.target.value,
                      })
                    }
                  />

                  {/* <SingleSelectDropdown
                    feildName="name"
                    listData={monthList}
                    inputName="End Month"
                    selectedOptionDependency="_id"
                    selectedOption={formData.financialYear?.endDate}
                    handleClick={(value) =>
                      handleInputChange("financialYear", {
                        ...formData.financialYear,
                        endDate: value._id,
                      })
                    }
                    hideLabel={true}
                  /> */}
                </div>
              </div>

              {/* Week Off */}
              <div className="col-span-1 md:col-span-2 mt-6">
                <Typography className="text-primary mb-4 font-medium text-[14px] capitalize">
                  Week Off
                </Typography>
                <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <label
                      key={day}
                      className={`cursor-pointer p-3 border rounded-md text-center transition ${
                        formData.weekOff?.includes(day)
                          ? "bg-blue-50 border-blue-500 text-blue-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.weekOff?.includes(day) || false}
                        onChange={(e) => {
                          let updatedWeekOff = [...(formData.weekOff || [])];
                          if (e.target.checked) {
                            updatedWeekOff.push(day);
                          } else {
                            updatedWeekOff = updatedWeekOff.filter(
                              (d) => d !== day
                            );
                          }
                          handleInputChange("weekOff", updatedWeekOff);
                        }}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                {isEditMode && (
                  <Button
                    color="red"
                    size="lg"
                    variant="outlined"
                    className="rounded-xl px-8 py-3"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  className="bg-primary  text-white rounded-xl "
                  size="md"
                  onClick={isEditMode ? handleUpdateBranch : handleAddBranch}
                  disabled={isAddingBranch}
                >
                  {isAddingBranch
                    ? isEditMode
                      ? "Updating..."
                      : "Adding..."
                    : isEditMode
                    ? "Update Branch"
                    : isSubOrg
                    ? "Add Branch"
                    : "Add"}
                </Button>
              </div>

              {/* Branch List Display */}
              {branchList.length > 0 && (
                <div className="mt-8">
                  <Typography className="text-primary mb-4 font-semibold text-[16px]">
                    Branch List ({branchList.length})
                  </Typography>

                  <div className="">
                    <Table
                      tableName="Branch"
                      tableJson={branchList}
                      isLoading={false}
                      hideColumns={true}
                      labels={{
                        name: {
                          DisplayName: "Name",
                        },
                        startTime: {
                          DisplayName: "Start Time",
                          type: "function",
                          data: (data, idx) => {
                            return (
                              <span key={idx}>
                                {convertTo12HourFormat(data.startTime)}
                              </span>
                            );
                          },
                        },
                        endTime: {
                          DisplayName: "End Time",
                          type: "function",
                          data: (data, idx) => {
                            return (
                              <span key={idx}>
                                {convertTo12HourFormat(data.endTime)}
                              </span>
                            );
                          },
                        },
                        maxIn: {
                          DisplayName: "Grace In (Time)",
                          type: "function",
                          data: (data, idx) => {
                            //  Check if maxIn is already in time format or is a number (minutes)
                            const isTimeFormat =
                              typeof data.maxIn === "string" &&
                              data.maxIn.includes(":");
                            const graceInTime = isTimeFormat
                              ? data.maxIn // Already in HH:mm format
                              : addMinutesToTime(data.startTime, data.maxIn); // Convert minutes to time

                            return (
                              <span key={idx}>
                                {convertTo12HourFormat(graceInTime)}
                              </span>
                            );
                          },
                        },
                        minOut: {
                          DisplayName: "Grace Out (Time)",
                          type: "function",
                          data: (data, idx) => {
                            //  Check if minOut is already in time format or is a number (minutes)
                            const isTimeFormat =
                              typeof data.minOut === "string" &&
                              data.minOut.includes(":");
                            const graceOutTime = isTimeFormat
                              ? data.minOut // Already in HH:mm format
                              : subtractMinutesFromTime(
                                  data.endTime,
                                  data.minOut
                                ); // Convert minutes to time

                            return (
                              <span key={idx}>
                                {convertTo12HourFormat(graceOutTime)}
                              </span>
                            );
                          },
                        },
                      }}
                      onRowClick={handleEditBranch}
                      actions={[
                        {
                          title: "Edit",
                          text: <MdModeEditOutline className="w-5 h-5" />,
                          onClick: (branch) => {
                            handleEditBranch(branch);
                          },
                        },
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrganizationForm;
