// src/components/OTCreation.jsx
import React, { useState } from "react";
import {
  Typography,
  Input,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import {
  OtCreateAction,
  OtUpdateAction,
} from "../../redux/Action/Wizard/WizardAction";

const OTCreation = ({
  formData,
  handleInputChange,
  onSuccess,
  overtimeList,
  setFormData,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleSaveOrUpdate = async () => {
    const payload = {
      name: formData.otName,
      category: formData.otCategory, // Daily, Week Off, Holiday
      amount: Number(formData.amountPerHour),
      type: formData.otType, // Pre Time OT, Post Time OT
      minHours: Number(formData.minMinutes),
      maxHours: Number(formData.maxOtMinutes),
    };

    setLoading(true);
    try {
      let resultAction;
      if (editId) {
        // Update flow
        resultAction = await dispatch(
          OtUpdateAction({ ...payload, overtimeId: editId })
        );
        if (OtUpdateAction.fulfilled.match(resultAction)) {
          console.log("OT updated successfully:", resultAction.payload);
          setEditId(null);
          if (onSuccess) onSuccess();
        } else {
          alert(resultAction.payload?.message || "Failed to update OT");
        }
      } else {
        // Create flow
        resultAction = await dispatch(OtCreateAction(payload));
        if (OtCreateAction.fulfilled.match(resultAction)) {
          console.log("OT created successfully:", resultAction.payload);
          if (onSuccess) onSuccess();
        } else {
          alert(resultAction.payload?.message || "Failed to create OT");
        }
      }
    } catch (err) {
      console.error("Error saving/updating OT:", err);
      alert("Something went wrong while saving OT");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ot) => {
    setEditId(ot._id);
    setFormData({
      otName: ot.name,
      otCategory: ot.category,
      otType: ot.type,
      amountPerHour: ot.amount,
      minMinutes: ot.minHours,
      maxOtMinutes: ot.maxHours,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h6" className="font-semibold text-gray-800">
        Overtime Settings
      </Typography>

      {/* OT Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="OT Name"
          value={formData.otName || ""}
          onChange={(e) => handleInputChange("otName", e.target.value)}
        />

        <Select
          label="OT Category"
          value={formData.otCategory || ""}
          onChange={(value) => handleInputChange("otCategory", value)}
        >
          <Option value="Daily">Daily</Option>
          <Option value="Week Off">Week Off</Option>
          <Option value="Holiday">Holiday</Option>
        </Select>

        <Select
          label="OT Type"
          value={formData.otType || ""}
          onChange={(value) => handleInputChange("otType", value)}
        >
          <Option value="Pre Time OT">Pre Time OT</Option>
          <Option value="Post Time OT">Post Time OT</Option>
        </Select>

        <Input
          label="Amount / Hour"
          type="number"
          value={formData.amountPerHour || ""}
          onChange={(e) => handleInputChange("amountPerHour", e.target.value)}
        />

        <Input
          label="Min OT Minutes"
          type="number"
          value={formData.minMinutes || ""}
          onChange={(e) => handleInputChange("minMinutes", e.target.value)}
        />

        <Input
          label="Max OT Minutes"
          type="number"
          value={formData.maxOtMinutes || ""}
          onChange={(e) => handleInputChange("maxOtMinutes", e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-4">
        {editId && (
          <Button
            color="red"
            onClick={() => {
              setEditId(null);
              setFormData({});
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          size="sm"
          className="w-fit items-center px-3 py-2 bg-primary text-white text-sm rounded-md font-medium hover:bg-blue-700 transition-all"
          onClick={handleSaveOrUpdate}
          disabled={loading}
        >
          {loading ? "Saving..." : editId ? "Update OT" : "Save OT"}
        </Button>
      </div>

      {/* OT Listing Table */}
      <div className="mt-8">
        <Typography variant="h6" className="mb-4 font-semibold text-gray-800">
          Existing Overtime Records
        </Typography>

        {overtimeList && overtimeList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2 text-left">Name</th>
                  <th className="border px-3 py-2 text-left">Category</th>
                  <th className="border px-3 py-2 text-left">Type</th>
                  <th className="border px-3 py-2 text-left">Amount/Hour</th>
                  <th className="border px-3 py-2 text-left">Min Minutes</th>
                  <th className="border px-3 py-2 text-left">Max Minutes</th>
                  <th className="border px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {overtimeList.map((ot) => (
                  <tr key={ot._id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{ot.name}</td>
                    <td className="border px-3 py-2">{ot.category}</td>
                    <td className="border px-3 py-2">{ot.type}</td>
                    <td className="border px-3 py-2">{ot.amount}</td>
                    <td className="border px-3 py-2">{ot.minHours}</td>
                    <td className="border px-3 py-2">{ot.maxHours}</td>
                    <td className="border px-3 py-2">
                      <Button
                        size="sm"
                        color="blue"
                        onClick={() => handleEdit(ot)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Typography color="gray">No overtime records found.</Typography>
        )}
      </div>
    </div>
  );
};

export default OTCreation;
