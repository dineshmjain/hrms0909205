import React, { useState, useEffect } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import {
  ShiftCreateAction,
  ShiftGetAction,
  ShiftUpdateAction,
} from "../../redux/Action/Shift/ShiftAction";
import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
const ShiftCreation = ({
  formData,
  handleInputChange,
  setFormData,
  branchList,
}) => {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState(null);

  // Get shiftList directly from Redux store
  const shiftList = useSelector((state) => state.shift.shiftList);
  const shiftLoading = useSelector((state) => state.shift.loading);

  const [selectedBranch, setSelectedBranch] = useState(formData.branchId || "");

  useEffect(() => {
    dispatch(ShiftGetAction()); // fetch shifts on mount
  }, [dispatch]);

  const handleEditShift = (shift) => {
    setFormData((prev) => ({
      ...prev,
      shiftName: shift.name,
      shiftStartTime: shift.startTime,
      shiftEndTime: shift.endTime,
      graceMinIn: shift.minIn,
      graceMinOut: shift.minOut,
      graceMaxIn: shift.maxIn,
      graceMaxOut: shift.maxOut,
    }));
    setSelectedBranch(shift.branchId || "");
    setEditingShiftId(shift._id);
  };

  const handleSaveShift = async () => {
    setSaving(true);
    try {
      let resultAction;

      if (editingShiftId) {
        // Update shift – exclude branchId
        const payload = {
          shiftId: editingShiftId,
          name: formData.shiftName,
          startTime: formData.shiftStartTime,
          endTime: formData.shiftEndTime,
          minIn: formData.graceMinIn,
          minOut: formData.graceMinOut,
          maxIn: formData.graceMaxIn,
          maxOut: formData.graceMaxOut,
        };
        resultAction = await dispatch(ShiftUpdateAction(payload));
      } else {
        // Create shift – include branchId
        const payload = {
          name: formData.shiftName,
          startTime: formData.shiftStartTime,
          endTime: formData.shiftEndTime,
          minIn: formData.graceMinIn,
          minOut: formData.graceMinOut,
          maxIn: formData.graceMaxIn,
          maxOut: formData.graceMaxOut,
          branchId: selectedBranch,
        };
        resultAction = await dispatch(ShiftCreateAction(payload));
      }

      if (
        ShiftCreateAction.fulfilled.match(resultAction) ||
        ShiftUpdateAction.fulfilled.match(resultAction)
      ) {
        // alert(editingShiftId ? "Shift updated!" : "Shift created!");
        // Reset form
        setFormData({
          shiftName: "",
          shiftStartTime: "",
          shiftEndTime: "",
          graceMinIn: "",
          graceMinOut: "",
          graceMaxIn: "",
          graceMaxOut: "",
        });
        setSelectedBranch("");
        setEditingShiftId(null);

        dispatch(ShiftGetAction());
      } else {
        // alert(resultAction.payload?.message || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      // alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Shift Form */}
      <Typography variant="h6" className="font-semibold text-gray-800">
        Create Shifts
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SingleSelectDropdown
          // inputName="Branch"
          listData={branchList}
          selectedOption={selectedBranch}
          selectedOptionDependency="_id"
          feildName="name"
          placeholder="Select Branch"
          handleClick={(branch) => setSelectedBranch(branch._id)}
        />

        <Input
          label="Shift Name"
          value={formData.shiftName || ""}
          onChange={(e) => handleInputChange("shiftName", e.target.value)}
        />
        <Input
          type="time"
          label="Start Time"
          value={formData.shiftStartTime || ""}
          onChange={(e) => handleInputChange("shiftStartTime", e.target.value)}
        />
        <Input
          type="time"
          label="End Time"
          value={formData.shiftEndTime || ""}
          onChange={(e) => handleInputChange("shiftEndTime", e.target.value)}
        />
      </div>

      {/* Grace Times */}
      <Typography variant="h6" className="font-semibold text-gray-800 mt-4">
        Grace Times
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Input
          type="time"
          label="Grace Min In"
          value={formData.graceMinIn || ""}
          onChange={(e) => handleInputChange("graceMinIn", e.target.value)}
        />
        <Input
          type="time"
          label="Grace Min Out"
          value={formData.graceMinOut || ""}
          onChange={(e) => handleInputChange("graceMinOut", e.target.value)}
        />
        <Input
          type="time"
          label="Grace Max In"
          value={formData.graceMaxIn || ""}
          onChange={(e) => handleInputChange("graceMaxIn", e.target.value)}
        />
        <Input
          type="time"
          label="Grace Max Out"
          value={formData.graceMaxOut || ""}
          onChange={(e) => handleInputChange("graceMaxOut", e.target.value)}
        />
      </div>

      {/* Smaller Button */}
      <Button
        size="sm"
        className="w-fit items-center px-3 py-2 bg-primary text-white text-sm rounded-md font-medium hover:bg-blue-700 transition-all"
        onClick={handleSaveShift}
        disabled={shiftLoading}
      >
        {saving ? "Saving..." : editingShiftId ? "Update Shift" : "Add Shift"}
      </Button>

      {/* Shift List */}
      <div className="mt-6">
        <Typography variant="h6" className="font-semibold text-gray-800 mb-2">
          Shift List
        </Typography>
        {shiftList.length === 0 ? (
          <p className="text-gray-500">No shifts available.</p>
        ) : (
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Start</th>
                <th className="border px-3 py-2">End</th>
                <th className="border px-3 py-2">Min In</th>
                <th className="border px-3 py-2">Max In</th>
                <th className="border px-3 py-2">Min Out</th>
                <th className="border px-3 py-2">Max Out</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shiftList.map((shift) => (
                <tr key={shift._id} className="text-center">
                  <td className="border px-3 py-2">{shift.name}</td>
                  <td className="border px-3 py-2">{shift.startTime}</td>
                  <td className="border px-3 py-2">{shift.endTime}</td>
                  <td className="border px-3 py-2">{shift.minIn}</td>
                  <td className="border px-3 py-2">{shift.maxIn}</td>
                  <td className="border px-3 py-2">{shift.minOut}</td>
                  <td className="border px-3 py-2">{shift.maxOut}</td>
                  <td className="border px-3 py-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleEditShift(shift)}
                    >
                      Edit
                    </button>
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

export default ShiftCreation;
