import React, { useState } from 'react';
import Header from '../../components/header/Header';
import BasicInformation from './BasicInformation/BasicInformation';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { DesignationCreateAction } from '../../redux/Action/Designation/DesignationAction';

const Add = () => {
  const [finalData, setFinalData] = useState({
    basicInfo: [],
  });

  const [formValidity, setFormValidity] = useState({
    basicInfo: true,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSave = async () => {
   try{ 
    const isAllValid = Object.values(formValidity).every(Boolean);
console.log(isAllValid,'isAllValid')
    if (!isAllValid) {
      toast.error('Please complete all required fields before saving.');
      return;
    }

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
 const result = await dispatch(DesignationCreateAction(formData));
      const { meta, payload } = result || {};
      console.log(meta,payload,'te')

      if (meta?.requestStatus === 'fulfilled') {
        // toast.success(payload?.message || 'Designation created successfully!');
        navigate('/designation');
      } else {
        // toast.error(payload?.message || 'Failed to create Designation.');
      }
    } catch (error) {
      console.error('Error creating Designation:', error);
      toast.error('An error occurred while creating the Designation.');
    }
  }
  }catch(error)
  {
     toast.error('An error occurred while creating the Designation.');
  }
  
  };

  return (
    <div className="flex flex-col gap-4 w-full pb-4 bg-white border border-gray-100 rounded-md p-2 shadow-hrms overflow-auto">
      <Header
        buttonTitle="Save"
        isBackHandler={true}
        headerLabel="Designation"
        subHeaderLabel="Add Your Designation Details"
        isButton={true}
        handleClick={handleSave}
      />

      <div className="mx-10 flex flex-col gap-4">
        <BasicInformation
          onChange={(data) =>
            setFinalData((prev) => ({ ...prev, basicInfo: data }))
          }
          onValidate={(isValid) =>
            setFormValidity((prev) => ({ ...prev, basicInfo: isValid }))
          }
        />
      </div>
    </div>
  );
};

export default Add;
