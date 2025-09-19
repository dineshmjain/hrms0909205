import React, { useEffect } from 'react';
import { Formik } from 'formik';
import Header from '../../components/header/Header';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DepartmentCreateAction } from '../../redux/Action/Department/DepartmentAction';
import BasicInformation, { BasicPriceConfig } from './BasicInformation/BasicInformation';
import * as Yup from 'yup'

const Add = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Use config exported from BasicFormation
  const { initialValues, validationSchema } = BasicPriceConfig();

  const handleSubmit = async (values) => {
    try {
      const result = await dispatch(DepartmentCreateAction({ ...values }));

      if (result?.meta?.requestStatus === "fulfilled") {
        navigate("/department"); // redirect after success
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col w-full pb-4 bg-white border border-gray-100 rounded-md shadow-hrms overflow-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ handleSubmit }) => (
          <>
            <Header
              isBackHandler={true}
              headerLabel={"Add Price Configuration"}
              subHeaderLabel={"Configure role-based pricing"}
              handleClick={handleSubmit}
            />

            {/* 🔽 Render the UI from BasicFormation */}
            <BasicInformation />
          </>
        )}
      </Formik>
    </div>
  );
};

export default Add;
