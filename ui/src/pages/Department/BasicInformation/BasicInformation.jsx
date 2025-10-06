import React, { useEffect, useState } from 'react';
import { Typography } from '@material-tailwind/react';
import { useDispatch } from 'react-redux';
import CustomField from '../../../components/input/CustomFeild';
import SubCardHeader from '../../../components/header/SubCardHeader';

const BasicInformation = ({ onChange, onValidate ,isEditAvaliable=false,state={}}) => {
  const dispatch = useDispatch();
console.log(state,isEditAvaliable,'inde')
  const [basicData, setBasicData] =useState([
    {
      key: 'name',
      label: 'Name',
      value: state?.name ||'',
      type: 'text',
      input: 'input',
      required: true,
    }
  ])


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
    validate(updatedData);
  };

  return (
    <div className="w-full p-2">
  <SubCardHeader headerLabel={"Basic Details"} />



  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-4">
        {basicData.map((field) => (
            <div key={field.key} className="flex flex-col">
             <Typography className="text-gray-700 text-[14px] mb-1 font-medium">
              {field.label}
            </Typography>
            {isEditAvaliable? (
               <Typography className="text-[#000] text-[14px]">
                {field.value || '--'}
              </Typography>
            ) : (
              <CustomField field={field} handleChange={handleChange} />
            )}
            {/* {errors[field.key] && (
              <Typography color="red" className="text-xs mt-1">
                {errors[field.key]}
              </Typography>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicInformation;
