import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";

import Header from "../../../components/header/Header";
import ApplicableToForm from "./components/ApplicableToForm";
import TemplateInfoForm from "./components/TemplateInfoForm";
import ComponentsForm from "./components/ComponentsForm";
import ActiveComponentsList from "./components/ActiveComponentsList";

const initialValues = {
  templateName: "",
  description: "",
  subOrgId: "",
  branchId: "",
  componentName: "",
  componentType: "",
  valueType: "",
  componentValue: "",
};

const validationSchema = Yup.object({
  templateName: Yup.string().required("Template Name is required"),
  description: Yup.string().required("Description is required"),
  subOrgId: Yup.string().required("Organization is required"),
  componentName: Yup.string().required("Component Name is required"),
  componentType: Yup.string().required("Component Type is required"),
  valueType: Yup.string().required("Component Value Type is required"),
  componentValue: Yup.string().required("Component Value is required"),
});

const handleSubmit = (values, { resetForm }) => {
  console.log("Form submitted:", values);
  resetForm();
};

const CreateTemplate = () => {
  const [addedComponents, setAddedComponents] = useState([]);

  return (
    <div className="flex flex-col w-full p-4 flex-1 bg-white border border-gray-100 rounded-md shadow-hrms overflow-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ submitForm, values, setFieldValue }) => (
          <>
            <Header
              isBackHandler={true}
              headerLabel="Create Template"
              subHeaderLabel="Create New Salary Template"
              handleClick={submitForm}
            />

            <div className="md:ml-[3.5rem] flex-col">
              <Form>
                <TemplateInfoForm />
                <ApplicableToForm />
                <ComponentsForm
                  values={values}
                  setFieldValue={setFieldValue}
                  setAddedComponents={setAddedComponents}
                />
                <ActiveComponentsList
                  addedComponents={addedComponents}
                  setAddedComponents={setAddedComponents}
                />
              </Form>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};

export default CreateTemplate;
