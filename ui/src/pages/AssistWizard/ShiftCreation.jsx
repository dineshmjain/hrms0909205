import React, { useState, useEffect } from "react";
import {
  Typography,
  Input,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Plus, Edit2, Save, X, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  ShiftCreateAction,
  ShiftGetAction,
  ShiftUpdateAction,
} from "../../redux/Action/Shift/ShiftAction";
import MultiSelectDropdown from "../../components/MultiSelectDropdown/MultiSelectDropdown";
import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
import moment from "moment";

const DEFAULT_SHIFTS = [
  { id: "morning", name: "Morning Shift" },
  { id: "evening", name: "Evening Shift" },
  { id: "night", name: "Night Shift" },
];

const ShiftCreation = ({
  formData,
  handleInputChange,
  setFormData,
  branchList,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(
    formData.branchId ? [formData.branchId] : []
  );

  const shiftList = useSelector((state) => state.shift.shiftList);

  const [newRow, setNewRow] = useState({
    shiftName: "",
    shiftStartTime: "",
    shiftEndTime: "",
    graceIn: "",
    graceOut: "",
    shiftNameType: "", // Track if default or custom
  });

  const [isCustomShiftName, setIsCustomShiftName] = useState(false);
  const formatTo12Hour = (time24) => {
    if (!time24) return "—";
    return moment(time24, "HH:mm").format("hh:mm A");
  };
  const computeGraceTimes = (startTime, endTime, graceIn, graceOut) => {
    const graceInMinutes = parseInt(graceIn || 0);
    const graceOutMinutes = parseInt(graceOut || 0);

    return {
      minIn:
        graceInMinutes > 0
          ? moment(startTime, "HH:mm")
              .subtract(graceInMinutes, "minutes")
              .format("HH:mm")
          : null,
      maxIn:
        graceInMinutes > 0
          ? moment(startTime, "HH:mm")
              .add(graceInMinutes, "minutes")
              .format("HH:mm")
          : null,
      minOut:
        graceOutMinutes > 0
          ? moment(endTime, "HH:mm")
              .subtract(graceOutMinutes, "minutes")
              .format("HH:mm")
          : null,
      maxOut:
        graceOutMinutes > 0
          ? moment(endTime, "HH:mm")
              .add(graceOutMinutes, "minutes")
              .format("HH:mm")
          : null,
    };
  };

  useEffect(() => {
    dispatch(ShiftGetAction());
  }, [dispatch]);

  const filteredShifts =
    selectedBranch && selectedBranch.length > 0
      ? shiftList.filter((shift) => selectedBranch.includes(shift.branchId))
      : shiftList;

  const handleShiftNameChange = (value) => {
    if (value === "custom") {
      setIsCustomShiftName(true);
      setNewRow((prev) => ({
        ...prev,
        shiftName: "",
        shiftNameType: "custom",
      }));
    } else {
      setIsCustomShiftName(false);
      const selectedShift = DEFAULT_SHIFTS.find((s) => s.id === value);
      setNewRow((prev) => ({
        ...prev,
        shiftName: selectedShift?.name || "",
        shiftNameType: value,
      }));
    }
  };

  const handleSaveShift = async (isNew = false) => {
    const rowData = isNew ? newRow : formData;

    if (!selectedBranch || selectedBranch.length === 0) {
      alert("Please select at least one branch first");
      return;
    }

    if (
      !rowData.shiftName ||
      !rowData.shiftStartTime ||
      !rowData.shiftEndTime
    ) {
      alert("Please fill all required fields");
      return;
    }

    setSaving(true);
    try {
      const graceInValue = parseInt(rowData.graceIn || 0);
      const graceOutValue = parseInt(rowData.graceOut || 0);

      let payload = {
        name: rowData.shiftName,
        startTime: rowData.shiftStartTime,
        endTime: rowData.shiftEndTime,
        branchIds: selectedBranch,
      };

      // Only add grace times if values are provided
      if (graceInValue > 0 || graceOutValue > 0) {
        const { minIn, maxIn, minOut, maxOut } = computeGraceTimes(
          rowData.shiftStartTime,
          rowData.shiftEndTime,
          graceInValue,
          graceOutValue
        );
        payload = {
          ...payload,
          minIn: graceInValue > 0 ? minIn : "",
          maxIn: graceInValue > 0 ? maxIn : "",
          minOut: graceOutValue > 0 ? minOut : "",
          maxOut: graceOutValue > 0 ? maxOut : "",
        };
      }

      // Remove undefined values from payload
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== "")
      );

      let resultAction;

      if (isNew) {
        resultAction = await dispatch(ShiftCreateAction(cleanPayload));

        if (ShiftCreateAction.fulfilled.match(resultAction)) {
          setNewRow({
            shiftName: "",
            shiftStartTime: "",
            shiftEndTime: "",
            graceIn: "",
            graceOut: "",
            shiftNameType: "",
          });
          setIsAddingNew(false);
          setIsCustomShiftName(false);
          await dispatch(ShiftGetAction());
          if (onSuccess) await onSuccess();
        } else {
          alert(resultAction.payload?.message || "Failed to create shift");
        }
      } else {
        const updatePayload = {
          shiftId: editingShiftId,
          name: rowData.shiftName,
          startTime: rowData.shiftStartTime,
          endTime: rowData.shiftEndTime,
        };

        // Always calculate and send grace times
        const { minIn, maxIn, minOut, maxOut } = computeGraceTimes(
          rowData.shiftStartTime,
          rowData.shiftEndTime,
          graceInValue,
          graceOutValue
        );

        // Send grace times - send empty strings if no grace values entered
        updatePayload.minIn = graceInValue > 0 ? minIn : "";
        updatePayload.maxIn = graceInValue > 0 ? maxIn : "";
        updatePayload.minOut = graceOutValue > 0 ? minOut : "";
        updatePayload.maxOut = graceOutValue > 0 ? maxOut : "";

        resultAction = await dispatch(ShiftUpdateAction(updatePayload));

        if (ShiftUpdateAction.fulfilled.match(resultAction)) {
          setFormData((prev) => ({
            ...prev,
            shiftName: "",
            shiftStartTime: "",
            shiftEndTime: "",
            graceIn: "",
            graceOut: "",
          }));
          setEditingShiftId(null);
          await dispatch(ShiftGetAction());
          if (onSuccess) await onSuccess();
        } else {
          alert(resultAction.payload?.message || "Failed to update shift");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving shift");
    } finally {
      setSaving(false);
    }
  };

  const handleEditShift = (shift) => {
    setFormData((prev) => ({
      ...prev,
      shiftName: shift.name,
      shiftStartTime: shift.startTime,
      shiftEndTime: shift.endTime,
      graceIn: "",
      graceOut: "",
    }));
    setEditingShiftId(shift._id);
  };

  const handleCancelEdit = () => {
    setEditingShiftId(null);
    setFormData((prev) => ({
      ...prev,
      shiftName: "",
      shiftStartTime: "",
      shiftEndTime: "",
      graceIn: "",
      graceOut: "",
    }));
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setIsCustomShiftName(false);
    setNewRow({
      shiftName: "",
      shiftStartTime: "",
      shiftEndTime: "",
      graceIn: "",
      graceOut: "",
      shiftNameType: "",
    });
  };

  const handleNewRowChange = (field, value) => {
    setNewRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleBranchChange = (e, branch) => {
    setIsAddingNew(false);
    setEditingShiftId(null);
    handleCancelEdit();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Typography variant="h6" className="font-semibold text-gray-800">
          Shift Settings
        </Typography>
      </div>

      {/* Branch Selection Row */}
      <div className="flex items-center gap-4 p-4  border border-blue-200 rounded-lg">
        <Typography className="font-semibold text-gray-700 whitespace-nowrap">
          Select Branch:
        </Typography>
        <div className="w-64">
          <MultiSelectDropdown
            data={branchList}
            selectedData={selectedBranch}
            setSelectedData={setSelectedBranch}
            Dependency="_id"
            FeildName="name"
            InputName="Choose branches"
            selectType="multiple"
            enableSearch={true}
            hideLabel={true}
          />
        </div>
        {selectedBranch && selectedBranch.length > 0 && (
          <div className="flex-1 flex justify-end">
            <Button
              size="sm"
              className="flex items-center gap-2 bg-primary text-white"
              onClick={() => setIsAddingNew(true)}
              disabled={isAddingNew || selectedBranch.length === 0}
            >
              <Plus size={16} />
              Add New Shift
            </Button>
          </div>
        )}
      </div>

      {/* Info Message */}
      {(!selectedBranch || selectedBranch.length === 0) && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Typography className="text-sm text-yellow-800">
            Please select one or more branches to view and manage shifts for
            those branches.
          </Typography>
        </div>
      )}

      {/* Shift Table */}
      {selectedBranch && selectedBranch.length > 0 && (
        <div className="overflow-x-auto border border-gray-300 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b px-4 py-3 text-left font-semibold">
                  Branch Name
                </th>
                <th className="border-b px-4 py-3 text-left font-semibold">
                  Shift Name
                </th>
                <th className="border-b px-4 py-3 text-left font-semibold">
                  Start Time
                </th>
                <th className="border-b px-4 py-3 text-left font-semibold">
                  End Time
                </th>
                <th className="border-b px-4 py-3 text-left font-semibold">
                  Grace In
                </th>
                <th className="border-b px-4 py-3 text-left font-semibold">
                  Grace Out
                </th>
                <th className="border-b px-4 py-3 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* New Row Form */}
              {isAddingNew && (
                <tr className="bg-blue-50">
                  <td className="border-b px-4 py-3">
                    <Typography className="text-sm font-medium text-gray-700">
                      {selectedBranch
                        .map(
                          (branchId) =>
                            branchList.find((b) => b._id === branchId)?.name
                        )
                        .filter(Boolean)
                        .join(", ") || "Selected Branches"}
                    </Typography>
                  </td>
                  <td className="border-b px-4 py-3">
                    {isCustomShiftName ? (
                      <div className="flex gap-2 items-center">
                        <Input
                          size="md"
                          label="Enter Shift Name"
                          value={newRow.shiftName}
                          onChange={(e) =>
                            handleNewRowChange("shiftName", e.target.value)
                          }
                          className="bg-white flex-1"
                        />
                        <button
                          onClick={() => setIsCustomShiftName(false)}
                          className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                        >
                          Use Default
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <SingleSelectDropdown
                          inputName="Shift Name"
                          selectedOption={newRow.shiftNameType || ""}
                          listData={DEFAULT_SHIFTS}
                          selectedOptionDependency="id"
                          feildName="name"
                          handleClick={(data) => handleShiftNameChange(data.id)}
                          hideLabel={true}
                          showSerch={true}
                          useFixedPosition={true}
                        />
                        <button
                          onClick={() => setIsCustomShiftName(true)}
                          className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                        >
                          Custom
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="border-b px-4 py-3">
                    <Input
                      size="md"
                      type="time"
                      label="Start"
                      value={newRow.shiftStartTime}
                      onChange={(e) =>
                        handleNewRowChange("shiftStartTime", e.target.value)
                      }
                      className="bg-white"
                    />
                  </td>
                  <td className="border-b px-4 py-3">
                    <Input
                      size="md"
                      type="time"
                      label="End"
                      value={newRow.shiftEndTime}
                      onChange={(e) =>
                        handleNewRowChange("shiftEndTime", e.target.value)
                      }
                      className="bg-white"
                    />
                  </td>
                  <td className="border-b px-4 py-3">
                    <Input
                      size="md"
                      label="Grace In (mins)"
                      type="number"
                      value={newRow.graceIn}
                      onChange={(e) =>
                        handleNewRowChange("graceIn", e.target.value)
                      }
                      className="bg-white"
                    />
                  </td>
                  <td className="border-b px-4 py-3">
                    <Input
                      size="md"
                      label="Grace Out (mins)"
                      type="number"
                      value={newRow.graceOut}
                      onChange={(e) =>
                        handleNewRowChange("graceOut", e.target.value)
                      }
                      className="bg-white"
                    />
                  </td>
                  <td className="border-b px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <IconButton
                        size="sm"
                        className="bg-primary"
                        onClick={() => handleSaveShift(true)}
                        disabled={saving}
                      >
                        <Check size={16} />
                      </IconButton>
                      <IconButton
                        size="sm"
                        color="red"
                        onClick={handleCancelNew}
                      >
                        <X size={16} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              )}

              {/* Existing Rows - Filtered by Branch */}
              {filteredShifts && filteredShifts.length > 0
                ? filteredShifts.map((shift) => {
                    const isEditing = editingShiftId === shift._id;
                    const branchName =
                      branchList.find((b) => b._id === shift.branchId)?.name ||
                      "N/A";

                    return (
                      <tr
                        key={shift._id}
                        className={`hover:bg-gray-50 ${
                          isEditing ? "bg-yellow-50" : ""
                        }`}
                      >
                        <td className="border-b px-4 py-3">
                          <span className="font-medium text-gray-700">
                            {branchName}
                          </span>
                        </td>
                        <td className="border-b px-4 py-3">
                          {isEditing ? (
                            <Input
                              size="md"
                              value={formData.shiftName || ""}
                              onChange={(e) =>
                                handleInputChange("shiftName", e.target.value)
                              }
                              className="bg-white"
                            />
                          ) : (
                            <span>{shift.name}</span>
                          )}
                        </td>
                        <td className="border-b px-4 py-3">
                          {isEditing ? (
                            <Input
                              size="md"
                              type="time"
                              value={formData.shiftStartTime || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "shiftStartTime",
                                  e.target.value
                                )
                              }
                              className="bg-white"
                            />
                          ) : (
                            <span>{formatTo12Hour(shift.startTime)}</span>
                          )}
                        </td>
                        <td className="border-b px-4 py-3">
                          {isEditing ? (
                            <Input
                              size="md"
                              type="time"
                              value={formData.shiftEndTime || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "shiftEndTime",
                                  e.target.value
                                )
                              }
                              className="bg-white"
                            />
                          ) : (
                            <span>{formatTo12Hour(shift.endTime)}</span>
                          )}
                        </td>
                        <td className="border-b px-4 py-3">
                          {isEditing ? (
                            <Input
                              size="md"
                              label="Grace In (mins)"
                              type="number"
                              value={formData.graceIn || ""}
                              onChange={(e) =>
                                handleInputChange("graceIn", e.target.value)
                              }
                              className="bg-white"
                            />
                          ) : (
                            <span>{formatTo12Hour(shift.maxIn)}</span>
                          )}
                        </td>
                        <td className="border-b px-4 py-3">
                          {isEditing ? (
                            <Input
                              size="md"
                              label="Grace Out (mins)"
                              type="number"
                              value={formData.graceOut || ""}
                              onChange={(e) =>
                                handleInputChange("graceOut", e.target.value)
                              }
                              className="bg-white"
                            />
                          ) : (
                            <span>{formatTo12Hour(shift.minOut)}</span>
                          )}
                        </td>
                        <td className="border-b px-4 py-3">
                          <div className="flex justify-center gap-2">
                            {isEditing ? (
                              <>
                                <IconButton
                                  size="sm"
                                  className="bg-primary"
                                  onClick={() => handleSaveShift(false)}
                                  disabled={saving}
                                >
                                  <Check size={16} />
                                </IconButton>
                                <IconButton
                                  size="sm"
                                  color="red"
                                  onClick={handleCancelEdit}
                                >
                                  <X size={16} />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton
                                size="sm"
                                className="bg-primary"
                                onClick={() => handleEditShift(shift)}
                                disabled={isAddingNew}
                              >
                                <Edit2 size={16} />
                              </IconButton>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                : !isAddingNew && (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-8 text-gray-500"
                      >
                        No shifts available for this branch. Click "Add New
                        Shift" to create one.
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      )}

      {saving && (
        <div className="text-center py-2">
          <Typography className="text-blue-600">Saving...</Typography>
        </div>
      )}
    </div>
  );
};

export default ShiftCreation;
