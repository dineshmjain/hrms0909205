// import React, { useEffect, useState, useMemo } from 'react';
// import { Dialog, Typography } from '@material-tailwind/react';
// import { 
//   Save, 
//   X, 
//   Copy, 
//   CheckCircle, 
//   Calculator, 
//   Settings, 
//   User, 
//   Calendar,
//   AlertCircle,
//   Info,
//   Zap,
//   RefreshCw
// } from 'lucide-react';
// import { useDispatch } from 'react-redux';
// import { useSelector } from 'react-redux';
// import { removeEmptyStrings } from '../../../constants/reusableFun';
// import { DesignationGetAction } from '../../../redux/Action/Designation/DesignationAction';
// import SingleSelectDropdown from '../../../components/SingleSelectDropdown/SingleSelectDropdown';
// import { 
//   QuotationStandardPriceCreate, 
//   QuotationStandardPriceUpdate, 
//   QuotationStandardPriceList 
// } from '../../../redux/Action/Quotation/Price';
// import { ToastContainer, toast } from 'react-toastify';

// const BasePriceBranch = ({ showPriceModal, setShowPriceModal, basePriceDetails, getPriceList }) => {
//   // Form state
//   const [formData, setFormData] = useState({
//     inCityDay: "", inCityNight: "", inCityDayMonth: "", inCityDayYear: "",
//     inCityNightMonth: "", inCityNightYear: "", outCityDay: "", outCityNight: "",
//     outCityDayMonth: "", outCityDayYear: "", outCityNightMonth: "", outCityNightYear: ""
//   });

//   const [femaleFormData, setFemaleFormData] = useState({
//     inCityDay: "", inCityNight: "", inCityDayMonth: "", inCityDayYear: "",
//     inCityNightMonth: "", inCityNightYear: "", outCityDay: "", outCityNight: "",
//     outCityDayMonth: "", outCityDayYear: "", outCityNightMonth: "", outCityNightYear: ""
//   });

//   // UI state
//   const [femaleAdjustment, setFemaleAdjustment] = useState({ type: "fixed", value: "" });
//   const [applyToAll, setApplyToAll] = useState(false);
//   const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().split('T')[0]);
//   const [designationId, setDesignationId] = useState(null);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [priceId, setPriceId] = useState(null);
//   const [activeTab, setActiveTab] = useState('basic');
//   const [saving, setSaving] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});

//   const dispatch = useDispatch();
//   const { designationList, loading } = useSelector((state) => state?.designation || {});

//   // Load designations on mount
//   useEffect(() => {
//     getDesignationList();
//   }, [dispatch]);

//   // Handle modal state changes
//   useEffect(() => {
//     if (showPriceModal) {
//       const hasData = basePriceDetails && Object.keys(basePriceDetails).length > 0;
//       if (hasData) {
//         setIsEditMode(true);
//         populateFormData(basePriceDetails);
//       } else {
//         setIsEditMode(false);
//         resetFormData();
//       }
//       setValidationErrors({});
//     }
//   }, [basePriceDetails, showPriceModal]);

//   const getDesignationList = (params) => {
//     const filters = {
//       category: "assigned",
//       mapedData: "designation",
//       isActive: true
//     };
//     const updatedParams = removeEmptyStrings({ ...params, ...filters });
//     dispatch(DesignationGetAction(updatedParams));
//   };

//   const resetFormData = () => {
//     const emptyFormData = {
//       inCityDay: "", inCityNight: "", inCityDayMonth: "", inCityDayYear: "",
//       inCityNightMonth: "", inCityNightYear: "", outCityDay: "", outCityNight: "",
//       outCityDayMonth: "", outCityDayYear: "", outCityNightMonth: "", outCityNightYear: ""
//     };

//     setFormData(emptyFormData);
//     setFemaleFormData(emptyFormData);
//     setFemaleAdjustment({ type: "fixed", value: "" });
//     setApplyToAll(false);
//     setDesignationId(null);
//     setPriceId(null);
//     setEffectiveFrom(new Date().toISOString().split('T')[0]);
//     setActiveTab('basic');
//     setValidationErrors({});
//   };

//   const populateFormData = (data) => {
//     console.log('Populating form data:', data);

//     setPriceId(data._id || data.docId);
//     setDesignationId(data.designationId);

//     if (data.effectiveFrom) {
//       setEffectiveFrom(new Date(data.effectiveFrom).toISOString().split('T')[0]);
//     }

//     if (data.adjustment) {
//       setFemaleAdjustment({
//         type: data.adjustment.type || "fixed",
//         value: data.adjustment.value?.toString() || ""
//       });
//     }

//     // Map API data to form fields with better field mapping
//     const maleData = {
//       inCityDay: data.daily?.male?.cityLimit?.toString() || data.daily?.male?.dayShift?.toString() || "",
//       inCityDayMonth: data.monthly?.male?.cityLimit?.toString() || data.monthly?.male?.dayShift?.toString() || "",
//       inCityDayYear: data.yearly?.male?.cityLimit?.toString() || data.yearly?.male?.dayShift?.toString() || "",
//       inCityNight: data.daily?.male?.nightShift?.toString() || "",
//       inCityNightMonth: data.monthly?.male?.nightShift?.toString() || "",
//       inCityNightYear: data.yearly?.male?.nightShift?.toString() || "",
//       outCityDay: data.daily?.male?.outCityLimit?.toString() || "",
//       outCityDayMonth: data.monthly?.male?.outCityLimit?.toString() || "",
//       outCityDayYear: data.yearly?.male?.outCityLimit?.toString() || "",
//       outCityNight: data.daily?.male?.outCityNightShift?.toString() || data.daily?.male?.nightShift?.toString() || "",
//       outCityNightMonth: data.monthly?.male?.outCityNightShift?.toString() || data.monthly?.male?.nightShift?.toString() || "",
//       outCityNightYear: data.yearly?.male?.outCityNightShift?.toString() || data.yearly?.male?.nightShift?.toString() || ""
//     };

//     const femaleData = {
//       inCityDay: data.daily?.female?.cityLimit?.toString() || data.daily?.female?.dayShift?.toString() || "",
//       inCityDayMonth: data.monthly?.female?.cityLimit?.toString() || data.monthly?.female?.dayShift?.toString() || "",
//       inCityDayYear: data.yearly?.female?.cityLimit?.toString() || data.yearly?.female?.dayShift?.toString() || "",
//       inCityNight: data.daily?.female?.nightShift?.toString() || "",
//       inCityNightMonth: data.monthly?.female?.nightShift?.toString() || "",
//       inCityNightYear: data.yearly?.female?.nightShift?.toString() || "",
//       outCityDay: data.daily?.female?.outCityLimit?.toString() || "",
//       outCityDayMonth: data.monthly?.female?.outCityLimit?.toString() || "",
//       outCityDayYear: data.yearly?.female?.outCityLimit?.toString() || "",
//       outCityNight: data.daily?.female?.outCityNightShift?.toString() || data.daily?.female?.nightShift?.toString() || "",
//       outCityNightMonth: data.monthly?.female?.outCityNightShift?.toString() || data.monthly?.female?.nightShift?.toString() || "",
//       outCityNightYear: data.yearly?.female?.outCityNightShift?.toString() || data.yearly?.female?.nightShift?.toString() || ""
//     };

//     setFormData(maleData);
//     setFemaleFormData(femaleData);

//     if (data.adjustment && data.adjustment.value) {
//       setApplyToAll(true);
//     }
//   };

//   // Enhanced calculation with better rounding
//   const calculateDerivedRates = (dayRate, period = 'monthly') => {
//     if (!dayRate || isNaN(dayRate)) return { monthly: "", yearly: "" };

//     const rate = parseFloat(dayRate);
//     const monthly = Math.round(rate * 30);
//     const yearly = Math.round(rate * 365);

//     return period === 'monthly' ? monthly : yearly;
//   };

//   // Improved female adjustment application
//   const applyFemaleAdjustmentToAll = () => {
//     if (!femaleAdjustment.value || !parseFloat(femaleAdjustment.value)) {
//       toast.error("Please enter a valid adjustment value");
//       return;
//     }

//     const adjustmentValue = parseFloat(femaleAdjustment.value);
//     const newFemaleData = { ...femaleFormData };

//     Object.keys(formData).forEach(key => {
//       const maleRate = parseFloat(formData[key] || 0);
//       if (maleRate > 0) {
//         let adjustedRate;
//         if (femaleAdjustment.type === "fixed") {
//           adjustedRate = maleRate + adjustmentValue;
//         } else {
//           adjustedRate = Math.round(maleRate * (1 + adjustmentValue / 100));
//         }
//         newFemaleData[key] = Math.max(0, adjustedRate).toString();
//       }
//     });

//     setFemaleFormData(newFemaleData);
//     setApplyToAll(true);
//     toast.success(`Female rates adjusted by ${femaleAdjustment.type === 'fixed' ? '₹' + adjustmentValue : adjustmentValue + '%'}`);
//   };

//   // Enhanced male rate change handler with auto-calculation
//   const handleMaleRateChange = (key, value) => {
//     const newFormData = { ...formData, [key]: value };

//     // Auto-calculate derived rates for daily inputs
//     if ((key.includes("Day") || key.includes("Night")) && !key.includes("Month") && !key.includes("Year") && value) {
//       const dayRate = parseFloat(value);
//       if (!isNaN(dayRate) && dayRate > 0) {
//         const monthlyKey = `${key}Month`;
//         const yearlyKey = `${key}Year`;
//         newFormData[monthlyKey] = calculateDerivedRates(dayRate, 'monthly').toString();
//         newFormData[yearlyKey] = calculateDerivedRates(dayRate, 'yearly').toString();
//       }
//     }

//     setFormData(newFormData);

//     // Auto-apply female adjustment if enabled
//     if (applyToAll && femaleAdjustment.value) {
//       const newFemaleData = { ...femaleFormData };
//       const maleRate = parseFloat(value || 0);

//       if (maleRate > 0) {
//         const adjustmentValue = parseFloat(femaleAdjustment.value);
//         let adjustedRate;

//         if (femaleAdjustment.type === "fixed") {
//           adjustedRate = maleRate + adjustmentValue;
//         } else {
//           adjustedRate = Math.round(maleRate * (1 + adjustmentValue / 100));
//         }

//         newFemaleData[key] = Math.max(0, adjustedRate).toString();

//         // Auto-calculate derived female rates
//         if ((key.includes("Day") || key.includes("Night")) && !key.includes("Month") && !key.includes("Year")) {
//           const monthlyKey = `${key}Month`;
//           const yearlyKey = `${key}Year`;
//           newFemaleData[monthlyKey] = calculateDerivedRates(adjustedRate, 'monthly').toString();
//           newFemaleData[yearlyKey] = calculateDerivedRates(adjustedRate, 'yearly').toString();
//         }
//       }

//       setFemaleFormData(newFemaleData);
//     }

//     // Clear validation error for this field
//     if (validationErrors[key]) {
//       setValidationErrors(prev => ({ ...prev, [key]: null }));
//     }
//   };

//   const handleFemaleRateChange = (key, value) => {
//     setFemaleFormData({ ...femaleFormData, [key]: value });

//     // Clear validation error
//     if (validationErrors[key]) {
//       setValidationErrors(prev => ({ ...prev, [key]: null }));
//     }
//   };

//   // Enhanced validation with detailed error messages
//   const validateForm = () => {
//     const errors = {};

//     if (!designationId) {
//       errors.designationId = "Please select a designation";
//     }

//     if (!effectiveFrom) {
//       errors.effectiveFrom = "Please select effective from date";
//     } else {
//       const selectedDate = new Date(effectiveFrom);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       if (selectedDate < today) {
//         errors.effectiveFrom = "Effective date cannot be in the past";
//       }
//     }

//     // Check if at least one rate is filled
//     const hasAnyMaleRate = Object.values(formData).some(value => value && parseFloat(value) > 0);
//     const hasAnyFemaleRate = Object.values(femaleFormData).some(value => value && parseFloat(value) > 0);

//     if (!hasAnyMaleRate && !hasAnyFemaleRate) {
//       errors.rates = "Please enter at least one rate";
//     }

//     // Validate individual rates
//     [...Object.keys(formData), ...Object.keys(femaleFormData)].forEach(key => {
//       const value = formData[key] || femaleFormData[key];
//       if (value && (parseFloat(value) < 0 || parseFloat(value) > 999999)) {
//         errors[key] = "Rate must be between 0 and 999,999";
//       }
//     });

//     setValidationErrors(errors);

//     if (Object.keys(errors).length > 0) {
//       toast.error("Please fix validation errors before saving");
//       return false;
//     }

//     return true;
//   };

//   // Enhanced save handler with better error handling
//   const handleSave = async () => {
//     if (!validateForm()) return;

//     setSaving(true);

//     try {
//       const payload = {
//         designationId: designationId,
//         daily: {
//           male: {
//             cityLimit: parseInt(formData.inCityDay) || 0,
//             outCityLimit: parseInt(formData.outCityDay) || 0,
//             dayShift: parseInt(formData.inCityDay) || 0,
//             nightShift: parseInt(formData.inCityNight) || 0
//           },
//           female: {
//             cityLimit: parseInt(femaleFormData.inCityDay) || 0,
//             outCityLimit: parseInt(femaleFormData.outCityDay) || 0,
//             dayShift: parseInt(femaleFormData.inCityDay) || 0,
//             nightShift: parseInt(femaleFormData.inCityNight) || 0
//           }
//         },
//         monthly: {
//           male: {
//             cityLimit: parseInt(formData.inCityDayMonth) || 0,
//             outCityLimit: parseInt(formData.outCityDayMonth) || 0,
//             dayShift: parseInt(formData.inCityDayMonth) || 0,
//             nightShift: parseInt(formData.inCityNightMonth) || 0
//           },
//           female: {
//             cityLimit: parseInt(femaleFormData.inCityDayMonth) || 0,
//             outCityLimit: parseInt(femaleFormData.outCityDayMonth) || 0,
//             dayShift: parseInt(femaleFormData.inCityDayMonth) || 0,
//             nightShift: parseInt(femaleFormData.inCityNightMonth) || 0
//           }
//         },
//         yearly: {
//           male: {
//             cityLimit: parseInt(formData.inCityDayYear) || 0,
//             outCityLimit: parseInt(formData.outCityDayYear) || 0,
//             dayShift: parseInt(formData.inCityDayYear) || 0,
//             nightShift: parseInt(formData.inCityNightYear) || 0
//           },
//           female: {
//             cityLimit: parseInt(femaleFormData.inCityDayYear) || 0,
//             outCityLimit: parseInt(femaleFormData.outCityDayYear) || 0,
//             dayShift: parseInt(femaleFormData.inCityDayYear) || 0,
//             nightShift: parseInt(femaleFormData.inCityNightYear) || 0
//           }
//         },
//         effectiveFrom: effectiveFrom,
//         adjustment: {
//           type: femaleAdjustment.type,
//           value: parseFloat(femaleAdjustment.value) || 0
//         }
//       };

//       if (isEditMode && priceId) {
//         payload.id = priceId;
//       }

//       let result;
//       if (isEditMode) {
//         result = await dispatch(QuotationStandardPriceUpdate(payload));
//       } else {
//         result = await dispatch(QuotationStandardPriceCreate(payload));
//       }

//       const { meta, payload: responsePayload } = result || {};

//       if (meta?.requestStatus === "fulfilled") {
//         toast.success(responsePayload?.message || `Price ${isEditMode ? 'updated' : 'created'} successfully`);
//         setShowPriceModal(false);

//         // Refresh price list
//         if (getPriceList) {
//           getPriceList();
//         } else {
//           dispatch(QuotationStandardPriceList({ limit: 50, page: 1 }));
//         }

//         resetFormData();
//       } else {
//         throw new Error(responsePayload?.message || `Failed to ${isEditMode ? 'update' : 'create'} price`);
//       }
//     } catch (error) {
//       console.error('Save error:', error);
//       toast.error(error.message || `Error ${isEditMode ? 'updating' : 'creating'} price`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleClose = () => {
//     setShowPriceModal(false);
//     resetFormData();
//   };

//   // Quick actions for common operations
//   const quickActions = [
//     {
//       label: "Copy Male to Female",
//       action: () => {
//         setFemaleFormData(formData);
//         toast.success("Male rates copied to female rates");
//       },
//       icon: Copy
//     },
//     {
//       label: "Clear All Female",
//       action: () => {
//         const emptyData = Object.keys(femaleFormData).reduce((acc, key) => {
//           acc[key] = "";
//           return acc;
//         }, {});
//         setFemaleFormData(emptyData);
//         toast.success("Female rates cleared");
//       },
//       icon: X
//     },
//     {
//       label: "Auto Calculate",
//       action: () => {
//         // Auto-calculate all derived rates from daily rates
//         const newMaleData = { ...formData };
//         const newFemaleData = { ...femaleFormData };

//         ['inCityDay', 'inCityNight', 'outCityDay', 'outCityNight'].forEach(dayKey => {
//           if (formData[dayKey]) {
//             const monthlyKey = `${dayKey}Month`;
//             const yearlyKey = `${dayKey}Year`;
//             const dayRate = parseFloat(formData[dayKey]);
//             newMaleData[monthlyKey] = calculateDerivedRates(dayRate, 'monthly').toString();
//             newMaleData[yearlyKey] = calculateDerivedRates(dayRate, 'yearly').toString();
//           }

//           if (femaleFormData[dayKey]) {
//             const monthlyKey = `${dayKey}Month`;
//             const yearlyKey = `${dayKey}Year`;
//             const dayRate = parseFloat(femaleFormData[dayKey]);
//             newFemaleData[monthlyKey] = calculateDerivedRates(dayRate, 'monthly').toString();
//             newFemaleData[yearlyKey] = calculateDerivedRates(dayRate, 'yearly').toString();
//           }
//         });

//         setFormData(newMaleData);
//         setFemaleFormData(newFemaleData);
//         toast.success("Derived rates calculated automatically");
//       },
//       icon: Calculator
//     }
//   ];

//   const locations = [
//     { key: "inCity", label: "In City", icon: "🏢" },
//     { key: "outCity", label: "Out of City", icon: "🚗" }
//   ];

//   const shifts = [
//     { key: "Day", label: "Day Shift", icon: "☀️" },
//     { key: "Night", label: "Night Shift", icon: "🌙" }
//   ];

//   return (
//     <>
//       <Dialog open={showPriceModal} handler={handleClose} size="xl" className="bg-white">
//         <ToastContainer position="top-right" />
//         <div className="bg-white rounded-lg w-full max-h-[95vh] overflow-hidden">
//           {/* Enhanced Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-xl font-semibold flex items-center">
//                   <Settings className="h-6 w-6 mr-2" />
//                   {isEditMode ? 'Edit Price Configuration' : 'Add New Price Configuration'}
//                 </h3>
//                 <p className="text-blue-100 mt-1 text-sm">
//                   Configure pricing structure for different shifts and locations
//                 </p>
//               </div>
//               <button 
//                 onClick={handleClose} 
//                 className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
//             <div className="p-6 space-y-6">
//               {/* Basic Configuration */}
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
//                   <Calendar className="h-5 w-5 mr-2 text-blue-600" />
//                   Basic Configuration
//                 </h4>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Effective From *
//                     </label>
//                     <input
//                       type="date"
//                       value={effectiveFrom}
//                       onChange={(e) => setEffectiveFrom(e.target.value)}
//                       className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//                         validationErrors.effectiveFrom ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                     />
//                     {validationErrors.effectiveFrom && (
//                       <p className="text-red-500 text-xs mt-1 flex items-center">
//                         <AlertCircle className="h-3 w-3 mr-1" />
//                         {validationErrors.effectiveFrom}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Select Designation *
//                     </label>
//                     <SingleSelectDropdown
//                       feildName='name'
//                       listData={designationList}
//                       inputName='Choose Designation'
//                       hideLabel
//                       customLabelCss={'p-3 border border-gray-300 rounded-lg'}
//                       handleClick={(r) => setDesignationId(r?._id)}
//                       selectedOptionDependency={'_id'}
//                       selectedOption={designationId}
//                     />
//                     {validationErrors.designationId && (
//                       <p className="text-red-500 text-xs mt-1 flex items-center">
//                         <AlertCircle className="h-3 w-3 mr-1" />
//                         {validationErrors.designationId}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Quick Actions */}
//               <div className="bg-blue-50 rounded-lg p-4">
//                 <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
//                   <Zap className="h-5 w-5 mr-2 text-blue-600" />
//                   Quick Actions
//                 </h4>
//                 <div className="flex flex-wrap gap-2">
//                   {quickActions.map((action, index) => (
//                     <button
//                       key={index}
//                       onClick={action.action}
//                       className="bg-white text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm border border-blue-200"
//                     >
//                       <action.icon className="h-4 w-4" />
//                       {action.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Rate Configuration */}
//               {locations.map((location) => (
//                 <div key={location.key} className="bg-white border border-gray-200 rounded-lg p-6">
//                   <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
//                     <span className="mr-2">{location.icon}</span>
//                     {location.label} Rates
//                   </h4>

//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead>
//                         <tr className="bg-gray-50">
//                           <th className="text-left p-3 font-medium text-gray-900">Shift</th>
//                           <th className="text-left p-3 font-medium text-blue-700">Male Daily (₹)</th>
//                           <th className="text-left p-3 font-medium text-blue-700">Male Monthly (₹)</th>
//                           <th className="text-left p-3 font-medium text-blue-700">Male Yearly (₹)</th>
//                           <th className="text-left p-3 font-medium text-pink-700">Female Daily (₹)</th>
//                           <th className="text-left p-3 font-medium text-pink-700">Female Monthly (₹)</th>
//                           <th className="text-left p-3 font-medium text-pink-700">Female Yearly (₹)</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {shifts.map((shift) => {
//                           const dayKey = `${location.key}${shift.key}`;
//                           const monthKey = `${dayKey}Month`;
//                           const yearKey = `${dayKey}Year`;

//                           return (
//                             <tr key={dayKey} className="border-b border-gray-100">
//                               <td className="p-3 font-medium text-gray-900 flex items-center">
//                                 <span className="mr-2">{shift.icon}</span>
//                                 {shift.label}
//                               </td>

//                               {/* Male rates */}
//                               {[dayKey, monthKey, yearKey].map((key) => (
//                                 <td key={key} className="p-3">
//                                   <input
//                                     type="number"
//                                     value={formData[key] || ""}
//                                     onChange={(e) => handleMaleRateChange(key, e.target.value)}
//                                     className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//                                       validationErrors[key] ? 'border-red-500' : 'border-blue-300'
//                                     } bg-blue-50`}
//                                     placeholder="0"
//                                     min="0"
//                                     max="999999"
//                                   />
//                                   {validationErrors[key] && (
//                                     <p className="text-red-500 text-xs mt-1">{validationErrors[key]}</p>
//                                   )}
//                                 </td>
//                               ))}

//                               {/* Female rates */}
//                               {[dayKey, monthKey, yearKey].map((key) => (
//                                 <td key={`female-${key}`} className="p-3">
//                                   <input
//                                     type="number"
//                                     value={femaleFormData[key] || ""}
//                                     onChange={(e) => handleFemaleRateChange(key, e.target.value)}
//                                     className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 ${
//                                       validationErrors[key] ? 'border-red-500' : 'border-pink-300'
//                                     } bg-pink-50`}
//                                     placeholder="0"
//                                     min="0"
//                                     max="999999"
//                                   />
//                                 </td>
//                               ))}
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               ))}

//               {/* Female Adjustment Section */}
//               <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
//                 <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
//                   <User className="h-5 w-5 mr-2 text-pink-600" />
//                   Female Price Adjustment
//                 </h4>

//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Adjustment Type
//                     </label>
//                     <select
//                       value={femaleAdjustment.type}
//                       onChange={(e) => setFemaleAdjustment({ ...femaleAdjustment, type: e.target.value })}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
//                     >
//                       <option value="fixed">Fixed Amount (₹)</option>
//                       <option value="percentage">Percentage (%)</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Adjustment Value
//                     </label>
//                     <input
//                       type="number"
//                       value={femaleAdjustment.value}
//                       onChange={(e) => setFemaleAdjustment({ ...femaleAdjustment, value: e.target.value })}
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
//                       placeholder={femaleAdjustment.type === "fixed" ? "Enter amount" : "Enter %"}
//                       min="0"
//                     />
//                   </div>

//                   <div>
//                     <button
//                       onClick={applyFemaleAdjustmentToAll}
//                       disabled={!femaleAdjustment.value}
//                       className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                     >
//                       <Calculator className="h-4 w-4" />
//                       Apply to All
//                     </button>
//                   </div>

//                   <div className="flex items-center">
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         checked={applyToAll}
//                         onChange={(e) => setApplyToAll(e.target.checked)}
//                         className="mr-2 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
//                       />
//                       <span className="text-sm text-gray-700">Auto-apply enabled</span>
//                     </label>
//                   </div>
//                 </div>

//                 <div className="mt-4 bg-white rounded-lg p-4 border border-pink-200">
//                   <div className="flex items-start">
//                     <Info className="h-5 w-5 text-pink-600 mt-0.5 mr-2 flex-shrink-0" />
//                     <div className="text-sm text-gray-600">
//                       <p className="mb-2">
//                         <strong>How adjustment works:</strong>
//                       </p>
//                       <ul className="space-y-1 text-xs">
//                         <li>• <strong>Fixed Amount:</strong> Adds the specified amount to male rates</li>
//                         <li>• <strong>Percentage:</strong> Increases male rates by the specified percentage</li>
//                         <li>• <strong>Auto-apply:</strong> When enabled, female rates update automatically as you change male rates</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Validation Errors Summary */}
//               {Object.keys(validationErrors).length > 0 && (
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                   <h4 className="font-semibold text-red-800 mb-2 flex items-center">
//                     <AlertCircle className="h-5 w-5 mr-2" />
//                     Please Fix These Issues:
//                   </h4>
//                   <ul className="text-sm text-red-700 space-y-1">
//                     {Object.entries(validationErrors).map(([field, error]) => (
//                       <li key={field}>• {error}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Enhanced Footer */}
//           <div className="bg-gray-50 px-6 py-4 border-t flex flex-col sm:flex-row gap-3 items-center justify-between">
//             <div className="text-sm text-gray-600">
//               {isEditMode ? (
//                 <span className="flex items-center">
//                   <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
//                   Editing existing price configuration
//                 </span>
//               ) : (
//                 <span className="flex items-center">
//                   <Info className="h-4 w-4 mr-1 text-blue-600" />
//                   Creating new price configuration
//                 </span>
//               )}
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={handleClose}
//                 disabled={saving}
//                 className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
//               >
//                 <X className="h-4 w-4" />
//                 Cancel
//               </button>

//               <button
//                 onClick={handleSave}
//                 disabled={saving || Object.keys(validationErrors).length > 0}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px]"
//               >
//                 {saving ? (
//                   <RefreshCw className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <Save className="h-4 w-4" />
//                 )}
//                 {saving ? 'Saving...' : (isEditMode ? 'Update Price' : 'Save Price')}
//               </button>
//             </div>
//           </div>
//         </div>
//       </Dialog>
//     </>
//   );
// };

// export default BasePriceBranch;

import React, { useEffect, useState, useMemo } from 'react';
import { Dialog, Typography } from '@material-tailwind/react';
import {
  Save,
  X,
  Copy,
  CheckCircle,
  Calculator,
  Settings,
  User,
  Calendar,
  AlertCircle,
  Info,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { removeEmptyStrings } from '../../../constants/reusableFun';
import { DesignationGetAction } from '../../../redux/Action/Designation/DesignationAction';
import SingleSelectDropdown from '../../../components/SingleSelectDropdown/SingleSelectDropdown';
import {
  QuotationStandardPriceCreate,
  QuotationStandardPriceUpdate,
  QuotationStandardPriceList,
  QuotationStandardDesignationPrice
} from '../../../redux/Action/Quotation/Price';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';

const BasePrice = ({ showPriceModal, setShowPriceModal, basePriceDetails, getPriceList }) => {
  // Form state
  const [formData, setFormData] = useState({
    inCityDay: "", inCityNight: "", inCityDayMonth: "", inCityDayYear: "",
    inCityNightMonth: "", inCityNightYear: "", outCityDay: "", outCityNight: "",
    outCityDayMonth: "", outCityDayYear: "", outCityNightMonth: "", outCityNightYear: ""
  });

  const [femaleFormData, setFemaleFormData] = useState({
    inCityDay: "", inCityNight: "", inCityDayMonth: "", inCityDayYear: "",
    inCityNightMonth: "", inCityNightYear: "", outCityDay: "", outCityNight: "",
    outCityDayMonth: "", outCityDayYear: "", outCityNightMonth: "", outCityNightYear: ""
  });

  // UI state
  const [femaleAdjustment, setFemaleAdjustment] = useState({ type: "fixed", value: "" });
  const [applyToAll, setApplyToAll] = useState(false);
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().split('T')[0]);
  const [designationId, setDesignationId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [priceId, setPriceId] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const dispatch = useDispatch();
  const { designationList, loading } = useSelector((state) => state?.designation || {});

  // Load designations on mount
  useEffect(() => {
    getDesignationList();
  }, [dispatch]);
  useEffect(() => {
    getDesignationPrice();
  }, [designationId]);
const [qpId,setQPId]=useState(null)
  // Handle modal state changes
  useEffect(() => {
    if (showPriceModal) {
      const hasData = basePriceDetails && Object.keys(basePriceDetails).length > 0;
      if (hasData) {
         console.log("basePriceDetails","basePriceDetails",basePriceDetails)
        setIsEditMode(true);
        populateFormData(basePriceDetails);
        setQPId(basePriceDetails?.baseQuotePriceId)
      } else {
        setIsEditMode(false);
        resetFormData();
      }
      setValidationErrors({});
    }
  }, [basePriceDetails, showPriceModal]);

  const getDesignationList = (params) => {
    const filters = {
      category: "assigned",
      mapedData: "designation",
      isActive: true
    };
    const updatedParams = removeEmptyStrings({ ...params, ...filters });
    dispatch(DesignationGetAction(updatedParams));
  };

  const resetFormData = () => {
    const emptyFormData = {
      inCityDay: "", inCityNight: "", inCityDayMonth: "", inCityDayYear: "",
      inCityNightMonth: "", inCityNightYear: "", outCityDay: "", outCityNight: "",
      outCityDayMonth: "", outCityDayYear: "", outCityNightMonth: "", outCityNightYear: ""
    };

    setFormData(emptyFormData);
    setFemaleFormData(emptyFormData);
    setFemaleAdjustment({ type: "fixed", value: "" });
    setApplyToAll(false);
    setDesignationId(null);
    setPriceId(null);
    setEffectiveFrom(new Date().toISOString().split('T')[0]);
    setActiveTab('basic');
    setValidationErrors({});
  };

  const populateFormData = (data) => {
    console.log('Populating form data:', data);



    // Extract the actual price data - it's nested in basePriceDetails.priceData
    const priceData = data.priceData || data;

    setPriceId(priceData.baseQuotePriceId);
    setDesignationId(data.designationId);

    if (priceData.effectiveFrom) {
      setEffectiveFrom(new Date(priceData.effectiveFrom).toISOString().split('T')[0]);
    }

    if (priceData.adjustment) {
      setFemaleAdjustment({
        type: priceData.adjustment.type || "fixed",
        value: priceData.adjustment.value?.toString() || ""
      });
    }

    // Helper function to convert array format to object format
    const convertArrayToObject = (dataArray) => {
      const maleData = dataArray?.find(item => item.gender === "male") || {};
      const femaleData = dataArray?.find(item => item.gender === "female") || {};

      console.log({ male: maleData, female: femaleData }, dataArray, 'trail')
      return { male: maleData, female: femaleData };
    };


    // Convert arrays to objects
    const daily = convertArrayToObject(priceData.daily);
    const monthly = convertArrayToObject(priceData.monthly);
    const yearly = convertArrayToObject(priceData.yearly);
    console.log(JSON.stringify(daily, null, 2))
    // Map to form fields
    const maleData = {
      inCityDay: daily.male?.cityLimit?.toString() || daily.male?.dayShift?.toString() || "",
      inCityDayMonth: monthly.male?.cityLimit?.toString() || monthly.male?.dayShift?.toString() || "",
      inCityDayYear: yearly.male?.cityLimit?.toString() || yearly.male?.dayShift?.toString() || "",
      inCityNight: daily.male?.nightShift?.toString() || "",
      inCityNightMonth: monthly.male?.nightShift?.toString() || "",
      inCityNightYear: yearly.male?.nightShift?.toString() || "",
      outCityDay: daily.male?.outCityLimit?.toString() || "",
      outCityDayMonth: monthly.male?.outCityLimit?.toString() || "",
      outCityDayYear: yearly.male?.outCityLimit?.toString() || "",
      outCityNight: daily.male?.outCityNightShift?.toString() || "",
      outCityNightMonth: monthly.male?.outCityNightShift?.toString() || "",
      outCityNightYear: yearly.male?.outCityNightShift?.toString() || ""
    };

    const femaleData = {
      inCityDay: daily.female?.cityLimit?.toString() || daily.female?.dayShift?.toString() || "",
      inCityDayMonth: monthly.female?.cityLimit?.toString() || monthly.female?.dayShift?.toString() || "",
      inCityDayYear: yearly.female?.cityLimit?.toString() || yearly.female?.dayShift?.toString() || "",
      inCityNight: daily.female?.nightShift?.toString() || "",
      inCityNightMonth: monthly.female?.nightShift?.toString() || "",
      inCityNightYear: yearly.female?.nightShift?.toString() || "",
      outCityDay: daily.female?.outCityLimit?.toString() || "",
      outCityDayMonth: monthly.female?.outCityLimit?.toString() || "",
      outCityDayYear: yearly.female?.outCityLimit?.toString() || "",
      outCityNight: daily.female?.outCityNightShift?.toString() || "",
      outCityNightMonth: monthly.female?.outCityNightShift?.toString() || "",
      outCityNightYear: yearly.female?.outCityNightShift?.toString() || ""
    };

    setFormData(maleData);
    setFemaleFormData(femaleData);

    if (priceData.adjustment && priceData.adjustment.value) {
      setApplyToAll(true);
    }
  };

  // Enhanced calculation with better rounding
  const calculateDerivedRates = (dayRate, period = 'monthly') => {
    if (!dayRate || isNaN(dayRate)) return { monthly: "", yearly: "" };

    const rate = parseFloat(dayRate);
    const monthly = Math.round(rate * 30);
    const yearly = Math.round(rate * 365);

    return period === 'monthly' ? monthly : yearly;
  };

  // Improved female adjustment application
  const applyFemaleAdjustmentToAll = () => {
    if (!femaleAdjustment.value || !parseFloat(femaleAdjustment.value)) {
      toast.error("Please enter a valid adjustment value");
      return;
    }

    const adjustmentValue = parseFloat(femaleAdjustment.value);
    const newFemaleData = { ...femaleFormData };

    Object.keys(formData).forEach(key => {
      const maleRate = parseFloat(formData[key] || 0);
      if (maleRate > 0) {
        let adjustedRate;
        if (femaleAdjustment.type === "fixed") {
          adjustedRate = maleRate + adjustmentValue;
        } else {
          adjustedRate = Math.round(maleRate * (1 + adjustmentValue / 100));
        }
        newFemaleData[key] = Math.max(0, adjustedRate).toString();
      }
    });

    setFemaleFormData(newFemaleData);
    setApplyToAll(true);
    toast.success(`Female rates adjusted by ${femaleAdjustment.type === 'fixed' ? '₹' + adjustmentValue : adjustmentValue + '%'}`);
  };

  // Enhanced male rate change handler with auto-calculation
  const handleMaleRateChange = (key, value) => {
    const newFormData = { ...formData, [key]: value };

    // Auto-calculate derived rates for daily inputs
    if ((key.includes("Day") || key.includes("Night")) && !key.includes("Month") && !key.includes("Year") && value) {
      const dayRate = parseFloat(value);
      if (!isNaN(dayRate) && dayRate > 0) {
        const monthlyKey = `${key}Month`;
        const yearlyKey = `${key}Year`;
        newFormData[monthlyKey] = calculateDerivedRates(dayRate, 'monthly').toString();
        newFormData[yearlyKey] = calculateDerivedRates(dayRate, 'yearly').toString();
      }
    }

    setFormData(newFormData);

    // Auto-apply female adjustment if enabled
    if (applyToAll && femaleAdjustment.value) {
      const newFemaleData = { ...femaleFormData };
      const maleRate = parseFloat(value || 0);

      if (maleRate > 0) {
        const adjustmentValue = parseFloat(femaleAdjustment.value);
        let adjustedRate;

        if (femaleAdjustment.type === "fixed") {
          adjustedRate = maleRate + adjustmentValue;
        } else {
          adjustedRate = Math.round(maleRate * (1 + adjustmentValue / 100));
        }

        newFemaleData[key] = Math.max(0, adjustedRate).toString();

        // Auto-calculate derived female rates
        if ((key.includes("Day") || key.includes("Night")) && !key.includes("Month") && !key.includes("Year")) {
          const monthlyKey = `${key}Month`;
          const yearlyKey = `${key}Year`;
          newFemaleData[monthlyKey] = calculateDerivedRates(adjustedRate, 'monthly').toString();
          newFemaleData[yearlyKey] = calculateDerivedRates(adjustedRate, 'yearly').toString();
        }
      }

      setFemaleFormData(newFemaleData);
    }

    // Clear validation error for this field
    if (validationErrors[key]) {
      setValidationErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  const handleFemaleRateChange = (key, value) => {
    setFemaleFormData({ ...femaleFormData, [key]: value });

    // Clear validation error
    if (validationErrors[key]) {
      setValidationErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  // Enhanced validation with detailed error messages
  const validateForm = () => {
    const errors = {};

    if (!designationId) {
      errors.designationId = "Please select a designation";
    }

    if (!effectiveFrom) {
      errors.effectiveFrom = "Please select effective from date";
    } else if (!isEditMode) {
      // Only check for past dates when creating new prices
      const selectedDate = new Date(effectiveFrom);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.effectiveFrom = "Effective date cannot be in the past";
      }
    }


    // Check if at least one rate is filled
    const hasAnyMaleRate = Object.values(formData).some(value => value && parseFloat(value) > 0);
    const hasAnyFemaleRate = Object.values(femaleFormData).some(value => value && parseFloat(value) > 0);

    if (!hasAnyMaleRate && !hasAnyFemaleRate) {
      errors.rates = "Please enter at least one rate";
    }

    // Validate individual rates
    [...Object.keys(formData), ...Object.keys(femaleFormData)].forEach(key => {
      const value = formData[key] || femaleFormData[key];
      if (value && (parseFloat(value) < 0 || parseFloat(value) > 999999)) {
        errors[key] = "Rate must be between 0 and 999,999";
      }
    });

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix validation errors before saving");
      return false;
    }

    return true;
  };

  // Enhanced save handler with better error handling
  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);

    try {
      // Helper function to safely parse numbers
      const safeParseInt = (value, defaultValue = 0) => {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? defaultValue : parsed;
      };

      const safeParseFloat = (value, defaultValue = 0) => {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? defaultValue : parsed;
      };

      const payload = {
        designationId: designationId,
        baseQuotePriceId:  qpId,
        daily: {
          male: {
            cityLimit: safeParseInt(formData.inCityDay),
            outCityLimit: safeParseInt(formData.outCityDay),
            dayShift: safeParseInt(formData.inCityDay),
            nightShift: safeParseInt(formData.inCityNight),
            outCityDayShift: safeParseInt(formData.outCityDay),
            outCityNightShift: safeParseInt(formData.outCityNight),
          },
          female: {
            cityLimit: safeParseInt(femaleFormData.inCityDay),
            outCityLimit: safeParseInt(femaleFormData.outCityDay),
            dayShift: safeParseInt(femaleFormData.inCityDay),
            nightShift: safeParseInt(femaleFormData.inCityNight),
            outCityDayShift: safeParseInt(femaleFormData.outCityDay),
            outCityNightShift: safeParseInt(femaleFormData.outCityNight),
          }
        },
        monthly: {
          male: {
            cityLimit: safeParseInt(formData.inCityDayMonth),
            outCityLimit: safeParseInt(formData.outCityDayMonth),
            dayShift: safeParseInt(formData.inCityDayMonth),
            nightShift: safeParseInt(formData.inCityNightMonth),
            outCityDayShift: safeParseInt(formData.outCityDayMonth),
            outCityNightShift: safeParseInt(formData.outCityNightMonth),
          },
          female: {
            cityLimit: safeParseInt(femaleFormData.inCityDayMonth),
            outCityLimit: safeParseInt(femaleFormData.outCityDayMonth),
            dayShift: safeParseInt(femaleFormData.inCityDayMonth),
            nightShift: safeParseInt(femaleFormData.inCityNightMonth),
            outCityDayShift: safeParseInt(femaleFormData.outCityDayMonth),
            outCityNightShift: safeParseInt(femaleFormData.outCityNightMonth),
          }
        },
        yearly: {
          male: {
            cityLimit: safeParseInt(formData.inCityDayYear),
            outCityLimit: safeParseInt(formData.outCityDayYear),
            dayShift: safeParseInt(formData.inCityDayYear),
            nightShift: safeParseInt(formData.inCityNightYear),
            outCityDayShift: safeParseInt(formData.outCityDayYear),
            outCityNightShift: safeParseInt(formData.outCityNightYear),
          },
          female: {
            cityLimit: safeParseInt(femaleFormData.inCityDayYear),
            outCityLimit: safeParseInt(femaleFormData.outCityDayYear),
            dayShift: safeParseInt(femaleFormData.inCityDayYear),
            nightShift: safeParseInt(femaleFormData.inCityNightYear),
            outCityDayShift: safeParseInt(femaleFormData.outCityDayYear),
            outCityNightShift: safeParseInt(femaleFormData.outCityNightYear),
          }
        },
        effectiveFrom: effectiveFrom,
        adjustment: {
          type: femaleAdjustment?.type || 'percentage',
          value: safeParseFloat(femaleAdjustment?.value)
        }
      };

      console.log(payload,'response')

      let result;
      if (isEditMode) {
        // Don't include 'id' in payload - handle it based on your API requirements
        // You might need to pass priceId separately if your update action requires it
        result = await dispatch(QuotationStandardPriceUpdate(removeEmptyStrings({
          ...payload,
          // Only add ID fields that your API specifically expects
          // priceId: priceId // or whatever identifier your API needs
        })));
      } else {
        result = await dispatch(QuotationStandardPriceCreate(removeEmptyStrings(payload)));
      }

      const { meta, payload: responsePayload } = result || {};

      if (meta?.requestStatus === "fulfilled") {
        toast.success(responsePayload?.message || `Price ${isEditMode ? 'updated' : 'created'} successfully`);
        setShowPriceModal(false);
setQPId(null)
        if (getPriceList) {
          getPriceList();
        } else {
          dispatch(QuotationStandardPriceList({ limit: 50, page: 1 }));
        }

        resetFormData();
      } else {
        throw new Error(responsePayload?.message || `Failed to ${isEditMode ? 'update' : 'create'} price`);
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message || `Error ${isEditMode ? 'updating' : 'creating'} price`);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setShowPriceModal(false);
    resetFormData();
  };

  // Quick actions for common operations
  const quickActions = [
    {
      label: "Copy Male to Female",
      action: () => {
        setFemaleFormData(formData);
        toast.success("Male rates copied to female rates");
      },
      icon: Copy
    },
    {
      label: "Clear All Female",
      action: () => {
        const emptyData = Object.keys(femaleFormData).reduce((acc, key) => {
          acc[key] = "";
          return acc;
        }, {});
        setFemaleFormData(emptyData);
        toast.success("Female rates cleared");
      },
      icon: X
    },
    {
      label: "Auto Calculate",
      action: () => {
        // Auto-calculate all derived rates from daily rates
        const newMaleData = { ...formData };
        const newFemaleData = { ...femaleFormData };

        ['inCityDay', 'inCityNight', 'outCityDay', 'outCityNight'].forEach(dayKey => {
          if (formData[dayKey]) {
            const monthlyKey = `${dayKey}Month`;
            const yearlyKey = `${dayKey}Year`;
            const dayRate = parseFloat(formData[dayKey]);
            newMaleData[monthlyKey] = calculateDerivedRates(dayRate, 'monthly').toString();
            newMaleData[yearlyKey] = calculateDerivedRates(dayRate, 'yearly').toString();
          }

          if (femaleFormData[dayKey]) {
            const monthlyKey = `${dayKey}Month`;
            const yearlyKey = `${dayKey}Year`;
            const dayRate = parseFloat(femaleFormData[dayKey]);
            newFemaleData[monthlyKey] = calculateDerivedRates(dayRate, 'monthly').toString();
            newFemaleData[yearlyKey] = calculateDerivedRates(dayRate, 'yearly').toString();
          }
        });

        setFormData(newMaleData);
        setFemaleFormData(newFemaleData);
        toast.success("Derived rates calculated automatically");
      },
      icon: Calculator
    }
  ];

  const locations = [
    { key: "inCity", label: "In City", icon: "🏢" },
    { key: "outCity", label: "Out of City", icon: "🚗" }
  ];

  const shifts = [
    { key: "Day", label: "Day Shift", icon: "☀️" },
    { key: "Night", label: "Night Shift", icon: "🌙" }
  ];

  const getDesignationPrice = (designation) => {

    console.log(designation?._id, 'd')
    dispatch(QuotationStandardDesignationPrice({ date: moment(effectiveFrom).format('DD-MM-YYYY'), designationId: designation?._id }))
  }

  return (
    <>
      <Dialog open={showPriceModal} handler={handleClose} size="xl" className="bg-white">
        <ToastContainer position="top-right" />
        <div className="bg-white rounded-lg w-full max-h-[95vh] overflow-hidden">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold flex items-center">
                  <Settings className="h-6 w-6 mr-2" />
                  {isEditMode ? 'Edit Base Price Configuration' : 'Add New Price Configuration'}
                </h3>
                <p className="text-blue-100 mt-1 text-sm">
                  Configure pricing structure for different shifts and locations
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
            <div className="p-6 space-y-6">
              {/* Basic Configuration */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Basic Configuration
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Effective From *
                    </label>
                    <input
                      type="date"
                      value={effectiveFrom}
                      onChange={(e) => setEffectiveFrom(e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${validationErrors.effectiveFrom ? 'border-red-500' : 'border-gray-300'
                        }`}
                      // Only restrict past dates for new prices
                      min={!isEditMode ? new Date().toISOString().split('T')[0] : undefined}
                    />
                    {validationErrors.effectiveFrom && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.effectiveFrom}
                      </p>
                    )}
                    {isEditMode && (
                      <p className="text-blue-600 text-xs mt-1">
                        Editing mode: Past dates are allowed for existing prices
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Designation *
                    </label>
                    <SingleSelectDropdown
                      feildName='name'
                      listData={designationList}
                      inputName='Choose Designation'
                      hideLabel
                      customLabelCss={'p-3 border border-gray-300 rounded-lg'}
                      handleClick={(r) => { setDesignationId(r?._id); getDesignationPrice(r) }}
                      selectedOptionDependency={'_id'}
                      selectedOption={designationId}
                      disabled={isEditMode}
                    />
                    {validationErrors.designationId && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.designationId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-blue-600" />
                  Quick Actions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="bg-white text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm border border-blue-200"
                    >
                      <action.icon className="h-4 w-4" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rate Configuration */}
              {locations.map((location) => (
                <div key={location.key} className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">{location.icon}</span>
                    {location.label} Rates
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-3 font-medium text-gray-900">Shift</th>
                          <th className="text-left p-3 font-medium text-blue-700">Male Daily (₹)</th>
                          <th className="text-left p-3 font-medium text-blue-700">Male Monthly (₹)</th>
                          <th className="text-left p-3 font-medium text-blue-700">Male Yearly (₹)</th>
                          <th className="text-left p-3 font-medium text-pink-700">Female Daily (₹)</th>
                          <th className="text-left p-3 font-medium text-pink-700">Female Monthly (₹)</th>
                          <th className="text-left p-3 font-medium text-pink-700">Female Yearly (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shifts.map((shift) => {
                          const dayKey = `${location.key}${shift.key}`;
                          const monthKey = `${dayKey}Month`;
                          const yearKey = `${dayKey}Year`;

                          return (
                            <tr key={dayKey} className="border-b border-gray-100">
                              <td className="p-3 font-medium text-gray-900 flex items-center">
                                <span className="mr-2">{shift.icon}</span>
                                {shift.label}
                              </td>

                              {/* Male rates */}
                              {[dayKey, monthKey, yearKey].map((key) => (
                                <td key={key} className="p-3">
                                  <input
                                    type="number"
                                    value={formData[key] || ""}
                                    onChange={(e) => handleMaleRateChange(key, e.target.value)}
                                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${validationErrors[key] ? 'border-red-500' : 'border-blue-300'
                                      } bg-blue-50`}
                                    placeholder="0"
                                    min="0"
                                    max="999999"
                                  />
                                  {validationErrors[key] && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors[key]}</p>
                                  )}
                                </td>
                              ))}

                              {/* Female rates */}
                              {[dayKey, monthKey, yearKey].map((key) => (
                                <td key={`female-${key}`} className="p-3">
                                  <input
                                    type="number"
                                    value={femaleFormData[key] || ""}
                                    onChange={(e) => handleFemaleRateChange(key, e.target.value)}
                                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 ${validationErrors[key] ? 'border-red-500' : 'border-pink-300'
                                      } bg-pink-50`}
                                    placeholder="0"
                                    min="0"
                                    max="999999"
                                  />
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {/* Female Adjustment Section */}
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-pink-600" />
                  Female Price Adjustment
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adjustment Type
                    </label>
                    <select
                      value={femaleAdjustment.type}
                      onChange={(e) => setFemaleAdjustment({ ...femaleAdjustment, type: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="fixed">Fixed Amount (₹)</option>
                      <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adjustment Value
                    </label>
                    <input
                      type="number"
                      value={femaleAdjustment.value}
                      onChange={(e) => setFemaleAdjustment({ ...femaleAdjustment, value: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder={femaleAdjustment.type === "fixed" ? "Enter amount" : "Enter %"}
                      min="0"
                    />
                  </div>

                  <div>
                    <button
                      onClick={applyFemaleAdjustmentToAll}
                      disabled={!femaleAdjustment.value}
                      className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Calculator className="h-4 w-4" />
                      Apply to All
                    </button>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={applyToAll}
                        onChange={(e) => setApplyToAll(e.target.checked)}
                        className="mr-2 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Auto-apply enabled</span>
                    </label>
                  </div>
                </div>

                <div className="mt-4 bg-white rounded-lg p-4 border border-pink-200">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-pink-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <p className="mb-2">
                        <strong>How adjustment works:</strong>
                      </p>
                      <ul className="space-y-1 text-xs">
                        <li>• <strong>Fixed Amount:</strong> Adds the specified amount to male rates</li>
                        <li>• <strong>Percentage:</strong> Increases male rates by the specified percentage</li>
                        <li>• <strong>Auto-apply:</strong> When enabled, female rates update automatically as you change male rates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation Errors Summary */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Please Fix These Issues:
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {Object.entries(validationErrors).map(([field, error]) => (
                      <li key={field}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="text-sm text-gray-600">
              {isEditMode ? (
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                  Editing existing price configuration
                </span>
              ) : (
                <span className="flex items-center">
                  <Info className="h-4 w-4 mr-1 text-blue-600" />
                  Creating new price configuration
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={saving}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving || Object.keys(validationErrors).length > 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px]"
              >
                {saving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? 'Saving...' : (isEditMode ? 'Update Price' : 'Save Price')}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default BasePrice;