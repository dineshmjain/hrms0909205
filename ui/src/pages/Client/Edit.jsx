// import React, { useState, useEffect } from "react";
// import { Formik, Form } from "formik";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
// import { Building, CheckCircle, UserPlus, Clock, Plus, Edit2, Trash2, X, Loader2 } from "lucide-react";
// import { FaPen } from "react-icons/fa";
// import * as Yup from "yup";
// import Header from "../../components/header/Header";
// import TabSection from "../../components/TabSection/TabSection";
// import FormikInput from "../../components/input/FormikInput";
// import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
// import Table from "../../components/Table/Table";
// import { Button, Chip, Typography } from "@material-tailwind/react";

// import { removeEmptyStrings } from "../../constants/reusableFun";
// import { EmployeeEditAction } from "../../redux/Action/Employee/EmployeeAction";
// import BasicInformation from "./BasicInformation/BasicInformation";
// import TabsContent from "./Tabs/TabsContent";
// import { clientEditAction } from "../../redux/Action/Client/ClientAction";
// import OwnerDetails from "./Tabs/OwnerDetails";
// import { BranchEditAction, BranchGetAction } from "../../redux/Action/Branch/BranchAction";
// import { SubOrgListAction } from "../../redux/Action/SubOrgAction/SubOrgAction";
// import { DesignationGetAction } from "../../redux/Action/Designation/DesignationAction";
// import { EmployeeGetActionForFilter } from "../../redux/Action/Employee/EmployeeAction";
// import { getAddressTypesAction, getTypeOfIndustyAction } from "../../redux/Action/Global/GlobalAction";
// import { clientListAction } from "../../redux/Action/Client/ClientAction";
// import { clientBranchCreateAction, clientBranchListAction } from "../../redux/Action/ClientBranch/ClientBranchAction";
// import { ShiftCreateAction, ShiftGetAction } from "../../redux/Action/Shift/ShiftAction";
// import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";
// import axiosInstance from "../../config/axiosInstance";
// import moment from "moment";
// import { MdModeEditOutline } from "react-icons/md";
// import { Dialog, DialogBody, DialogHeader, IconButton } from '@material-tailwind/react';
// import { HiOutlineXMark } from "react-icons/hi2";
// import TooltipMaterial from "../../components/TooltipMaterial/TooltipMaterial";
// import KYC from "./Tabs/KYC";
// import toast from 'react-hot-toast';
// // Validation Schema
// const getClientValidationSchema = () => {
//   return Yup.object({
//     companyName: Yup.string().required("Company name is required"),
//     contractDate: Yup.date().required("Contract date is required"),
//     ownerName: Yup.string().required("Owner name is required"),
//     designation: Yup.string().required("Designation is required"),
//     contactMobile: Yup.string()
//       .matches(/^[0-9]{10}$/, "Must be exactly 10 digits")
//       .required("Contact number is required"),
//     contactEmail: Yup.string()
//       .email("Invalid email format")
//       .required("Email is required"),
//     gstNumber: Yup.string().required("GST number is required"),
//     panNumber: Yup.string()
//       .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
//       .required("PAN number is required"),
//     registeredAddress: Yup.string().required("Address is required"),
//     city: Yup.string().required("City is required"),
//     state: Yup.string().required("State is required"),
//     pincode: Yup.string()
//       .matches(/^[0-9]{6}$/, "Must be 6 digits")
//       .required("Pincode is required"),
//     selectedEmployee: Yup.string().required("Please select an employee"),
//   });
// };

// const getShiftValidationSchema = () => {
//   return Yup.object({
//     clientId: Yup.string().required("Please select a client"),
//     selectedBranches: Yup.array()
//       .min(1, "Please select at least one branch")
//       .required("Please select branches"),
//     shiftName: Yup.string()
//       .required("Shift name is required")
//       .min(3, "Shift name must be at least 3 characters"),
//     startTime: Yup.string().required("Start time is required"),
//     endTime: Yup.string().required("End time is required"),
//     isReportingRequired: Yup.boolean(),
//     reportingMinsBefore: Yup.number().when('isReportingRequired', {
//       is: true,
//       then: (schema) => schema
//         .required("Reporting time is required")
//         .min(1, "Must be at least 1 minute")
//         .max(120, "Cannot exceed 120 minutes"),
//       otherwise: (schema) => schema.notRequired()
//     }),
//   });
// };

// // Generate JSON for API
// const generateClientJSON = (values) => {
//   const nameParts = values.ownerName.trim().split(' ');
//   const firstName = nameParts[0] || '';
//   const lastName = nameParts.slice(1).join(' ') || '';

//   const fullAddress = [
//     values.registeredAddress,
//     values.landmark,
//     values.city,
//     values.state,
//     'India'
//   ].filter(Boolean).join(', ');

//   return {
//     client: {
//       name: values.companyName,
//       clientSince: values.contractDate
//     },
//     registeredBy: {
//       name: {
//         firstName: firstName,
//         lastName: lastName
//       },
//       relationshipToOrg: values.designation,
//       mobile: values.contactMobile,
//       email: values.contactEmail
//     },
//     branch: {
//       name: values.companyName,
//       gstNo: values.gstNumber,
//       panNo: values.panNumber,
//       address: {
//         addressTypeId: values?.addressTypeId,
//         address: fullAddress,
//         city: values.city,
//         state: values.state,
//         pincode: values.pincode
//       }
//     },
//     fieldOfficer: {
//       id: values.selectedEmployee
//     }
//   };
// };

// const generateShiftJSON = (values, clientName, branchNames) => {
//   const newTime = moment(values?.startTime, "HH:mm").subtract(values?.reportingMinsBefore, "minutes").format("HH:mm");

//   return {
//     clientId: values.clientId,
//     branchIds: values.selectedBranches,
//     name: values.shiftName,
//     startTime: values.startTime,
//     endTime: values.endTime,
//     reportTimeIn: values?.isReportingRequired ? newTime : null,
//   };
// };

// function extractPANFromGSTIN(gstin) {
//   if (!gstin || typeof gstin !== "string") return "";
//   const normalized = gstin.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
//   if (normalized.length !== 15) return "";
//   const pan = normalized.slice(2, 12);
//   const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
//   return panRegex.test(pan) ? pan : "";
// }

// // API Services
// const ClientAPI = {
//   addClient: async (clientData) => {
//     try {
//       const response = await axiosInstance.post('/client/wizard/add', clientData);
//       return { success: true, data: response.data };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.response?.data?.message || 'Failed to add client'
//       };
//     }
//   }
// };

// const ShiftAPI = {
//   addShift: async (shiftData) => {
//     try {
//       const response = await axiosInstance.post('/shift/create', removeEmptyStrings(shiftData));
//       return { success: true, data: response.data };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.response?.data?.message || 'Failed to add shift'
//       };
//     }
//   }
// };

// const Edit = () => {
//   const dispatch = useDispatch();
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const checkModules = useCheckEnabledModule();

//   const [isEditable, setIsEditable] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [shifts, setShifts] = useState([]);
//   const [selectedClientBranch, setSelectedClientBranch] = useState({});
//   const [openDialog, setOpenDialog] = useState(false);
//   const [branchName, setBranchName] = useState({});
//   const [shiftDetails, setShiftDetails] = useState({});
//   const [isBranchEdit, setIsBranchEdit] = useState(false);
//   // Redux selectors
//   const { subOrgs } = useSelector((state) => state?.subOrgs || {});
//   const { branchList } = useSelector((state) => state?.branch || {});
//   const { employeesFilters } = useSelector((state) => state?.employee || {});
//   const { designationList } = useSelector((state) => state?.designation || {});
//   const { addressTypes, typeOfIndustries = [] } = useSelector((state) => state?.global);
//   const { clientList } = useSelector((state) => state?.client);
//   const { clientBranchList, loading: branchLoading } = useSelector((state) => state?.clientBranch || {});
//   const { shiftList, loading: shiftLoading } = useSelector((state) => state?.shift);

//   const [initialValues, setInitialValues] = useState({
//     name: "",
//     orgTypeId: "",
//     clientId: "",
//   });

//   useEffect(() => {
//     if (checkModules('suborganization', 'r')) {
//       dispatch(SubOrgListAction({}));
//     } else {
//       dispatch(BranchGetAction({}));
//     }
//     dispatch(DesignationGetAction({}));
//     dispatch(clientListAction());
//     dispatch(getAddressTypesAction());
//     dispatch(getTypeOfIndustyAction());
//   }, [dispatch]);

//   // Load client branches when component mounts (similar to BranchTab.jsx)
//   useEffect(() => {
//     if (state?._id) {
//       dispatch(clientBranchListAction({ clientMappedId: state?._id }));
//     }
//   }, [dispatch, state?._id]);

//   // Set first branch as selected when branches load (similar to ShiftTab.jsx)
//   useEffect(() => {
//     if (clientBranchList?.length > 0) {
//       const first = clientBranchList[0];
//       setSelectedClientBranch({ branchId: first._id, name: first.name });
//     }
//   }, [clientBranchList]);

//   // Load shifts when branch is selected (similar to ShiftTab.jsx)
//   useEffect(() => {
//     if (selectedClientBranch && state?._id) {
//       const json = {
//         orgId: state._id,
//         branchId: selectedClientBranch.branchId,
//       };
//       dispatch(ShiftGetAction(json));
//     }
//   }, [selectedClientBranch, state?._id, dispatch]);

//   // Bind basic client data when component mounts (same as BasicInformation.jsx)
//   useEffect(() => {
//     if (state) {
//       setInitialValues(prev => ({
//         ...prev,
//         name: state?.name,
//       }));
//     }
//   }, [state]);

//   const handleSubmit = async (values) => {
//     setIsSaving(true);
//     setApiError(null);

//     try {
//       console.log("Received values:", values);

//       const userPayload = removeEmptyStrings({
//         name: values?.name,
//         orgTypeId: values?.orgTypeId,
//         id: values?.id,
//         clientId: values?.clientId
//       });

//       const result = await dispatch(clientEditAction(userPayload));
//       if (result?.meta?.requestStatus === "fulfilled") {
//         alert("Client updated successfully!");
//       }
//     } catch (error) {
//       console.error("Error updating client:", error);
//       setApiError(error.message || 'An error occurred while updating');
//     } finally {
//       setIsSaving(false);
//     }
//   };
//   const branchLabels = {
//     name: {
//       DisplayName: "Branch Name",
//     },
//     firstName: {
//       DisplayName: "Created By",
//       type: "object",
//       objectName: "createdBy.name",
//       keyName: "firstName",
//     },
//     isActive: {
//       DisplayName: "Status",
//       type: "function",
//       data: (data, idx, subData, subIdx) => {
//         return (
//           <div className="flex justify-center items-center gap-2" key={idx}>
//             <Chip
//               color={data?.isActive ? "green" : "red"}
//               variant="ghost"
//               value={data?.isActive ? "Active" : "Inactive"}
//               className="cursor-pointer font-poppins"
//             />
//           </div>
//         );
//       },
//     },
//   }

//   const shiftLabels = {
//     name: {
//       DisplayName: "Name",
//       type: "function",
//       data: (data, idx, subData, subIdx) => {
//         function getInitials(name) {
//           if (!name) return "";
//           const words = name.trim().split(/\s+/);
//           if (words.length === 1) {
//             return words[0][0].toUpperCase();
//           }
//           return words[0][0].toUpperCase() + words[1][0].toUpperCase();
//         }
//         return (
//           <div className="flex items-center gap-2" key={idx}>
//             <div
//               className="h-7 w-7 rounded-md flex items-center justify-center"
//               style={{ backgroundColor: data?.bgColor }}
//             >
//               <Typography
//                 className="text-xs font-semibold"
//                 style={{ color: data?.textColor }}
//               >
//                 {getInitials(data?.name)}
//               </Typography>
//             </div>
//             <span className="text-sm">{data?.name}</span>
//           </div>
//         );
//       },
//     },
//     startTime: {
//       DisplayName: "Start Time",
//     },
//     endTime: {
//       DisplayName: "End Time",
//     },
//     firstName: {
//       DisplayName: "Created By",
//       type: "object",
//       objectName: "createdBy",
//     },
//     isActive: {
//       DisplayName: "Status",
//       type: "function",
//       data: (data, idx, subData, subIdx) => {
//         return (
//           <div className="flex justify-center items-center gap-2" key={idx}>
//             <Chip
//               color={data?.isActive ? "green" : "red"}
//               variant="ghost"
//               value={data?.isActive ? "Active" : "Inactive"}
//               className="cursor-pointer font-poppins"
//             />
//           </div>
//         );
//       },
//     },
//   }

//   const actions = [
//     {
//       title: "Edit",
//       text: <MdModeEditOutline className="w-5 h-5" />,
//       onClick: (branch) => {
//         if (checkModules("client", "u") == false)
//           return toast.error("You are Unauthorized to Edit Client Branch!");
//         editClientButton(branch);
//       },
//     },
//   ];

//   const closeDialog = () => {
//     setOpenDialog(false);
//   }

//   const addClientBranch = () => {
//     setIsBranchEdit(false)
//     setBranchName({ name: "", value: "" });
//     setOpenDialog(true);
//   }

//   const submitCreate = async () => {
//     const responseData = removeEmptyStrings({
//       clientMappedId: state?._id,
//       clientId: state?.clientId,
//       name: branchName.name,
//     });
//     console.log(responseData);
//     const response = await dispatch(clientBranchCreateAction(responseData));
//     setOpenDialog(false);
//     if (response?.meta?.requestStatus === "fulfilled") {
//       dispatch(clientBranchListAction({ clientMappedId: state?._id }));
//     }
//   }

//   const editClientButton = async (rowData) => {
//     setIsBranchEdit(true)
//     setOpenDialog(true);
//     setBranchName({ name: rowData?.name, value: rowData?._id });
//   };

//   const submitEdit = async () => {
//     const responseData = removeEmptyStrings({
//       subOrgId: state?._id,
//       id: branchName.value,
//       name: branchName.name,
//     });
//     console.log(responseData);
//     const response = await dispatch(BranchEditAction(responseData));
//     setOpenDialog(false);
//     if (response?.meta?.requestStatus === "fulfilled") {
//       dispatch(clientBranchListAction({ clientMappedId: state?._id }));
//     }
//   }


//   const handleEditClick = () => {
//     setIsEditable(true);
//   };

//   const handleShiftSubmit = async (values) => {
//     const newTime = moment(shiftDetails?.startTime, "HH:mm").subtract(shiftDetails?.reportingTime, "minutes").format("HH:mm");
//     const payload = {
//       clientId: state.clientId,
//       clientMappedId: state._id,
//       branchIds: shiftDetails.branch,
//       name: shiftDetails.shiftName,
//       startTime: shiftDetails.startTime,
//       endTime: shiftDetails.endTime,
//       reportTimeIn: shiftDetails?.isReportingRequired ? newTime : null,
//     }
//     console.log(payload, "payload to add shift");
//     const cleanedData = removeEmptyStrings(payload);
//     const result = await dispatch(ShiftCreateAction(cleanedData));
//     const { meta, payload: resPayload } = result;
//     debugger
//     if (meta.requestStatus === 'fulfilled') {
//       debugger
//       toast.success(resPayload?.message || 'Shift created successfully!');
//       dispatch(ShiftGetAction({
//         orgId: state._id, branchId: selectedClientBranch.branchId,
//       }));
//       setShiftDetails({ branch: "", shiftName: "", startTime: "", endTime: "", isReportingRequired: false, reportingMinsBefore: "" })
//     }
//   };

//   return (
//     <>
//       <Dialog open={openDialog} size='xl'>
//         <DialogHeader className="flex justify-between">
//           <h3 className="text-lg font-semibold">{isBranchEdit == true ? "Edit" : "Add"} Branch</h3>
//           <HiOutlineXMark onClick={closeDialog} />
//         </DialogHeader>
//         <DialogBody >
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Branch Name
//           </label>
//           <input
//             id="searchInput"
//             type="text"
//             value={branchName.name}
//             className={`border-2 border-gray-400 mr-2 rounded-md w-[250px] p-2`}
//             placeholder="Enter Branch Name"
//             onChange={(e) => {
//               setBranchName(prev => ({ ...prev, name: e.target.value }));
//             }}
//           />
//           <KYC />
//           <div className="flex justify-end gap-2 mt-4">
//             <button
//               className="bg-green-700 text-white px-4 py-1 rounded-md h-fit"
//               onClick={isBranchEdit ? submitEdit : submitCreate}
//             >
//               Submit
//             </button>
//             <button
//               className="bg-red-700 text-white px-4 py-1 rounded-md h-fit"
//               onClick={closeDialog}
//             >
//               Cancel
//             </button>
//           </div>
//         </DialogBody>
//       </Dialog>
//       <div className="flex flex-col w-full p-4 bg-white border border-gray-100 rounded-md shadow-hrms overflow-auto">
//         <Header
//           isBackHandler={true}
//           headerLabel={"Edit Client Organization"}
//           subHeaderLabel={"Edit Your Client Organization Details"}
//           isButton={false}
//           handleBack={() => {
//             navigate("../");
//           }}
//         />
//         <Formik enableReinitialize initialValues={initialValues}>
//           {({ values }) => (
//             <Form className="space-y-6">

//               {/* Section 1: Client Details */}
//               <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
//                   <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
//                     <Building className="w-5 h-5 text-blue-600" />
//                   </div>
//                   <h3 className="text-lg font-bold text-gray-800">Client Details</h3>
//                 </div>
//                 <div className="flex gap-6 items-end">
//                   <div className="w-[250px]">
//                     <FormikInput
//                       name="name"
//                       label="Client Organization Name"
//                       inputType={"input"}
//                       editValue={values?.name}
//                       disabled={!isEditable}
//                       placeholder="Enter company name"
//                     />
//                   </div>
//                   {!isEditable ? (
//                     <TooltipMaterial content={"Click To Edit Name"}>
//                       <IconButton
//                         onClick={handleEditClick}
//                         size="sm"
//                         className="flex items-center justify-center text-gray-600 hover:text-pop transition-colors  bg-primary
//                         hover:bg-primaryLight text-white hover:text-primary w-8 h-8 sm:w-10 sm:h-10 rounded-full"
//                       >
//                         <FaPen
//                           className=""
//                         />
//                       </IconButton>
//                     </TooltipMaterial>
//                   ) : (
//                     <div className="flex items-end">
//                       <button className="bg-red-700 text-white px-4 py-1 rounded-md h-fit" onClick={() => { setIsEditable(false) }}>Cancel</button>&nbsp;
//                       <button className="bg-green-700 text-white px-4 py-1 rounded-md h-fit" >Update</button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Section 2: KYC Details */}
//               {/* <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
//                   <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
//                     <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
//                       <CheckCircle className="w-5 h-5 text-green-600" />
//                     </div>
//                     <h3 className="text-lg font-bold text-gray-800">KYC Details</h3>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
//                     <FormikInput
//                       name="gstNumber"
//                       label="GST Number"
//                       inputType="input"
//                       placeholder="Enter GST number"
//                     />
//                     <FormikInput
//                       name="panNumber"
//                       label="PAN Number"
//                       inputType="input"
//                       placeholder="ABCDE1234F"
//                     />
//                   </div>

//                   <div className="grid grid-cols-12 gap-4 mb-4">
//                     <div className="col-span-12 md:col-span-2">
//                       <FormikInput
//                         name="addressTypeId"
//                         label="Address Type"
//                         inputType="dropdown"
//                         listData={addressTypes}
//                         inputName="Select AddressType"
//                         feildName="name"
//                         hideLabel={true}
//                         showSerch={true}
//                         handleClick={(selected) => {
//                           setFieldValue("addressTypeId", selected?._id);
//                         }}
//                         selectedOption={values.addressTypeId}
//                         selectedOptionDependency="_id"
//                       />
//                     </div>

//                     <div className="col-span-12 md:col-span-10">
//                       <label className="text-gray-700 text-sm font-medium mb-1.5 block">
//                         Registered Address
//                       </label>
//                       <textarea
//                         name="registeredAddress"
//                         value={values.registeredAddress || ""}
//                         onChange={(e) => setFieldValue("registeredAddress", e.target.value)}
//                         rows={1}
//                         placeholder="Enter complete address"
//                         className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-600 focus:border-gray-600 focus:ring-2 focus:ring-gray-100 resize-none"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-12 gap-4 mb-4">
//                     <div className="col-span-12 md:col-span-4">
//                       <FormikInput name="landmark" label="Landmark" inputType="input" placeholder="Near..." />
//                     </div>
//                     <div className="col-span-12 md:col-span-3">
//                       <FormikInput name="city" label="City" inputType="input" placeholder="City" />
//                     </div>
//                     <div className="col-span-12 md:col-span-3">
//                       <FormikInput name="state" label="State" inputType="input" placeholder="State" />
//                     </div>
//                     <div className="col-span-12 md:col-span-2">
//                       <FormikInput name="pincode" label="Pincode" inputType="input" placeholder="6 digits" maxLength={6} />
//                     </div>
//                   </div>
//                 </div> */}

//               {/* Section 3: Assign Officer */}
//               {/* <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
//                   <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
//                     <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
//                       <UserPlus className="w-5 h-5 text-purple-600" />
//                     </div>
//                     <h3 className="text-lg font-bold text-gray-800">Assign Officer</h3>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                     {checkModules("suborganization", "r") && (
//                       <FormikInput
//                         name="subOrgId"
//                         inputType="dropdown"
//                         listData={subOrgs}
//                         inputName="Select Organization"
//                         feildName="name"
//                         hideLabel={true}
//                         showSerch={true}
//                         handleClick={(selected) => setFieldValue("subOrgId", selected?._id)}
//                         selectedOption={values.subOrgId}
//                         selectedOptionDependency="_id"
//                       />
//                     )}
//                     <FormikInput
//                       name="selectedBranch"
//                       inputType="dropdown"
//                       listData={branchList}
//                       inputName="Select Branch"
//                       feildName="name"
//                       hideLabel={true}
//                       showSerch={true}
//                       handleClick={(selected) => setFieldValue("selectedBranch", selected?._id)}
//                       selectedOption={values.selectedBranch}
//                       selectedOptionDependency="_id"
//                     />
//                     <FormikInput
//                       name="selectedDesignation"
//                       inputType="dropdown"
//                       listData={designationList}
//                       inputName="Select Designation"
//                       feildName="name"
//                       hideLabel={true}
//                       showSerch={true}
//                       handleClick={(selected) => setFieldValue("selectedDesignation", selected?._id)}
//                       selectedOption={values.selectedDesignation}
//                       selectedOptionDependency="_id"
//                     />
//                     <FormikInput
//                       name="selectedEmployee"
//                       inputType="dropdown"
//                       listData={employeesFilters}
//                       inputName="Select Employee"
//                       feildName="name"
//                       hideLabel={true}
//                       showSerch={true}
//                       handleClick={(selected) => setFieldValue("selectedEmployee", selected?._id)}
//                       selectedOption={values.selectedEmployee}
//                       selectedOptionDependency="_id"
//                     />
//                   </div>
//                 </div> */}

//               {/* Branch List - Right after Assign Officer */}
//               {clientBranchList && clientBranchList.length > 0 && (
//                 <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
//                   <div className="flex justify-between">
//                     <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
//                       <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
//                         <Building className="w-5 h-5 text-blue-600" />
//                       </div>
//                       <h3 className="text-lg font-bold text-gray-800">Client Branches</h3>
//                     </div>
//                     <button type="button"
//                       className="flex items-center gap-2 cursor-pointer transition ease-in-out 
//                       duration-[.2s] w-fit bg-primary shadow-none text-popfont-medium text-white
//                        px-2 py-2 rounded-md hover:bg-primaryLight hover:shadow-none text-sm h-fit
//                        hover:text-primary"
//                       onClick={addClientBranch}
//                     >
//                       Create
//                     </button>
//                   </div>
//                   <Table
//                     tableJson={clientBranchList}
//                     labels={branchLabels}
//                     uniqueRowKey="_id"
//                     actions={actions}
//                     tableName="Branch"
//                   />
//                 </div>
//               )}

//               {/* Section 4: Shift Details */}
//               <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
//                   <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
//                     <Clock className="w-5 h-5 text-orange-600" />
//                   </div>
//                   <h3 className="text-lg font-bold text-gray-800">Shift Details</h3>
//                 </div>

//                 <Formik
//                   initialValues={{
//                     clientId: state?.clientId || state?._id || "",
//                     clientMappedId: state?._id || "",
//                     selectedBranches: [],
//                     shiftName: "",
//                     startTime: "",
//                     endTime: "",
//                     isReportingRequired: false,
//                     reportingMinsBefore: "",
//                   }}
//                   validationSchema={getShiftValidationSchema()}
//                 >
//                   {({ values: shiftValues, setFieldValue: setShiftFieldValue, resetForm: resetShiftForm, isSubmitting: isShiftSubmitting }) => (
//                     <div className="space-y-6">
//                       <div className="flex gap-6">
//                         <div className="w-[250px]">
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Client (Current)
//                           </label>
//                           <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
//                             {state?.name || 'Current Client'}
//                           </div>
//                           <p className="text-xs text-gray-500 mt-1">
//                             Shifts will be created for this client
//                           </p>
//                         </div>
//                         <div className="mt-1">
//                           <FormikInput
//                             name="selectedBranches"
//                             label="Select Branches"
//                             inputType="multiDropdown"
//                             selectedData={shiftDetails.branch}
//                             data={clientBranchList}
//                             Dependency="_id"
//                             FeildName="name"
//                             type={"object"}
//                             InputName={"Branches"}
//                             setSelectedData={(branches) => setShiftDetails(prev => ({ ...prev, branch: branches }))}
//                             hideLabel
//                           />
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
//                         <FormikInput
//                           name="shiftName"
//                           label="Shift Name"
//                           inputType="input"
//                           placeholder="e.g., Morning Shift"
//                           editValue={shiftDetails.shiftName}
//                           onChange={(e) =>
//                             setShiftDetails((prev) => ({
//                               ...prev,
//                               shiftName: e.target.value,
//                             }))
//                           }
//                         />
//                         <FormikInput
//                           name="startTime"
//                           label="Start Time"
//                           inputType="input"
//                           type="time"
//                           editValue={shiftDetails.startTime}
//                           onChange={(e) =>
//                             setShiftDetails((prev) => ({
//                               ...prev,
//                               startTime: e.target.value,
//                             }))
//                           }
//                         />

//                         <FormikInput
//                           name="endTime"
//                           label="End Time"
//                           inputType="input"
//                           type="time"
//                           editValue={shiftDetails.endTime}
//                           onChange={(e) =>
//                             setShiftDetails((prev) => ({
//                               ...prev,
//                               endTime: e.target.value,
//                             }))
//                           }
//                         />
//                       </div>
//                       <div className="mb-4">
//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <input
//                             type="checkbox"
//                             checked={shiftDetails.isReportingRequired}
//                             onChange={(e) => {
//                               setShiftDetails(prev => ({ ...prev, isReportingRequired: e.target.checked }))
//                               // setShiftFieldValue("isReportingRequired", e.target.checked);
//                               if (!e.target.checked) {
//                                 setShiftDetails(prev => ({ ...prev, reportingTime: "" }))
//                                 // setShiftFieldValue("reportingMinsBefore", "");reportingTime
//                               }
//                             }}
//                             className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 border-gray-300"
//                           />
//                           <span className="text-sm font-medium text-gray-700">
//                             Is Reporting Time Required?
//                           </span>
//                         </label>
//                       </div>

//                       {shiftDetails.isReportingRequired && (
//                         <div className="w-[250px]">
//                           <FormikInput
//                             name="reportingMinsBefore"
//                             label="Minutes Before Shift Start"
//                             inputType="input"
//                             type="number"
//                             placeholder="e.g., 15"
//                             onChange={(e) =>
//                               setShiftDetails((prev) => ({
//                                 ...prev,
//                                 reportingTime: e.target.value,
//                               }))
//                             }
//                             editValue={shiftDetails.reportingTime}
//                           />
//                           <p className="text-xs text-gray-500 mt-1">
//                             Staff must report {shiftDetails.reportingTime || '___'} minutes before shift starts
//                           </p>
//                         </div>
//                       )}

//                       <div className="flex justify-center">
//                         <button
//                           type="submit"
//                           onClick={handleShiftSubmit}
//                           disabled={isShiftSubmitting || isSaving}
//                           className="flex items-center gap-2 px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           Add Shift
//                         </button>
//                       </div>
//                       {/* {shiftList && shiftList.length > 0 && ( */}
//                       <div className="mt-6">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
//                           <SingleSelectDropdown
//                             listData={clientBranchList ?? []}
//                             inputName="Client Branch"
//                             hideLabel={true}
//                             showTip={false}
//                             feildName="name"
//                             selectedOption={selectedClientBranch?.branchId}
//                             selectedOptionDependency={"_id"}
//                             handleClick={(data) => {
//                               setSelectedClientBranch((prev) => ({
//                                 ...prev,
//                                 branchId: data?._id,
//                                 name: data?.name,
//                               }));
//                             }}
//                           />
//                         </div>

//                         <Table
//                           tableJson={shiftList}
//                           labels={shiftLabels}
//                           uniqueRowKey="_id"
//                           tableName="Shifts"
//                         />
//                       </div>
//                       {/* )} */}
//                     </div>
//                   )}
//                 </Formik>
//               </div>

//               {/* Action Buttons */}
//               {/* <div className="flex justify-center pt-6 border-t">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting || isSaving}
//                   className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isSaving ? (
//                     <>
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Building className="w-5 h-5" />
//                       Update Client
//                     </>
//                   )}
//                 </button>
//               </div> */}
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </>
//   );
// };

// export default Edit;


import React, { useState ,useRef} from "react";
import { useEffect } from "react";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

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
import Settings from "./Tabs/Settings/Settings";
import BranchTab from "./Tabs/BranchTab";
import EmployeeAssign from "../../components/EmployeeAssign/EmployeeAssign";
import ShiftTab from "./Tabs/ShiftTab";
import OwnerDetails from "./Tabs/OwnerDetails";
import EmergencyNo from "./Tabs/Emergency/EmergencyNo";
const Edit = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [params, setParams] = useSearchParams({ tab: "Client Owner Details" });
  const tab = params.get("tab");
  const scrollContainerRef = useRef(null);
  const clientOwnerDetailsRef = useRef(null);
  const clientBranchRef = useRef(null);
  const clientShiftRef = useRef(null);
  const assignEmpRef = useRef(null);
  const emergencyNoRef = useRef(null);
  const settingsRef = useRef(null);

  const [isEditAvailable, setIsEditAvailable] = useState(true);

  const employee = useSelector((state) => state?.employeee);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    id: employee?.data?.id || "",
    // Add more fields if needed
  };

  const handleTabClick = (targetTab) => {
    setParams({ tab: targetTab });
    navigate(`/client/edit?tab=${targetTab}`, { state });
  };

  const handleSubmit = async (values) => {
    try {
      console.log("Received values:", values);

      const userPayload = removeEmptyStrings({
        name: values?.name,
        orgTypeId: values?.orgTypeId,
        id: values?.id,
        clientId: values?.clientId
      });
      console.log(userPayload)
      const result = await dispatch(clientEditAction(userPayload));
      if (result?.meta?.requestStatus === "fulfilled") {
        setIsEditAvailable(!isEditAvailable);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  // ADD THIS NEW useEffect AFTER handleTabClick
  useEffect(() => {
    const refs = {
      "Client Owner Details": clientOwnerDetailsRef,
      "Client Branch": clientBranchRef,
      "Client Shift": clientShiftRef,
      "Assign Emp": assignEmpRef,
      "Emergency No": emergencyNoRef,
      "Settings": settingsRef,
    };

    const targetRef = refs[tab];

    if (targetRef?.current && scrollContainerRef?.current) {
      setTimeout(() => {
        const container = scrollContainerRef.current;
        const element = targetRef.current;

        // Calculate scroll position
        const containerTop = container.getBoundingClientRect().top;
        const elementTop = element.getBoundingClientRect().top;
        const scrollTop = container.scrollTop;
        const offset = elementTop - containerTop + scrollTop - 20;

        // Smooth scroll
        container.scrollTo({
          top: offset,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [tab]);

  return (
  <div className="flex flex-col w-full h-screen bg-white border border-gray-100 rounded-md">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ submitForm }) => (
          <>
            <Header
              isBackHandler
              headerLabel="Client"
              subHeaderLabel="Edit Client Details"
              handleClick={submitForm}
              isEditAvaliable={isEditAvailable}
              handleBack={() => {
                navigate("../");
              }}
              isButton
              handleEdit={() => setIsEditAvailable((prev) => !prev)}
            />
            <Form>
              <div className="ml-[3rem] flex-col">
                <div className="pb-2  border-gray-200">
                  <BasicInformation isEditAvaliable={isEditAvailable} />
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>

      <TabSection
        tabs={[
          "Client Owner Details",
          "Client Branch",
          "Client Shift",
          "Assign Emp",
          "Emergency No",
          "Settings"
        ]}
        selectedTab={tab}
        handleTabClick={handleTabClick}
        scrollContainerRef={scrollContainerRef} // Pass the ref to TabSection
      > 
        <div className="flex-1 min-h-0 p-2 w-full flex flex-col gap-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          {/* Owner Section */}
          <div ref={clientOwnerDetailsRef} id="Client Owner Details" className="pt-2">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Owner Details</h3>
              </div>
              <OwnerDetails state={state} />
            </div>
          </div>

          {/* Branch Section */}
          <div ref={clientBranchRef} id="Client Branch">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Client Branches</h3>
              </div>
              <BranchTab state={state} />
            </div>
          </div>

          {/* Shift Section */}
          <div ref={clientShiftRef} id="Client Shift">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Client Shifts</h3>
              </div>
              <ShiftTab state={state}/>
            </div>
          </div>

          {/* Employee Assignment Section */}
          {/* <div ref={assignEmpRef} id="Assign Emp">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Employee Assignment</h3>
              </div>
              <EmployeeAssign state={state}/>
            </div>
          </div> */}

          {/*Emergency Contact Section */}
          <div ref={emergencyNoRef} id="Emergency No">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Emergency Contacts</h3>
              </div>
              <EmergencyNo state={state}/>
            </div>
          </div>

          {/* Settings Section */}
          <div ref={settingsRef} id="Settings">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-gray-500 flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Settings</h3>
              </div>
              <Settings state={state}/>
            </div>
          </div>
        </div>
      </TabSection>
    </div>
  );
};

export default Edit;