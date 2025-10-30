// import { Clock, Plus, Edit2, Trash2, X, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
// import React, { useState, useEffect } from 'react';
// import { Formik, Form, useFormikContext } from 'formik';
// import * as Yup from 'yup';
// import { useSelector, useDispatch } from 'react-redux';
// import FormikInput from '../../components/Input/FormikInput';
// import { clientListwithFeildOfficerAction } from '../../redux/Action/Client/ClientAction';
// import { BranchGetAction } from '../../redux/Action/Branch/BranchAction';
// import axiosInstance from '../../config/axiosInstance';
// import { clientBranchListAction } from '../../redux/Action/ClientBranch/ClientBranchAction';
// import moment from 'moment';
// import { removeEmptyStrings } from '../../constants/reusableFun';
// import SingleSelectDropdown from '../../components/SingleSelectDropdown/SingleSelectDropdown';
// import { ShiftGetAction } from '../../redux/Action/Shift/ShiftAction';
// import MultiSelectDropdown from '../../components/MultiSelectDropdown/MultiSelectDropdown';
// import toast from 'react-hot-toast';
// const shiftColors = [
//     { bgColor: "#FF6B6B", textColor: "#FFFFFF" },
//     { bgColor: "#4ECDC4", textColor: "#073B4C" },
//     { bgColor: "#FFD93D", textColor: "#3C3C3C" },
//     { bgColor: "#1A535C", textColor: "#FFFFFF" },
//     { bgColor: "#6C5CE7", textColor: "#FFFFFF" },
//     { bgColor: "#FF9F1C", textColor: "#2C2C2C" },
//     { bgColor: "#00B894", textColor: "#FFFFFF" },
//     { bgColor: "#E84393", textColor: "#FFFFFF" },
//     { bgColor: "#FDCB6E", textColor: "#2E2E2E" },
//     { bgColor: "#55E6C1", textColor: "#043F3F" },
//     { bgColor: "#D63031", textColor: "#FFFFFF" },
//     { bgColor: "#74B9FF", textColor: "#1A1A1A" },
//     { bgColor: "#A29BFE", textColor: "#1E1E1E" },
//     { bgColor: "#FAB1A0", textColor: "#4A1C00" },
//     { bgColor: "#81ECEC", textColor: "#083B3B" },
//     { bgColor: "#00CEC9", textColor: "#F1F2F6" },
//     { bgColor: "#636E72", textColor: "#FFFFFF" },
//     { bgColor: "#E17055", textColor: "#1E1E1E" },
//     { bgColor: "#FAD4D8", textColor: "#8B1E3F" },
//     { bgColor: "#CFF5E7", textColor: "#004D40" }
// ];

// // ✅ Function to get a random color pair
// function getRandomShiftColor() {
//     const randomIndex = Math.floor(Math.random() * shiftColors.length);
//     return shiftColors[randomIndex];
// }
// // Confirmation Modal Component
// const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//             {/* Backdrop */}
//             <div
//                 className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
//                 onClick={!isLoading ? onClose : undefined}
//             />

//             {/* Modal */}
//             <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
//                 {/* Header */}
//                 <div className="flex items-center gap-3 p-6 border-b border-gray-200">
//                     <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
//                         <AlertTriangle className="w-6 h-6 text-red-600" />
//                     </div>
//                     <div className="flex-1">
//                         <h3 className="text-lg font-bold text-gray-900">{title}</h3>
//                     </div>
//                     {!isLoading && (
//                         <button
//                             onClick={onClose}
//                             className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
//                         >
//                             <X className="w-5 h-5 text-gray-500" />
//                         </button>
//                     )}
//                 </div>

//                 {/* Content */}
//                 <div className="p-6">
//                     <p className="text-gray-600">{message}</p>
//                 </div>

//                 {/* Footer */}
//                 <div className="flex gap-3 p-6 bg-gray-50 rounded-b-xl">
//                     <button
//                         type="button"
//                         onClick={onClose}
//                         disabled={isLoading}
//                         className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="button"
//                         onClick={onConfirm}
//                         disabled={isLoading}
//                         className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                     >
//                         {isLoading ? (
//                             <>
//                                 <Loader2 className="w-4 h-4 animate-spin" />
//                                 Deleting...
//                             </>
//                         ) : (
//                             'Delete'
//                         )}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Validation Schema
// const getShiftValidationSchema = () => {
//     return Yup.object({
//         clientId: Yup.string().required("Please select a client"),
//         selectedBranches: Yup.array()
//             // .min(1, "Please select at least one branch")
//             .required("Please select branches"),
//         name: Yup.string()
//             .required("Shift name is required")
//             .min(3, "Shift name must be at least 3 characters"),
//         startTime: Yup.string().required("Start time is required"),
//         endTime: Yup.string().required("End time is required"),
//         isReportingRequired: Yup.boolean(),
//         reportTimeIn: Yup.number().when('isReportingRequired', {
//             is: true,
//             then: (schema) => schema
//                 .required("Reporting time is required")
//                 .min(1, "Must be at least 1 minute")
//                 .max(120, "Cannot exceed 120 minutes"),
//             otherwise: (schema) => schema.notRequired()
//         }),
//     });
// };

// // Generate JSON for API
// const generateShiftJSON = (values, clientName, branchNames) => {
//     console.log(values)
//     const newTime = moment(values?.startTime, "HH:mm")
//         .subtract(values?.reportTimeIn || 0, "minutes")
//         .format("HH:mm");

//     return {
//         clientId: values.clientId,
//         clientMappedId: values.clientMappedId,
//         branchIds: values.selectedBranches,
//         name: values.name,
//         startTime: values.startTime,
//         endTime: values.endTime,
//         reportTimeIn: values?.isReportingRequired ? newTime : null,
//     };
// };

// // API Service
// const ShiftAPI = {
//     addShift: async (shiftData) => {
//         try {
//             const { bgColor, textColor } = getRandomShiftColor();
//             const response = await axiosInstance.post('/shift/create', removeEmptyStrings({ ...shiftData, 'bgColor': bgColor, 'textColor': textColor }));
//             return { success: true, data: response.data };
//         } catch (error) {
//             return {
//                 success: false,
//                 error: error.response?.data?.message || 'Failed to add shift'
//             };
//         }
//     },

//     updateShift: async (shiftId, shiftData) => {
//         try {
//             const response = await axiosInstance.post(`/shift/update/${shiftId}`, shiftData);
//             return { success: true, data: response.data };
//         } catch (error) {
//             return {
//                 success: false,
//                 error: error.response?.data?.message || 'Failed to update shift'
//             };
//         }
//     },

//     deleteShift: async (shiftId) => {
//         try {
//             const response = await axiosInstance.delete(`/shift/delete/${shiftId}`);
//             return { success: true, data: response.data };
//         } catch (error) {
//             return {
//                 success: false,
//                 error: error.response?.data?.message || 'Failed to delete shift'
//             };
//         }
//     }
// };

// // Form Fields Component
// const ShiftFormFields = ({ clientBranchList = [] }) => {
//     const { values, setFieldValue } = useFormikContext();
//     const { clientList } = useSelector((state) => state?.client || {});
//     const dispatch = useDispatch();
//     const [selectedClientBranches, setSelectedClientBranches] = useState([]);

//     // Filter branches based on selected client
//     const availableBranches = values.clientMappedId
//         ? clientBranchList?.filter(branch => branch.clientMappedId === values.clientMappedId) || []
//         : [];

//     const hasSingleBranch = availableBranches.length === 1;

//     // Auto-select single branch
//     useEffect(() => {
//         if (values.clientId && hasSingleBranch && availableBranches.length > 0) {
//             setFieldValue("selectedBranches", [availableBranches[0]._id]);
//         }
//     }, [values.clientId, hasSingleBranch, availableBranches.length]);

//     // Load branches when client changes
//     useEffect(() => {
//         if (values.clientMappedId) {
//             dispatch(clientBranchListAction({ clientMappedId: values?.clientMappedId }));
//         }
//     }, [values.clientMappedId, dispatch]);

//     // Update selectedBranches when selectedClientBranches changes
//     useEffect(() => {
//         setFieldValue('selectedBranches', selectedClientBranches);
//     }, [selectedClientBranches]);

//     return (
//         <div>
//             {/* Section 1: Client & Branch Selection */}
//             <div className="bg-white p-4  border border-gray-100 mb-2">
//                 <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
//                     <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
//                         <Clock className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <h3 className="text-lg font-bold text-gray-800">Client & Branch Selection</h3>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//                     <FormikInput
//                         name="clientId"
//                         label="Select Client"
//                         inputType="dropdown"
//                         listData={clientList}
//                         inputName="Select Client"
//                         feildName="nickName"
//                         hideLabel={true}
//                         showSerch={true}
//                         handleClick={(selected) => {
//                             setFieldValue("clientMappedId", selected?._id);
//                             setFieldValue("clientName", selected?.nickName);
//                             setFieldValue("clientId", selected?.clientId);
//                             setFieldValue("selectedBranches", []);
//                             setSelectedClientBranches([]);
//                         }}
//                         selectedOption={values.clientId}
//                         selectedOptionDependency="clientId"
//                     />

//                     {values.clientId && !hasSingleBranch && (
//                         <div>
//                             <FormikInput
//                                 name="selectedBranches"
//                                 label="Select Branches"
//                                 inputType="multiDropdown"
//                                 selectedData={selectedClientBranches}
//                                 data={clientBranchList}
//                                 Dependency="_id"
//                                 FeildName="name"
//                                 type={"object"}
//                                 InputName={"Branches"}
//                                 setSelectedData={setSelectedClientBranches}
//                                 hideLabel
//                                 className={"w-full"}
//                             />
//                         </div>
//                     )}

//                     {values.clientId && hasSingleBranch && (
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Branch (Auto-selected)
//                             </label>
//                             <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
//                                 {availableBranches[0]?.name}
//                             </div>
//                             <p className="text-xs text-gray-500 mt-1">
//                                 This client has only one branch
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Section 2: Shift Details */}
//             <div className="bg-white p-4 mb-4">
//                 <div className="flex items-center gap-3 mb-2 pb-2 border-b border-gray-100">
//                     <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
//                         <Clock className="w-5 h-5 text-green-600" />
//                     </div>
//                     <h3 className="text-lg font-bold text-gray-800">Shift Details</h3>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-4">
//                     <div>
//                         <FormikInput
//                             name="name"
//                             label="Shift Name"
//                             inputType="input"
//                             placeholder="e.g., Morning Shift"
//                             list="shift-suggestions"
//                         />
//                         <datalist id="shift-suggestions">
//                             <option value="Morning Shift" />
//                             <option value="Evening Shift" />
//                             <option value="Night Shift" />
//                         </datalist>
//                     </div>
//                     <FormikInput
//                         name="startTime"
//                         label="Start Time"
//                         inputType="input"
//                         type="time"
//                     />
//                     <FormikInput
//                         name="endTime"
//                         label="End Time"
//                         inputType="input"
//                         type="time"
//                     />
//                     <div className='mt-8'>
//                         <FormikInput
//                             name="isReportingRequired"
//                             inputType="checkbox"
//                             label="Is Reporting Time Required?"

//                         />
//                     </div>
//                     {values.isReportingRequired && (<FormikInput
//                         name="reportTimeIn"
//                         label="Minutes Before Shift Start"
//                         inputType="input"
//                         type="number"
//                         placeholder="e.g., 15"
//                         min="1"
//                         max="120"
//                     />
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Shifts Display Component
// const ShiftsbyBranches = ({
//     shifts = [],
//     onEditShift,
//     onDeleteShift,
//     isSaving,
//     selectedBranches = [],
//     clientId,
//     clientMappedId,
// }) => {
//     const dispatch = useDispatch();
//     const { clientList } = useSelector((state) => state?.client || {});
//     const { clientBranchList } = useSelector((state) => state?.clientBranch || {});
//     const { shiftList } = useSelector((state) => state?.shift || {});


//     // --- Local Filters (for table view)
//     const [filterClientId, setFilterClientId] = useState(clientId || "");
//     const [filterClientMappedId, setFilterClientMappedId] = useState(clientMappedId || "");
//     const [filterBranchIds, setFilterBranchIds] = useState(
//         selectedBranches || []
//     );
//     // console.log(selectedBranches)
//     // ✅ Sync props -> local filters when parent (form) selection changes
//     useEffect(() => {
//         if (clientId) setFilterClientId(clientId);
//         if (clientMappedId) setFilterClientMappedId(clientMappedId);
//         if (Array.isArray(selectedBranches) && selectedBranches.length > 0)
//             setFilterBranchIds(selectedBranches);
//     }, [clientId, clientMappedId, selectedBranches]);

//     // 🔁 Fetch shifts when filters change
//     useEffect(() => {
//         if (filterClientId && filterBranchIds.length > 0) {
//             dispatch(
//                 ShiftGetAction({
//                     orgId: filterClientMappedId,
//                     branchIds: filterBranchIds,
//                 })
//             );
//         }
//     }, [dispatch, filterClientId, filterBranchIds]);

//     // 🔁 Fetch branches when client changes
//     useEffect(() => {
//         if (filterClientMappedId) {
//             dispatch(clientBranchListAction({ clientMappedId: filterClientMappedId }));
//         }
//     }, [filterClientMappedId, dispatch]);

//     // 🧩 Filtered branches for dropdown
//     const filteredBranchList = filterClientMappedId
//         ? clientBranchList?.filter(
//             (branch) => branch.clientMappedId === filterClientMappedId
//         )
//         : clientBranchList;

//     // 🧮 Filter shifts for display

//     // console.log(shiftList,'trai')
//     const filteredShifts = shiftList.filter((shift) => {
//         const matchClient = !filterClientId || shift.clientId === filterClientId;
//         const matchBranch =
//             !filterBranchIds.length ||
//             shift.selectedBranches?.some((id) => filterBranchIds.includes(id));
//         return matchClient && matchBranch;
//     });

//     // Reset filters
//     const clearFilters = () => {
//         setFilterClientId("");
//         setFilterClientMappedId("");
//         setFilterBranchIds([]);
//     };

//     return (
//         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
//             {/* Header + Filters */}
//             <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
//                 <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
//                         <Clock className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div>
//                         <h3 className="text-lg font-bold text-gray-800">Added Shifts</h3>
//                         <p className="text-sm text-gray-500">
//                             {filteredShifts.length} of {shifts.length} shift
//                             {shifts.length !== 1 ? "s" : ""}
//                         </p>
//                     </div>
//                 </div>

//                 {/* Filters */}
//                 <div className="flex flex-wrap items-end gap-4">
//                     {/* Client Dropdown */}
//                     <div className="min-w-[180px] flex-shrink-0">
//                         <SingleSelectDropdown
//                             label="Select Client"
//                             inputType="dropdown"
//                             listData={clientList}
//                             inputName="Filter by Client"
//                             feildName="nickName"
//                             hideLabel
//                             showSerch
//                             handleClick={(selected) => {
//                                 setFilterClientId(selected?.clientId || "");
//                                 setFilterClientMappedId(selected?._id || "");
//                                 // setFilterBranchIds([]);
//                             }}
//                             selectedOption={filterClientId}
//                             selectedOptionDependency="clientId"
//                         />
//                     </div>

//                     {/* Branch Dropdown */}
//                     {filterClientMappedId && (
//                         <div className="min-w-[180px] flex-shrink-0">
//                             <MultiSelectDropdown
//                                 label="Select Branch"
//                                 selectedData={filterBranchIds}
//                                 data={clientBranchList}
//                                 Dependency="_id"
//                                 FeildName="name"
//                                 type="object"
//                                 InputName="Branches"
//                                 setSelectedData={setFilterBranchIds}
//                                 hideLabel
//                             />
//                         </div>
//                     )}

//                     {/* Clear Filters Button */}
//                     {(filterClientId || filterBranchIds.length > 0) && (
//                         <div className="flex-shrink-0">
//                             <button
//                                 type="button"
//                                 onClick={clearFilters}
//                                 className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
//                             >
//                                 <X className="w-4 h-4" />
//                                 <span>Clear</span>
//                             </button>
//                         </div>
//                     )}
//                 </div>

//             </div>

//             {/* Table */}
//             {clientBranchList.length > 0 ? (
//                 <div className="overflow-x-auto rounded-lg border border-gray-200">
//                     <table className="w-full">
//                         <thead className="bg-gray-50 border-b border-gray-200">
//                             <tr>
//                                 {[
//                                     // "Client",
//                                     // "Branches",
//                                     "Shift Name",
//                                     "Start Time",
//                                     "End Time",
//                                     "Reporting Time(Mins)",
//                                     "Status",
//                                     "Actions",
//                                 ].map((head) => (
//                                     <th
//                                         key={head}
//                                         className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
//                                     >
//                                         {head}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">

//                             {shiftList.map((shift, index) => {
//                                 // console.log(JSON.stringify(shift,null,2))
//                                 return (
//                                     <tr
//                                         key={index}
//                                         className="hover:bg-gray-50 transition-colors"
//                                     >
//                                         {/* <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                                             {shift?.branchDetails?.clientName}
//                                         </td>
//                                         <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                                             {shift?.branchDetails?.branchName}
//                                         </td> */}
//                                         {/* <td className="px-4 py-3 text-sm text-gray-700">
//                                         <div className="flex flex-wrap gap-1">
//                                             {shift.branchNames?.map((name, idx) => (
//                                                 <span
//                                                     key={idx}
//                                                     className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
//                                                 >
//                                                     {name}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </td> */}
//                                         <td className="px-4 py-3 text-sm text-gray-700">
//                                             {shift.name}
//                                         </td>
//                                         <td className="px-4 py-3 text-sm text-gray-700">
//                                             {moment(shift.startTime, 'HH:mm').format('hh:mm A')}
//                                         </td>
//                                         <td className="px-4 py-3 text-sm text-gray-700">
//                                             {moment(shift.endTime, 'HH:mm').format('hh:mm A')}
//                                         </td>
//                                         <td className="px-4 py-3 text-sm text-gray-700">
//                                             {shift.reportTimeIn
//                                                 ? `${moment(shift?.startTime, 'HH:mm').diff(moment(shift?.reportTimeIn, 'HH:mm'), 'minutes')} mins before`
//                                                 : "Not Required"}
//                                         </td>
//                                         <td className="px-4 py-3 text-sm">
//                                             <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                                 <CheckCircle className="w-3 h-3" />
//                                                 Saved
//                                             </span>
//                                         </td>
//                                         <td className="px-4 py-3">
//                                             <div className="flex gap-2 justify-center">
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => onEditShift(index)}
//                                                     className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                                                     title="Edit"
//                                                     disabled={isSaving}
//                                                 >
//                                                     <Edit2 className="w-4 h-4" />
//                                                 </button>
//                                                 {/* <button
//                                                 type="button"
//                                                 onClick={() => onDeleteShift(index)}
//                                                 className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                                                 title="Delete"
//                                                 disabled={isSaving}
//                                             >
//                                                 <Trash2 className="w-4 h-4" />
//                                             </button> */}
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 )
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200 shadow-md">
//                     <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//                     <p className="text-lg font-medium">No shifts found</p>
//                     <p className="text-sm">Try adjusting the filters above</p>
//                 </div>
//             )}
//         </div>
//     );
// };
// ;


// // Main Shift Component
// const ClientShifts = ({ wizardData, updateWizardData, setIsStepValid }) => {
//     const dispatch = useDispatch();
//     const { clientList } = useSelector((state) => state?.client);
//     const { clientBranchList } = useSelector((state) => state?.clientBranch || {});

//     useEffect(() => {
//         setIsStepValid(true);
//     }, [wizardData]);

//     const [shifts, setShifts] = useState(wizardData?.shifts || []);
//     const [editingShiftIndex, setEditingShiftIndex] = useState(null);
//     const [isSaving, setIsSaving] = useState(false);
//     const [apiError, setApiError] = useState(null);
//     const { shiftList } = useSelector((state) => state?.shift)
//     // Modal state
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [shiftToDelete, setShiftToDelete] = useState(null);
//     const [isDeleting, setIsDeleting] = useState(false);

//     const initialValues = {
//         clientId: "",
//         clientMappedId: "",
//         clientName: "",
//         selectedBranches: [],
//         name: "Morning Shift",
//         startTime: "",
//         endTime: "",
//         isReportingRequired: false,
//         reportTimeIn: "",
//     };

//     useEffect(() => {
//         dispatch(clientListwithFeildOfficerAction());
//     }, [dispatch]);

//     // Update parent wizard data whenever shifts change
//     useEffect(() => {
//         if (updateWizardData && setIsStepValid) {
//             updateWizardData('shifts', shifts, shifts.length > 0);
//         }
//     }, [shifts]);

//     //     const handleSubmit = async (values, { resetForm, setSubmitting }) => {
//     //         setIsSaving(true);
//     //         setApiError(null);

//     //         try {
//     //             const client = clientList?.find(c => c._id === values.clientMappedId);
//     //             const selectedBranchData = clientBranchList?.filter(b =>
//     //                 values.selectedBranches.includes(b._id)
//     //             ) || [];

//     //             const clientName = client?.name || '';
//     //             const branchNames = selectedBranchData.map(b => b.name);

//     //             const shiftJSON = generateShiftJSON(values, clientName, branchNames);
//     // console.log(shiftJSON,'shiftJson')
//     //             // API call
//     //             let result;
//     //             if (editingShiftIndex !== null) {
//     //                 const shiftId = shifts[editingShiftIndex].id;
//     //                 result = await ShiftAPI.updateShift(shiftId, shiftJSON);
//     //             } else {
//     //                 result = await ShiftAPI.addShift(shiftJSON);
//     //             }

//     //             if (result.success) {
//     //                 const newShift = {
//     //                     id: result.data.shiftId || result.data._id || Date.now(),
//     //                     ...values,
//     //                     clientName,
//     //                     branchNames,
//     //                     jsonData: shiftJSON,
//     //                     apiResponse: result.data,
//     //                 };

//     //                 if (editingShiftIndex !== null) {
//     //                     const updatedShifts = [...shifts];
//     //                     updatedShifts[editingShiftIndex] = newShift;
//     //                     setShifts(updatedShifts);
//     //                     setEditingShiftIndex(null);
//     //                 } else {
//     //                     setShifts((prev) => [...prev, newShift]);
//     //                 }

//     //                 toast.success(
//     //                     editingShiftIndex !== null
//     //                         ? 'Shift updated successfully!'
//     //                         : 'Shift added successfully!'
//     //                 );
//     //                 resetForm();
//     //             } else {
//     //                 throw new Error(result.error);
//     //             }
//     //         } catch (error) {
//     //             console.error('API Error:', error);
//     //             setApiError(error.message || 'An error occurred while saving');
//     //             toast.error(`Error: ${error.message || 'Failed to save. Please try again.'}`);
//     //         } finally {
//     //             setIsSaving(false);
//     //             setSubmitting(false);
//     //         }
//     //     };
//     const handleSubmit = async (values, { resetForm, setSubmitting }) => {
//         try {
//             setIsSaving(true);
//             const shiftJSON = generateShiftJSON(values);

//             console.log("Submitting shift:", values);
//             console.log("Final Payload:", shiftJSON);

//             let res;
//             if (editingShiftIndex !== null) {
//                 const { branchIds, ...rest } = shiftJSON
//                 res = await axiosInstance.post('/shift/update', removeEmptyStrings({ ...rest, clientMappedId: values?.orgId, "shiftId": values?._id }));


//                 console.log("Shift API result:", res);

//                 if (res?.data.status == 200) {
//                     toast.success("Shift Updated Successfully");
//                     await dispatch(
//                         ShiftGetAction({
//                             orgId: shiftJSON?.clientMappedId,
//                             branchIds: shiftJSON?.branchIds,
//                         })
//                     );
//                     resetForm();
//                     setEditingShiftIndex(null);

//                 } else {
//                     toast.error(res?.message || "Failed to save shift");
//                 }

//             }
//             else {
//                 res = await axiosInstance.post('/shift/create', removeEmptyStrings(shiftJSON));


//                 console.log("Shift API result:", res);

//                 if (res?.data.status == 200) {
//                     toast.success("Shift Created Successfully");
//                     await dispatch(
//                         ShiftGetAction({
//                             orgId: shiftJSON?.clientMappedId,
//                             branchIds: shiftJSON?.branchIds,
//                         })
//                     );
//                     resetForm();
//                     setEditingShiftIndex(null);

//                 } else {
//                     toast.error(res?.message || "Failed to save shift");
//                 }

//             }
//         } catch (err) {
//             console.error("Shift save error:", err);
//             toast.error("Something went wrong while saving shift");
//         } finally {
//             setIsSaving(false);
//             setSubmitting(false);
//         }
//     };
//     const handleEditShift = (index, setFieldValue) => {
//         const shift = shiftList[index];
//         Object.keys(shift).forEach(key => {
//             if (
//                 key !== 'id' &&
//                 key !== 'jsonData' &&
//                 key !== 'apiResponse' &&
//                 key !== 'clientName' &&
//                 key !== 'branchNames'
//             ) {
//                 console.log(key, 'ty')

//                 if (key == "reportTimeIn") {
//                     setFieldValue("isReportingRequired", true)
//                     const tempTime = moment(shift?.startTime, 'HH:mm').diff(moment(shift?.reportTimeIn, 'HH:mm'), 'minutes')
//                     setFieldValue("reportTimeIn", tempTime)

//                 }
//                 else {
//                     setFieldValue(key, shift[key]);
//                 }
//             }
//         });
//         setEditingShiftIndex(index);
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     const handleDeleteShift = (index) => {
//         setShiftToDelete(index);
//         setIsDeleteModalOpen(true);
//     };

//     const confirmDeleteShift = async () => {
//         if (shiftToDelete === null) return;

//         const shift = shifts[shiftToDelete];
//         setIsDeleting(true);

//         try {
//             const result = await ShiftAPI.deleteShift(shift.id);

//             if (result.success) {
//                 const updatedShifts = shifts.filter((_, i) => i !== shiftToDelete);
//                 setShifts(updatedShifts);
//                 setIsDeleteModalOpen(false);
//                 setShiftToDelete(null);
//                 toast.success('Shift deleted successfully!');
//             } else {
//                 throw new Error(result.error);
//             }
//         } catch (error) {
//             console.error('Delete Error:', error);
//             toast.error(`Error: ${error.message || 'Failed to delete shift'}`);
//         } finally {
//             setIsDeleting(false);
//         }
//     };

//     const cancelDelete = () => {
//         if (!isDeleting) {
//             setIsDeleteModalOpen(false);
//             setShiftToDelete(null);
//         }
//     };

//     return (
//         <>
//             {/* Delete Confirmation Modal */}
//             <ConfirmationModal
//                 isOpen={isDeleteModalOpen}
//                 onClose={cancelDelete}
//                 onConfirm={confirmDeleteShift}
//                 title="Delete Shift"
//                 message="Are you sure you want to delete this shift? This action cannot be undone."
//                 isLoading={isDeleting}
//             />

//             <Formik
//                 initialValues={initialValues}
//                 validationSchema={getShiftValidationSchema()}
//                 onSubmit={handleSubmit}
//                 enableReinitialize
//             >
//                 {({ values, setFieldValue, resetForm, isSubmitting }) => (
//                     <Form className="space-y-2 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-4">
//                         {/* API Error Message */}
//                         {/* {apiError && (
//                             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                                 <div className="flex items-start gap-3">
//                                     <X className="w-5 h-5 text-red-600 mt-0.5" />
//                                     <div>
//                                         <h4 className="font-semibold text-red-800">Error</h4>
//                                         <p className="text-sm text-red-700">{apiError}</p>
//                                     </div>
//                                     <button
//                                         type="button"
//                                         onClick={() => setApiError(null)}
//                                         className="ml-auto p-1 hover:bg-red-100 rounded"
//                                     >
//                                         <X className="w-4 h-4 text-red-600" />
//                                     </button>
//                                 </div>
//                             </div>
//                         )} */}

//                         {/* Form Fields */}
//                         <ShiftFormFields clientBranchList={clientBranchList} />

//                         {/* Action Buttons */}
//                         <div className="flex flex-wrap gap-2 justify-center pt-4">
//                             {editingShiftIndex !== null && (
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         setEditingShiftIndex(null);
//                                         resetForm();
//                                     }}
//                                     className="flex items-center gap-2 px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-semibold shadow-lg hover:shadow-xl"
//                                     disabled={isSaving}
//                                 >
//                                     <X className="w-5 h-5" />
//                                     Cancel
//                                 </button>
//                             )}
//                             <button
//                                 type="submit"
//                                 // disabled={isSubmitting || isSaving}
//                                 className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {isSaving ? (
//                                     <>
//                                         <Loader2 className="w-5 h-5 animate-spin" />
//                                         Saving...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Plus className="w-5 h-5" />
//                                         {editingShiftIndex !== null ? "Update Shift" : "Add Shift"}
//                                     </>
//                                 )}
//                             </button>
//                         </div>

//                         {/* Shifts Display */}
//                         <ShiftsbyBranches
//                             shifts={shifts}
//                             onEditShift={(index) => handleEditShift(index, setFieldValue)}
//                             onDeleteShift={handleDeleteShift}
//                             isSaving={isSaving}
//                             clientMappedId={values?.clientMappedId}
//                             clientId={values?.clientId}
//                             selectedBranches={values?.selectedBranches}
//                         />
//                     </Form>
//                 )}
//             </Formik>
//         </>
//     );
// };

// export default ClientShifts;

import React, { useState, useEffect } from "react";
import {
    Typography,
    Input,
    Button,
    IconButton,
    Checkbox,
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
import { clientListAction } from "../../redux/Action/Client/ClientAction";
import { clientBranchListAction } from "../../redux/Action/ClientBranch/ClientBranchAction";
import axiosInstance from "../../config/axiosInstance";
import { removeEmptyStrings } from "../../constants/reusableFun";
import toast from "react-hot-toast";

const DEFAULT_SHIFTS = [
    { id: "morning", name: "Morning Shift" },
    { id: "evening", name: "Evening Shift" },
    { id: "night", name: "Night Shift" },
];

const ClientShifts = ({
    wizardData, updateWizardData, setIsStepValid
}) => {
    useEffect(() => {
        setIsStepValid(true);
    }, [wizardData]);
    const dispatch = useDispatch();
    const [saving, setSaving] = useState(false);
    const [editingShiftId, setEditingShiftId] = useState(null);
    const { clientList } = useSelector((state) => state?.client);
    const { clientBranchList } = useSelector((state) => state?.clientBranch || {});
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [selectedClient, setSelectedClient] = useState();
    const [selectedClientMappedId, setSelectedClientMappedId] = useState();
    const [selectedBranch, setSelectedBranch] = useState(
        []
    );

    // Local state for editing
    const [editRow, setEditRow] = useState({
        shiftName: "",
        shiftStartTime: "",
        shiftEndTime: "",
        reportInTimeRequired: false,
        reportInTimeMinutes: "", // Store as minutes
        graceIn: "",
        graceOut: "",
    });

    useEffect(() => {
        dispatch(clientListAction());
    }, [dispatch]);

    useEffect(() => {
        if (selectedClientMappedId) {
            dispatch(clientBranchListAction({ clientMappedId: selectedClientMappedId }));
        }
    }, [selectedClientMappedId, dispatch]);

    const shiftList = useSelector((state) => state.shift.shiftList);

    const [newRow, setNewRow] = useState({
        shiftName: "",
        shiftStartTime: "",
        shiftEndTime: "",
        reportInTimeRequired: false,
        reportInTimeMinutes: "", // Store as minutes
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

    // Convert minutes to time by subtracting from start time
    const computeReportInTime = (startTime, minutesBefore) => {
        const minutes = parseInt(minutesBefore || 0);
        if (minutes > 0 && startTime) {
            return moment(startTime, "HH:mm")
                .subtract(minutes, "minutes")
                .format("HH:mm");
        }
        return null;
    };

    useEffect(() => {
        if (selectedClientMappedId && selectedBranch)
            dispatch(ShiftGetAction({
                orgId: selectedClientMappedId,
                branchIds: selectedBranch,
            }));
    }, [dispatch, selectedBranch, selectedClientMappedId]);

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
        const rowData = isNew ? newRow : editRow;

        // 1️⃣ Basic validation
        if (!selectedBranch || selectedBranch.length === 0) {
            toast.error("Please select at least one branch first");
            return;
        }

        if (!rowData.shiftName || !rowData.shiftStartTime || !rowData.shiftEndTime) {
            toast.error("Please fill all required fields");
            return;
        }

        setSaving(true);

        try {
            // 2️⃣ Build base payload
            let payload = {
                name: rowData.shiftName,
                startTime: rowData.shiftStartTime,
                endTime: rowData.shiftEndTime,
                branchIds: selectedBranch,
            };

            // 3️⃣ Handle reportInTime logic
            if (rowData.reportInTimeRequired && rowData.reportInTime) {
                const reportTime = moment(rowData.shiftStartTime, "HH:mm")
                    .subtract(rowData.reportInTime, "minutes")
                    .format("HH:mm");
                payload.reportTimeIn = reportTime;
            } else {
                payload.reportTimeIn = "";
            }

            // 4️⃣ Clean undefined or empty values
            const cleanPayload = Object.fromEntries(
                Object.entries(payload).filter(([_, v]) => v !== undefined && v !== "")
            );

            let resultAction;

            // 5️⃣ Create or update flow
            if (isNew) {
                //   resultAction = await axiosInstance.post('/shift/create', removeEmptyStrings({ ...cleanPayload,clientId:selectedClient,clientMappedId:selectedClientMappedId }));
                resultAction = await dispatch(ShiftCreateAction(removeEmptyStrings({ ...cleanPayload, clientId: selectedClient, clientMappedId: selectedClientMappedId })))

                console.log(removeEmptyStrings({ ...cleanPayload, clientId: selectedClient, clientMappedId: selectedClientMappedId }))

            } else {
                const { branchIds, ...rest } = cleanPayload
                resultAction = await dispatch(
                    ShiftUpdateAction({
                        clientId: selectedClient, clientMappedId: selectedClientMappedId,
                        shiftId: editingShiftId,
                        ...rest,
                    })
                );
            }

            // 6️⃣ Handle result
            const isSuccess =
                (isNew && ShiftCreateAction.fulfilled.match(resultAction)) ||
                (!isNew && ShiftUpdateAction.fulfilled.match(resultAction));

            if (isSuccess) {
                // Reset forms after success
                const resetData = {
                    shiftName: "",
                    shiftStartTime: "",
                    shiftEndTime: "",
                    reportInTimeRequired: false,
                    reportInTime: "",
                };

                if (isNew) {
                    setNewRow(resetData);
                    setIsAddingNew(false);
                    setIsCustomShiftName(false);
                } else {
                    setEditRow(resetData);
                    setEditingShiftId(null);
                }

                // Refresh shifts
                await dispatch(
                    ShiftGetAction({
                        orgId: selectedClientMappedId,
                        branchIds: selectedBranch,
                    })
                );

                if (onSuccess) await onSuccess();
            } else {
                //   toast.error(resultAction.payload?.message || "Failed to save shift");
            }
        } catch (err) {
            console.error("Error saving shift:", err);
            toast.error("Something went wrong while saving shift");
        } finally {
            setSaving(false);
        }
    };


    const handleEditShift = (shift) => {
        let dem = moment(shift?.startTime, 'HH:mm').diff(moment(shift?.reportTimeIn, 'HH:mm'), 'minutes')
        setEditRow({
            shiftId: shift?._id,
            shiftName: shift.name,
            shiftStartTime: shift.startTime,
            shiftEndTime: shift.endTime,
            reportInTimeRequired: !!shift.reportTimeIn,
            reportInTime: dem || "",
            graceIn: "",
            graceOut: "",
        });
        setEditingShiftId(shift._id);
    };

    const handleCancelEdit = () => {
        setEditingShiftId(null);
        setEditRow({
            shiftName: "",
            shiftStartTime: "",
            shiftEndTime: "",
            reportInTimeRequired: false,
            reportInTime: "",
            graceIn: "",
            graceOut: "",
        });
    };

    const handleCancelNew = () => {
        setIsAddingNew(false);
        setIsCustomShiftName(false);
        setNewRow({
            shiftName: "",
            shiftStartTime: "",
            shiftEndTime: "",
            reportInTimeRequired: false,
            reportInTime: "",
            graceIn: "",
            graceOut: "",
            shiftNameType: "",
        });
    };

    const handleNewRowChange = (field, value) => {
        setNewRow((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditRowChange = (field, value) => {
        setEditRow((prev) => ({ ...prev, [field]: value }));
    };

    const handleBranchChange = (e, branch) => {
        setIsAddingNew(false);
        setEditingShiftId(null);
        handleCancelEdit();
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <Typography variant="h4" className="font-semibold text-gray-800">
                    Shift Settings
                </Typography>
            </div>

            {/* Branch Selection Row */}
            <div className="flex items-center gap-4 p-4 border border-blue-200 rounded-lg">
                <div>
                    <div className="w-64">

                        <SingleSelectDropdown
                            listData={clientList}
                            selectedOption={selectedClientMappedId}
                            handleClick={(sel) => {
                                setSelectedClient(sel?.clientId);
                                setSelectedClientMappedId(sel?._id);
                                setSelectedBranch()
                            }}
                            selectedOptionDependency={"_id"}
                            // FeildName="name"
                            feildName="name"
                            inputName="Select Client"
                            enableSearch={true}
                            hideLabel={false}
                            showTip={false}
                        // hideLabel={true}
                        />
                    </div>
                </div>
                <div>
                    <div className="w-64">
                        <MultiSelectDropdown
                            data={clientBranchList}
                            selectedData={selectedBranch}
                            setSelectedData={setSelectedBranch}
                            Dependency="_id"
                            FeildName="name"
                            InputName="Select branches"
                            selectType="multiple"
                            enableSearch={true}
                            showTip={false}
                        // hideLabel={true}
                        />
                    </div>
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
                                    Is Reporting Time
                                </th>
                                <th className="border-b px-4 py-3 text-left font-semibold">
                                    Reporting Time
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
                                                        clientBranchList?.find((b) => b._id === branchId)?.name
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
                                        <Checkbox
                                            label={"Required"}
                                            checked={newRow.reportInTimeRequired}
                                            onChange={(e) => handleNewRowChange("reportInTimeRequired", e.target.checked)}
                                        />
                                    </td>
                                    <td className="border-b px-4 py-3">
                                        {newRow?.reportInTimeRequired ? (
                                            <Input
                                                size="md"
                                                type="number"
                                                label="Report In Time"
                                                value={newRow.reportInTime}
                                                onChange={(e) =>
                                                    handleNewRowChange("reportInTime", e.target.value)
                                                }
                                                className="bg-white"
                                            />
                                        ) : (
                                            <span className="text-gray-500">Not Required</span>
                                        )}
                                    </td>
                                    <td className="border-b px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <IconButton
                                                size="sm"
                                                color="bg-primary"
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
                                        clientBranchList.find((b) => b._id === shift.branchId)?.name ||
                                        "N/A";

                                    return (
                                        <tr
                                            key={shift._id}
                                            className={`hover:bg-gray-50 ${isEditing ? "bg-yellow-50" : ""
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
                                                        value={editRow.shiftName || ""}
                                                        onChange={(e) =>
                                                            handleEditRowChange("shiftName", e.target.value)
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
                                                        value={editRow.shiftStartTime || ""}
                                                        onChange={(e) =>
                                                            handleEditRowChange(
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
                                                        value={editRow.shiftEndTime || ""}
                                                        onChange={(e) =>
                                                            handleEditRowChange(
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
                                                    <Checkbox
                                                        label={"Required"}
                                                        checked={editRow.reportInTimeRequired}
                                                        onChange={(e) => handleEditRowChange("reportInTimeRequired", e.target.checked)}
                                                    />
                                                ) : (
                                                    <span>{shift?.reportTimeIn ? 'Yes' : 'No'}</span>
                                                )}
                                            </td>
                                            <td className="border-b px-4 py-3">
                                                {isEditing ? (
                                                    editRow.reportInTimeRequired ? (
                                                        <Input
                                                            size="md"
                                                            type="number"
                                                            label="Report In Time"
                                                            value={editRow.reportInTime || ""}
                                                            onChange={(e) =>
                                                                handleEditRowChange("reportInTime", e.target.value)
                                                            }
                                                            className="bg-white"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-500">Not Required</span>
                                                    )
                                                ) : (
                                                    <span>{shift?.reportTimeIn ? formatTo12Hour(shift.reportTimeIn) : 'Not Required'}</span>
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

export default ClientShifts;

// export default ClientShifts