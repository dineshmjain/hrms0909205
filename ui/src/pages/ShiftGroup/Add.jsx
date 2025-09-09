import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/header/Header';
import SubCardHeader from '../../components/header/SubCardHeader';

// import BasicInformation, { BasicConfig } from './BasicInformation/BasicInformation';
// import AddressNew, { AddressCon } from '../../components/Address/AddressNew';
// import { BranchCreateAction } from '../../redux/Action/Branch/BranchAction';
import { useSelector } from 'react-redux';
import BasicInformation, { BasicConfig } from './BasicInformation/BasicInformation';
import OfficialInformation from './OfficailInformation/OfficialInformation';
import { ShiftGetAction } from '../../redux/Action/Shift/ShiftAction';
import Weekly, { WeeklyConfig } from './Weekly/Weekly';
import WeekDayWise from './WeekDayWise/WeekDayWise';
import Custom from './Custom/Custom'
import { Typography } from '@material-tailwind/react';
// import { removeEmptyStrings } from '../../constants/reusableFun';


const Add = ({ onComplete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [weeklyPayload, setWeeklyPayload] = useState(null);

  const BasicCon = BasicConfig();
  const weekConfig = WeeklyConfig()

  const user = useSelector((state) => state?.user)
  console.log(user, 'd')
  const { shiftList } = useSelector((state) => state?.shift)
  const [Json, setJson] = useState({})
  // ✅ Load configs
  // const BasicCon = BasicConfig();
  // const AddressConf = AddressCon();

  // ✅ Combine initial values
  const initialValues = {
    ...BasicCon.initialValues,
    ...weekConfig.initialValues
    // ...AddressConf.initialValues
  };

  // ✅ Combine Yup schemas correctly using shape() and fields
  const validationSchema = Yup.object({
    ...BasicCon.validationSchema,
    ...weekConfig.validationSchema
    //  ...AddressConf.validationSchema
  });

  const submitForm1 = async (values) => {
    try {
      console.log('full', values)
    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="flex flex-col w-full min-h-screen bg-white border border-gray-100 rounded-md shadow-hrms overflow-auto">

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={() => {
          console.log("hi")
        }}
        validateOnMount
      >
        {({ submitForm, values }) => (
          <>
            <Header
              isBackHandler={true}
               isButton={false}
              headerLabel="Add Shift Patterns"
              subHeaderLabel="Create Your Shift Patterns"
              handleClick={() => {
                // submitForm()
                submitForm1(values)
              }}
            />
            <Form>
              {/* <div className="ml-[3rem] flex-col">
                <BasicInformation />
                <OfficialInformation />
              </div> */}
              <div className="ml-[3rem] flex-col rounded-xl mb-4">
                {/* {values?.type == 1 && */}
                <div>
                  <Weekly />
                </div>
                {/* // } */}
                {values?.type == 2 && <div>
                  <WeekDayWise />
                </div>}
                {values?.type == 3 && <div>
                  "M"
                </div>}
                {values?.type == 4 && <div>
                  "M W"
                </div>}
                {values?.type == 5 && <div>
                  <Custom />
                </div>}

              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>

  );
};

export default Add;
