import React, { useEffect, useState } from 'react';
import { Typography } from '@material-tailwind/react';
import { useDispatch, useSelector } from 'react-redux';
import CustomField from '../../../components/input/CustomFeild';
import { getTypeOfIndustyAction } from '../../../redux/Action/Global/GlobalAction';
import { SubOrgListAction } from '../../../redux/Action/SubOrgAction/SubOrgAction';
import SubCardHeader from '../../../components/header/SubCardHeader';

const BasicInformation = ({ onChange, onValidate,data,isEdit=false }) => {
  const dispatch = useDispatch();
  const { subOrgs } = useSelector((state) => state?.subOrgs);
const {user} =useSelector((state)=>state?.user)
console.log(user?.modules['suborganization'],'=================================+++++++++++++++++++++++++===basic Info')
  const [basicData, setBasicData] = useState( [
    {
      key: 'name',
      label: 'Name',
      value: data?.name ||'',
      type: 'text',
      input: 'input',
      required: true,
    },
    user?.modules?.['suborganization']?.r==true &&
    {
      key: 'subOrgId',
      label: 'Sub Organization',
      value: data?.subOrgId ||'',
      type: 'text',
      input: 'dropdown',
      required: true,
      data:subOrgs,
      labelFeild:'name',
      valueFeild:'_id'
    }
  ].filter(Boolean));

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(SubOrgListAction());
  }, [dispatch,]);

  useEffect(() => {
  if (subOrgs?.length) {
    setBasicData((prevData) =>
      prevData.map((field) =>
        field.key === 'subOrgId'
          ? {
              ...field,
              data:
                !field.data || field.data.length === 0
                  ? subOrgs
                  : field.data, // use existing if present
            }
          : field
      )
    );
  }
}, [subOrgs]);


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
    <div className="w-full p-2">
  <SubCardHeader headerLabel={"Basic Details"} />


    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-4">
        {basicData.map((field) => (
            <div key={field.key} className="flex flex-col">
             <Typography className="text-gray-700 text-[14px] mb-1 font-medium">
              {field.label}
            </Typography>
            {isEdit ? (
                 <Typography> { field?.key==='subOrgId'? subOrgs?.filter((d)=>d?._id===data?.subOrgId)[0]?.name: field?.value }</Typography>
              
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
