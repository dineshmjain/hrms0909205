import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import TemplateInfoForm from "../Salary/Template/components/TemplateInfoForm";
import ComponentsForm from "../Salary/Template/components/ComponentsForm";
import ActiveComponentsList from "../Salary/Template/components/ActiveComponentsList";

import {
  SalaryComponentsGetAction,
  SalaryTemplateCreateAction,
} from "../../redux/Action/Salary/SalaryAction";
import { toTitleCase } from "../../constants/reusableFun";
import { specialBases } from "../../constants/Constants";

const initialValues = {
  templateName: "Default Template",
  description: "Default salary template.",
  componentName: "",
  componentType: "",
  valueType: "",
  componentValue: "",
  percentageOf: [],
};

const validationSchema = Yup.object({
  templateName: Yup.string().required("Template Name is required"),
  description: Yup.string().required("Description is required"),
});

const DefaultSalaryTemplate = () => {
  const [addedComponents, setAddedComponents] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: componentNames, loading } = useSelector(
    (state) => state.salary.all
  );
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(
      SalaryComponentsGetAction({
        page: 1,
        limit: 100,
        category: "all",
        isActive: true,
      })
    );
  }, [dispatch]);

  const formattedComponents = useMemo(() => {
    if (!componentNames || !Array.isArray(componentNames)) return [];
    return componentNames.map((c) => ({
      ...c,
      name: toTitleCase(c.name),
    }));
  }, [componentNames]);

  const percentageOptions = useMemo(() => {
    const dbComponents = (componentNames || []).map((c) => ({
      _id: c._id,
      name: toTitleCase(c.name),
      type: "component",
    }));

    const specials = specialBases.map((s) => ({
      _id: `special:${s._id}`,
      name: s.name,
      type: "special",
    }));

    return [...specials, ...dbComponents];
  }, [componentNames]);

  const handleSubmit = (values, { resetForm }) => {
    const payload = {
      templateName: values.templateName,
      description: values.description,
      components: addedComponents.map((c) => {
        const percentageOf = (c.percentageOf || []).map((id) => {
          if (id.startsWith("special:")) {
            return { type: "special", value: id.replace("special:", "") };
          }
          return { type: "component", value: id };
        });

        return {
          componentName: c.componentName,
          valueType: c.valueType,
          componentValue: c.componentValue,
          percentageOf,
        };
      }),
      userId: user?._id,
      orgDetails: { _id: user?.orgId },
    };

    dispatch(SalaryTemplateCreateAction(payload));
    resetForm();
    setAddedComponents([]);
  };

  return (
    <div className="flex flex-col w-full p-4 flex-1 bg-white">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ values, setFieldValue, submitForm }) => (
          <>
            {/* Title + Subtitle + Save Button */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Salary Settings</h1>
                <p className="text-sm text-gray-500">
                  Configure your organization’s default salary template and components
                </p>
              </div>

              <button
                type="button"
                className="px-6 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                onClick={submitForm}   // 👈 call Formik submit directly
              >
                Save Settings
              </button>
            </div>

            <Form>
              <TemplateInfoForm />

              <ComponentsForm
                values={values}
                setFieldValue={setFieldValue}
                setAddedComponents={setAddedComponents}
                componentNames={formattedComponents}
                percentageOptions={percentageOptions}
                loading={loading}
              />

              <ActiveComponentsList
                addedComponents={addedComponents}
                setAddedComponents={setAddedComponents}
                componentNames={formattedComponents}
              />
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default DefaultSalaryTemplate;
