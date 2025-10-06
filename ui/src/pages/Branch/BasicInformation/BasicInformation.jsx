// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import * as Yup from 'yup';
// import FormikInput from '../../../components/input/FormikInput';
// import SubCardHeader from '../../../components/header/SubCardHeader';
// import { getTypeOfIndustyAction } from '../../../redux/Action/Global/GlobalAction';
// import { useFormikContext } from 'formik';
// import { useNavigate } from 'react-router-dom';
// import { SubOrgListAction } from '../../../redux/Action/SubOrgAction/SubOrgAction';

// // ✅ Exporting field config for Formik in parent
// export const BasicConfig = () => {

//   return {
//     initialValues: {
//       name: '',
//       subOrgId: ''
//     },
//     validationSchema: {
//       name: Yup.string().required('Branch  Name is required'),
//       subOrgId: Yup.string().required('SubOrg Type is required'),

//     },
//   };
// };

// // ✅ React component
// const BasicInformation = () => {
//   const dispatch = useDispatch();

//   const { subOrgs } = useSelector((state) => state?.subOrgs);
//   const { user } = useSelector((state) => state?.user)
//   const { values, setFieldValue } = useFormikContext();
//   console.log(user?.modules['suborganization'].r, 'basic Info')

//   useEffect(() => {
//     dispatch(SubOrgListAction());
//   }, [dispatch,]);

//   return (
//     <div className="w-full p-2">
//       <SubCardHeader headerLabel={"Basic Details"} />

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//         <FormikInput name="name" size="sm" label={"Name"} inputType="input" />
//        {user?.modules['suborganization'].r  &&<FormikInput
//           name="subOrgId"
//           size="sm"
//           label={"Client Organization Type"}
//           inputType="dropdown"
//           listData={subOrgs}

//           inputName={`Select Type`}
//           feildName={'name'}

//           hideLabel={true}
//           showTip={false}
//           showSerch={true}
//           handleClick={(selected) => {

//             setFieldValue('subOrgId', selected?._id)
//           }}
//           selectedOption={values?.subOrgId}
//           selectedOptionDependency={"_id"}

//         />
// }
//       </div>
//     </div>
//   );
// };

// export default BasicInformation;

// KYCInformationForm.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, useFormikContext } from "formik";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";
import FormikInput from "../../../components/input/FormikInput";
import { SubOrgListAction } from "../../../redux/Action/SubOrgAction/SubOrgAction";
import { useCheckEnabledModule } from "../../../hooks/useCheckEnabledModule";
export const BasicConfig = () => {
  return {
    initialValues: {
      name: "",
      subOrgId: "",
    },
    validationSchema: {
      name: Yup.string().required("Branch  Name is required"),
      subOrgId: Yup.string().required("SubOrg Type is required"),
    },
  };
};
const BasicInformation = ({ isEditAvaliable, isClient }) => {
  const dispatch = useDispatch();
  const { state, search } = useLocation();
  const checkModule = useCheckEnabledModule();
  const { values, setFieldValue } = useFormikContext(); // ✅ Now it's safe
  const { subOrgs, loaded, loading } = useSelector((state) => state.subOrgs);
  const { user } = useSelector((state) => state?.user);
  const { branchkycDetails } = useSelector((state) => state?.branch);

  useEffect(() => {
    // dispatch(SubOrgListAction());
    if (state) {
      setFieldValue("name", state?.name);
      if (user?.modules?.["suborganization"]?.r) {
        setFieldValue("subOrgId", state?.subOrgId);
      }
    }
  }, [dispatch]);
  useEffect(() => {
    if(user?.modules?.["suborganization"]?.r)
    {
    dispatch(SubOrgListAction());
    }
  }, [dispatch]);
  return (
    <div className="w-full">
      <Form>
        <div className="p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <FormikInput
              name="name"
              size="sm"
              label={"Name"}
              inputType={isEditAvaliable ? "edit" : "input"}
              editValue={values?.name}
            />
            {!isClient && checkModule("suborganization", "r") && (
              <FormikInput
                name="subOrgId"
                size="sm"
                label={"Organization"}
                inputType={isEditAvaliable ? "edit" : "dropdown"}
                listData={subOrgs}
                inputName={`Select Organization`}
                feildName={"name"}
                hideLabel={true}
                showTip={false}
                showSerch={true}
                handleClick={(selected) => {
                  setFieldValue("subOrgId", selected?._id);
                }}
                selectedOption={values?.subOrgId}
                selectedOptionDependency={"_id"}
                editValue={
                  subOrgs?.filter((d) => d._id == values?.subOrgId)[0]?.name
                }
              />
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default BasicInformation;
