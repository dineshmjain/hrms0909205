import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import Header from "../../../components/header/Header";
import TemplateInfoForm from "./components/TemplateInfoForm";
import ComponentsForm from "./components/ComponentsForm";
import ActiveComponentsList from "./components/ActiveComponentsList";

import { SalaryComponentsGetAction, SalaryTemplateCreateAction } from "../../../redux/Action/Salary/SalaryAction";
import { toTitleCase } from "../../../constants/reusableFun";
import { specialBases } from "../../../constants/Constants";
import { useNavigate } from "react-router-dom";

const initialValues = {
  templateName: "",
  description: "",
  componentName: "",
  valueType: "",
  componentValue: "",
  percentageOf: [],
};

const validationSchema = Yup.object({
  templateName: Yup.string().required("Template Name is required"),
  description: Yup.string().required("Description is required"),
});

const CreateTemplate = () => {
  const [addedComponents, setAddedComponents] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  // redux salary components (all)
  const { list: componentNames, loading } = useSelector(
    (state) => state.salary.all
  );

  const { user } = useSelector((state) => state.user); // 👈 assuming user state exists

  // fetch components list
  useEffect(() => {
    dispatch(SalaryComponentsGetAction({ page: 1, limit: 100, category: "all", isActive: true }));
  }, [dispatch]);

  // format names
  const formattedComponents = useMemo(() => {
    if (!componentNames || !Array.isArray(componentNames)) return [];
    return componentNames.map((c) => ({
      ...c,
      name: toTitleCase(c.name),
    }));
  }, [componentNames]);

  // options for percentageOf (special + components)
  const percentageOptions = useMemo(() => {
      const dbComponents = (componentNames || []).map((c) => ({
        _id: c._id,
        name: toTitleCase(c.name),
        type: "component",
      }));

      const specials = specialBases.map((s) => ({
        _id: `special:${s._id}`,   // 👈 prefix here
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
    navigate('/salaryTemplate/list')
  };


  return (
    <div className="flex flex-col w-full p-4 flex-1 bg-white border border-gray-100 rounded-md shadow-hrms">
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
              buttonTitle="Save Template"
            />

            <div className="md:ml-[3.5rem] flex-col">
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
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};

export default CreateTemplate;
