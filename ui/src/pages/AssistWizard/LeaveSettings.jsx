import React, { useEffect, useState } from "react";
import {
  Typography,
  Input,
  Checkbox,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
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
  console.log("Redux leaveList:", leaveList);

  const leavePolicyOptions = leavePolicyList.map((policy) => ({
    value: policy._id,
    label: policy.name,
  }));
  const branchOptions = branchList.map((b) => ({
    value: b._id,
    label: b.name,
  }));

  const leaveHandlingOptions = ["Carry Forward", "Convert to Salary", "None"];

  // Dynamic state from formData
  const [selectedBranch, setSelectedBranch] = useState(formData.branchId || "");
  const [selectedLeavePolicy, setSelectedLeavePolicy] = useState(
    formData.leaveType || ""
  );
  const [editingLeaveId, setEditingLeaveId] = useState(null);
  const [yearlyCount, setYearlyCount] = useState(formData.yearlyCount || 0);
  const [isMonthly, setIsMonthly] = useState(formData.isMonthly || false);
  const [monthlyCount, setMonthlyCount] = useState(formData.monthlyCount || 0);
  const [creditedDay, setCreditedDay] = useState(formData.creditedDay || 0);
  const [creditedMonth, setCreditedMonth] = useState(
    formData.creditedMonth || 0
  );
  const [eligibleDays, setEligibleDays] = useState(formData.eligibleDays || 0);

  const [leaveHandling, setLeaveHandling] = useState(
    formData.leaveHandling || ""
  );
  const [handlingType, setHandlingType] = useState(formData.handlingType || "");
  const [maxAllowedLeave, setMaxAllowedLeave] = useState(
    formData.maxAllowedLeave || 0
  );
  const [salaryBasis, setSalaryBasis] = useState(formData.salaryBasis || "");
  const [salaryPercent, setSalaryPercent] = useState(
    formData.salaryPercent || 0
  );

  // Fetch leave policies
  useEffect(() => {
    dispatch(LeavePolicyNameGetAction());
  }, [dispatch]);

  // Update parent formData on changes
  useEffect(
    () => handleInputChange("branchId", selectedBranch),
    [selectedBranch]
  );
  useEffect(
    () => handleInputChange("leaveType", selectedLeavePolicy),
    [selectedLeavePolicy]
  );

  // Inside LeaveSettings component

  // Fetch leave policies and created leaves
  useEffect(() => {
    dispatch(LeavePolicyNameGetAction());
    dispatch(LeavePolicyGetAction());
  }, [dispatch]);
  // Auto-calculate monthlyCount if monthly distribution is checked
  useEffect(() => {
    if (isMonthly && yearlyCount > 0) {
      const calcMonthly = yearlyCount / 12;
      setMonthlyCount(parseFloat(calcMonthly.toFixed(1)));
    }
  }, [isMonthly, yearlyCount]);

  useEffect(
    () => handleInputChange("monthlyCount", monthlyCount),
    [monthlyCount]
  );

  useEffect(() => handleInputChange("yearlyCount", yearlyCount), [yearlyCount]);
  useEffect(() => handleInputChange("creditedDay", creditedDay), [creditedDay]);
  useEffect(
    () => handleInputChange("creditedMonth", creditedMonth),
    [creditedMonth]
  );
  useEffect(
    () => handleInputChange("eligibleDays", eligibleDays),
    [eligibleDays]
  );
  useEffect(
    () => handleInputChange("leaveHandling", leaveHandling),
    [leaveHandling]
  );
  useEffect(
    () => handleInputChange("handlingType", handlingType),
    [handlingType]
  );
  useEffect(
    () => handleInputChange("maxAllowedLeave", maxAllowedLeave),
    [maxAllowedLeave]
  );
  useEffect(() => handleInputChange("salaryBasis", salaryBasis), [salaryBasis]);
  useEffect(
    () => handleInputChange("salaryPercent", salaryPercent),
    [salaryPercent]
  );

  const handleSaveLeave = () => {
    if (!selectedBranch || !selectedLeavePolicy) {
      return alert("Please select branch and leave policy");
    }

    // Base payload
    const payload = {
      branchId: selectedBranch,
      noOfDays: isMonthly ? monthlyCount : yearlyCount,
      // eligibleNoOfDays: eligibleDays,
      cycle: {
        type: isMonthly ? "monthly" : "yearly",
        creditedDay,
        ...(isMonthly ? {} : { creditedMonth }),
      },
      carryForwardEnabled: leaveHandling === "Carry Forward",
      ...(leaveHandling === "Carry Forward"
        ? { carryForwardCycle: handlingType.toLowerCase() }
        : {}),
      salaryConversionEnabled: leaveHandling === "Convert to Salary",
      ...(leaveHandling === "Convert to Salary"
        ? {
            salaryConversionCycle: handlingType.toLowerCase(),
            maxLeavesConvertSalary:
              handlingType.toLowerCase() === "yearly"
                ? maxAllowedLeave
                : undefined,
            leaveEncashmentRatePerDaySalary: salaryPercent,
            salaryConversionBase: salaryBasis.toLowerCase(),
          }
        : {}),
      isExpiredLeaveAtMonthEnd: false,
    };

    if (editingLeaveId) {
      // EDIT: do NOT include leavePolicyId
      dispatch(
        LeavePolicyUpdateAction({
          _id: editingLeaveId,
          ...payload,
        })
      ).then(() => {
        dispatch(LeavePolicyGetAction());
        setEditingLeaveId(null);
      });
    } else {
      // CREATE: include leavePolicyId
      dispatch(
        LeavePolicyCreateAction({
          leavePolicyId: selectedLeavePolicy, // only for create
          ...payload,
        })
      ).then(() => dispatch(LeavePolicyGetAction()));
    }
  };

  const handleEditLeave = (leave) => {
    setEditingLeaveId(leave._id);
    setSelectedBranch(leave.branchId); // or leave.brachName if you map id
    setSelectedLeavePolicy(leave.leavePolicyId);
    setYearlyCount(leave.noOfDays);
    setIsMonthly(leave.cycle.type === "monthly");
    setMonthlyCount(leave.monthlyCount || 0);
    setCreditedDay(leave.cycle.creditedDay);
    setCreditedMonth(leave.cycle.creditedMonth || "");
    // setEligibleDays(leave.eligibleNoOfDays || 0);
    setLeaveHandling(
      leave.carryForwardEnabled
        ? "Carry Forward"
        : leave.salaryConversionEnabled
        ? "Convert to Salary"
        : "None"
    );
    setHandlingType(
      leave.carryForwardCycle || leave.salaryConversionCycle || ""
    );
    setMaxAllowedLeave(leave.maxLeavesConvertSalary || 0);
    setSalaryBasis(leave.salaryConversionBase || "");
    setSalaryPercent(leave.leaveEncashmentRatePerDaySalary || 0);
  };
  return (
    <div className="flex w-full flex-col space-y-6">
      <Typography variant="h5" color="blue-gray" className="mb-6">
        Leave Settings
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SingleSelectDropdown
          inputName="Branch"
          listData={branchList}
          selectedOption={selectedBranch}
          selectedOptionDependency="_id"
          feildName="name"
          placeholder="Select Branch"
          handleClick={(branch) => setSelectedBranch(branch._id)}
          hideLabel={true}
        />

        <SingleSelectDropdown
          inputName="Leave Type"
          listData={leavePolicyOptions}
          selectedOption={selectedLeavePolicy}
          selectedOptionDependency="value"
          feildName="label"
          placeholder="Select Leave Policy"
          handleClick={(option) => setSelectedLeavePolicy(option.value)}
          hideLabel={true}
        />

        <Input
          inputName=""
          type="number"
          label="Yearly Leave Count"
          value={yearlyCount}
          onChange={(e) => setYearlyCount(Number(e.target.value))}
          min={0}
        />

        <Checkbox
          label="Monthly Distribution"
          checked={isMonthly}
          onChange={(e) => setIsMonthly(e.target.checked)}
        />

        {isMonthly ? (
          <Input
            type="number"
            label="Monthly Count"
            value={monthlyCount}
            onChange={(e) => setMonthlyCount(Number(e.target.value))}
            min={0}
            max={yearlyCount}
          />
        ) : (
          <Input
            type="text"
            label="Credited Month"
            value={creditedMonth}
            onChange={(e) => setCreditedMonth(e.target.value)}
          />
        )}

        <Input
          type="number"
          label="Credited Day"
          value={creditedDay}
          onChange={(e) => setCreditedDay(Number(e.target.value))}
          min={1}
        />

        {/* <Input
          type="number"
          label="Eligible Days"
          value={eligibleDays}
          onChange={(e) => setEligibleDays(Number(e.target.value))}
          min={0}
        /> */}

        <Select
          label="Leave Handling"
          value={leaveHandling}
          onChange={setLeaveHandling}
        >
          {leaveHandlingOptions.map((opt) => (
            <Option key={opt} value={opt}>
              {opt}
            </Option>
          ))}
        </Select>

        {["Carry Forward", "Convert to Salary"].includes(leaveHandling) && (
          <Select
            label="Handling Type"
            value={handlingType}
            onChange={setHandlingType}
          >
            {["Yearly", "Monthly"].map((opt) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>
        )}

        {leaveHandling === "Convert to Salary" && (
          <>
            <Input
              type="number"
              label="Max Allowed Leave"
              value={maxAllowedLeave}
              onChange={(e) => setMaxAllowedLeave(Number(e.target.value))}
              min={0}
            />
            <Select
              label="Salary Basis"
              value={salaryBasis}
              onChange={setSalaryBasis}
            >
              {["basic", "gross"].map((opt) => (
                <Option key={opt} value={opt}>
                  {opt}
                </Option>
              ))}
            </Select>
            <Input
              type="number"
              label="% of Salary per Leave"
              value={salaryPercent}
              onChange={(e) => setSalaryPercent(Number(e.target.value))}
              min={0}
              max={100}
            />
          </>
        )}
      </div>

      <Button
        className="w-fit inline-flex items-center px-3 py-2 bg-primary text-white text-sm rounded-md font-medium hover:bg-blue-700 transition-all"
        onClick={handleSaveLeave}
        disabled={!selectedBranch || !selectedLeavePolicy}
      >
        {editingLeaveId ? "Update" : "Add"}
      </Button>

      <div className="mt-10">
        <Typography variant="h6" color="blue-gray" className="mb-4">
          Created Leaves
        </Typography>

        {leaveList.length === 0 ? (
          <Typography>No leaves found.</Typography>
        ) : (
          <table className="text-sm  min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Branch Name</th>
                <th className="border px-4 py-2">Policy Name</th>
                <th className="border px-4 py-2">Leave Count</th>
                <th className="border px-4 py-2">Cycle</th>
                <th className="border px-4 py-2">Leave Handling</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveList.map((leave) => (
                <tr key={leave._id}>
                  <td className="border px-4 py-2">{leave.brachName}</td>
                  <td className="border px-4 py-2">{leave.leavePolicyName}</td>
                  <td className="border px-4 py-2">{leave.noOfDays}</td>
                  <td className="border px-4 py-2">{leave.cycle.type}</td>
                  <td className="border px-4 py-2">
                    {leave.carryForwardEnabled
                      ? `Carry Forward (${leave.carryForwardCycle})`
                      : leave.salaryConversionEnabled
                      ? `Convert to Salary (${leave.salaryConversionCycle})`
                      : "None"}
                  </td>
                  <td className="border px-4 py-2">
                    <Button
                      size="sm"
                      // color="green"
                      onClick={() => handleEditLeave(leave)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeaveSettings;
