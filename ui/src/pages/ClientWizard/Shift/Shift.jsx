import { Clock, Plus, Edit2, Trash2, X, Loader2, CheckCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import FormikInput from '../../../components/Input/FormikInput';
import { clientListAction } from '../../../redux/Action/Client/ClientAction';
import { BranchGetAction } from '../../../redux/Action/Branch/BranchAction';
import axiosInstance from '../../../config/axiosInstance';
import { clientBranchListAction } from '../../../redux/Action/ClientBranch/ClientBranchAction';
import moment from 'moment';
import { removeEmptyStrings } from '../../../constants/reusableFun';

// Validation Schema
const getShiftValidationSchema = () => {
  return Yup.object({
    clientId: Yup.string().required("Please select a client"),
    selectedBranches: Yup.array()
      .min(1, "Please select at least one branch")
      .required("Please select branches"),
    shiftName: Yup.string()
      .required("Shift name is required")
      .min(3, "Shift name must be at least 3 characters"),
    startTime: Yup.string().required("Start time is required"),
    endTime: Yup.string()
      .required("End time is required")
      ,
    isReportingRequired: Yup.boolean(),
    reportingMinsBefore: Yup.number().when('isReportingRequired', {
      is: true,
      then: (schema) => schema
        .required("Reporting time is required")
        .min(1, "Must be at least 1 minute")
        .max(120, "Cannot exceed 120 minutes"),
      otherwise: (schema) => schema.notRequired()
    }),
  });
};

// Generate JSON for API
const generateShiftJSON = (values, clientName, branchNames) => {
  const newTime = moment(values?.startTime, "HH:mm").subtract(values?.reportingMinsBefore, "minutes").format("HH:mm");

  console.log(newTime,values?.reportingMinsBefore,'newTime')
  return {
    clientId: values.clientId,
    branchIds: values.selectedBranches,
    name: values.shiftName,
    startTime: values.startTime,
    endTime: values.endTime,
    // isReportingRequired: values.isReportingRequired,
    reportTimeIn: values?.isReportingRequired ? newTime : null,
    // Additional metadata for display
    // clientName: clientName,
    // branchNames: branchNames,
  };
};

// API Service
const ShiftAPI = {
  addShift: async (shiftData) => {
    try {
      const response = await axiosInstance.post('/shift/create', removeEmptyStrings(shiftData));
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add shift'
      };
    }
  },

  updateShift: async (shiftId, shiftData) => {
    try {
      const response = await axiosInstance.put(`/client/shift/update/${shiftId}`, shiftData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update shift'
      };
    }
  },

  deleteShift: async (shiftId) => {
    try {
      const response = await axiosInstance.delete(`/shift/delete/${shiftId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete shift'
      };
    }
  }
};

// Form Fields Component
const ShiftFormFields = ({clientBranchList=[]}) => {
  const { values, setFieldValue } = useFormikContext();
  const { clientList } = useSelector((state) => state?.client || {});
  const { branchList } = useSelector((state) => state?.branch || {});
  const dispatch = useDispatch();
const [selectedClientBranches,setSelectedClientBraches]=useState([])
  // Filter branches based on selected client
  const availableBranches = values.clientId
    ? branchList?.filter(branch => branch.clientId === values.clientId) || []
    : [];

  const hasSingleBranch = availableBranches.length === 1;

  // Auto-select single branch
  useEffect(() => {
    if (values.clientId && hasSingleBranch && availableBranches.length > 0) {
      setFieldValue("selectedBranches", [availableBranches[0]._id]);
    }
  }, [values.clientId, hasSingleBranch, availableBranches]);

  // Load branches when client changes
  useEffect(() => {
    if (values.clientId) {
      dispatch(clientBranchListAction({ clientMappedId:values?.clientMappedId }));
    }
  }, [values.clientId, dispatch]);

  console.log(selectedClientBranches)
  useEffect(()=>{
setFieldValue('selectedBranches',selectedClientBranches)
  },[selectedClientBranches])

  return (
    <div>
      {/* Section 1: Client & Branch Selection */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Client & Branch Selection</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormikInput
            name="clientId"
            label="Select Client"
            inputType="dropdown"
            listData={clientList}
            inputName="Select Client"
            feildName="name"
            hideLabel={true}
            showSerch={true}
            handleClick={(selected) => {
              setFieldValue("clientMappedId", selected?._id);
           setFieldValue("clientId", selected?.clientId);
              setFieldValue("selectedBranches", []); // Reset branches on client change
            }}
            selectedOption={values.clientId}
            selectedOptionDependency="clientId"
          />

          {values.clientId && !hasSingleBranch && (
            <FormikInput
              name="selectedBranches"
              label="Select Branches"
              inputType="multiDropdown"

               selectedData={selectedClientBranches}
              data={clientBranchList}
              Dependency="_id"
              FeildName="name"

              type={"object"}
              InputName={"Branches"}
              setSelectedData={setSelectedClientBraches}
              // setFieldName={values.selectedBranches}
            // handleChange={(r)=>{
            //   console.log(r)
            // }}
              hideLabel

              // listData={availableBranches}
              // inputName="Select Branches"
              // feildName="name"
              // hideLabel={false}
              // showSerch={true}
              // handleClick={(selected) => {
              //   const currentBranches = values.selectedBranches || [];
              //   const branchId = selected?._id;
              //   if (currentBranches.includes(branchId)) {
              //     setFieldValue("selectedBranches", currentBranches.filter(id => id !== branchId));
              //   } else {
              //     setFieldValue("selectedBranches", [...currentBranches, branchId]);
              //   }
              // }}
              // selectedOptions={values.selectedBranches}
              // selectedOptionDependency="_id"
            />
          )}

          {values.clientId && hasSingleBranch && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch (Auto-selected)
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                {availableBranches[0]?.name}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This client has only one branch
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Shift Details */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Shift Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <FormikInput
            name="shiftName"
            label="Shift Name"
            inputType="input"
            placeholder="e.g., Morning Shift"
          />
          <FormikInput
            name="startTime"
            label="Start Time"
            inputType="input"
            type="time"
          />
          <FormikInput
            name="endTime"
            label="End Time"
            inputType="input"
            type="time"
          />
        </div>

        {/* Reporting Time Checkbox */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={values.isReportingRequired}
              onChange={(e) => {
                setFieldValue("isReportingRequired", e.target.checked);
                if (!e.target.checked) {
                  setFieldValue("reportingMinsBefore", "");
                }
              }}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">
              Is Reporting Time Required?
            </span>
          </label>
        </div>

        {/* Reporting Minutes Input */}
        {values.isReportingRequired && (
          <div className="ml-6">
            <FormikInput
              name="reportingMinsBefore"
              label="Minutes Before Shift Start"
              inputType="input"
              type="number"
              placeholder="e.g., 15"
              min="1"
              max="120"
            />
            <p className="text-xs text-gray-500 mt-1">
              Staff must report {values.reportingMinsBefore || '___'} minutes before shift starts
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Shift Component
const Shift = ({ wizardData, updateWizardData, setIsStepValid }) => {
  const dispatch = useDispatch();
  const { clientList } = useSelector((state) => state?.client);
  const { branchList } = useSelector((state) => state?.branch || {});
  const { clientBranchList, loading, totalRecord } = useSelector(
      (state) => state?.clientBranch
    );
  useEffect(()=>{
  setIsStepValid(true)
  
  },[wizardData])
  const [shifts, setShifts] = useState(wizardData?.shifts || []);
  const [editingShiftIndex, setEditingShiftIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [filterClient, setFilterClient] = useState(null);
  const [filterBranch, setFilterBranch] = useState(null);

  const initialValues = {
    clientId: "",
    selectedBranches: [],
    shiftName: "",
    startTime: "",
    endTime: "",
    isReportingRequired: false,
    reportingMinsBefore: "",
  };

  useEffect(() => {
    dispatch(clientListAction());
  }, [dispatch]);

  // Update parent wizard data whenever shifts change
  useEffect(() => {
    if (updateWizardData && setIsStepValid) {
      updateWizardData('shifts', shifts, shifts.length > 0);
    }
  }, [shifts]);

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsSaving(true);
    setApiError(null);

    try {
      const client = clientList?.find(c => c._id === values.clientId);
      const selectedBranchData = clientBranchList?.filter(b => values.selectedBranches.includes(b._id)) || [];
      
      const clientName = client?.name || '';
      const branchNames = selectedBranchData.map(b => b.name);

      const shiftJSON = generateShiftJSON(values, clientName, branchNames);
      console.log('Shift JSON:', shiftJSON);

      // API call
      let result;
      if (editingShiftIndex !== null) {
        const shiftId = shifts[editingShiftIndex].id;
        result = await ShiftAPI.updateShift(shiftId, shiftJSON);
      } else {
        result = await ShiftAPI.addShift(shiftJSON);
      }

      if (result.success) {
        const newShift = {
          id: result.data.shiftId || result.data._id || Date.now(),
          ...values,
          clientName,
          branchNames,
          jsonData: shiftJSON,
          apiResponse: result.data,
        };

        if (editingShiftIndex !== null) {
          const updatedShifts = [...shifts];
          updatedShifts[editingShiftIndex] = newShift;
          setShifts(updatedShifts);
          setEditingShiftIndex(null);
        } else {
          setShifts((prev) => [...prev, newShift]);
        }

        alert(editingShiftIndex !== null ? 'Shift updated successfully!' : 'Shift added successfully!');
        resetForm();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('API Error:', error);
      setApiError(error.message || 'An error occurred while saving');
      alert(`Error: ${error.message || 'Failed to save. Please try again.'}`);
    } finally {
      setIsSaving(false);
      setSubmitting(false);
    }
  };

  const handleEditShift = (index, setFieldValue) => {
    const shift = shifts[index];
    Object.keys(shift).forEach(key => {
      if (key !== 'id' && key !== 'jsonData' && key !== 'apiResponse' && key !== 'clientName' && key !== 'branchNames') {
        setFieldValue(key, shift[key]);
      }
    });
    setEditingShiftIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteShift = async (index) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      const shift = shifts[index];
      
      try {
        const result = await ShiftAPI.deleteShift(shift.id);
        
        if (result.success) {
          const updatedShifts = shifts.filter((_, i) => i !== index);
          setShifts(updatedShifts);
          alert('Shift deleted successfully!');
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Delete Error:', error);
        alert(`Error: ${error.message || 'Failed to delete shift'}`);
      }
    }
  };

  // Filter shifts
  const filteredShifts = shifts.filter(shift => {
    const matchClient = !filterClient || shift.clientId === filterClient;
    const matchBranch = !filterBranch || shift.selectedBranches.includes(filterBranch);
    return matchClient && matchBranch;
  });

  // Get filter branches based on selected client
  const filterBranches = filterClient
    ? clientBranchList?.filter(branch => branch.clientId === filterClient) || []
    : [];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getShiftValidationSchema()}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, resetForm, isSubmitting }) => (
        <Form className="space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
          {/* API Error Message */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-600 mt-0.5" />
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
          <ShiftFormFields clientBranchList={clientBranchList}/>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            {editingShiftIndex !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditingShiftIndex(null);
                  resetForm();
                }}
                className="flex items-center gap-2 px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-semibold shadow-lg hover:shadow-xl"
                disabled={isSaving}
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  {editingShiftIndex !== null ? "Update Shift" : "Add Shift"}
                </>
              )}
            </button>
          </div>

          {/* Shifts List */}
          {shifts.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Added Shifts</h3>
                    <p className="text-sm text-gray-500">{filteredShifts.length} shift{filteredShifts.length !== 1 ? 's' : ''} added</p>
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
                        setFilterClient(selected?._id);
                        setFilterBranch(null);
                      }}
                      selectedOption={filterClient}
                      selectedOptionDependency="_id"
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
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Branches</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Shift Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Timing</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reporting Time</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredShifts.map((shift, index) => (
                      <tr key={shift.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{shift.clientName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div className="flex flex-wrap gap-1">
                            {shift.branchNames?.map((name, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{shift.shiftName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {shift.startTime} - {shift.endTime}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {shift.isReportingRequired
                            ? `${shift.reportingMinsBefore} mins before`
                            : 'Not Required'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3" />
                            Saved
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 justify-center">
                            <button
                              type="button"
                              onClick={() => handleEditShift(index, setFieldValue)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Edit"
                              disabled={isSaving}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteShift(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
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

                {filteredShifts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No shifts found matching the selected filters
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {shifts.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200 shadow-md">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No shifts added yet</p>
              <p className="text-sm">Start by adding your first shift above</p>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default Shift;