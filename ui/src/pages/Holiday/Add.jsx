import React, { useState } from 'react';
import BasicInformation, { BasicConfig } from './BasicInformation/BasicInformation';
import Header from '../../components/header/Header';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HolidayCreateAction } from '../../redux/Action/Holiday/holiday';
import toast from 'react-hot-toast';

const Add = () => {
  const BasicCon = BasicConfig();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('myOrg');

  const initialValues = {
    ...BasicCon.initialValues,
  };

  const validationSchema = Yup.object({
    ...BasicCon.validationSchema,
  });

  const handleSubmit = async (values) => {
    try {
      const payload = {
        holidays: [
          {
            name: values.name,
            date: values.date,
            holidayType: values.holidayType,
            description: values.description,
            duration: values.duration,
            subOrgId: values.subOrgId,
            branchIds: values.branchIds,
            clientMappedId: values.clientMappedId,
            clientBranchIds: values.clientBranchIds,
          },
        ],
      };

      const result = await dispatch(HolidayCreateAction(payload));
      if (result?.meta?.requestStatus === 'fulfilled') {
        toast.success(
          result?.payload?.message || "Holiday created successfully!"
        );
        navigate('/holidays');
      }
    } catch (error) {
      console.log('Holiday creation error:', error);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[70vh] bg-white border border-gray-100 rounded-md shadow-hrms overflow-auto">
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
              headerLabel={"Create Holiday"}
              subHeaderLabel={"Add Your Holiday Details"}
              handleClick={handleSubmit}
              handleBack={() => navigate("/holidays")}
            />

            {/* Tab Switching UI */}
            <div className="inline-flex rounded-md overflow-hidden shadow my-4 ml-12 border border-gray-200 w-fit">
              {['myOrg', 'clientOrg'].map((typeValue) => (
                <button
                  key={typeValue}
                  type="button"
                  onClick={() => setFilterType(typeValue)}
                  className={`px-4 py-2 font-medium text-[12px] transition-all duration-150 
                    ${filterType === typeValue ? 'bg-primary text-white' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
                >
                  {typeValue === 'myOrg' ? 'My Organization' : 'Client Organization'}
                </button>
              ))}
            </div>

            {/* Content Based on Tab */}
            <div className="md:ml-[3rem] flex-col">
              <div className="pb-2 flex-col border-gray-200">
                <Form>
                  <BasicInformation filterType={filterType} />
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
