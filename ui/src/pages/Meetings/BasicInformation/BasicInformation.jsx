import React, { useEffect, useState } from 'react';
import { Typography } from '@material-tailwind/react';
import { useDispatch, useSelector } from 'react-redux';
import CustomField from '../../../components/Input/CustomFeild';
import { getTypeOfIndustyAction } from '../../../redux/Action/Global/GlobalAction';
import moment from 'moment';

const BasicInformation = ({ onChange, onValidate }) => {
  const dispatch = useDispatch();
  const { typeOfIndustries } = useSelector((state) => state?.global);
  const status=[{id:1,name:'intrested'},{id:2,name:'Hold'},{id:3,name:'Rejected'}]

  const [basicData, setBasicData] = useState([
    {
     key:"leadId",
      label: 'Lead',
      value: '',
      type: 'text',
      input: 'dropdown',
      required: true,
      labelFeild: 'name',
      valueFeild: 'name',
      data: [],
    },
     {
     key:"status",
      label: 'Meeting Status',
      value: '',
      type: 'text',
      input:"textarea",
      input: 'dropdown',
      required: true,
      labelFeild: 'name',
      valueFeild: 'name',
      data: status,
    },{
     key:"summary",
      label: 'Meeting Summary',
      value: '',
      type: 'text',
      input:"textarea"
    },
    {
     key:"date",
      label: 'Follow up Date',
      value: moment().format('YYYY-MM-DD'),
      type: 'date',
      input:"date"
    },
    {
     key:"time",
      label: 'Follow up Date',
      value: moment().format('HH:mm'),
      type: 'time',
      input:"time"
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
          field.key === 'leadId'
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
console.log(basicData,'f')
  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
  {basicData.map((field) => {
    // Get current status value
    const statusField = basicData.find((f) => f.key === 'status');
    const statusValue = statusField?.value;

    // Conditionally skip rendering date/time fields if status is not 'intrested'
    if (
      (field.key === 'date' || field.key === 'time') &&
      statusValue !== 'intrested'
    ) {
      return null;
    }

    return (
      <div
        key={field.key}
        className={`flex flex-col ${field.key !== 'textarea' ? 'min-w-[180px]' : 'w-[280px]'}`}
      >
        <Typography className="text-gray-700 text-[12px] mb-1 font-medium">
          {field.label}
        </Typography>
        <div className={`flex flex-col ${field.key !== 'textarea' ? 'w-[220px]' : 'w-full'} mr-2`}>
          <CustomField field={field} handleChange={handleChange} />
        </div>
      </div>
    );
  })}
</div>


  );
};

export default BasicInformation;
