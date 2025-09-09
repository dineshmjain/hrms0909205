import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useLocation } from "react-router-dom";

import Header from "../../../components/header/Header";
import PasswordForm from "./PasswordForm";
import { EmployeeUpdatePasswordAction } from "../../../redux/Action/Employee/EmployeeAction";

const Password = () => {
  const dispatch = useDispatch();
  const { state } = useLocation(); // optional if you're passing something via navigation
  const { user } = useSelector((state) => state?.user); // your actual user reducer
  // const userId = user?._id || "";
console.log("state",state,"statestatestatestatestatestatestate")

const userId = state?._id
  const [isEditAvailable, setIsEditAvailable] = useState(false);

  const initialValues = {
    id: userId,
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Required"),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const { id, newPassword: password } = values;
console.log({ id, password })
    dispatch(EmployeeUpdatePasswordAction({ id, password }))
      .unwrap()
      .then((res) => {
        console.log("Password update success:", res);
        setIsEditAvailable(false);
        resetForm();
      })
      .catch((err) => {
        console.error("Password update failed:", err);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div>
      {userId && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ submitForm }) => (
            <>
              <Header
                isBackHandler={false}
                headerLabel="Change Password"
                subHeaderLabel="Update Password"
                handleClick={submitForm}
                isEditAvaliable={isEditAvailable}
                isButton={true}
                handleEdit={() => setIsEditAvailable(!isEditAvailable)}
              />
              <Form>
                <PasswordForm isEditAvailable={isEditAvailable} />
              </Form>
            </>
          )}
        </Formik>
      )}
    </div>
  );
};

export default Password;
