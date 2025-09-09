import React, { useState } from 'react';
import Header from '../../components/header/Header';
// import BasicInformation from './BasicInformation/BasicInformation';
import { ShiftCreateAction, ShiftUpdateAction } from '../../redux/Action/Shift/ShiftAction';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';


const Edit = () => {
  const [finalData, setFinalData] = useState({
    basicInfo: [],

  });
const {state}=useLocation()
  const [formValidity, setFormValidity] = useState({
    basicInfo: true,

  });
const dispatch=useDispatch()
const navigate=useNavigate()
  const handleSave = async() => {
    const allValid = Object.values(formValidity).every(Boolean);
    if (!allValid) {
      alert('Please complete all required fields before saving.');
      return;
    }

    console.log(JSON.stringify(finalData, null, 2), '===== Final Submitted Data =====');

      const errors = [];
        const formData = finalData.basicInfo.reduce((acc, field) => {
        
          if (field.required && !field.value?.toString().trim()) {
            errors.push(`${field.label} is required.`);
          }
          acc[field.key] = field.value;
          return acc;
        }, {});
    console.log(formData,errors)

      if (errors.length > 0) {
          toast.error(errors.join('\n'));
          return;
        }else{
    
        try {
          console.log('Form submitted:', formData);
     const result = await dispatch(ShiftUpdateAction({...formData,shiftId:state?._id}));
          const { meta, payload } = result || {};
          console.log(meta,payload,'te')
    
          if (meta?.requestStatus === 'fulfilled') {
            toast.success(payload?.message || 'Shift created successfully!');
            navigate('/shift');
          } else {
            toast.error(payload?.message || 'Failed to create Shift.');
          }
        } catch (error) {
          console.error('Error creating Shift:', error);
          toast.error('An error occurred while creating the Shift.');
        }
      }
      
    
      
    // You can now send `finalData` to API or further process
  };
  const [isEdit,setIsEdit]=useState(true)
const handleEdit=()=>{
  setIsEdit(!isEdit)
}

  return (
    <div className="flex flex-col gap-4 w-full h-full bg-white border border-gray-100 rounded-md p-2 overflow-auto">
      <Header
       buttonTitle="Save"
        isBackHandler
        isEditAvaliable={isEdit}
        isButton
     
        handleClick={handleSave}
        handleEdit={handleEdit}
        headerLabel="Roles"
        subHeaderLabel="Edit Your Roles"
      />

      <div className="mx-10 flex flex-col gap-4">
       
          {/* <BasicInformation
          data={state}
          isEditAvaliable={isEdit}
            onChange={(data) =>
              setFinalData((prev) => ({ ...prev, basicInfo: data }))
            }
            onValidate={(isValid) =>
              setFormValidity((prev) => ({ ...prev, basicInfo: isValid }))
            }
          /> */}
       
      </div>
    </div>
  );
};

export default Edit;
