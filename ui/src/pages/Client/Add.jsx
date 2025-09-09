import React from 'react';
import BasicInformation, { BasicConfig } from './BasicInformation/BasicInformation';
import Header from '../../components/header/Header';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { clientCreateAction } from '../../redux/Action/Client/ClientAction';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const BasicCon = BasicConfig();

  const initialValues = {
    ...BasicCon.initialValues,
  };

  const validationSchema = Yup.object({
    ...BasicCon.validationSchema,
  });


  const handleSubmit = async (values) => {
    try {
      const result = await dispatch(clientCreateAction({ ...values }));
      console.log(result?.meta?.requestStatus === "fulfilled");

      if (result?.meta?.requestStatus === "fulfilled") {


        navigate("/client"); // ← Change this to your target route

      }
    }
    catch (error) {
      console.log(error)
    }

  };
  const navigate = useNavigate()
  const dispatch = useDispatch()
  return (
    <div className="flex flex-col w-full min-h-[70vh] bg-white border border-gray-100 rounded-md shadow-hrms overflow-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            {/* ✅ Pass Formik handleSubmit to Header */}
            <Header
              isBackHandler={true}
              headerLabel={"Add Client Organization"}
              subHeaderLabel={"Add Your Client Organization Details"}
              handleClick={handleSubmit}
              handleBack={() => {
                navigate("../");
              }}
            />

            <div className="md:ml-[3rem] flex-col">
              <div className="pb-2 flex-col border-gray-200">
                <Form>
                  <BasicInformation />
                </Form>
              </div>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};

export default Add;
