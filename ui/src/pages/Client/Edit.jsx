import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Building, CheckCircle, UserPlus, Clock, Plus, Edit2, Trash2, X, Loader2 } from "lucide-react";
import * as Yup from "yup";

import Header from "../../components/header/Header";
import TabSection from "../../components/TabSection/TabSection";
import FormikInput from "../../components/Input/FormikInput";
import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
import Table from "../../components/Table/Table";
import { Chip, Typography } from "@material-tailwind/react";

import { removeEmptyStrings } from "../../constants/reusableFun";
import { EmployeeEditAction } from "../../redux/Action/Employee/EmployeeAction";
import BasicInformation from "./BasicInformation/BasicInformation";
import TabsContent from "./Tabs/TabsContent";
import { clientEditAction } from "../../redux/Action/Client/ClientAction";
import OwnerDetails from "./Tabs/OwnerDetails";
import { BranchGetAction } from "../../redux/Action/Branch/BranchAction";
import { SubOrgListAction } from "../../redux/Action/SubOrgAction/SubOrgAction";
import { DesignationGetAction } from "../../redux/Action/Designation/DesignationAction";
import { EmployeeGetActionForFilter } from "../../redux/Action/Employee/EmployeeAction";
import { getAddressTypesAction, getTypeOfIndustyAction } from "../../redux/Action/Global/GlobalAction";
import { clientListAction } from "../../redux/Action/Client/ClientAction";
import { clientBranchListAction } from "../../redux/Action/ClientBranch/ClientBranchAction";
import { ShiftGetAction } from "../../redux/Action/Shift/ShiftAction";
import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";
import axiosInstance from "../../config/axiosInstance";
import moment from "moment";
// Validation Schema
const getClientValidationSchema = () => {
  return Yup.object({
    companyName: Yup.string().required("Company name is required"),
    contractDate: Yup.date().required("Contract date is required"),
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
    endTime: Yup.string().required("End time is required"),
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
      name: values.companyName,
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

const generateShiftJSON = (values, clientName, branchNames) => {
  const newTime = moment(values?.startTime, "HH:mm").subtract(values?.reportingMinsBefore, "minutes").format("HH:mm");

  return {
    clientId: values.clientId,
    branchIds: values.selectedBranches,
    name: values.shiftName,
    startTime: values.startTime,
    endTime: values.endTime,
    reportTimeIn: values?.isReportingRequired ? newTime : null,
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

// API Services
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
  }
};

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
  }
};

const Edit = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();
  const checkModules = useCheckEnabledModule();

  const [isEditAvailable, setIsEditAvailable] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [selectedClientBranch, setSelectedClientBranch] = useState({});

  // Redux selectors
  const { subOrgs } = useSelector((state) => state?.subOrgs || {});
  const { branchList } = useSelector((state) => state?.branch || {});
  const { employeesFilters } = useSelector((state) => state?.employee || {});
  const { designationList } = useSelector((state) => state?.designation || {});
  const { addressTypes, typeOfIndustries = [] } = useSelector((state) => state?.global);
  const { clientList } = useSelector((state) => state?.client);
  const { clientBranchList, loading: branchLoading } = useSelector((state) => state?.clientBranch || {});
  const { shiftList, loading: shiftLoading } = useSelector((state) => state?.shift);

  const initialValues = {
    // Basic Client Details - Bind from state (same as BasicInformation.jsx)
    name: state?.name || "",
    orgTypeId: state?.orgTypeId || "",
    clientId: state?.clientId || "",
    // Additional Client Details
    companyName: state?.name || "",
    contractDate: state?.contractDate || "",
    ownerName: state?.ownerName || "",
    designation: state?.designation || "",
    contactMobile: state?.contactMobile || "",
    contactEmail: state?.contactEmail || "",
    gstNumber: state?.gstNumber || "",
    panNumber: state?.panNumber || "",
    landmark: state?.landmark || "",
    city: state?.city || "",
    state: state?.state || "",
    pincode: state?.pincode || "",
    registeredAddress: state?.registeredAddress || "",
    selectedBranch: "",
    selectedEmployee: "",
    subOrgId: "",
    addressTypeId: "",
    // Shift Details
    selectedBranches: [],
    shiftName: "",
    startTime: "",
    endTime: "",
    isReportingRequired: false,
    reportingMinsBefore: "",
  };

  useEffect(() => {
    if (checkModules('suborganization', 'r')) {
      dispatch(SubOrgListAction({}));
    } else {
      dispatch(BranchGetAction({}));
    }
    dispatch(DesignationGetAction({}));
    dispatch(clientListAction());
    dispatch(getAddressTypesAction());
    dispatch(getTypeOfIndustyAction());
  }, [dispatch]);

  // Load client branches when component mounts (similar to BranchTab.jsx)
  useEffect(() => {
    if (state?._id) {
      dispatch(clientBranchListAction({ clientMappedId: state?._id }));
    }
  }, [dispatch, state?._id]);

  // Set first branch as selected when branches load (similar to ShiftTab.jsx)
  useEffect(() => {
    if (clientBranchList?.length > 0) {
      const first = clientBranchList[0];
      setSelectedClientBranch({ branchId: first._id, name: first.name });
    }
  }, [clientBranchList]);

  // Load shifts when branch is selected (similar to ShiftTab.jsx)
  useEffect(() => {
    if (selectedClientBranch && state?._id) {
      const json = {
        orgId: state._id,
        branchId: selectedClientBranch.branchId,
      };
      dispatch(ShiftGetAction(json));
    }
  }, [selectedClientBranch, state?._id, dispatch]);

  // Bind basic client data when component mounts (same as BasicInformation.jsx)
  useEffect(() => {
    if (state) {
      console.log(state, "Client data loaded in Edit.jsx");
    }
  }, [state]);

  const handleSubmit = async (values) => {
    setIsSaving(true);
    setApiError(null);

    try {
      console.log("Received values:", values);

      const userPayload = removeEmptyStrings({
        name: values?.name,
        orgTypeId: values?.orgTypeId,
        id: values?.id,
        clientId: values?.clientId
      });
      
      const result = await dispatch(clientEditAction(userPayload));
      if (result?.meta?.requestStatus === "fulfilled") {
        setIsEditAvailable(!isEditAvailable);
        alert("Client updated successfully!");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      setApiError(error.message || 'An error occurred while updating');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShiftSubmit = async (values) => {
    setIsSaving(true);
    setApiError(null);

    try {
      const selectedBranchData = clientBranchList?.filter(b => values.selectedBranches.includes(b._id)) || [];
      
      const clientName = state?.name || '';
      const branchNames = selectedBranchData.map(b => b.name);

      // Use current client ID from state
      const shiftData = {
        ...values,
        clientId: state?.clientId || state?._id,
        clientMappedId: state?._id,
      };

      const shiftJSON = generateShiftJSON(shiftData, clientName, branchNames);
      console.log('Shift JSON:', shiftJSON);

      const result = await ShiftAPI.addShift(shiftJSON);

      if (result.success) {
        const newShift = {
          id: result.data.shiftId || result.data._id || Date.now(),
          ...shiftData,
          clientName,
          branchNames,
          jsonData: shiftJSON,
          apiResponse: result.data,
        };

        setShifts((prev) => [...prev, newShift]);
        alert('Shift added successfully!');
        
        // Refresh shift list
        if (selectedClientBranch && state?._id) {
          const json = {
            orgId: state._id,
            branchId: selectedClientBranch.branchId,
          };
          dispatch(ShiftGetAction(json));
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('API Error:', error);
      setApiError(error.message || 'An error occurred while saving');
      alert(`Error: ${error.message || 'Failed to save. Please try again.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="text-center flex-1">
              <h1 className="text-primary mb-3 font-bold text-3xl">Edit Client Details</h1>
              <p className="text-gray-600 text-sm">Update client information and settings</p>
            </div>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
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

          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ values, setFieldValue, resetForm, isSubmitting }) => (
              <Form className="space-y-6">
                
                {/* Section 1: Client Details */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Client Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Basic Information Fields */}
                    <FormikInput
                      name="name"
                      label="Client Organization Name"
                      inputType="input"
                      placeholder="Enter company name"
                    />
                    <FormikInput
                      name="type"
                      label="Client Business Type"
                      inputType="dropdown"
                      listData={typeOfIndustries}
                      inputName="Select Type"
                      feildName="name"
                      hideLabel={true}
                      showTip={false}
                      showSerch={true}
                      handleClick={(selected) => {
                        setFieldValue("orgTypeId", selected?._id);
                      }}
                      selectedOption={values?.orgTypeId}
                      selectedOptionDependency="_id"
                    />
                    <FormikInput
                      name="contractDate"
                      label="Contract Date"
                      inputType="input"
                      type="date"
                    />
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
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
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

                    {/* Branch List - Right after Assign Officer */}
                    {clientBranchList && clientBranchList.length > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Building className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">Client Branches</h3>
                    </div>

                    <Table
                      tableJson={clientBranchList}
                      labels={{
                        name: {
                          DisplayName: "Branch Name",
                        },
                        firstName: {
                          DisplayName: "Created By",
                          type: "object",
                          objectName: "createdBy.name",
                          keyName: "firstName",
                        },
                        isActive: {
                          DisplayName: "Status",
                          type: "function",
                          data: (data, idx, subData, subIdx) => {
                            return (
                              <div className="flex justify-center items-center gap-2" key={idx}>
                                <Chip
                                  color={data?.isActive ? "green" : "red"}
                                  variant="ghost"
                                  value={data?.isActive ? "Active" : "Inactive"}
                                  className="cursor-pointer font-poppins"
                                />
                              </div>
                            );
                          },
                        },
                      }}
                      uniqueRowKey="_id"
                      tableName="Branch"
                    />
                  </div>
                )}

                {/* Section 4: Shift Details */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Shift Details</h3>
                  </div>

                  <Formik
                    initialValues={{
                      clientId: state?.clientId || state?._id || "",
                      clientMappedId: state?._id || "",
                      selectedBranches: [],
                      shiftName: "",
                      startTime: "",
                      endTime: "",
                      isReportingRequired: false,
                      reportingMinsBefore: "",
                    }}
                    validationSchema={getShiftValidationSchema()}
                    onSubmit={handleShiftSubmit}
                  >
                    {({ values: shiftValues, setFieldValue: setShiftFieldValue, resetForm: resetShiftForm, isSubmitting: isShiftSubmitting }) => (
                      <div className="space-y-6">
                        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
                          {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Client (Current)
                            </label>
                            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                              {state?.name || 'Current Client'}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Shifts will be created for this client
                            </p>
                          </div> */}

                          {/* <FormikInput
                            name="selectedBranches"
                            label="Select Branches"
                            inputType="multiDropdown"
                            selectedData={shiftValues.selectedBranches}
                            data={clientBranchList}
                            Dependency="_id"
                            FeildName="name"
                            type={"object"}
                            InputName={"Branches"}
                            setSelectedData={(branches) => setShiftFieldValue("selectedBranches", branches)}
                            hideLabel
                          /> */}
                        {/* </div> */}

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

                        <div className="mb-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={shiftValues.isReportingRequired}
                              onChange={(e) => {
                                setShiftFieldValue("isReportingRequired", e.target.checked);
                                if (!e.target.checked) {
                                  setShiftFieldValue("reportingMinsBefore", "");
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Is Reporting Time Required?
                            </span>
                          </label>
                        </div>

                        {shiftValues.isReportingRequired && (
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
                              Staff must report {shiftValues.reportingMinsBefore || '___'} minutes before shift starts
                            </p>
                          </div>
                        )}

                        <div className="flex justify-center">
                          <button
                            type="submit"
                            disabled={isShiftSubmitting || isSaving}
                            className="flex items-center gap-2 px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Plus className="w-5 h-5" />
                                Add Shift
                              </>
                            )}
                          </button>
                        </div>

                        {/* Shift List - Right after Add Shift button */}
                        {shiftList && shiftList.length > 0 && (
                          <div className="mt-6">

                            {/* Branch Selector for Shifts */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                              <SingleSelectDropdown
                                listData={clientBranchList ?? []}
                                inputName="Client Branch"
                                hideLabel={true}
                                showTip={false}
                                feildName="name"
                                selectedOption={selectedClientBranch?.branchId}
                                selectedOptionDependency={"_id"}
                                handleClick={(data) => {
                                  setSelectedClientBranch((prev) => ({
                                    ...prev,
                                    branchId: data?._id,
                                    name: data?.name,
                                  }));
                                }}
                              />
                            </div>

                            <Table
                              tableJson={shiftList}
                              labels={{
                                name: {
                                  DisplayName: "Name",
                                  type: "function",
                                  data: (data, idx, subData, subIdx) => {
                                    function getInitials(name) {
                                      if (!name) return "";
                                      const words = name.trim().split(/\s+/);
                                      if (words.length === 1) {
                                        return words[0][0].toUpperCase();
                                      }
                                      return words[0][0].toUpperCase() + words[1][0].toUpperCase();
                                    }
                                    return (
                                      <div className="flex items-center gap-2" key={idx}>
                                        <div
                                          className="h-7 w-7 rounded-md flex items-center justify-center"
                                          style={{ backgroundColor: data?.bgColor }}
                                        >
                                          <Typography
                                            className="text-xs font-semibold"
                                            style={{ color: data?.textColor }}
                                          >
                                            {getInitials(data?.name)}
                                          </Typography>
                                        </div>
                                        <span className="text-sm">{data?.name}</span>
                                      </div>
                                    );
                                  },
                                },
                                startTime: {
                                  DisplayName: "Start Time",
                                },
                                endTime: {
                                  DisplayName: "End Time",
                                },
                                firstName: {
                                  DisplayName: "Created By",
                                  type: "object",
                                  objectName: "createdBy",
                                },
                                isActive: {
                                  DisplayName: "Status",
                                  type: "function",
                                  data: (data, idx, subData, subIdx) => {
                                    return (
                                      <div className="flex justify-center items-center gap-2" key={idx}>
                                        <Chip
                                          color={data?.isActive ? "green" : "red"}
                                          variant="ghost"
                                          value={data?.isActive ? "Active" : "Inactive"}
                                          className="cursor-pointer font-poppins"
                                        />
                                      </div>
                                    );
                                  },
                                },
                              }}
                              uniqueRowKey="_id"
                              tableName="Shifts"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </Formik>
                </div>

            

                {/* Action Buttons */}
                <div className="flex justify-center pt-6 border-t">
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
                        <Building className="w-5 h-5" />
                        Update Client
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Edit;
