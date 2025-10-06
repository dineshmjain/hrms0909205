import React, { useEffect, useState } from 'react';
import { Typography } from '@material-tailwind/react';
import { useDispatch, useSelector } from 'react-redux';
import CustomField from '../../../components/input/CustomFeild';

const OwnersDetails = ({ onChange, onValidate }) => {

  const [basicData, setBasicData] = useState([

    {
     key:"firstName",
      label: ' Incharge/Owner First Name',
      value: '',
      type: 'text',
      input: 'input',
      required: true,
    
    },
    {
     key:"lastName",
      label: ' Incharge/Owner Last Name',
     value: '',
      type: 'text',
      input: 'input',
      required: true,
  
    },
      {
     key:"mobile",
      label: 'Incharge/Owner Mobile Number',
     value: '',
      type: 'text',
      input: 'input',
      required: true,
   
    },
    {
     key:"email",
      label: 'Incharge/Owner Email',
 value: '',
      type: 'text',
      input: 'input',
      required: true,
    },
  ]);

  const [errors, setErrors] = useState({});



  const validate = (data) => {
    const newErrors = {};
    data.forEach((field) => {
      if (field.required && !field.value?.toString().trim()) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    onValidate && onValidate(Object.keys(newErrors).length === 0);
  };

  const handleChange = (key, newValue) => {
    const updatedData = basicData.map((field) =>
      field.key === key ? { ...field, value: newValue } : field
    );
    setBasicData(updatedData);
    onChange(updatedData);
    validate(updatedData); // Only validates required fields
  };

  return (
    <div className="w-full">
      <Typography className="text-gray-600 text-md text-[14px] font-semibold">
        Owner Details
      </Typography>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {basicData.map((field) => (
          <div key={field.key} className="flex flex-col min-w-[180px]">
             <Typography className="text-gray-700 text-[14px] mb-1 font-medium">
              {field.label}
            </Typography>
            <div className="flex flex-col w-[220px] mr-2">
              <CustomField field={field} handleChange={handleChange} />
              {/* {field.required && errors[field.key] && (
                <span className="text-red-500 text-xs mt-1">
                  {errors[field.key]}
                </span>
              )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnersDetails;
