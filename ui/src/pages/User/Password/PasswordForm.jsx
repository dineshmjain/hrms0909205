import React from "react";
import { Form, useFormikContext } from "formik";
import FormikInput from "../../../components/Input/FormikInput";

const PasswordForm = ({ isEditAvailable }) => {
  return (
    <Form>
      <div className="w-full p-2">
        <div className="flex flex-col lg:flex-row justify-between py-2 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 flex-1 flex-wrap gap-4">
            <FormikInput
              name="newPassword"
              size="sm"
              label="New Password"
              inputType={isEditAvailable ? "edit" : "input"}
              type="password"
              hideLabel
            />

            <FormikInput
              name="confirmPassword"
              size="sm"
              label="Confirm Password"
              inputType={isEditAvailable ? "edit" : "input"}
              type="password"
              hideLabel
            />
          </div>
        </div>
      </div>
    </Form>
  );
};

export default PasswordForm;
