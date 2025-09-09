import React, { useEffect, useState } from 'react';
import { Typography, Input, Textarea } from '@material-tailwind/react';
import SingleSelectDropdown from '../SingleSelectDropdown/SingleSelectDropdown';
import MultiSelectDropdown from '../MultiSelectDropdown/MultiSelectDropdown';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const CustomField = ({ field, handleChange, shouldValidate }) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const [eyeOpen,setEyeOpen]=useState(false)
  const validateField = (value) => {
    if (field.required && !value) {
      return `${field.label || 'This field'} is required`;
    }
    return '';
  };

  useEffect(() => {
    if (shouldValidate || touched) {
      setError(validateField(field.value));
    }
  }, [field.value, field.required, shouldValidate, touched]);

  const handleInputChange = (value) => {
    handleChange(field.key, value);
    if (!touched) setTouched(true);
    setError(validateField(value));
  };

  const handleBlur = () => {
    if (!touched) setTouched(true);
    setError(validateField(field.value));
  };

  const renderError = () =>
    error && (touched || shouldValidate) && (
      <Typography className="text-red-500 text-xs mt-1">{error}</Typography>
    );

  // console.log(field?.data,field?.valueFeild, 'custom field');

  return (
    <div className="mb-2">
      {field.input === 'textarea' && (
        <>
          <Textarea
            variant="outlined"
            required={field.required}
            value={field.value}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleBlur}
           size='lg'
            className={`!border h-full ${
              error ? '!border-red-500' : '!border-gray-300'
            } bg-white text-gray-900 focus:!border-gray-900 focus:ring-gray-900/10  rounded-md`}
            labelProps={{ className: 'hidden' }}
          />
          {renderError()}
        </>
      )}

      {field.input === 'input' && (
        <>
          <Input
            variant="outlined"
            required={field.required}
            value={field.value}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleBlur}
            size='md'
            type={field.type}
            className={`!border ${
              error ? '!border-red-500' : '!border-gray-300'
            } bg-white text-gray-900 focus:!border-gray-900 focus:ring-gray-900/10 rounded-md`}
            labelProps={{ className: 'hidden' }}
          />
          {renderError()}
        </>
      )}
      {field.input === 'color' && (
        <>
          <Input
            variant="outlined"
            required={field.required}
            value={field.value}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleBlur}
            type={'color'}
            className={`!border ${
              error ? '!border-red-500' : '!border-gray-300'
            } bg-white text-gray-900 focus:!border-gray-900 focus:ring-gray-900/10 rounded-md`}
            labelProps={{ className: 'hidden' }}
          />
          {renderError()}
        </>
      )}

      {field.input === 'dropdown' && (
        <>
          <SingleSelectDropdown
            inputName={`Select ${field?.label}`}
            feildName={field?.labelFeild}
            listData={field?.data}
            hideLabel={true}
            showTip={false}
            showSerch={true}
           disabled={field?.disabled || false}
            handleClick={(selected) => {
              const value = selected[field?.valueFeild];
              handleChange(field?.key, value);
              if (!touched) setTouched(true);
              setError(validateField(value));
            }}
            selectedOption={field.value}
            selectedOptionDependency={field.valueFeild}
          />
          {renderError()}
        </>
      )}

      {field.input === 'multidropdown' && (
         <>
          <SingleSelectDropdown
            inputName={`Select ${field?.label}`}
            feildName={field?.labelFeild}
            listData={field?.data}
            hideLabel={true}
            showTip={false}
            showSerch={true}
           
            handleClick={(selected) => {
              const value = selected[field?.valueFeild];
              handleChange(field?.key, value);
              if (!touched) setTouched(true);
              setError(validateField(value));
            }}
            selectedOption={field.value}
            selectedOptionDependency={field.valueFeild}
          />
          {renderError()}
        </>
      )
      }
 {field.input === 'date' && (
        <>
          <Input
            variant="outlined"
            required={field.required}
            value={field.value}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleBlur}
            type={'date'}
            className={`!border ${
              error ? '!border-red-500' : '!border-gray-300'
            } bg-white text-gray-900 focus:!border-gray-900 focus:ring-gray-900/10 rounded-md`}
            labelProps={{ className: 'hidden' }}
          />
          {renderError()}
        </>
      )}
       {field.input === 'time' && (
        <>
          <Input
            variant="outlined"
            required={field.required}
            value={field.value}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleBlur}
            type={'time'}
            className={`!border ${
              error ? '!border-red-500' : '!border-gray-300'
            } bg-white text-gray-900 focus:!border-gray-900 focus:ring-gray-900/10 rounded-md`}
            labelProps={{ className: 'hidden' }}
          />
          {renderError()}
        </>
      )}

      {field.input === 'password' && (
        <>
          <Input
            variant="outlined"
            required={field.required}
            value={field.value}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleBlur}
            type={eyeOpen ? 'text' : 'password'}
            className={`!border ${error ? '!border-red-500' : '!border-gray-300'
              } bg-white text-gray-900 focus:!border-gray-900 focus:ring-gray-900/10 rounded-md`}
            labelProps={{ className: 'hidden' }}
            icon={
              eyeOpen ? <FaEye onClick={() => { setEyeOpen(!eyeOpen) }} /> : <FaEyeSlash onClick={() => { setEyeOpen(!eyeOpen) }} />
            }

          />
          {renderError()}
        </>
      )}
      
    </div>
  );
};

export default CustomField;
