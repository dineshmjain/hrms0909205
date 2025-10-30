import React, { useState, useEffect } from "react";
import {
  Typography,
  Input,
  Select,
  Option,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Plus, Edit2, Save, X, Check } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  OtCreateAction,
  OtUpdateAction,
  OtGetAction,
} from "../../redux/Action/Wizard/WizardAction";
import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
const OTCreation = ({
  formData,
  handleInputChange,
  onSuccess,
  setFormData,
  branchList,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(formData.branchId || "");
  const [overtimeList, setOvertimeList] = useState([]);
  const [newRow, setNewRow] = useState({
    otName: "",
    otCategory: "",
    otType: "",
    amountPerHour: "",
    minMinutes: "",
    maxOtMinutes: "",
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  // Add these option arrays at the top of your component, after useState declarations
  const otCategoryOptions = [
    { value: "Daily", label: "Daily" },
    { value: "Week Off", label: "Week Off" },
    { value: "Holiday", label: "Holiday" },
  ];

  const otTypeOptions = [
    { value: "Pre OT", label: "Pre OT" },
    { value: "Post OT", label: "Post OT" },
    { value: "None", label: "None" },
  ];
  // Fetch OT data when component mounts or when branch changes
  useEffect(() => {
    if (selectedBranch) {
      fetchOvertimeData();
    }
  }, [selectedBranch]);

  const fetchOvertimeData = async () => {
    try {
      setLoading(true);
      const resultAction = await dispatch(OtGetAction());

      if (OtGetAction.fulfilled.match(resultAction)) {
        const otData = resultAction.payload?.data || [];
        console.log("Fetched OT data:", otData);
        setOvertimeList(otData);
      } else {
        console.error("Failed to fetch OT data");
        setOvertimeList([]);
      }
    } catch (err) {
      console.error("Error fetching OT data:", err);
      setOvertimeList([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter overtime based on selected branch
  const filteredOT = selectedBranch
    ? (overtimeList || []).filter((ot) => ot.branchId === selectedBranch)
    : [];

  const handleSaveRow = async (isNew = false) => {
    const rowData = isNew ? newRow : formData;

    // Validation
    if (!selectedBranch) {
      alert("Please select a branch first");
      return;
    }

    const payload = {
      name: rowData.otName,
      category: rowData.otCategory,
      amount: Number(rowData.amountPerHour),
      type: rowData.otType,
      minHours: Number(rowData.minMinutes),
      maxHours: Number(rowData.maxOtMinutes),
    };

    // Only add branchId if it's a new record
    if (isNew) {
      payload.branchId = selectedBranch;
    }

    // Validation
    if (
      !payload.name ||
      !payload.category ||
      !payload.type ||
      !payload.amount
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      let resultAction;

      if (isNew) {
        // Create new OT
        resultAction = await dispatch(OtCreateAction(payload));
        if (OtCreateAction.fulfilled.match(resultAction)) {
          console.log("OT created successfully");
          setNewRow({
            otName: "",
            otCategory: "",
            otType: "",
            amountPerHour: "",
            minMinutes: "",
            maxOtMinutes: "",
          });
          setIsAddingNew(false);
          // Fetch updated OT list
          await fetchOvertimeData();
          if (onSuccess) await onSuccess();
        } else {
          alert(resultAction.payload?.message || "Failed to create OT");
        }
      } else {
        // Update existing OT
        resultAction = await dispatch(
          OtUpdateAction({ ...payload, overtimeId: editingRowId })
        );
        if (OtUpdateAction.fulfilled.match(resultAction)) {
          console.log("OT updated successfully");
          setFormData((prev) => ({
            ...prev,
            otName: "",
            otCategory: "",
            otType: "",
            amountPerHour: "",
            minMinutes: "",
            maxOtMinutes: "",
          }));
          setEditingRowId(null);
          // Fetch updated OT list
          await fetchOvertimeData();
          if (onSuccess) await onSuccess();
        } else {
          alert(resultAction.payload?.message || "Failed to update OT");
        }
      }
    } catch (err) {
      console.error("Error saving OT:", err);
      alert("Something went wrong while saving OT");
    } finally {
      setLoading(false);
    }
  };

  const handleEditRow = (ot) => {
    setEditingRowId(ot._id);
    setFormData((prev) => ({
      ...prev,
      otName: ot.name,
      otCategory: ot.category,
      otType: ot.type,
      amountPerHour: ot.amount,
      minMinutes: ot.minHours,
      maxOtMinutes: ot.maxHours,
    }));
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setFormData((prev) => ({
      ...prev,
      otName: "",
      otCategory: "",
      otType: "",
      amountPerHour: "",
      minMinutes: "",
      maxOtMinutes: "",
    }));
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewRow({
      otName: "",
      otCategory: "",
      otType: "",
      amountPerHour: "",
      minMinutes: "",
      maxOtMinutes: "",
    });
  };

  const handleNewRowChange = (field, value) => {
    setNewRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleBranchChange = (branch) => {
    setSelectedBranch(branch._id);
    // Cancel any ongoing edit/add when branch changes
    setIsAddingNew(false);
    setEditingRowId(null);
    handleCancelEdit();
    handleCancelNew();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Typography variant="h6" className="font-semibold text-gray-800">
          Overtime Settings
        </Typography>
      </div>

      {/* Branch Selection Row */}
      <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <Typography className="font-semibold text-gray-700 whitespace-nowrap">
          Select Branch:
        </Typography>
        <div className="w-64">
          <SingleSelectDropdown
            listData={branchList}
            selectedOption={selectedBranch}
            selectedOptionDependency="_id"
            feildName="name"
            placeholder="Choose a branch"
            handleClick={handleBranchChange}
            useFixedPosition={true}
          />
        </div>
        {selectedBranch && (
          <div className="flex-1 flex justify-end">
            <Button
              size="sm"
              className="flex items-center gap-2 bg-primary text-white"
              onClick={() => setIsAddingNew(true)}
              disabled={isAddingNew || !selectedBranch}
            >
              <Plus size={16} />
              Add New OT
            </Button>
          </div>
        )}
      </div>

      {/* Info Message */}
      {!selectedBranch && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Typography className="text-sm text-yellow-800">
            Please select a branch to view and manage overtime policies for that
            branch.
          </Typography>
        </div>
      )}

      {/* Show OT count for debugging */}
      {selectedBranch && (
        <div className="text-sm text-gray-600">
          Total OT records: {overtimeList.length} | Filtered:{" "}
          {filteredOT.length}
        </div>
      )}

      {/* OT Table */}
      {selectedBranch && (
        <div className="relative border border-gray-300 rounded-lg">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b px-4 py-3 text-left font-semibold">
                    Branch
                  </th>
                  <th className="border-b px-4 py-3 text-left font-semibold">
                    OT Name
                  </th>
                  <th className="border-b px-4 py-3 text-left font-semibold">
                    Category
                  </th>
                  <th className="border-b px-4 py-3 text-left font-semibold">
                    Type
                  </th>
                  <th className="border-b px-4 py-3 text-left font-semibold">
                    Amount/Hour
                  </th>
                  <th className="border-b px-4 py-3 text-left font-semibold">
                    Min OT Minutes
                  </th>
                  <th className="border-b px-4 py-3 text-left font-semibold">
                    Max OT Hours
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
                        {(branchList || []).find(
                          (b) => b._id === selectedBranch
                        )?.name || "Selected Branch"}
                      </Typography>
                    </td>
                    <td className="border-b px-4 py-3">
                      <Input
                        size="md"
                        label="OT Name"
                        value={newRow.otName}
                        onChange={(e) =>
                          handleNewRowChange("otName", e.target.value)
                        }
                        className="bg-white"
                      />
                    </td>
                    {/* <td className="border-b px-4 py-3">
                    <Select
                      size="md"
                      label="Category"
                      value={newRow.otCategory}
                      onChange={(value) =>
                        handleNewRowChange("otCategory", value)
                      }
                      className="bg-white"
                    >
                      <Option value="Daily">Daily</Option>
                      <Option value="Week Off">Week Off</Option>
                      <Option value="Holiday">Holiday</Option>
                    </Select>
                  </td> */}
                    <td className="border-b px-4 py-3">
                      <SingleSelectDropdown
                        listData={otCategoryOptions}
                        selectedOption={newRow.otCategory}
                        selectedOptionDependency="value"
                        feildName="label"
                        placeholder="Select Category"
                        handleClick={(option) =>
                          handleNewRowChange("otCategory", option.value)
                        }
                        hideLabel={true}
                        useFixedPosition={true}
                      />
                    </td>
                    <td className="border-b px-4 py-3">
                      <SingleSelectDropdown
                        listData={otTypeOptions}
                        selectedOption={newRow.otType}
                        selectedOptionDependency="value"
                        feildName="label"
                        placeholder="Select Type"
                        handleClick={(option) =>
                          handleNewRowChange("otType", option.value)
                        }
                        hideLabel={true}
                        useFixedPosition={true}
                      />
                    </td>
                    <td className="border-b px-4 py-3">
                      <Input
                        size="md"
                        type="number"
                        label="Amount"
                        value={newRow.amountPerHour}
                        onChange={(e) =>
                          handleNewRowChange("amountPerHour", e.target.value)
                        }
                        className="bg-white"
                      />
                    </td>
                    <td className="border-b px-4 py-3">
                      <Input
                        size="md"
                        type="number"
                        label="Min"
                        value={newRow.minMinutes}
                        onChange={(e) =>
                          handleNewRowChange("minMinutes", e.target.value)
                        }
                        className="bg-white"
                      />
                    </td>
                    <td className="border-b px-4 py-3">
                      <Input
                        size="md"
                        type="number"
                        label="Max"
                        value={newRow.maxOtMinutes}
                        onChange={(e) =>
                          handleNewRowChange("maxOtMinutes", e.target.value)
                        }
                        className="bg-white"
                      />
                    </td>
                    <td className="border-b px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <IconButton
                          size="sm"
                          className="bg-primary"
                          onClick={() => handleSaveRow(true)}
                          disabled={loading}
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
                {filteredOT && filteredOT.length > 0
                  ? filteredOT.map((ot) => {
                      const isEditing = editingRowId === ot._id;
                      const branchName =
                        (branchList || []).find((b) => b._id === ot.branchId)
                          ?.name || "N/A";

                      return (
                        <tr
                          key={ot._id}
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
                                value={formData.otName || ""}
                                onChange={(e) =>
                                  handleInputChange("otName", e.target.value)
                                }
                                className="bg-white"
                              />
                            ) : (
                              <span>{ot.name}</span>
                            )}
                          </td>
                          <td className="border-b px-4 py-3">
                            {isEditing ? (
                              <SingleSelectDropdown
                                listData={otCategoryOptions}
                                selectedOption={formData.otCategory || ""}
                                selectedOptionDependency="value"
                                feildName="label"
                                placeholder="Select Category"
                                handleClick={(option) =>
                                  handleInputChange("otCategory", option.value)
                                }
                                hideLabel={true}
                                useFixedPosition={true}
                              />
                            ) : (
                              <span>{ot.category}</span>
                            )}
                          </td>{" "}
                          <td className="border-b px-4 py-3">
                            {isEditing ? (
                              <SingleSelectDropdown
                                listData={otTypeOptions}
                                selectedOption={formData.otType || ""}
                                selectedOptionDependency="value"
                                feildName="label"
                                placeholder="Select Type"
                                handleClick={(option) =>
                                  handleInputChange("otType", option.value)
                                }
                                hideLabel={true}
                                useFixedPosition={true}
                              />
                            ) : (
                              <span>{ot.type}</span>
                            )}
                          </td>
                          <td className="border-b px-4 py-3">
                            {isEditing ? (
                              <Input
                                size="md"
                                type="number"
                                value={formData.amountPerHour || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "amountPerHour",
                                    e.target.value
                                  )
                                }
                                className="bg-white"
                              />
                            ) : (
                              <span>{ot.amount}</span>
                            )}
                          </td>
                          <td className="border-b px-4 py-3">
                            {isEditing ? (
                              <Input
                                size="md"
                                type="number"
                                value={formData.minMinutes || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "minMinutes",
                                    e.target.value
                                  )
                                }
                                className="bg-white"
                              />
                            ) : (
                              <span>{ot.minHours}</span>
                            )}
                          </td>
                          <td className="border-b px-4 py-3">
                            {isEditing ? (
                              <Input
                                size="md"
                                type="number"
                                value={formData.maxOtMinutes || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "maxOtMinutes",
                                    e.target.value
                                  )
                                }
                                className="bg-white"
                              />
                            ) : (
                              <span>{ot.maxHours}</span>
                            )}
                          </td>
                          <td className="border-b px-4 py-3">
                            <div className="flex justify-center gap-2">
                              {isEditing ? (
                                <>
                                  <IconButton
                                    size="sm"
                                    className="bg-primary"
                                    onClick={() => handleSaveRow(false)}
                                    disabled={loading}
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
                                  onClick={() => handleEditRow(ot)}
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
                          colSpan="8"
                          className="text-center py-8 text-gray-500"
                        >
                          No overtime records found for this branch. Click "Add
                          New OT" to create one.
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-2">
          <Typography className="text-blue-600">Loading...</Typography>
        </div>
      )}
    </div>
  );
};

export default OTCreation;
