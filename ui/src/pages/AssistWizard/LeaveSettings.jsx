import React, { useEffect, useState, useRef } from "react";
import {
  Typography,
  Input,
  Select,
  Option,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import { MoreVertical, ChevronDown, ChevronUp } from "lucide-react";
import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";

import { useDispatch, useSelector } from "react-redux";
import {
  LeavePolicyNameGetAction,
  LeavePolicyCreateAction,
  LeavePolicyGetAction,
  LeavePolicyUpdateAction,
} from "../../redux/Action/Leave/LeaveAction";

const LeaveSettings = ({ formData, handleInputChange, branchList }) => {
  const dispatch = useDispatch();

  // Redux state
  const leavePolicyList = useSelector(
    (state) => state.leave.LeavePolicyNameList || []
  );
  const leaveList = useSelector((state) => state.leave.PolicyList || []);

  const sortedLeavePolicyList = React.useMemo(() => {
    if (!leavePolicyList || leavePolicyList.length === 0) return [];

    const priorityLeaves = ["Paid Leave", "UnPaid Leave"];

    return [...leavePolicyList].sort((a, b) => {
      const aIndex = priorityLeaves.indexOf(a.name);
      const bIndex = priorityLeaves.indexOf(b.name);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });
  }, [leavePolicyList]);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [localLeaveData, setLocalLeaveData] = useState({});

  // ADDED: Track which policy is being saved to prevent data loss
  const savingPolicyIdRef = useRef(null);
  // ADDED: Track previous branch to detect branch changes
  const prevBranchRef = useRef(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Auto-select first branch when branchList is available
  useEffect(() => {
    if (branchList && branchList.length > 0 && !selectedBranch) {
      setSelectedBranch(branchList[0]._id);
    }
  }, [branchList, selectedBranch]);

  // Fetch leave policies
  useEffect(() => {
    dispatch(LeavePolicyNameGetAction());
    dispatch(LeavePolicyGetAction({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Initialize local data for all leave types when branch is selected
  // FIXED: Preserve unsaved changes when data refreshes after Add/Update
  // BUT: Reset everything when branch changes
  useEffect(() => {
    if (selectedBranch && sortedLeavePolicyList.length > 0) {
      // Check if branch has changed
      const branchChanged =
        prevBranchRef.current !== null &&
        prevBranchRef.current !== selectedBranch;

      // Update the ref for next comparison
      prevBranchRef.current = selectedBranch;

      // If branch changed, reset everything (don't preserve)
      if (branchChanged) {
        const initialData = {};

        sortedLeavePolicyList.forEach((policy) => {
          const existingLeave = leaveList.find(
            (l) =>
              l.branchId === selectedBranch && l.leavePolicyId === policy._id
          );

          if (existingLeave) {
            let yearlyTotal;
            if (existingLeave.yearlyLeaveCount) {
              yearlyTotal = existingLeave.yearlyLeaveCount;
            } else if (
              existingLeave.noOfDays &&
              existingLeave.cycle?.type === "monthly"
            ) {
              yearlyTotal = existingLeave.noOfDays * 12;
            } else {
              yearlyTotal = existingLeave.noOfDays || 0;
            }

            initialData[policy._id] = {
              ...existingLeave,
              noOfDays: yearlyTotal,
              isExisting: true,
            };
          } else {
            initialData[policy._id] = {
              _id: null,
              leavePolicyId: policy._id,
              leavePolicyName: policy.name,
              branchId: selectedBranch,
              noOfDays: "",
              cycle: {
                type: "monthly",
                creditedDay: "",
                creditedMonth: "January",
              },
              carryForwardEnabled: true,
              carryForwardCycle: "monthly",
              salaryConversionEnabled: false,
              isExisting: false,
            };
          }
        });

        setLocalLeaveData(initialData);
        return;
      }

      // Branch NOT changed - preserve unsaved changes
      setLocalLeaveData((prevData) => {
        const initialData = {};

        sortedLeavePolicyList.forEach((policy) => {
          const existingLeave = leaveList.find(
            (l) =>
              l.branchId === selectedBranch && l.leavePolicyId === policy._id
          );

          const prevPolicy = prevData[policy._id];
          const isCurrentlySaving = savingPolicyIdRef.current === policy._id;

          // Check if this row has unsaved local changes
          let hasUnsavedChanges = false;
          if (prevPolicy) {
            if (!prevPolicy.isExisting && prevPolicy.noOfDays !== "") {
              // New row with entered data
              hasUnsavedChanges = true;
            } else if (prevPolicy.isExisting && existingLeave) {
              // Existing row - check if any field was modified
              const backendYearlyTotal =
                existingLeave.yearlyLeaveCount ||
                (existingLeave.cycle?.type === "monthly"
                  ? existingLeave.noOfDays * 12
                  : existingLeave.noOfDays) ||
                0;

              hasUnsavedChanges =
                prevPolicy.noOfDays !== backendYearlyTotal ||
                prevPolicy.cycle?.type !== existingLeave.cycle?.type ||
                prevPolicy.cycle?.creditedDay !==
                  existingLeave.cycle?.creditedDay ||
                prevPolicy.cycle?.creditedMonth !==
                  existingLeave.cycle?.creditedMonth ||
                prevPolicy.carryForwardEnabled !==
                  existingLeave.carryForwardEnabled ||
                prevPolicy.salaryConversionEnabled !==
                  existingLeave.salaryConversionEnabled ||
                prevPolicy.carryForwardCycle !==
                  existingLeave.carryForwardCycle ||
                prevPolicy.salaryConversionCycle !==
                  existingLeave.salaryConversionCycle ||
                prevPolicy.maxLeavesConvertSalary !==
                  existingLeave.maxLeavesConvertSalary ||
                prevPolicy.leaveEncashmentRatePerDaySalary !==
                  existingLeave.leaveEncashmentRatePerDaySalary ||
                prevPolicy.salaryConversionBase !==
                  existingLeave.salaryConversionBase;
            }
          }

          if (existingLeave) {
            // Always store the yearly total for display
            let yearlyTotal;
            if (existingLeave.yearlyLeaveCount) {
              yearlyTotal = existingLeave.yearlyLeaveCount;
            } else if (
              existingLeave.noOfDays &&
              existingLeave.cycle?.type === "monthly"
            ) {
              yearlyTotal = existingLeave.noOfDays * 12;
            } else {
              yearlyTotal = existingLeave.noOfDays || 0;
            }

            // Only update from backend if this row was just saved OR has no local changes
            if (isCurrentlySaving) {
              initialData[policy._id] = {
                ...existingLeave,
                noOfDays: yearlyTotal,
                isExisting: true,
              };
              // Clear the saving flag
              savingPolicyIdRef.current = null;
            } else if (hasUnsavedChanges) {
              // Preserve unsaved local changes
              initialData[policy._id] = prevPolicy;
            } else {
              // No unsaved changes, use backend data
              initialData[policy._id] = {
                ...existingLeave,
                noOfDays: yearlyTotal,
                isExisting: true,
              };
            }
          } else if (prevPolicy && !isCurrentlySaving) {
            // No backend data but we have local data - preserve it
            initialData[policy._id] = prevPolicy;
          } else {
            // Initialize new entry
            initialData[policy._id] = {
              _id: null,
              leavePolicyId: policy._id,
              leavePolicyName: policy.name,
              branchId: selectedBranch,
              noOfDays: "",
              cycle: {
                type: "monthly",
                creditedDay: "",
                creditedMonth: "January",
              },
              carryForwardEnabled: true,
              carryForwardCycle: "monthly",
              salaryConversionEnabled: false,
              isExisting: false,
            };
          }
        });

        return initialData;
      });
    } else {
      setLocalLeaveData({});
    }
  }, [selectedBranch, sortedLeavePolicyList, leaveList]);

  const toggleRowExpansion = (policyId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [policyId]: !prev[policyId],
    }));
  };

  const handleLocalUpdate = (policyId, field, value) => {
    setLocalLeaveData((prev) => {
      const currentData = prev[policyId];
      const updated = { ...currentData };

      switch (field) {
        case "noOfDays":
          updated.noOfDays = value === "" ? "" : Number(value);
          break;
        case "cycleType":
          updated.cycle = {
            ...updated.cycle,
            type: value,
          };
          break;
        case "creditedDay":
          updated.cycle = {
            ...updated.cycle,
            creditedDay: value === "" ? "" : Number(value),
          };
          break;
        case "creditedMonth":
          updated.cycle = {
            ...updated.cycle,
            creditedMonth: value,
          };
          break;
        case "leaveHandling":
          updated.carryForwardEnabled = value === "Carry Forward";
          updated.salaryConversionEnabled = value === "Convert to Salary";
          if (value === "Carry Forward" && !updated.carryForwardCycle) {
            updated.carryForwardCycle = "monthly";
          }
          if (value === "Convert to Salary" && !updated.salaryConversionCycle) {
            updated.salaryConversionCycle = "monthly";
            updated.salaryConversionBase = "basic";
            updated.leaveEncashmentRatePerDaySalary = "";
          }
          break;
        case "handlingType":
          if (updated.carryForwardEnabled) {
            updated.carryForwardCycle = value.toLowerCase();
          }
          if (updated.salaryConversionEnabled) {
            updated.salaryConversionCycle = value.toLowerCase();
          }
          break;
        case "maxAllowedLeave":
          updated.maxLeavesConvertSalary = value === "" ? "" : Number(value);
          break;
        case "salaryBasis":
          updated.salaryConversionBase = value.toLowerCase();
          break;
        case "salaryPercent":
          updated.leaveEncashmentRatePerDaySalary =
            value === "" ? "" : Number(value);
          break;
      }

      return {
        ...prev,
        [policyId]: updated,
      };
    });
  };

  const handleSaveLeave = (policyId) => {
    const leaveData = localLeaveData[policyId];
    if (!leaveData) return;

    // ADDED: Mark this row as being saved
    savingPolicyIdRef.current = policyId;

    // Build the base payload
    let payload = {
      branchId: leaveData.branchId,
      cycle: {
        type: leaveData.cycle.type,
        creditedDay: leaveData.cycle.creditedDay || 1,
        ...(leaveData.cycle.type === "yearly"
          ? { creditedMonth: leaveData.cycle.creditedMonth }
          : {}),
      },
      carryForwardEnabled: leaveData.carryForwardEnabled,
      salaryConversionEnabled: leaveData.salaryConversionEnabled,
      isExpiredLeaveAtMonthEnd: false,
    };

    // Add carryForwardCycle if carry forward is enabled
    if (leaveData.carryForwardEnabled) {
      payload.carryForwardCycle = leaveData.carryForwardCycle;
    }

    // Add salary conversion fields if enabled
    if (leaveData.salaryConversionEnabled) {
      payload.salaryConversionCycle = leaveData.salaryConversionCycle;
      payload.maxLeavesConvertSalary = leaveData.maxLeavesConvertSalary || 0;
      payload.leaveEncashmentRatePerDaySalary =
        leaveData.leaveEncashmentRatePerDaySalary || 0;
      payload.salaryConversionBase = leaveData.salaryConversionBase || "basic";
    }

    // Handle noOfDays vs yearlyLeaveCount based on cycle type
    if (leaveData.cycle.type === "monthly") {
      payload.noOfDays = leaveData.noOfDays ? leaveData.noOfDays / 12 : 0;
      delete payload.yearlyLeaveCount;
    } else if (leaveData.cycle.type === "yearly") {
      payload.noOfDays = leaveData.noOfDays || 0;
      payload.yearlyLeaveCount = leaveData.noOfDays || 0;
    }

    console.log(
      "Leave Payload before dispatch:",
      JSON.stringify(payload, null, 2)
    );

    if (leaveData.isExisting && leaveData._id) {
      const updatePayload = {
        _id: leaveData._id,
        ...payload,
      };
      console.log("Update Payload:", JSON.stringify(updatePayload, null, 2));
      dispatch(LeavePolicyUpdateAction(updatePayload)).then(() => {
        dispatch(LeavePolicyGetAction({ page: 1, limit: 100 }));
      });
    } else {
      const createPayload = {
        leavePolicyId: policyId,
        ...payload,
      };
      console.log("Create Payload:", JSON.stringify(createPayload, null, 2));
      dispatch(LeavePolicyCreateAction(createPayload)).then(() => {
        dispatch(LeavePolicyGetAction({ page: 1, limit: 100 }));
      });
    }
  };

  const handleDeleteLeave = (policyId) => {
    const leaveData = localLeaveData[policyId];
    if (!leaveData?.isExisting) {
      setLocalLeaveData((prev) => ({
        ...prev,
        [policyId]: {
          ...prev[policyId],
          noOfDays: "",
          cycle: {
            type: "monthly",
            creditedDay: "",
            creditedMonth: "January",
          },
          carryForwardEnabled: false,
          salaryConversionEnabled: false,
        },
      }));
      return;
    }

    if (window.confirm("Are you sure you want to delete this leave policy?")) {
      console.log("Deleting leave:", leaveData._id);
      dispatch(LeavePolicyGetAction({ page: 1, limit: 100 }));
    }
  };

  const allLeaveTypes = Object.values(localLeaveData);

  return (
    <div className="flex w-full flex-col space-y-2 md:p-8 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg transition-all duration-300 border border-primary/40">
      <Typography variant="h5" color="blue-gray" className="mb-6 font-bold">
        Leave Settings
      </Typography>

      {/* Branch Selection */}
      <div className="mb-6">
        <SingleSelectDropdown
          inputName="Select Branch"
          listData={branchList}
          selectedOption={selectedBranch}
          selectedOptionDependency="_id"
          feildName="name"
          placeholder="Select Branch"
          handleClick={(branch) => setSelectedBranch(branch._id)}
          hideLabel={true}
        />
      </div>

      {/* Show table only when branch is selected */}
      {selectedBranch && allLeaveTypes.length > 0 && (
        <div className="rounded-lg overflow-hidden border border-gray-200 shadow-md bg-white">
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-primary text-white">
                  <th className="border-r border-blue-500 text-left text-sm font-semibold px-4 py-3 w-[200px]">
                    Leave Type
                  </th>
                  <th className="border-r border-blue-500 text-center text-sm font-semibold px-3 py-3 w-[110px]">
                    Yearly Count
                  </th>
                  <th className="border-r border-blue-500 text-center text-sm font-semibold px-3 py-3 w-[180px]">
                    Distribution
                  </th>
                  <th className="border-r border-blue-500 text-center text-sm font-semibold px-3 py-3 w-[120px]">
                    Credited Day
                  </th>
                  <th className="text-center text-sm font-semibold px-4 py-3 w-[180px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {allLeaveTypes.map((leave, index) => {
                  const policyId = leave.leavePolicyId;
                  const isEven = index % 2 === 0;
                  const monthlyCount = leave.noOfDays ? leave.noOfDays / 12 : 0;
                  return (
                    <React.Fragment key={policyId}>
                      {/* Main Row */}
                      <tr
                        className={`${
                          isEven ? "bg-gray-50" : "bg-white"
                        } hover:bg-blue-50 transition-colors border-b border-gray-200`}
                      >
                        <td className="border-r border-gray-200 px-4 py-3 font-medium text-gray-800">
                          {leave.leavePolicyName}
                          {!leave.isExisting && (
                            <span className="ml-2 text-xs text-orange-600 italic font-normal">
                              (Not Added)
                            </span>
                          )}
                        </td>
                        <td className="border-r border-gray-200 px-3 py-3">
                          <Input
                            type="number"
                            value={leave.noOfDays}
                            onChange={(e) =>
                              handleLocalUpdate(
                                policyId,
                                "noOfDays",
                                e.target.value
                              )
                            }
                            className="!border-blue-gray-200 focus:!border-blue-500 w-full"
                            containerProps={{ className: "min-w-0" }}
                            labelProps={{
                              className:
                                "before:content-none after:content-none",
                            }}
                            min={0}
                            step="0.01"
                          />
                        </td>
                        <td className="border-r border-gray-200 px-3 py-3">
                          <div className="flex items-center gap-2">
                            <Select
                              label="Cycle Type"
                              value={
                                leave.cycle?.type === "monthly" ||
                                !leave.cycle?.type
                                  ? "Monthly"
                                  : "Yearly"
                              }
                              onChange={(val) => {
                                handleLocalUpdate(
                                  policyId,
                                  "cycleType",
                                  val.toLowerCase()
                                );
                              }}
                              className="min-w-[130px]"
                              containerProps={{ className: "min-w-[130px]" }}
                            >
                              <Option value="Monthly">Monthly</Option>
                              <Option value="Yearly">Yearly</Option>
                            </Select>
                            <span className="text-xs text-blue-600 font-bold whitespace-nowrap bg-blue-50 px-2 py-1 rounded">
                              {leave.cycle?.type === "monthly" ||
                              !leave.cycle?.type
                                ? `${
                                    Number.isInteger(monthlyCount)
                                      ? monthlyCount
                                      : monthlyCount.toFixed(1)
                                  }/monthly`
                                : `${leave.noOfDays || 0}/yearly`}
                            </span>
                          </div>
                        </td>

                        <td className="border-r border-gray-200 px-3 py-3">
                          <Input
                            type="number"
                            value={leave.cycle.creditedDay}
                            onChange={(e) =>
                              handleLocalUpdate(
                                policyId,
                                "creditedDay",
                                e.target.value
                              )
                            }
                            className="!border-blue-gray-200 focus:!border-blue-500 w-full"
                            containerProps={{ className: "min-w-0" }}
                            labelProps={{
                              className:
                                "before:content-none after:content-none",
                            }}
                            min={1}
                            max={31}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <IconButton
                              variant="text"
                              size="sm"
                              onClick={() => toggleRowExpansion(policyId)}
                              className="hover:bg-blue-100"
                            >
                              {expandedRows[policyId] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </IconButton>
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-blue-700 px-4 py-2 normal-case text-xs"
                              onClick={() => handleSaveLeave(policyId)}
                            >
                              {leave.isExisting ? "Update" : "Add"}
                            </Button>
                            <Menu placement="bottom-end">
                              {!leave.isExisting && (
                                <Menu placement="bottom-end">
                                  <MenuHandler>
                                    <IconButton
                                      variant="text"
                                      size="sm"
                                      className="hover:bg-gray-100"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </IconButton>
                                  </MenuHandler>
                                  <MenuList className="bg-white border border-gray-300">
                                    <MenuItem
                                      onClick={() =>
                                        handleDeleteLeave(policyId)
                                      }
                                      className="text-blue-600 hover:bg-blue-50"
                                    >
                                      Reset
                                    </MenuItem>
                                  </MenuList>
                                </Menu>
                              )}
                            </Menu>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Row - Leave Handling Details */}
                      {expandedRows[policyId] && (
                        <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                          <td
                            colSpan="5"
                            className="px-6 py-5 border-b border-gray-200"
                          >
                            <div className="space-y-4">
                              <Typography
                                variant="small"
                                className="font-semibold text-gray-700 mb-3"
                              >
                                Leave Handling Configuration
                              </Typography>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Credited Month - Only for Yearly */}
                                {leave.cycle?.type === "yearly" && (
                                  <div>
                                    <Select
                                      label="Credited Month"
                                      value={
                                        leave.cycle.creditedMonth || "January"
                                      }
                                      onChange={(val) =>
                                        handleLocalUpdate(
                                          policyId,
                                          "creditedMonth",
                                          val
                                        )
                                      }
                                    >
                                      {months.map((month) => (
                                        <Option key={month} value={month}>
                                          {month}
                                        </Option>
                                      ))}
                                    </Select>
                                  </div>
                                )}

                                <div>
                                  <Select
                                    label="Leave Handling"
                                    value={
                                      leave.carryForwardEnabled
                                        ? "Carry Forward"
                                        : leave.salaryConversionEnabled
                                        ? "Convert to Salary"
                                        : "Carry Forward"
                                    }
                                    onChange={(val) =>
                                      handleLocalUpdate(
                                        policyId,
                                        "leaveHandling",
                                        val
                                      )
                                    }
                                  >
                                    <Option value="Carry Forward">
                                      Carry Forward
                                    </Option>
                                    <Option value="Convert to Salary">
                                      Convert to Salary
                                    </Option>
                                  </Select>
                                </div>

                                {(leave.carryForwardEnabled ||
                                  leave.salaryConversionEnabled) && (
                                  <div>
                                    <Select
                                      label="Handling Type"
                                      value={
                                        leave.carryForwardEnabled
                                          ? leave.carryForwardCycle
                                              ?.charAt(0)
                                              .toUpperCase() +
                                              leave.carryForwardCycle?.slice(
                                                1
                                              ) || "Yearly"
                                          : leave.salaryConversionCycle
                                              ?.charAt(0)
                                              .toUpperCase() +
                                              leave.salaryConversionCycle?.slice(
                                                1
                                              ) || "Yearly"
                                      }
                                      onChange={(val) =>
                                        handleLocalUpdate(
                                          policyId,
                                          "handlingType",
                                          val
                                        )
                                      }
                                    >
                                      <Option value="Yearly">Yearly</Option>
                                      <Option value="Monthly">Monthly</Option>
                                    </Select>
                                  </div>
                                )}

                                {leave.salaryConversionEnabled && (
                                  <>
                                    <div>
                                      <Input
                                        type="number"
                                        label="Max Allowed Leave"
                                        value={
                                          leave.maxLeavesConvertSalary || ""
                                        }
                                        onChange={(e) =>
                                          handleLocalUpdate(
                                            policyId,
                                            "maxAllowedLeave",
                                            e.target.value
                                          )
                                        }
                                        min={0}
                                      />
                                    </div>
                                    <div>
                                      <Select
                                        label="Salary Basis"
                                        value={
                                          leave.salaryConversionBase
                                            ?.charAt(0)
                                            .toUpperCase() +
                                            leave.salaryConversionBase?.slice(
                                              1
                                            ) || "Basic"
                                        }
                                        onChange={(val) =>
                                          handleLocalUpdate(
                                            policyId,
                                            "salaryBasis",
                                            val
                                          )
                                        }
                                      >
                                        <Option value="Basic">Basic</Option>
                                        <Option value="Gross">Gross</Option>
                                      </Select>
                                    </div>
                                    <div>
                                      <Input
                                        type="number"
                                        label="% of Salary per Leave"
                                        value={
                                          leave.leaveEncashmentRatePerDaySalary ||
                                          ""
                                        }
                                        onChange={(e) =>
                                          handleLocalUpdate(
                                            policyId,
                                            "salaryPercent",
                                            e.target.value
                                          )
                                        }
                                        min={0}
                                        max={100}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!selectedBranch && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border-2 border-dashed border-blue-300">
          <Typography color="blue-gray" className="text-lg font-medium">
            Please select a branch to manage leave settings
          </Typography>
        </div>
      )}
    </div>
  );
};

export default LeaveSettings;
