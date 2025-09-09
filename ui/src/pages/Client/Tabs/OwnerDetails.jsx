import { Formik, Form } from "formik";
import React, { useState } from "react";
import OwnerDetailsForm, {
  OwnerConfig,
} from "../OwnerDetails/OwnerDetailsForm";
import * as Yup from "yup";
import Header from "../../../components/header/Header";
import {
  clientOwnerCreateAction,
  clientOwnerEditAction,
} from "../../../redux/Action/Client/ClientAction";
import { useDispatch } from "react-redux";
import { removeEmptyStrings } from "../../../constants/reusableFun";

const OwnerDetails = () => {
  const [isEditAvailable, setIsEditAvailable] = useState(true);
  const dispatch = useDispatch();
  const BasicCon = OwnerConfig();
  const [submitting, setSubmitting] = useState(false);
  // Combine initial values and validation schema
  const initialValues = {
    ...BasicCon.initialValues,
  };

  const validationSchema = Yup.object({
    ...BasicCon.validationSchema,
  });

  const handleUpdate = async (values) => {
    if (submitting) return; // Prevent double dispatch
    setSubmitting(true);
    console.log(values?.isEdit, "edit");
    try {
      const responseData = removeEmptyStrings({
        name: { firstName: values?.firstName, lastName: values?.lastName },
        mobile: values?.mobile?.toString(),
        clientId: values?.clientId,
        _id: values?._id,
      });
      console.log(responseData);

      const response = await dispatch(clientOwnerEditAction(responseData));
      const { meta, payload } = response || {};
      console.log(
        meta,
        meta.requestStatus == "fulfilled",
        "ddddddddddddddddddddddddddddddddddddddddddd"
      );

      if (meta.requestStatus == "fulfilled") {
        setIsEditAvailable(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleEdit = (values) => {
    setIsEditAvailable((prev) => !prev);
    console.log(values);
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleUpdate}
        validateOnMount
      >
        {({ submitForm }) => (
          <Form>
            <Header
              headerLabel="Owner Details"
              subHeaderLabel="Manage Owner Details"
              handleClick={submitForm}
              handleEdit={toggleEdit}
              isEditAvaliable={isEditAvailable}
              isButton={true}
            />

            <OwnerDetailsForm isEditAvaliable={isEditAvailable} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OwnerDetails;
