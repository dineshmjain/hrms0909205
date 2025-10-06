import { Formik, Form } from "formik";
import * as Yup from "yup";
import Header from "../../../components/header/Header";
import ComponentInfoForm from "./components/ComponentInfoForm"; 
import { SalaryComponentCreateAction } from "../../../redux/Action/Salary/SalaryAction";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// initial form values
const initialValues = {
  name: "",
  category: "",
};

// validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Component Name is required"),
  category: Yup.string().required("Category is required"),
});

const AddComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const result = await dispatch(SalaryComponentCreateAction(values));

            if (result.meta.requestStatus === "fulfilled") {
                resetForm();
                navigate("/salarySettings");
            }
        } catch (error) {
            console.error("Error creating component:", error);
        }
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
              headerLabel="Add Component"
              subHeaderLabel="Create a new Salary Component"
              handleClick={submitForm}
              buttonTitle="Save"
              isButton={true}
            />

            <div className="md:ml-[3.5rem] flex-col">
              <Form>
                {/* Custom form component */}
                <ComponentInfoForm
                  values={values}
                  setFieldValue={setFieldValue}
                />
              </Form>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};

export default AddComponent;
