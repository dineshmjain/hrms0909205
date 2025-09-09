import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikInput from "../../../components/Input/FormikInput";
import SubCardHeader from "../../../components/header/SubCardHeader";
import { getTypeOfIndustyAction } from "../../../redux/Action/Global/GlobalAction";
import { useFormikContext } from "formik";
import { useLocation, useNavigate } from "react-router-dom";

// ✅ Exporting field config for Formik in parent
export const BasicConfig = () => {
  return {
    initialValues: {
      name: "",
      orgTypeId: "",
    },
    validationSchema: {
      name: Yup.string().required("Client Organization Name is required"),
      orgTypeId: Yup.string().required("Client Business Type is required"),
    },
  };
};

// ✅ React component
const BasicInformation = ({ isEditAvaliable = false }) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  // ✅ Use Redux state correctly
  const { typeOfIndustries = [] } = useSelector((state) => state.global);
  const { values, setFieldValue } = useFormikContext();

  // ✅ Fetch dropdown data
  useEffect(() => {
    dispatch(getTypeOfIndustyAction());
  }, [dispatch]);
  useEffect(() => {
    if (state) {
      console.log(state, "d");
      setFieldValue("name", state?.name);
      setFieldValue("orgTypeId", state?.orgTypeId);
      setFieldValue("clientId", state?.clientId || '');
    }
  }, [state]);

  return (
    <div className="w-full p-2">
      <SubCardHeader headerLabel={"Basic Details"} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <FormikInput
          name="name"
          size="sm"
          label={"Name"}
          inputType={isEditAvaliable ? "edit" : "input"}
          editValue={values?.name}
        />
        <FormikInput
          name="type"
          size="sm"
          label={"Client Business Type"}
          inputType={isEditAvaliable ? "edit" : "dropdown"}
          listData={typeOfIndustries}
          inputName={`Select Type`}
          feildName={"name"}
          hideLabel={true}
          showTip={false}
          showSerch={true}
          handleClick={(selected) => {
            setFieldValue("orgTypeId", selected?._id);
          }}
          selectedOption={values?.orgTypeId}
          selectedOptionDependency={"_id"}
          editValue={
            typeOfIndustries?.filter((d) => d._id == values?.orgTypeId)?.[0]
              ?.name
          }
        />
      </div>
    </div>
  );
};

export default BasicInformation;
