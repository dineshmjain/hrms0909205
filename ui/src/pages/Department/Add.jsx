import React, { useEffect } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Header from '../../components/header/Header';
import FormikInput from '../../components/input/FormikInput';
import { useDispatch, useSelector } from 'react-redux';
import { getTypeOfIndustyAction } from '../../redux/Action/Global/GlobalAction';
import { SubOrgCreateAction } from '../../redux/Action/SubOrgAction/SubOrgAction';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DepartmentCreateAction } from '../../redux/Action/Department/DepartmentAction';

const Add = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate()
  const initialValues = {
    name: '',
   
  };
  const validationSchema = Yup.object({
    name: Yup.string().required('Department Name is required'),
  
  });

  const { typeOfIndustries = [] } = useSelector((state) => state.global);

  useEffect(() => {
    dispatch(getTypeOfIndustyAction());
  }, [dispatch]);

  const handleSubmit = async (values) => {
    try {
      const result = await dispatch(DepartmentCreateAction({ ...values }));
      console.log(result?.meta?.requestStatus === "fulfilled");

      if (result?.meta?.requestStatus === "fulfilled") {
       
        
          navigate("/department"); // ← Change this to your target route
        
      }
    }
    catch (error) {
      console.log(error)
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
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            <Header
              isBackHandler={true}
              headerLabel={"Add Department"}
              subHeaderLabel={"Add Your Department Details"}
              handleClick={handleSubmit}
            />


            <Form className='ml-12 p-2'>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <FormikInput
                  name="name"
                  size="sm"
                  label={"Name"}
                  inputType="input"
                />

               
              </div>
            </Form>

          </>
        )}
      </Formik>
    </div>
  );
};

export default Add;
