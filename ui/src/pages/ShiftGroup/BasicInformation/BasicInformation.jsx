import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import FormikInput from '../../../components/Input/FormikInput';

import { SubOrgListAction } from '../../../redux/Action/SubOrgAction/SubOrgAction';
import { BranchGetAction } from '../../../redux/Action/Branch/BranchAction';
import { DepartmentGetAssignedAction } from '../../../redux/Action/Department/DepartmentAction';
import { DesignationGetAssignedAction } from '../../../redux/Action/Designation/DesignationAction';
import { RoleGetAction } from '../../../redux/Action/Roles/RoleAction';
import { EmployeeOfficialDetailsAction } from '../../../redux/Action/Employee/EmployeeAction';

import { days, patterns } from '../../../constants/Constants';
import moment from 'moment';

export const BasicConfig = () => {
    return {
        initialValues: {
           name:'',
           type:'',
           startDate:'',
           endDate:'',
          //  startDay:'',
           subOrgId:''

        },
      validationSchema: {
        name: Yup.string().required('Name is required'),
        type: Yup.string().required('Pattern is required'),
        startDate: Yup.string().required('Start Date is required'),
        endDate: Yup.string().required('End Date is required'),
        // startDay: Yup.string().required('Start Day is required'),
      
        // startTime: Yup.string().required('Shift Start Time is required'),
        // endTime: Yup.string().required('Shift End Time is required'),
        // bgColor: Yup.string().required('Shift BG Color is required '),
        // textColor: Yup.string().required('Shift Text Color is required '),
      },
    };
};

const BasicInformation = ({ isEditAvailable }) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { values, setFieldValue } = useFormikContext();

 
  return (
    <div className="w-full p-2">
      <Form>
        <div className="flex flex-col lg:flex-row justify-between py-2 gap-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
            <FormikInput
              name="name"
              size="sm"
              label="Shift Group Name"
              inputType={isEditAvailable ? 'edit' : 'input'}
              type="input"
            />

            <FormikInput
              name="type"
              size="sm"
              label="Pattern Type"
              inputType={isEditAvailable ? 'edit' : 'dropdown'}
              listData={patterns}
              feildName="value"
              showSerch={true}
              handleClick={(selected) => setFieldValue('type', selected?.id)}
              selectedOption={values?.type}
          
              selectedOptionDependency="id"
            />

            <FormikInput
              name="startDate"
              size="sm"
              label="Start Date"
              inputType={isEditAvailable ? 'edit' : 'input'}
              type="date"
            />

            <FormikInput
              name="endDate"
              size="sm"
              label="End Date"
              inputType={isEditAvailable ? 'edit' : 'input'}
              type="date"
            />

            {/* <FormikInput
              name="startDay"
              size="sm"
              label="Start Day"
              inputType={isEditAvailable ? 'edit' : 'dropdown'}
              listData={days}
              feildName="value"
              showSerch={true}
              handleClick={(selected) => setFieldValue('startDay', selected?.key)}
              selectedOption={values?.startDay}
              editValue={days?.find((d) => d.key === values.startDay)?.value}
              selectedOptionDependency="key"
            /> */}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default BasicInformation;
