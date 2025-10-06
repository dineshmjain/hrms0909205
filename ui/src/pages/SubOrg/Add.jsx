import React, { useEffect } from 'react';
import { Form, Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import Header from '../../components/header/Header';
import FormikInput from '../../components/input/FormikInput';
import { useDispatch, useSelector } from 'react-redux';
import { getTypeOfIndustyAction } from '../../redux/Action/Global/GlobalAction';
import { SubOrgCreateAction } from '../../redux/Action/SubOrgAction/SubOrgAction';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Add = ({ onComplete }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate()
  const initialValues = {
    name: '',
    orgTypeId: ''
  };
  const { active: isSetupMode } = useSelector((state) => state?.setupMode);
  const validationSchema = Yup.object({
    name: Yup.string().required(' Name is required'),
    orgTypeId: Yup.string().required('Business Type is required')
  });

  const { typeOfIndustries = [] } = useSelector((state) => state.global);

  useEffect(() => {
    dispatch(getTypeOfIndustyAction());
  }, [dispatch]);

  const handleSubmit = async (values) => {
    try {
      console.log(values, "values in sub org add");
      const result = await dispatch(SubOrgCreateAction({ ...values }));
      console.log(result?.meta?.requestStatus === "fulfilled");

      if (result?.meta?.requestStatus === "fulfilled") {
        toast.success(
          result?.payload?.message || "Sub Org created successfully!"
        );
        if (isSetupMode) {
          return onComplete();

        } else {
          navigate("/suborganization"); // ← Change this to your target route
        }
      }
    }
    catch (error) {
      console.log(error)
    }
  };



  const AddForm=()=>{
      const {values,setFieldValue}=useFormikContext()
  useEffect(()=>{
setFieldValue('orgTypeId',typeOfIndustries[0]?._id)
  },[typeOfIndustries])
  return(
     <Form className='ml-12 p-2'>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <FormikInput
                  name="name"
                  size="sm"
                  label={"Name"}
                  inputType="input"
                />

                <FormikInput
                  name="orgTypeId"
                  size="sm"
                  label={"Business Type"}
                  inputType="dropdown"
                  listData={typeOfIndustries}
                  inputName="Select Type"
                  feildName="name"
                  hideLabel={true}
                  showTip={false}
                  showSerch={true}
                  handleClick={(selected) => {
                    setFieldValue('orgTypeId', selected?._id);
                  }}
                  selectedOption={values?.orgTypeId}
                  selectedOptionDependency="_id"
                />
              </div>
            </Form>
  )
}

  return (
    <div className="flex flex-col h-[410px] bg-white border border-gray-100 rounded-md shadow-hrms overflow-auto">
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
              headerLabel={"Organization"}
              subHeaderLabel={"Add Your Organization Details"}
              handleClick={handleSubmit}
            />


           <AddForm/>

          </>
        )}
      </Formik>
    </div>
  );
};



export default Add;
