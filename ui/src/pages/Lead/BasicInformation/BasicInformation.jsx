import React, { useEffect, useState } from 'react';
import { Typography } from '@material-tailwind/react';
import { useDispatch, useSelector } from 'react-redux';
import CustomField from '../../../components/input/CustomFeild';
import { getTypeOfIndustyAction } from '../../../redux/Action/Global/GlobalAction';

const BasicInformation = ({ onChange, onValidate }) => {
  const dispatch = useDispatch();
  const { typeOfIndustries } = useSelector((state) => state?.global);

  const [basicData, setBasicData] = useState([
    {
      key: 'name',
      label: ' Name',
      value: '',
      type: 'text',
      input: 'input',
      required: true,
    },
    {
     key:"orgType",
      label: 'Organization Type',
      value: '',
      type: 'text',
      input: 'dropdown',
      required: true,
      labelFeild: 'name',
      valueFeild: 'name',
      data: [],
    }
  ]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getTypeOfIndustyAction());
  }, [dispatch]);

  useEffect(() => {
    if (typeOfIndustries?.length) {
      setBasicData((prevData) =>
        prevData.map((field) =>
          field.key === 'orgType'
            ? { ...field, data: typeOfIndustries }
            : field
        )
      );
    }
  }, [typeOfIndustries]);

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
       Organization Details
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

export default BasicInformation;
