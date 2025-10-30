import { Building, CheckCircle, UserPlus, Trash2, Edit2, Plus, X, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import FormikInput from '../../../components/Input/FormikInput';
import { BranchGetAction } from '../../../redux/Action/Branch/BranchAction';
import { SubOrgListAction } from '../../../redux/Action/SubOrgAction/SubOrgAction';
import { DesignationGetAction } from '../../../redux/Action/Designation/DesignationAction';
import { useCheckEnabledModule } from '../../../hooks/useCheckEnabledModule';
import { EmployeeGetActionForFilter } from '../../../redux/Action/Employee/EmployeeAction';
import { removeEmptyStrings } from '../../../constants/reusableFun';
import { getAddressTypesAction } from '../../../redux/Action/Global/GlobalAction';
import axios from 'axios';
import axiosInstance from '../../../config/axiosInstance';
import SingleSelectDropdown from '../../../components/SingleSelectDropdown/SingleSelectDropdown';
import { clientListAction } from '../../../redux/Action/Client/ClientAction';

// Validation Schema
const getBranchValidationSchema = () => {
  return Yup.object({
    companyName: Yup.string().when('$isAddingBranch', {
      is: false,
      then: (schema) => schema.required("Company name is required"),
      otherwise: (schema) => schema.notRequired()
    }),
    contractDate: Yup.date().when('$isAddingBranch', {
      is: false,
      then: (schema) => schema.required("Contract date is required"),
      otherwise: (schema) => schema.notRequired()
    }),
    branchName: Yup.string().when('$isAddingBranch', {
      is: true,
      then: (schema) => schema.required("Branch name is required"),
      otherwise: (schema) => schema.notRequired()
    }),
    ownerName: Yup.string().required("Owner name is required"),
    designation: Yup.string().required("Designation is required"),
    contactMobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Must be exactly 10 digits")
      .required("Contact number is required"),
    contactEmail: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    gstNumber: Yup.string().required("GST number is required"),
    panNumber: Yup.string()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
      .required("PAN number is required"),
    registeredAddress: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, "Must be 6 digits")
      .required("Pincode is required"),
    selectedEmployee: Yup.string().required("Please select an employee"),
  });
};

const generateClientJSON = (values) => {
  const nameParts = values.ownerName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const fullAddress = [
    values.registeredAddress,
    values.landmark,
    values.city,
    values.state,
    'India'
  ].filter(Boolean).join(', ');

  return {
    client: {
      name: values.companyName,
      clientSince: values.contractDate
    },
    registeredBy: {
      name: {
        firstName: firstName,
        lastName: lastName
      },
      relationshipToOrg: values.designation,
      mobile: values.contactMobile,
      email: values.contactEmail
    },
    branch: {
      name: values.branchName || values.companyName,
      gstNo: values.gstNumber,
      panNo: values.panNumber,
      address: {
        addressTypeId: values?.addressTypeId,
        address: fullAddress,
        city: values.city,
        state: values.state,
        pincode: values.pincode
      }
    },
    fieldOfficer: {
      id: values.selectedEmployee
    }
  };
};

// FIXED: Updated structure to match API expectations and include registeredBy information
const generateBranchJSON = (values, selectedClient) => {
  const nameParts = values.ownerName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const fullAddress = [
    values.registeredAddress,
    values.landmark,
    values.city,
    values.state,
    'India'
  ].filter(Boolean).join(', ');

  return {
    clientId: selectedClient?.clientDetails?.clientId || selectedClient?.clientId,
    clientMappedId: selectedClient?.clientDetails?.clientMappedId || selectedClient?._id,
    name: values.branchName,
    gstNo: values.gstNumber,
    panNo: values.panNumber,
    address: {
      addressTypeId: values?.addressTypeId,
      address: fullAddress,
      city: values.city,
      state: values.state,
      pincode: values.pincode
    },
    registeredBy: {
      name: {
        firstName: firstName,
        lastName: lastName
      },
      relationshipToOrg: values.designation,
      mobile: values.contactMobile,
      email: values.contactEmail
    },
    fieldOfficer: {
      id: values.selectedEmployee
    }
  };
};

function extractPANFromGSTIN(gstin) {
  if (!gstin || typeof gstin !== "string") return "";
  const normalized = gstin.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (normalized.length !== 15) return "";
  const pan = normalized.slice(2, 12);
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  return panRegex.test(pan) ? pan : "";
}

// API Service
const ClientAPI = {
  addClient: async (clientData) => {
    try {
      const response = await axiosInstance.post('/client/wizard/add', clientData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add client'
      };
    }
  },

  addBranch: async (branchData) => {
    try {
      const response = await axiosInstance.post('/client/branch/wizard/add', branchData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add branch'
      };
    }
  }
};

// Form Fields Component
const BranchFormFields = ({ isAddingBranch, checkModules }) => {
  const { values, setFieldValue } = useFormikContext();
  const { subOrgs } = useSelector((state) => state?.subOrgs || {});
  const { branchList } = useSelector((state) => state?.branch || {});
  const { employeesFilters } = useSelector((state) => state?.employee || {});
  const { designationList } = useSelector((state) => state?.designation || {});
  const { addressTypes } = useSelector((state) => state?.global);
  const dispatch = useDispatch();

  useEffect(() => {
    const extracted = extractPANFromGSTIN(values.gstNumber);
    if (extracted && extracted !== values.panNumber) {
      setFieldValue("panNumber", extracted);
    }
  }, [values.gstNumber, setFieldValue]);

  useEffect(() => {
    dispatch(getAddressTypesAction());
  }, [dispatch]);

  useEffect(() => {
    dispatch(BranchGetAction({
      mapedData: "branch",
      orgLevel: true,
      subOrgId: values?.subOrgId
    }));
  }, [values?.subOrgId]);
 

  useEffect(() => {
    dispatch(EmployeeGetActionForFilter(removeEmptyStrings({
      orgIds: [values?.subOrgId],
      branchIds: [values?.selectedBranch],
      designationIds: [values?.selectedDesignation]
    })));
  }, [values?.subOrgId, values?.selectedBranch, values?.selectedDesignation]);

  return (
    <div>
      {/* Section 1: Client Details */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Building className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            {isAddingBranch ? "Branch Details" : "Client Details"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {!isAddingBranch && (
            <>
              <FormikInput
                name="companyName"
                label="Client Organization Name"
                inputType="input"
                placeholder="Enter company name"
              />
              <FormikInput
                name="contractDate"
                label="Contract Date"
                inputType="input"
                type="date"
              />
            </>
          )}

          {isAddingBranch && (
            <FormikInput
              name="branchName"
              label="Branch Name"
              inputType="input"
              placeholder="Enter branch name"
            />
          )}

          <FormikInput
            name="ownerName"
            label="Owner/Incharge Name"
            inputType="input"
            placeholder="Enter owner name"
          />
          <FormikInput
            name="designation"
            label="Designation"
            inputType="input"
            placeholder="Enter designation"
          />
          <FormikInput
            name="contactMobile"
            label="Contact Number"
            inputType="input"
            type="tel"
            placeholder="10 digit mobile number"
          />
          <FormikInput
            name="contactEmail"
            label="Email ID"
            inputType="input"
            type="email"
            placeholder="email@example.com"
          />
        </div>
      </div>

      {/* Section 2: KYC Details */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">KYC Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <FormikInput
            name="gstNumber"
            label="GST Number"
            inputType="input"
            placeholder="Enter GST number"
          />
          <FormikInput
            name="panNumber"
            label="PAN Number"
            inputType="input"
            placeholder="ABCDE1234F"
          />
        </div>

        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-12 md:col-span-2">
            <FormikInput
              name="addressTypeId"
              label="Address Type"
              inputType="dropdown"
              listData={addressTypes}
              inputName="Select AddressType"
              feildName="name"
              hideLabel={true}
              showSerch={true}
              handleClick={(selected) => {
                setFieldValue("addressTypeId", selected?._id);
              }}
              selectedOption={values.addressTypeId}
              selectedOptionDependency="_id"
            />
          </div>

          <div className="col-span-12 md:col-span-10">
            <label className="text-gray-700 text-sm font-medium mb-1.5 block">
              Registered Address
            </label>
            <textarea
              name="registeredAddress"
              value={values.registeredAddress || ""}
              onChange={(e) => setFieldValue("registeredAddress", e.target.value)}
              rows={1}
              placeholder="Enter complete address"
              className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-600 focus:border-gray-600 focus:ring-2 focus:ring-gray-100 resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-12 md:col-span-4">
            <FormikInput name="landmark" label="Landmark" inputType="input" placeholder="Near..." />
          </div>
          <div className="col-span-12 md:col-span-3">
            <FormikInput name="city" label="City" inputType="input" placeholder="City" />
          </div>
          <div className="col-span-12 md:col-span-3">
            <FormikInput name="state" label="State" inputType="input" placeholder="State" />
          </div>
          <div className="col-span-12 md:col-span-2">
            <FormikInput name="pincode" label="Pincode" inputType="input" placeholder="6 digits" maxLength={6} />
          </div>
        </div>
      </div>

      {/* Section 3: Assign Officer */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Assign Officer</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {checkModules("suborganization", "r") && (
            <FormikInput
              name="subOrgId"
              inputType="dropdown"
              listData={subOrgs}
              inputName="Select Organization"
              feildName="name"
              hideLabel={true}
              showSerch={true}
              handleClick={(selected) => setFieldValue("subOrgId", selected?._id)}
              selectedOption={values.subOrgId}
              selectedOptionDependency="_id"
            />
          )}
          <FormikInput
            name="selectedBranch"
            inputType="dropdown"
            listData={branchList}
            inputName="Select Branch"
            feildName="name"
            hideLabel={true}
            showSerch={true}
            handleClick={(selected) => setFieldValue("selectedBranch", selected?._id)}
            selectedOption={values.selectedBranch}
            selectedOptionDependency="_id"
          />
          <FormikInput
            name="selectedDesignation"
            inputType="dropdown"
            listData={designationList}
            inputName="Select Designation"
            feildName="name"
            hideLabel={true}
            showSerch={true}
            handleClick={(selected) => setFieldValue("selectedDesignation", selected?._id)}
            selectedOption={values.selectedDesignation}
            selectedOptionDependency="_id"
          />
          <FormikInput
            name="selectedEmployee"
            inputType="dropdown"
            listData={employeesFilters}
            inputName="Select Employee"
            feildName="name"
            hideLabel={true}
            showSerch={true}
            handleClick={(selected) => setFieldValue("selectedEmployee", selected?._id)}
            selectedOption={values.selectedEmployee}
            selectedOptionDependency="_id"
          />
        </div>
      </div>
    </div>
  );
};

// Main Branch Component
const Branch = ({ wizardData, updateWizardData, setIsStepValid }) => {
  const dispatch = useDispatch();
  const checkModules = useCheckEnabledModule();
  const { clientList } = useSelector((state) => state?.client)
  const [clientBranches, setClientBranches] = useState(wizardData?.branches || []);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [editingBranchIndex, setEditingBranchIndex] = useState(null);
  const [clientDetails, setClientDetails] = useState(wizardData?.clientDetails || null);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [selectedClientForBranch, setSelectedClientForBranch] = useState(null); // FIXED: New state for selected client

  const initialValues = {
    companyName: "",
    contractDate: "",
    branchName: "",
    ownerName: "",
    designation: "",
    contactMobile: "",
    contactEmail: "",
    gstNumber: "",
    panNumber: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    registeredAddress: "",
    selectedBranch: "",
    selectedEmployee: "",
    subOrgId: "",
    addressTypeId: "",
  };

  useEffect(() => {
    if (checkModules('suborganization', 'r')) {
      dispatch(SubOrgListAction({}));
    } else {
      dispatch(BranchGetAction({}));
    }
    dispatch(DesignationGetAction({}));
    dispatch(clientListAction());
  }, [dispatch]);

  // Update parent wizard data whenever branches change
  useEffect(() => {
    updateWizardData('branches', clientBranches, clientBranches.length > 0);
    updateWizardData('clientDetails', clientDetails, true);
  }, [clientBranches, clientDetails]);

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsSaving(true);
    setApiError(null);
    console.log("Attempting to save...");

    try {
      // First branch - add new client
      if (!clientDetails && !isAddingBranch) {
        const clientJSON = generateClientJSON(values);
        console.log('Creating new client with data:', clientJSON);

        const result = await ClientAPI.addClient(clientJSON);

        if (result.success) {
          // Save client details
          const newClientDetails = {
            companyName: values.companyName,
            contractDate: values.contractDate,
            clientId: result.data.clientId || result.data._id || result.data.id,
            clientMappedId: result.data.clientMappedId || result.data.clientDetails?.clientMappedId,
          };
          setClientDetails(newClientDetails);
          dispatch(clientListAction());

          // Save branch data
          const newBranch = {
            id: Date.now(),
            ...values,
            clientId: newClientDetails.clientId,
            clientMappedId: newClientDetails.clientMappedId,
            jsonData: clientJSON,
            apiResponse: result.data,
            branchId: result.data.branchId || result.data.branch?._id,
          };

          setClientBranches([newBranch]);
          setIsStepValid(true);

          alert('Client and branch created successfully!');
          console.log('Client created:', result.data);
        } else {
          throw new Error(result.error);
        }
      }
      // Additional branch for existing client
      else if (isAddingBranch && selectedClientForBranch) {
        // FIXED: Use selectedClientForBranch instead of clientDetails
        const branchJSON = generateBranchJSON(values, selectedClientForBranch);
        console.log('Adding branch to existing client:', branchJSON);

        const result = await ClientAPI.addBranch(branchJSON);

        if (result.success) {
          const newBranch = {
            id: Date.now(),
            ...values,
            clientId: selectedClientForBranch?.clientDetails?.clientId || selectedClientForBranch?._id,
            clientMappedId: selectedClientForBranch?.clientDetails?.clientMappedId || selectedClientForBranch?.clientMappedId,
            clientName: selectedClientForBranch?.name,
            jsonData: branchJSON,
            apiResponse: result.data,
            branchId: result.data.branchId || result.data._id,
          };

          if (editingBranchIndex !== null) {
            const updatedBranches = [...clientBranches];
            updatedBranches[editingBranchIndex] = newBranch;
            setClientBranches(updatedBranches);
            setEditingBranchIndex(null);
          } else {
            setClientBranches((prev) => [...prev, newBranch]);
          }

          alert('Branch added successfully!');
          console.log('Branch created:', result.data);
          dispatch(clientListAction()); // Refresh client list
        } else {
          throw new Error(result.error);
        }
      } else if (isAddingBranch && !selectedClientForBranch) {
        throw new Error('Please select a client to add branch to');
      }

      // Reset branch-specific fields only
      resetForm({
        values: {
          ...initialValues,
        }
      });

      setIsAddingBranch(false);
      setSelectedClientForBranch(null); // Reset selected client
    } catch (error) {
      console.error('API Error:', error);
      setApiError(error.message || 'An error occurred while saving');
      alert(`Error: ${error.message || 'Failed to save. Please try again.'}`);
    } finally {
      setIsSaving(false);
      setSubmitting(false);
    }
  };

  const handleEditBranch = (index, setFieldValue) => {
    const branch = clientBranches[index];
    Object.keys(branch).forEach(key => {
      if (key !== 'id' && key !== 'jsonData' && key !== 'apiResponse' && key !== 'clientId' && key !== 'branchId' && key !== 'clientMappedId' && key !== 'clientName') {
        setFieldValue(key, branch[key]);
      }
    });
    setEditingBranchIndex(index);
    setIsAddingBranch(true);
    
    // Set the selected client for editing
    const client = clientList?.find(c => 
      (c.clientDetails?.clientId === branch.clientId || c._id === branch.clientId)
    );
    setSelectedClientForBranch(client);
  };

  const handleDeleteBranch = (index) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      const updatedBranches = clientBranches.filter((_, i) => i !== index);
      setClientBranches(updatedBranches);

      if (updatedBranches.length === 0) {
        setIsStepValid(false);
        setClientDetails(null);
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getBranchValidationSchema()}
      context={{ isAddingBranch }} // FIXED: Pass context for validation
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, resetForm, isSubmitting }) => (
        <Form className="space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
          {/* Current Client Banner */}
          {isAddingBranch && (
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-100">
                    {editingBranchIndex !== null ? "Editing Branch For:" : "Adding Branch For:"}
                  </p>
                  <div className="mt-2">
                    <SingleSelectDropdown
                      listData={clientList}
                      name="clientId"
                      label="Select Client"
                      inputName="Select Client"
                      feildName="name"
                      hideLabel={true}
                      showSerch={true}
                      handleClick={(selected) => {
                        setSelectedClientForBranch(selected);
                        console.log('Selected client:', selected);
                      }}
                      selectedOption={selectedClientForBranch?._id}
                      selectedOptionDependency="_id"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

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
          <BranchFormFields isAddingBranch={isAddingBranch} checkModules={checkModules} />

          {/* Added Branches Table */}
          {clientBranches.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Added Branches</h3>
                    <p className="text-sm text-gray-500">{clientBranches.length} branch{clientBranches.length !== 1 ? 'es' : ''} added</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Branch</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Incharge</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Designation</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">City</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {clientBranches.map((branch, index) => (
                      <tr key={branch.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{branch.branchName || branch.companyName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{branch.clientName || clientDetails?.companyName || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{branch.ownerName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{branch.designation}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{branch.contactMobile}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{branch.contactEmail}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{branch.city}</td>
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
                              onClick={() => handleEditBranch(index, setFieldValue)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Edit"
                              disabled={isSaving}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBranch(index)}
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
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            {isAddingBranch ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingBranch(false);
                    setEditingBranchIndex(null);
                    setSelectedClientForBranch(null);
                    resetForm();
                  }}
                  className="flex items-center gap-2 px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-semibold shadow-lg hover:shadow-xl"
                  disabled={isSaving}
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isSaving || !selectedClientForBranch}
                  className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Building className="w-5 h-5" />
                      {editingBranchIndex !== null ? "Update Branch" : "Save Branch"}
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                {clientBranches.length === 0 && (
                  <button
                    type="submit"
                    disabled={isSubmitting || isSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Add Client & Branch
                      </>
                    )}
                  </button>
                )}
                {clientBranches.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsAddingBranch(true)}
                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                    disabled={isSaving}
                  >
                    <Building className="w-5 h-5" />
                    Add More Branches
                  </button>
                )}
              </>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Branch;