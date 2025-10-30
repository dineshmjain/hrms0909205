import React, { useState, useEffect } from 'react';
import { Target, Users, CheckCircle, X, Trash2, Edit2, UserCheck, Loader2, AlertCircle, Search } from 'lucide-react';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../../../config/axiosInstance';
import FormikInput from '../../../components/Input/FormikInput';
import { clientListAction } from '../../../redux/Action/Client/ClientAction';
import { clientBranchListAction } from '../../../redux/Action/ClientBranch/ClientBranchAction';
import { DesignationGetAction } from '../../../redux/Action/Designation/DesignationAction';
import { EmployeeGetActionForFilter } from '../../../redux/Action/Employee/EmployeeAction';
import { removeEmptyStrings } from '../../../constants/reusableFun';
import { ShiftGetAction } from '../../../redux/Action/Shift/ShiftAction';

// Validation Schema
const getRequirementValidationSchema = () => {
  return Yup.object({
    clientId: Yup.string().required("Please select a client"),
    selectedBranch: Yup.string().required("Please select a branch"),
    checkpointCount: Yup.number()
      .min(1, "Checkpoint count must be at least 1")
      .required("Checkpoint count is required"),
    selectedShift: Yup.string().required("Please select a shift"),
    selectedDesignation: Yup.string().required("Please select a designation"),
    selectedGender: Yup.string().required("Please select gender"),
    employeeCount: Yup.number()
      .min(1, "Employee count must be at least 1")
      .required("Employee count is required"),
  });
};

// API Service
const RequirementAPI = {
  addRequirements: async (requirementData) => {
    try {
      const response = await axiosInstance.post('/client/branch/add/requirements', requirementData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add requirements'
      };
    }
  },

  updateRequirement: async (requirementId, requirementData) => {
    try {
      const response = await axiosInstance.put(`/requirement/update/${requirementId}`, requirementData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update requirement'
      };
    }
  },

  deleteRequirement: async (requirementId) => {
    try {
      const response = await axiosInstance.delete(`/requirement/delete/${requirementId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete requirement'
      };
    }
  },
};

// Generate JSON for API - Updated to match new structure
const generateRequirementsPayload = (rows, clientId, clientMappedId, branchId) => {
  return {
    clientId: clientId,
    clientMappedId: clientMappedId,
    branchId: branchId,
    requirements: rows.map(row => ({
      shiftId: row.selectedShift,
      designationId: row.selectedDesignation,
      gender: row.selectedGender.toLowerCase(),
      count: parseInt(row.employeeCount),
      assignedEmployees: row.assignedEmployees.map(emp => emp._id)
    }))
  };
};

// Material-Tailwind styled Input component
const MTInput = ({ label, value, onChange, type = "text", min, placeholder, required = false, error }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.toString().length > 0;

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        min={min}
        className={`w-full px-4 py-3 border rounded-lg bg-white transition-all outline-none
          ${error ? 'border-red-500' : isFocused ? 'border-blue-500 border-2' : 'border-gray-300'}`}
      />
      <label className={`absolute left-3 bg-white px-1 transition-all pointer-events-none
        ${hasValue || isFocused
          ? `text-xs -top-2.5 ${error ? 'text-red-500' : 'text-blue-500'}`
          : 'text-base top-3 text-gray-500'}`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

// Requirement Form Fields Component
const RequirementFormFields = ({ shifts, loadingShifts }) => {
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const { clientList } = useSelector((state) => state?.client || {});
  const { clientBranchList } = useSelector((state) => state?.clientBranch || {});
  const [designationList, setDesignationList] = useState([]);
  const { employeesFilters } = useSelector((state) => state?.employee || {});
  const { shiftList } = useSelector((state) => state?.shift);

  const genders = [
    { _id: 'Male', name: 'Male' },
    { _id: 'Female', name: 'Female' },
  ];

  useEffect(() => {
    fetchShifts();
  }, [values?.clientId, values?.selectedBranch]);

  const fetchShifts = async () => {
    try {
      dispatch(ShiftGetAction(removeEmptyStrings({ clientId: values?.clientId, branchId: values?.selectedBranch })));
    } catch (error) {
      console.error('Error fetching shifts:', error);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, [values?.clientId]);

  const fetchDesignations = async () => {
    try {
      const data = await axiosInstance.post("/designation/get/asService", { type: "active" }).then((res) => res?.data);
      setDesignationList(data?.data);
    } catch (error) {
      console.error('Error fetching designations:', error);
    }
  };

  // Filter branches based on selected client
  const availableBranches = values.clientId
    ? clientBranchList?.filter(branch => branch.clientId === values.clientId) || []
    : [];

  // Load branches when client is selected
  useEffect(() => {
    if (values.clientId) {
      dispatch(clientBranchListAction({ clientMappedId: values.clientMappedId }));
    }
  }, [values.clientId, dispatch]);

  // Fetch employees based on filters
  useEffect(() => {
    if (values.selectedBranch && values.selectedDesignation && values.selectedGender) {
      dispatch(EmployeeGetActionForFilter(removeEmptyStrings({
        orgIds: [],
        designationIds: [values.selectedDesignation],
      })));
    }
  }, [values.selectedBranch, values.selectedDesignation, values.selectedGender, dispatch]);

  return (
    <div className="space-y-6">
      {/* Section 1: Client & Branch Selection */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Client & Branch Selection</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <FormikInput
              name="clientId"
              inputType="dropdown"
              listData={clientList || []}
              inputName="Select Client"
              feildName="name"
              hideLabel={true}
              showSerch={true}
              handleClick={(selected) => {
                setFieldValue("clientMappedId", selected?._id);
                setFieldValue("clientId", selected?.clientId);
                setFieldValue("selectedBranch", "");
                setFieldValue("selectedShift", "");
              }}
              selectedOption={values.clientId}
              selectedOptionDependency="clientId"
            />
            {touched.clientId && errors.clientId && (
              <p className="text-red-500 text-xs mt-1">{errors.clientId}</p>
            )}
          </div>

          <div>
            <FormikInput
              name="selectedBranch"
              inputType="dropdown"
              listData={clientBranchList}
              inputName="Select Branch"
              feildName="name"
              hideLabel={true}
              showSerch={true}
              handleClick={(selected) => {
                setFieldValue("selectedBranch", selected?._id);
                setFieldValue("selectedShift", "");
              }}
              selectedOption={values.selectedBranch}
              selectedOptionDependency="_id"
              disabled={!values.clientId}
            />
            {touched.selectedBranch && errors.selectedBranch && (
              <p className="text-red-500 text-xs mt-1">{errors.selectedBranch}</p>
            )}
          </div>

          <MTInput
            label="Checkpoint Count"
            type="number"
            value={values.checkpointCount}
            onChange={(e) => setFieldValue("checkpointCount", e.target.value)}
            min="1"
            placeholder="Enter count"
            required
            error={touched.checkpointCount && errors.checkpointCount}
          />
        </div>
      </div>

      {/* Section 2: Requirement Details */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Requirement Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <FormikInput
              name="selectedShift"
              inputType="dropdown"
              listData={shiftList}
              inputName="Select Shift"
              feildName="name"
              hideLabel={true}
              showSerch={true}
              handleClick={(shift) => setFieldValue("selectedShift", shift._id)}
              selectedOption={values.selectedShift}
              selectedOptionDependency="_id"
              disabled={!values.selectedBranch || loadingShifts}
            />
          </div>

          <div className="md:col-span-3">
            <FormikInput
              name="selectedDesignation"
              inputType="dropdown"
              listData={designationList || []}
              inputName="Select Designation"
              feildName="name"
              hideLabel={true}
              showSerch={true}
              handleClick={(designation) => setFieldValue("selectedDesignation", designation._id)}
              selectedOption={values.selectedDesignation}
              selectedOptionDependency="_id"
            />
          </div>

          <div className="md:col-span-2">
            <FormikInput
              name="selectedGender"
              inputType="dropdown"
              listData={genders}
              inputName="Select Gender"
              feildName="name"
              hideLabel={true}
              showSerch={true}
              handleClick={(gender) => setFieldValue("selectedGender", gender._id)}
              selectedOption={values.selectedGender}
              selectedOptionDependency="_id"
            />
          </div>

          <div className="md:col-span-2">
            <MTInput
              label="Employee Count"
              type="number"
              value={values.employeeCount}
              onChange={(e) => setFieldValue("employeeCount", e.target.value)}
              min="1"
              placeholder="Count"
              required
              error={touched.employeeCount && errors.employeeCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Requirements Component
const RequirementsCheckPoints = ({ wizardData, updateWizardData, setIsStepValid }) => {
  const dispatch = useDispatch();

  const { clientList } = useSelector((state) => state?.client || {});
  const { clientBranchList } = useSelector((state) => state?.clientBranch || {});
  const [designationList, setDesignationList] = useState([]);
  const { employeesFilters } = useSelector((state) => state?.employee || {});

  const [requirementRows, setRequirementRows] = useState(wizardData?.requirementRows || []);
  const [requirementsList, setRequirementsList] = useState(wizardData?.requirementsList || []);
  const [editingRowId, setEditingRowId] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [currentAssigningRowId, setCurrentAssigningRowId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [loadingShifts, setLoadingShifts] = useState(false);
  const [filterClient, setFilterClient] = useState(null);
  const [filterBranch, setFilterBranch] = useState(null);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');

  const initialValues = {
    clientId: "",
    clientMappedId: "",
    selectedBranch: "",
    checkpointCount: "",
    selectedShift: "",
    selectedDesignation: "",
    selectedGender: "",
    employeeCount: "",
  };

  // Load data on mount
  useEffect(() => {
    dispatch(clientListAction());
    getServiceDesignation();
  }, [dispatch]);

  // Fetch Designations
  const getServiceDesignation = async () => {
    const result = await axiosInstance.post("/designation/get/asService", { type: "active" });
    if (result.data) {
      setDesignationList(result.data?.data);
    } else {
      console.error('Failed to fetch designations');
    }
  };

  // Update parent wizard data
  useEffect(() => {
    if (updateWizardData && setIsStepValid) {
      updateWizardData('requirementRows', requirementRows, requirementRows.length > 0);
      updateWizardData('requirementsList', requirementsList, true);
    }
  }, [requirementRows, requirementsList]);

  // Filter employees based on search query
  const filteredEmployees = employeesFilters?.filter(employee => {
    if (!employeeSearchQuery) return true;
    const searchLower = employeeSearchQuery.toLowerCase();
    return (
      employee.name?.firstName?.toLowerCase().includes(searchLower) ||
      employee.name?.lastName?.toLowerCase().includes(searchLower) ||
      employee.empCode?.toLowerCase().includes(searchLower)
    );
  }) || [];

  const handleAddOrUpdateRow = async (values, { setSubmitting, setFieldValue }) => {
    if (!values.clientId || !values.selectedBranch || !values.checkpointCount) {
      alert('Please select client, branch and enter checkpoint count first');
      setSubmitting(false);
      return;
    }

    if (!values.selectedShift || !values.selectedDesignation || !values.selectedGender || !values.employeeCount) {
      alert('Please fill all fields: shift, designation, gender and employee count');
      setSubmitting(false);
      return;
    }

    const client = clientList?.find(c => c.clientId === values.clientId);
    const branch = clientBranchList?.find(b => b._id === values.selectedBranch);
    const shift = shifts?.find(s => s._id === values.selectedShift);
    const designation = designationList?.find(d => d._id === values.selectedDesignation);

    if (editingRowId) {
      const updatedRow = {
        id: editingRowId,
        ...values,
        clientName: client?.name,
        branchName: branch?.name,
        shiftName: shift?.name,
        designationName: designation?.name,
        assignedEmployees: [],
        isAssigned: false,
      };

      setRequirementRows(requirementRows.map(row =>
        row.id === editingRowId ? updatedRow : row
      ));

      setCurrentAssigningRowId(editingRowId);
      setSelectedEmployees([]);
      setEmployeeSearchQuery('');
      setShowEmployeeModal(true);
      setEditingRowId(null);
    } else {
      const tempRowId = Date.now();
      const newRow = {
        id: tempRowId,
        ...values,
        clientName: client?.name,
        branchName: branch?.name,
        shiftName: shift?.name,
        designationName: designation?.name,
        assignedEmployees: [],
        isAssigned: false,
      };

      setRequirementRows([...requirementRows, newRow]);
      setCurrentAssigningRowId(tempRowId);
      setSelectedEmployees([]);
      setEmployeeSearchQuery('');
      setShowEmployeeModal(true);
    }

    // Reset only requirement-specific fields
    setFieldValue("selectedShift", "");
    setFieldValue("selectedDesignation", "");
    setFieldValue("selectedGender", "");
    setFieldValue("employeeCount", "");

    setSubmitting(false);
  };

  const handleEditRow = (row, setFieldValue) => {
    setFieldValue("clientId", row.clientId);
    setFieldValue("clientMappedId", row.clientMappedId);
    setFieldValue("selectedBranch", row.selectedBranch);
    setFieldValue("checkpointCount", row.checkpointCount);
    setFieldValue("selectedShift", row.selectedShift);
    setFieldValue("selectedDesignation", row.selectedDesignation);
    setFieldValue("selectedGender", row.selectedGender);
    setFieldValue("employeeCount", row.employeeCount);
    setEditingRowId(row.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveRow = (id) => {
    if (window.confirm('Are you sure you want to remove this requirement row?')) {
      setRequirementRows(requirementRows.filter(row => row.id !== id));
      if (editingRowId === id) {
        setEditingRowId(null);
      }
    }
  };

  const handleAssignRow = (row) => {
    setSelectedEmployees(row.assignedEmployees || []);
    setCurrentAssigningRowId(row.id);
    setEmployeeSearchQuery('');
    setShowEmployeeModal(true);
  };

  const handleEmployeeSelect = (employee) => {
    const isSelected = selectedEmployees.find(emp => emp._id === employee._id);
    const currentRow = requirementRows.find(row => row.id === currentAssigningRowId);

    if (isSelected) {
      setSelectedEmployees(selectedEmployees.filter(emp => emp._id !== employee._id));
    } else {
      if (selectedEmployees.length < parseInt(currentRow.employeeCount)) {
        setSelectedEmployees([...selectedEmployees, employee]);
      } else {
        alert(`You can only select ${currentRow.employeeCount} employee(s)`);
      }
    }
  };

  const handleSubmitAssignment = () => {
    const currentRow = requirementRows.find(row => row.id === currentAssigningRowId);

    if (selectedEmployees.length !== parseInt(currentRow.employeeCount)) {
      alert(`Please select exactly ${currentRow.employeeCount} employee(s)`);
      return;
    }

    setRequirementRows(requirementRows.map(row =>
      row.id === currentAssigningRowId
        ? { ...row, assignedEmployees: selectedEmployees, isAssigned: true }
        : row
    ));

    setShowEmployeeModal(false);
    setCurrentAssigningRowId(null);
    setSelectedEmployees([]);
    setEmployeeSearchQuery('');
  };

  const handleCancelAssignment = () => {
    const currentRow = requirementRows.find(row => row.id === currentAssigningRowId);
    if (currentRow && !currentRow.isAssigned) {
      setRequirementRows(requirementRows.filter(row => row.id !== currentAssigningRowId));
    }
    setShowEmployeeModal(false);
    setCurrentAssigningRowId(null);
    setSelectedEmployees([]);
    setEmployeeSearchQuery('');
  };

  const handleProceedToNewClient = async () => {
    const unassignedRows = requirementRows.filter(row => !row.isAssigned);

    if (unassignedRows.length > 0) {
      alert('Please assign employees to all requirement rows before proceeding');
      return;
    }

    if (requirementRows.length === 0) {
      alert('Please add at least one requirement row');
      return;
    }

    setIsSaving(true);
    setApiError(null);

    try {
      // Get client, branch info from first row (all rows have same client/branch)
      const firstRow = requirementRows[0];
      const clientId = firstRow.clientId;
      const clientMappedId = firstRow.clientMappedId;
      const branchId = firstRow.selectedBranch;

      // Generate payload in the required format
      const payload = generateRequirementsPayload(
        requirementRows,
        clientId,
        clientMappedId,
        branchId
      );

      console.log('Submitting payload:', JSON.stringify(payload, null, 2));

      // Send all requirements in a single API call
      const result = await RequirementAPI.addRequirements(payload);

      if (result.success) {
        // Save to requirements list with API response
        const savedRequirements = requirementRows.map((row, index) => ({
          ...row,
          requirementId: result.data?.requirements?.[index]?._id || `${result.data._id}_${index}`,
          apiResponse: result.data,
        }));

        // Add to requirements list
        setRequirementsList([...requirementsList, ...savedRequirements]);

        // Clear current requirements
        setRequirementRows([]);

        alert('Requirements saved successfully! You can now add requirements for another client.');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('API Error:', error);
      setApiError(error.message || 'An error occurred while saving requirements');
      alert(`Error: ${error.message || 'Failed to save requirements. Please try again.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRequirement = async (requirement) => {
    if (window.confirm('Are you sure you want to delete this requirement?')) {
      setIsSaving(true);

      try {
        if (requirement.requirementId) {
          const result = await RequirementAPI.deleteRequirement(requirement.requirementId);

          if (!result.success) {
            throw new Error(result.error);
          }
        }

        setRequirementsList(requirementsList.filter(req => req.id !== requirement.id));
        alert('Requirement deleted successfully!');
      } catch (error) {
        console.error('Delete Error:', error);
        alert(`Error: ${error.message || 'Failed to delete requirement'}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Filter requirements
  const filteredRequirements = requirementsList.filter(req => {
    const matchClient = !filterClient || req.clientId === filterClient;
    const matchBranch = !filterBranch || req.selectedBranch === filterBranch;
    return matchClient && matchBranch;
  });

  // Get filter branches based on selected client
  const filterBranches = filterClient
    ? clientBranchList?.filter(branch => branch.clientId === filterClient) || []
    : [];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getRequirementValidationSchema()}
      onSubmit={handleAddOrUpdateRow}
      enableReinitialize
    >
      {({ values, setFieldValue, resetForm, isSubmitting }) => (
        <Form className="space-y-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
          {/* API Error Message */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800">Error</h4>
                  <p className="text-sm text-red-700">{apiError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setApiError(null)}
                  className="ml-auto p-1 hover:bg-red-100 rounded"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <RequirementFormFields shifts={shifts} loadingShifts={loadingShifts} />

          {/* Action Button */}
          <div className="flex justify-center">
            {editingRowId !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditingRowId(null);
                  resetForm();
                }}
                className="flex items-center gap-2 px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-semibold shadow-lg hover:shadow-xl mr-4"
                disabled={isSaving}
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || isSaving}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {editingRowId ? 'Update & Assign' : 'Add & Assign'}
                </>
              )}
            </button>
          </div>

          {/* Current Requirements */}
          {requirementRows.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Current Requirements
                </h3>
                {requirementRows.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {requirementRows[0].clientName} - {requirementRows[0].branchName} - {requirementRows[0].checkpointCount} Checkpoints
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {requirementRows.map((row) => (
                  <div
                    key={row.id}
                    className={`p-4 border-2 rounded-lg transition-all ${row.isAssigned
                      ? 'border-green-400 bg-green-50'
                      : 'border-orange-400 bg-orange-50'
                      }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div>
                          <span className="text-xs text-gray-500 font-medium">Shift</span>
                          <p className="font-semibold text-gray-800 text-sm">{row.shiftName}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 font-medium">Designation</span>
                          <p className="font-semibold text-gray-800 text-sm">{row.designationName}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 font-medium">Gender</span>
                          <p className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${row.selectedGender === 'Male'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-pink-100 text-pink-800'
                            }`}>
                            {row.selectedGender}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 font-medium">Count</span>
                          <p className="font-semibold text-gray-800 text-sm">{row.employeeCount}</p>
                        </div>
                        {row.isAssigned && (
                          <div>
                            <span className="text-xs text-gray-500 font-medium">Assigned</span>
                            <div className="flex gap-1 mt-1">
                              {row.assignedEmployees.map(emp => (
                                <span
                                  key={emp._id}
                                  className="inline-block px-2 py-1 bg-green-600 text-white rounded text-xs font-medium"
                                  title={emp.name?.firstName}
                                >
                                  {emp.empCode}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {!row.isAssigned && (
                          <button
                            type="button"
                            onClick={() => handleAssignRow(row)}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-semibold text-sm shadow-md"
                            disabled={isSaving}
                          >
                            Assign Now
                          </button>
                        )}
                        {row.isAssigned && (
                          <button
                            type="button"
                            onClick={() => handleAssignRow(row)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold text-sm shadow-md"
                            disabled={isSaving}
                          >
                            Reassign
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEditRow(row, setFieldValue)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                          title="Edit"
                          disabled={isSaving}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(row.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                          title="Remove"
                          disabled={isSaving}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t flex justify-end">
                <button
                  type="button"
                  onClick={handleProceedToNewClient}
                  disabled={isSaving}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Requirements
                      <span className="text-xl">→</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Employee Selection Modal - IMPROVED VERSION */}
          {showEmployeeModal && currentAssigningRowId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Users className="w-6 h-6 text-purple-600" />
                      Select Employees ({selectedEmployees.length}/{requirementRows.find(r => r.id === currentAssigningRowId)?.employeeCount})
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {requirementRows.find(r => r.id === currentAssigningRowId)?.designationName} • {requirementRows.find(r => r.id === currentAssigningRowId)?.selectedGender}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancelAssignment}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or employee code..."
                      value={employeeSearchQuery}
                      onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  {employeeSearchQuery && (
                    <p className="text-sm text-gray-600 mt-2">
                      Found {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Employee Table */}
                <div className="flex-1 overflow-y-auto p-4">
                  {!filteredEmployees || filteredEmployees.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">
                        {employeeSearchQuery ? 'No employees found matching your search' : 'No employees found matching the criteria'}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full bg-white">
                        <thead className="bg-purple-600 text-white sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold w-12">Select</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Employee Code</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Gender</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Designation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredEmployees.map(employee => {
                            const isSelected = selectedEmployees.find(emp => emp._id === employee._id);
                            return (
                              <tr
                                key={employee._id}
                                onClick={() => handleEmployeeSelect(employee)}
                                className={`cursor-pointer transition-colors ${isSelected
                                  ? 'bg-purple-50 hover:bg-purple-100'
                                  : 'hover:bg-gray-50'
                                  }`}
                              >
                                <td className="px-4 py-3">
                                  <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-purple-600' : 'bg-gray-200 border border-gray-300'
                                    }`}>
                                    {isSelected && (
                                      <CheckCircle className="w-5 h-5 text-white" />
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="font-semibold text-gray-900">{employee.empCode}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-gray-700">{employee.name?.firstName} {employee.name?.lastName}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${employee.gender === 'Male'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-pink-100 text-pink-800'
                                    }`}>
                                    {employee.gender}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-gray-700">{employee.designation?.name || 'N/A'}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Selected Employees Summary */}
                {selectedEmployees.length > 0 && (
                  <div className="px-6 py-3 border-t bg-purple-50">
                    <p className="text-sm font-medium text-gray-700 mb-2">Selected Employees:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployees.map(emp => (
                        <span
                          key={emp._id}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium"
                        >
                          {emp.empCode} - {emp.name?.firstName}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEmployeeSelect(emp);
                            }}
                            className="hover:bg-purple-700 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Modal Footer */}
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={handleCancelAssignment}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-semibold shadow-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitAssignment}
                      disabled={selectedEmployees.length !== parseInt(requirementRows.find(r => r.id === currentAssigningRowId)?.employeeCount || 0)}
                      className={`px-6 py-3 rounded-lg transition-all font-semibold shadow-md ${selectedEmployees.length === parseInt(requirementRows.find(r => r.id === currentAssigningRowId)?.employeeCount || 0)
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      Confirm Assignment ({selectedEmployees.length}/{requirementRows.find(r => r.id === currentAssigningRowId)?.employeeCount})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Requirements History - IMPROVED TABLE */}
          {requirementsList.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      All Requirements History
                    </h3>
                    <p className="text-sm text-gray-500">{filteredRequirements.length} requirement{filteredRequirements.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex gap-3 flex-wrap">
                  <div className="w-48">
                    <FormikInput
                      name="filterClient"
                      inputType="dropdown"
                      listData={clientList}
                      inputName="Filter by Client"
                      feildName="name"
                      hideLabel={true}
                      showSerch={true}
                      handleClick={(selected) => {
                        setFilterClient(selected?.clientId);
                        setFilterBranch(null);
                      }}
                      selectedOption={filterClient}
                      selectedOptionDependency="clientId"
                    />
                  </div>

                  {filterClient && (
                    <div className="w-48">
                      <FormikInput
                        name="filterBranch"
                        inputType="dropdown"
                        listData={filterBranches}
                        inputName="Filter by Branch"
                        feildName="name"
                        hideLabel={true}
                        showSerch={true}
                        handleClick={(selected) => {
                          setFilterBranch(selected?._id);
                        }}
                        selectedOption={filterBranch}
                        selectedOptionDependency="_id"
                      />
                    </div>
                  )}

                  {(filterClient || filterBranch) && (
                    <button
                      type="button"
                      onClick={() => {
                        setFilterClient(null);
                        setFilterBranch(null);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full bg-white">
                  <thead className="bg-purple-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Client</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Branch</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Checkpoints</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Shift</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Designation</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Gender</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Required</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Assigned Employees</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRequirements.map((requirement) => (
                      <tr key={requirement.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{requirement.clientName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{requirement.branchName}</td>
                        <td className="px-4 py-3 text-sm text-center font-semibold text-gray-700">{requirement.checkpointCount}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            {requirement.shiftName}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{requirement.designationName}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${requirement.selectedGender === 'Male'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-pink-100 text-pink-800'
                            }`}>
                            {requirement.selectedGender}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center font-semibold text-gray-700">{requirement.employeeCount}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            {requirement.assignedEmployees.map(emp => (
                              <div key={emp._id} className="flex items-center gap-2 bg-purple-50 px-2 py-1 rounded">
                                <span className="font-semibold text-purple-900">{emp.empCode}</span>
                                <span className="text-gray-600 text-xs">•</span>
                                <span className="text-gray-700">{emp.name?.firstName}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 justify-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteRequirement(requirement)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                              title="Delete"
                              disabled={isSaving}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredRequirements.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No requirements found matching the selected filters
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {requirementsList.length === 0 && requirementRows.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300 shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
                <Target className="w-10 h-10 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">No Requirements Created Yet</h4>
              <p className="text-gray-500">Fill in the form above to get started</p>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default RequirementsCheckPoints;