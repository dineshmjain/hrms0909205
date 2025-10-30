import React from 'react';
import moment from 'moment';
import BasicInformation, { BasicConfig } from './BasicInformation/BasicInformation';
import Header from '../../components/header/Header';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { clientCreateAction } from '../../redux/Action/Client/ClientAction';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShiftCreateAction } from '../../redux/Action/Shift/ShiftAction';
import toast from 'react-hot-toast';
import { removeEmptyStrings } from '../../constants/reusableFun';


const Add = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const BasicCon = BasicConfig();

  const [selectedBranch, setSelectedBranch] = React.useState([]);

  const initialValues = {
    ...BasicCon.initialValues,
  };

  const validationSchema = Yup.object({
    ...BasicCon.validationSchema,
  });

function validateShift({
  startTime,
  endTime,
  minIn,
  maxIn,
  minOut,
  maxOut,
}) {
  const errors = [];

  function parseTime(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date;
  }

    let start, end, minInTime, maxInTime, minOutTime, maxOutTime;

  try {
    if (!startTime || !endTime) {
      errors.push("startTime and endTime are required.");
      return errors;
    }

    start = parseTime(startTime);
    end = parseTime(endTime);

  // Optional fields: parse only if provided (use computed values)
  if (minIn) minInTime = parseTime(minIn);
  if (maxIn) maxInTime = parseTime(maxIn);
  if (minOut) minOutTime = parseTime(minOut);
  if (maxOut) maxOutTime = parseTime(maxOut);
  } catch (e) {
    errors.push("Invalid time format. Use 'HH:mm'.");
    return errors;
  }

  // Handle overnight shift
  if (end <= start) {
    end.setDate(end.getDate() + 1);
  }
  if (minInTime && maxInTime && maxInTime < minInTime) {
    maxInTime.setDate(maxInTime.getDate() + 1);
  }
  if (minOutTime && maxOutTime && maxOutTime < minOutTime) {
    maxOutTime.setDate(maxOutTime.getDate() + 1);
  }

  // Core validations
  if(start==end){
    errors.push("Start Time and End Time cannot be the same.");
  }
  if (start < new Date(0, 0, 0, 0, 0) || end < new Date(0, 0, 0, 0, 0)) {
    errors.push("Start Time and End Time must be valid times.");
  } 
  if (start >= end) errors.push("Start Time must be before End Time (or valid overnight shift).");

  return errors;
}

  const handleSubmit = async (formData) => {
    console.log(formData.branchIds,"sdsdsdsds");
    try {
      const payload = { ...formData };
      const start = formData.startTime;
      const end = formData.endTime;
      const maxInMinutes = parseInt(formData.maxIn || 0, 10);
      const minOutMinutes = parseInt(formData.minOut || 0, 10);

      if (start && !isNaN(maxInMinutes)) {
        payload.maxIn = moment(start, 'HH:mm').add(maxInMinutes, 'minutes').format('HH:mm');
        payload.minIn = moment(start, 'HH:mm').subtract(maxInMinutes, 'minutes').format('HH:mm');
      }

      if (end && !isNaN(minOutMinutes)) {
        payload.minOut = moment(end, 'HH:mm').subtract(minOutMinutes, 'minutes').format('HH:mm');
        payload.maxOut = moment(end, 'HH:mm').add(minOutMinutes, 'minutes').format('HH:mm');
      }
      console.log('Form submitted:', payload);
      const cleanedData = removeEmptyStrings(payload);
      // Dispatch the create action
      const result = await dispatch(ShiftCreateAction(cleanedData));

      if (!result || !result.meta) {
        throw new Error('Unexpected response from dispatch.');
      }

      const { meta, payload: resPayload } = result;

      // Handle result
      if (meta.requestStatus === 'fulfilled') {
        toast.success(resPayload?.message || 'Shift created successfully!');
        navigate(-1);
      } else {
        toast.error(resPayload?.message || 'Failed to create Shift.');
      }
    } catch (error) {
      console.error('Error creating Shift:', error);
      toast.error('An error occurred while creating the Shift.');
    }
  };

  return (
    <div className="flex flex-col w-full pb-4 bg-white border border-gray-100 rounded-md shadow-hrms overflow-auto">
     <Formik
             initialValues={initialValues}
             validationSchema={validationSchema}
             onSubmit={handleSubmit}
             validateOnMount
           >
        {({ submitForm,values, setFieldValue,errors }) => {
          console.log(errors)
          return(
          <>
            {/* ✅ Pass Formik handleSubmit to Header */}
            <Header
              isBackHandler={true}
              headerLabel={"Shift"}
              subHeaderLabel={"Add Your Shift Details"}
              handleClick={submitForm}
            />

            <div className="md:ml-[3rem] flex-col">
              <div className="pb-2 border-b-2 flex-col border-gray-200">
                <Form>
                  <BasicInformation
                    selectedBranch={selectedBranch}
                    setSelectedBranch={setSelectedBranch}
                    type='add'
                  />
                </Form>
              </div>
            </div>
          </>
        )}}
      </Formik>
    </div>
  );
};

export default Add;
