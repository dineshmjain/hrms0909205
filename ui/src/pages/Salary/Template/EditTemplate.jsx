import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../../components/header/Header";
import TemplateInfoForm from "./components/TemplateInfoForm";
import ComponentsForm from "./components/ComponentsForm";
import ActiveComponentsList from "./components/ActiveComponentsList";

import {
  SalaryComponentsGetAction,
  SalaryTemplateGetOneAction,
  // SalaryTemplateUpdateAction,
} from "../../../redux/Action/Salary/SalaryAction";

import { toTitleCase } from "../../../constants/reusableFun";
import { specialBases } from "../../../constants/Constants";

const validationSchema = Yup.object({
  templateName: Yup.string().required("Template Name is required"),
  description: Yup.string().required("Description is required"),
});

const EditTemplate = () => {
  const { templateId } = useParams();
  const [addedComponents, setAddedComponents] = useState([]);
  const [initialValues, setInitialValues] = useState({
    templateName: "",
    description: "",
    componentName: "",
    valueType: "",
    componentValue: "",
    includeInEPF: false,
    includeInESI: false,
    percentageOf: [],
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: componentNames, loading } = useSelector(
    (state) => state.salary.all
  );

  const { data: templateData, loading: templateLoading } = useSelector(
    (state) => state.salary.template || {}
  );

  const { user } = useSelector((state) => state.user);

  // Fetch all components
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

  // Fetch existing template data
  useEffect(() => {
    if (templateId && user?.orgId) {
      dispatch(
        SalaryTemplateGetOneAction({
          templateId,
          orgDetails: { _id: user.orgId },
        })
      );
    }
  }, [dispatch, templateId, user]);

  // Pre-fill form once template data arrives
  useEffect(() => {
    if (templateData) {
      setInitialValues({
        templateName: templateData.templateName || "",
        description: templateData.description || "",
        componentName: "",
        valueType: "",
        componentValue: "",
        includeInEPF: false,
        includeInESI: false,
        percentageOf: [],
      });

      const formattedComponents = (templateData.components || []).map((c) => ({
        componentName: c.componentName?._id || c.componentName,
        componentType: c.componentName?.category || "earning", // 👈 added this
        valueType: c.valueType,
        componentValue: c.componentValue,
        percentageOf: (c.percentageOf || []).map((p) =>
          p.type === "special" ? `special:${p.value}` : p.value
        ),
      }));

      setAddedComponents(formattedComponents);
    }
  }, [templateData]);

  // Format component names for dropdowns
  const formattedComponents = useMemo(() => {
    if (!componentNames || !Array.isArray(componentNames)) return [];

    const filtered = componentNames.filter(
      (c) =>
        ![
          "employee provident fund (epf)",
          "employee state insurance (esi)",
        ].includes(c.name.toLowerCase().trim())
    );

    return filtered.map((c) => ({
      ...c,
      name: toTitleCase(c.name),
    }));
  }, [componentNames]);

  // Percentage-of options (special + components)
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

  const handleSubmit = (values) => {
    const payload = {
      templateId,
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

    // dispatch(SalaryTemplateUpdateAction(payload));
    navigate("/salaryTemplate/list");
  };

  if (templateLoading) {
    return <div className="p-6 text-gray-500">Loading template data...</div>;
  }

  return (
    <div className="flex flex-col w-full p-4 flex-1 bg-white border border-gray-100 rounded-md shadow-hrms">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ submitForm, values, setFieldValue }) => (
          <>
            <Header
              isBackHandler={true}
              headerLabel="Edit Template"
              subHeaderLabel="Modify Salary Template Details"
              handleClick={submitForm}
              buttonTitle="Update Template"
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
                  componentNames={componentNames}
                />
              </Form>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};

export default EditTemplate;
