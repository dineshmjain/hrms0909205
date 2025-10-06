// import React, { useState } from 'react';
// import Header from '../../components/header/Header';
// import BasicInformation from './BasicInformation/BasicInformation';
// import OwnersDetails from './OwnerDeatils/OwnersDetails';
// import Address from '../../components/Address/Address';


// const Add = () => {
//   const [finalData, setFinalData] = useState({
//     basicInfo: [],
//     ownersDetails:[],
//     addressDetails:[]

//   });

//   const [formValidity, setFormValidity] = useState({
//     basicInfo: true,
//     ownersDetails:true,
//     addressDetails:true

//   });

//   const handleSave = () => {
//     const allValid = Object.values(formValidity).every(Boolean);
//     if (!allValid) {
//       alert('Please complete all required fields before saving.');
//       return;
//     }

//     console.log(JSON.stringify(finalData, null, 2), '===== Final Submitted Data =====');
//     // You can now send `finalData` to API or further process
//   };

//   return (
//     <div className="flex flex-col gap-4 w-full h-full bg-white border border-gray-100 rounded-md p-2 overflow-auto">
//       <Header
//         buttonTitle="Save"
//         isBackHandler={true}
//         headerLabel="Lead"
//         subHeaderLabel="Add Your Lead Details"
//         isButton={true}
//         onClick={handleSave}
//       />

//       <div className="mx-10 flex flex-col gap-4">
//         <div className="border-b border-gray-300 pb-2">
//           <BasicInformation
//             onChange={(data) =>
//               setFinalData((prev) => ({ ...prev, basicInfo: data }))
//             }
//             onValidate={(isValid) =>
//               setFormValidity((prev) => ({ ...prev, basicInfo: isValid }))
//             }
//           />
//         </div>
//         <div className=" border-gray-300 ">
//           <OwnersDetails
//             onChange={(data) =>
//               setFinalData((prev) => ({ ...prev, ownersDetails: data }))
//             }
//             onValidate={(isValid) =>
//               setFormValidity((prev) => ({ ...prev, ownersDetails: isValid }))
//             }
//           />
//         </div>
//              <div className=" border-gray-300 ">
//                 <Address onChange={(data) =>
//               setFinalData((prev) => ({ ...prev, addressDetails: data }))
//             }
//             onValidate={(isValid) =>
//               setFormValidity((prev) => ({ ...prev, addressDetails: isValid }))
//             }/>
//              </div>



//       </div>

//     </div>
//   );
// };

// export default Add;

import React, { useState, useEffect } from 'react';
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Save,
  X,
  ArrowLeft,
  Building,
  Users,
  AlertCircle
} from 'lucide-react';
import { useCheckEnabledModule } from '../../hooks/useCheckEnabledModule';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { SubOrgListAction } from '../../redux/Action/SubOrgAction/SubOrgAction';
import { BranchGetAction } from '../../redux/Action/Branch/BranchAction';
import SingleSelectDropdown from '../../components/SingleSelectDropdown/SingleSelectDropdown';
import { EmployeeListApi } from '../../apis/Employee/Employee';
import { EmployeeGetAction } from '../../redux/Action/Employee/EmployeeAction';
import { DesignationGetAction } from '../../redux/Action/Designation/DesignationAction';
import { LeadCreateAction } from '../../redux/Action/Leads/LeadAction';
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companayAddress: '',
    contactPerson: '',
    contactPersonDesignation: '',
    contactPersonEmail: '',
    mobile: '',
    subOrgId: '',
    branchId: '',
    assignedToId: '',
    designationId:''
  });
  const [subOrgFilter, setSubOrgFilter] = useState(null);
  const [branchFilter, setBranchFilter] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const { designationList} = useSelector(
      (state) => state?.designation || {}
    );
  // const [branchList, setbranchList] = useState([]);
  // const [employees, setEmployees] = useState([]);
  const [filteredbranchList, setFilteredbranchList] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const { subOrgs } = useSelector((state) => state?.subOrgs || {});
  const { branchList } = useSelector((state) => state?.branch || {});
  const { employeeList } = useSelector((state) => state?.employee);
const navigate =useNavigate()
  console.log(employeeList, 'user')
  const checkModules = useCheckEnabledModule()
  useEffect(() => {
    // if (checkModules('suborganization', 'r')) {
      getSubOrgList();


      getBranchList();
    // }
  }, []);
  useEffect(()=>{
getDesignationList()
  },[formData?.subOrgId])
const getDesignationList=async()=>{
  dispatch(DesignationGetAction({}))
}


  const getSubOrgList = () => {
    dispatch(SubOrgListAction({}));
  };
  useEffect(() => {
    getBranchList()
  }, [formData.subOrgId])
  const getBranchList = () => {
    const params = {

    }
    if (formData.subOrgId) {
      params.subOrgId = formData.subOrgId
    }
    dispatch(BranchGetAction({ ...params }));
  };



  useEffect(() => {
    if (formData.subOrgId) {
      const filtered = branchList.filter(b => b.subOrgId === formData.subOrgId);
      setFilteredbranchList(filtered);
      setFormData(prev => ({ ...prev, branchId: '', assignedToId: '' }));
      setFilteredEmployees([]);
    } else {
      setFilteredbranchList([]);
      setFilteredEmployees([]);
    }
  }, [formData.subOrgId]);

  useEffect(() => {
    getEmployees()
  }, [formData?.branchId,formData?.designationId])

  const getEmployees = async (data) => {
    try {

      let params = {

      };
      if (formData?.subOrgId) {
        params.orgIds = formData?.subOrgId
      }
      if (formData?.branchId) {
        params.branchIds = [formData.branchId]
      }
      if (formData?.designationId) {
        params.designationIds = [formData.designationId]
      }
      dispatch(EmployeeGetAction({ ...params }))
    }
    catch (error) {
      console.log(error)
    }
  }

  // useEffect(() => {
  //   if (formData.branchId) {
  //     const filtered = employees.filter(e => e.branchId === formData.branchId);
  //     setFilteredEmployees(filtered);
  //     setFormData(prev => ({ ...prev, assignedToId: '' }));
  //   } else if (formData.subOrgId) {
  //     const filtered = employees.filter(e => e.subOrgId === formData.subOrgId);
  //     setFilteredEmployees(filtered);
  //   } else {
  //     setFilteredEmployees([]);
  //   }
  // }, [formData.branchId, formData.subOrgId]);

  const handleChange = (e) => {

    console.log(e)
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.companayAddress.trim()) {
      newErrors.companayAddress = 'Company address is required';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person name is required';
    }

    if (!formData.contactPersonDesignation.trim()) {
      newErrors.contactPersonDesignation = 'Designation is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    if (!formData.contactPersonEmail.trim()) {
      newErrors.contactPersonEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactPersonEmail)) {
      newErrors.contactPersonEmail = 'Invalid email format';
    }

    if (!formData.subOrgId) {
      newErrors.subOrgId = 'Sub organization is required';
    }

    if (!formData.assignedToId) {
      newErrors.assignedToId = 'Assigned employee is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const {designationId,...rest}=formData

  

    const result = await  dispatch(LeadCreateAction({...rest}))
         const { meta, payload } = result || {};
         console.log(meta,payload,'te')
   
         if (meta?.requestStatus === 'fulfilled') {
              setLoading(false);
           // toast.success(payload?.message || 'Designation created successfully!');
           navigate('/leads');
         } else {
              setLoading(false);
           // toast.error(payload?.message || 'Failed to create Designation.');
         }
  };

  const handleReset = () => {
    setFormData({
      companyName: '',
      companayAddress: '',
      contactPerson: '',
      contactPersonDesignation: '',
      contactPersonEmail: '',
      mobile: '',
      subOrgId: '',
      branchId: '',
      assignedToId: '',
    });
    setErrors({});
    setFilteredbranchList([]);
    setFilteredEmployees([]);
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
    navigate('/leads')
  };

  return (
    <div className="flex flex-col gap-6 p-4 w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                Add New Lead
              </h1>
              <p className="text-gray-600 mt-1">Create a new lead entry</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {/* Company Information Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2.5 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.companyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter company name"
                />
              </div>
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.companyName}
                </p>
              )}
            </div>

            {/* Company Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="companayAddress"
                  value={formData.companayAddress}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2.5 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.companayAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter company address"
                />
              </div>
              {errors.companayAddress && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.companayAddress}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Person Information Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
            <User className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Contact Person Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Person Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2.5 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter contact person name"
                />
              </div>
              {errors.contactPerson && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.contactPerson}
                </p>
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="contactPersonDesignation"
                  value={formData.contactPersonDesignation}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2.5 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.contactPersonDesignation ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter designation"
                />
              </div>
              {errors.contactPersonDesignation && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.contactPersonDesignation}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  className={`pl-10 pr-4 py-2.5 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.mobile ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter 10-digit mobile number"
                />
              </div>
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.mobile}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="contactPersonEmail"
                  value={formData.contactPersonEmail}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2.5 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.contactPersonEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter email address"
                />
              </div>
              {errors.contactPersonEmail && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.contactPersonEmail}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Assignment Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Assignment Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sub Organization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Organization <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                {/* <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none z-10" /> */}
                {/* <select
                  name="subOrgId"
                  value={formData.subOrgId}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2.5 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.subOrgId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Sub Organization</option>
                  {subOrgs.map(subOrg => (
                    <option key={subOrg._id} value={subOrg._id}>
                      {subOrg.name}
                    </option>
                  ))}
                </select> */}

                <SingleSelectDropdown
                  listData={subOrgs}
                  selectedOptionDependency={"_id"}
                  feildName='name'
                  selectedOption={formData.subOrgId}
                  handleClick={(e) => setFormData((prev) => ({ ...prev, subOrgId: e._id }))} />
              </div>
              {errors.subOrgId && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.subOrgId}
                </p>
              )}
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch
              </label>
              <div className="relative">
                {/* <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none z-10" /> */}
                <SingleSelectDropdown
                  listData={branchList}
                  selectedOptionDependency={"_id"}
                  feildName='name'
                  selectedOption={formData.branchId}
                  handleClick={(e) => setFormData((prev) => ({ ...prev, branchId: e._id }))} />
              </div>
              {!formData.subOrgId && (
                <p className="mt-1 text-sm text-gray-500">
                  Select Sub Organization first
                </p>
              )}
            </div>
            {/* Designations */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designations
              </label>
              <div className="relative">
                {/* <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none z-10" /> */}
                <SingleSelectDropdown
                  listData={designationList}
                  selectedOptionDependency={"_id"}
                  feildName='name'
                  selectedOption={formData.designationId}
                  handleClick={(e) => setFormData((prev) => ({ ...prev, designationId: e._id }))} />
              </div>
              {!formData.subOrgId && (
                <p className="mt-1 text-sm text-gray-500">
                  Select Sub Organization first
                </p>
              )}
            </div>

            {/* Assigned Employee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign To Employee <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                {/* <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none z-10" /> */}
                <SingleSelectDropdown
                  listData={employeeList}
                  selectedOptionDependency={"_id"}
                  feildName='name'
                  selectedOption={formData.assignedToId}
                  handleClick={(e) => setFormData((prev) => ({ ...prev, assignedToId: e._id }))} />
              </div>
              {errors.assignedToId && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.assignedToId}
                </p>
              )}
              {!formData.subOrgId && (
                <p className="mt-1 text-sm text-gray-500">
                  Select Sub Organization first
                </p>
              )}
            </div>
          </div>

          {/* Info box */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Assignment Information:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Select a Sub Organization to view available branchList and employees</li>
                  <li>Branch selection is optional - you can assign directly to any employee in the Sub Organization</li>
                  <li>If you select a specific branch, only employees from that branch will be shown</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Lead'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Add;
