import React, { useState } from "react";
import BasicInformation, {
  BasicConfig,
} from "./BasicInformation/BasicInformation";
import Header from "../../components/header/Header";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { clientCreateAction } from "../../redux/Action/Client/ClientAction";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShiftCreateAction,
  ShiftUpdateAction,
} from "../../redux/Action/Shift/ShiftAction";
import toast from "react-hot-toast";
import { removeEmptyStrings } from "../../constants/reusableFun";

const Edit = () => {
  // const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const BasicCon = BasicConfig();
  const [isEdit, setIsEdit] = useState(true);
  const initialValues = {
    ...BasicCon.initialValues,
  };

  const validationSchema = Yup.object({
    ...BasicCon.validationSchema,
  });

  function validateShift({ startTime, endTime, minIn, maxIn, minOut, maxOut }) {
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

      // Optional fields: parse only if provided
      if (minIn) minInTime = parseTime(minIn);
      if (maxIn) maxInTime = parseTime(maxIn);
      if (minOut) minOutTime = parseTime(minOut);
      if (maxOut) maxOutTime = parseTime(maxOut);
    } catch (errors) {
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
    if (start == end) {
      errors.push("Start Time and End Time cannot be the same.");
    }
    if (start < new Date(0, 0, 0, 0, 0) || end < new Date(0, 0, 0, 0, 0)) {
      errors.push("Start Time and End Time must be valid times.");
    }
    if (
      minInTime &&
      maxInTime &&
      (minInTime < new Date(0, 0, 0, 0, 0) ||
        maxInTime < new Date(0, 0, 0, 0, 0))
    ) {
      errors.push("Grace Min-In and Grace Max In must be valid times.");
    }
    if (
      minOutTime &&
      maxOutTime &&
      (minOutTime < new Date(0, 0, 0, 0, 0) ||
        maxOutTime < new Date(0, 0, 0, 0, 0))
    ) {
      errors.push("Grace Min Out and Grace Max Out must be valid times.");
    }
    if (start >= end)
      errors.push(
        "Start Time must be before End Time (or valid overnight shift)."
      );

    // Conditional validations based on presence
    if (minInTime && maxInTime) {
      if (minInTime > maxInTime) {
        errors.push("Grace Min-In must be before or equal to Grace Max-In.");
      }
      if (start < minInTime) {
        errors.push("Grace Min-In Cannot Be Greater Than Start Time");
      }
      if (start > maxInTime) {
        errors.push("Grace Max In Cannot Be Lesser Than Start Time");
      }
    }

    if (minOutTime && maxOutTime) {
      if (minOutTime > maxOutTime) {
        errors.push("Grace Min-Out must be before or equal to Grace Max Out.");
      }
      if (end < minOutTime) {
        errors.push("Grace Min Out Cannot Be Greater Than End Time");
      }
      if (end > maxOutTime) {
        errors.push("Grace Max Out Cannot Be Lesser Than End Time");
      }
    }

    // Overlap check (only if both ranges present)
    if (maxInTime && minOutTime && maxInTime > minOutTime) {
      errors.push("Grace Max In Cannot Be Greater Than Grace Min Out");
    }

    return errors;
  }

  const handleSubmit = async (formData) => {
    try {
      console.log('Form submitted:', formData);
      const validationErrors = validateShift(formData); // If using time validation
      if (validationErrors?.length > 0) {
        validationErrors.forEach((err) => toast.error(err));
        return;
      }
      // Clean the form data
      // const cleanedData = removeEmptyStrings(formData);
      const {_id,orgId,createDate,createdBy,modifiedBy,modifiedDate,actualIdx,selectedFilterType,...rest}=formData
      const result = await dispatch(ShiftUpdateAction(removeEmptyStrings(rest)));
      const { meta, payload } = result || {};
      console.log(meta, payload, "te");
      if (meta?.requestStatus === "fulfilled") {
        // toast.success(payload?.message || 'Shift created successfully!');
        navigate(-1);
      } else {
        // toast.error(payload?.message || 'Failed to create Shift.');
      }
    } catch (error) {
      console.error("Error creating Shift:", error);
      toast.error("An error occurred while creating the Shift.");
    }
  };
  const handleEdit = () => {
    setIsEdit(!isEdit);
  };

  return (
    <div className="flex flex-col w-full pb-4 bg-white border border-gray-100 rounded-md overflow-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ submitForm, values }) => (
          <>
            {/* ✅ Pass Formik handleSubmit to Header */}
            <Header
              buttonTitle="Save"
              isBackHandler
              isEditAvaliable={isEdit}
              isButton
              handleClick={submitForm}
              handleEdit={handleEdit}
              headerLabel="Shift"
              subHeaderLabel="Edit Your Shift Details"
            />

            <div className="md:ml-[3rem] flex-col">
              <div className="pb-2 border-b-2 flex-col border-gray-200">
                <Form>
                  <BasicInformation isEdit={isEdit} type="edit" />
                </Form>
              </div>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};

export default Edit;
