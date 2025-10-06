import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import FormikInput from '../../../../components/input/FormikInput';
import SubCardHeader from '../../../../components/header/SubCardHeader';

// Validation schema and initial values
export const DeviceConfig = () => {
  return {
    initialValues: {
      deviceCategory: 'accessControllerDevice',
      deviceInfo: {
        name: '',
        serialNo: '',
        verifyCode: '',
        userName: '',
        password: '',
        streamSecretKey: ''
      },
      timeZone: {
        id: '169',
        applyToDevice: '1'
      },
      importToArea: {
        areaId: '557676e521184926b5bd42ff81a08288',
        enable: 1
      }
    },
    validationSchema: {
      'deviceInfo.name': Yup.string().required('Device name is required'),
      'deviceInfo.serialNo': Yup.string().required(' serial number is required'),
      'deviceInfo.verifyCode': Yup.string().required(' verification code is required'),
      'timeZone.id': Yup.string().required('Time zone is required'),
      'importToArea.areaId': Yup.string().required('Area ID is required')
    },
  };
};

const BasicForm = ({ isEditAvailable }) => {
  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormikContext();
  const { user } = useSelector((state) => state?.user);
  
  // Mock data for time zones (would come from API in real app)
  const [timeZones, setTimeZones] = useState([
    { id: '169', name: 'UTC-+05:30 India(Mumbai,Chennai,Kolkatta,Delhi)' },
  ]);
  
  // Mock data for areas (would come from API in real app)
  const [areas, setAreas] = useState([
    { id: '557676e521184926b5bd42ff81a08288', name: 'Main Entrance' },
    { id: '657676e521184926b5bd42ff81a08289', name: 'Back Gate' },
    { id: '757676e521184926b5bd42ff81a08290', name: 'Parking Area' },
  ]);

  useEffect(() => {
    // In a real app, you would fetch time zones and areas here
    // dispatch(fetchTimeZonesAction());
    // dispatch(fetchAreasAction());
  }, [dispatch]);

  return (
    <div className="w-full">
      <Form>
        {/* Device Information Section */}
        <div className="p-2 mb-2">
          <SubCardHeader headerLabel={"Device Information"} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            <FormikInput
              name="deviceInfo.name"
              size="sm"
              label={"Device Name"}
              inputType={isEditAvailable ? "edit" : "input"}
              editValue={values?.deviceInfo?.name}
              placeholder="Enter device name"
            />
            
            <FormikInput
              name="deviceInfo.SerialNo"
              size="sm"
              label={" Serial Number"}
              inputType={isEditAvailable ? "edit" : "input"}
              editValue={values?.deviceInfo?.SerialNo}
              placeholder="Enter serial number"
            />
            
            <FormikInput
              name="deviceInfo.VerifyCode"
              size="sm"
              label={" Verification Code"}
              inputType={isEditAvailable ? "edit" : "input"}
              editValue={values?.deviceInfo?.VerifyCode}
              placeholder="Enter verification code"
            />
            
            <FormikInput
              name="deviceInfo.userName"
              size="sm"
              label={"Username "}
              inputType={isEditAvailable ? "edit" : "input"}
              editValue={values?.deviceInfo?.userName}
              placeholder="Enter username"
            />
            
            <FormikInput
              name="deviceInfo.password"
              size="sm"
              type="input"
              label={"Password "}
              inputType={isEditAvailable ? "edit" : "input"}
              editValue={values?.deviceInfo?.password}
              placeholder="Enter password"
            />
            
            <FormikInput
              name="deviceInfo.streamSecretKey"
              size="sm"
              label={"Stream Secret Key "}
              inputType={isEditAvailable ? "edit" : "input"}
              editValue={values?.deviceInfo?.streamSecretKey}
              placeholder="Enter stream secret key"
            />
          </div>
        </div>
        
        {/* Time Zone Configuration Section */}
        <div className="p-2 mb-2">
          <SubCardHeader headerLabel={"Time Zone Configuration"} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            <FormikInput
              name="timeZone.id"
              size="sm"
              label={"Time Zone"}
              inputType={isEditAvailable ? "edit" : "dropdown"}
              listData={timeZones}
              inputName={`Select Time Zone`}
              feildName={'name'}
              hideLabel={true}
              showTip={false}
              showSerch={true}
              handleClick={(selected) => {
                setFieldValue('timeZone.id', selected?.id);
              }}
              selectedOption={values?.timeZone?.id}
              selectedOptionDependency={"id"}
              editValue={
                timeZones?.filter((d) => d.id === values?.timeZone?.id)[0]?.name
              }
            />
            
            <div className="flex items-center mt-6">
              <FormikInput
                name="timeZone.applyToDevice"
                size="sm"
                label={"Apply Time Zone to Device"}
                inputType="checkbox"
                handleClick={(checked) => {
                  setFieldValue('timeZone.applyToDevice', checked ? '1' : '0');
                }}
                checked={values?.timeZone?.applyToDevice === '1'}
              />
            </div>
          </div>
        </div>
        
        {/* Area Import Settings Section */}
        <div className="p-2 mb-2">
          <SubCardHeader headerLabel={"Area Import Settings"} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            <FormikInput
              name="importToArea.areaId"
              size="sm"
              label={"Area"}
              inputType={isEditAvailable ? "edit" : "dropdown"}
              listData={areas}
              inputName={`Select Area`}
              feildName={'name'}
              hideLabel={true}
              showTip={false}
              showSerch={true}
              handleClick={(selected) => {
                setFieldValue('importToArea.areaId', selected?.id);
              }}
              selectedOption={values?.importToArea?.areaId}
              selectedOptionDependency={"id"}
              editValue={
                areas?.filter((d) => d.id === values?.importToArea?.areaId)[0]?.name
              }
            />
            
            <div className="flex items-center mt-6">
              <FormikInput
                name="importToArea.enable"
                size="sm"
                label={"Enable Area Import"}
                inputType="checkbox"
                handleClick={(checked) => {
                  setFieldValue('importToArea.enable', checked ? 1 : 0);
                }}
                checked={values?.importToArea?.enable === 1}
              />
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default BasicForm;