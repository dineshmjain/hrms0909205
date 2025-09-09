import { Formik, Form, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
// import { EmployeeDetailsByTypeAction, EmployeeEditAction } from '../../redux/Action/Employee/EmployeeAction';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import * as Yup from "yup";
import Header from "../../../components/header/Header";
import {
  EmployeeDetailsByTypeAction,
  EmployeeOfficialDetailsAction,
} from "../../../redux/Action/Employee/EmployeeAction";
import AddressForm from "./AddressForm";
import { AddressCon } from "../../../components/Address/AddressNew";
import { EmployeeAddressCreateAction } from "../../../redux/Action/Employee/EmployeeAction";
import { removeEmptyStrings } from "../../../constants/reusableFun";

const Address = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const emp = useSelector((state) => state?.employeee);
  const [tab, setTab] = useState("Official");
  const [params, setParams] = useSearchParams({ tab: "Official" });
  const { employeeOfficial } = useSelector((state) => state?.employee);
  // const { employeeDetails } = useSelector((state) => state?.employee);
  const { employeeAddressDetails } = useSelector((state) => state.employee);
  // Use employeeAddressDetails for initialValues in Formik
  const nav = useNavigate();
  const present = AddressCon("presentAddress");
  const permanat = AddressCon("permanantAddress");
  const [isPermanentSame, setisPermanentSame] = useState(false);
  const initialValues = {
    presentAddress: present.initialValues,
    permanantAddress: permanat.initialValues,
    isPermanentSame: false,
  };

  const validationSchema = Yup.object().shape({
    ...present.validationSchema,
    ...(isPermanentSame ? permanat.validationSchema : {}),
  });

  const getUserAddressDetails = async () => {
    try {
      console.log("Calling address list with ID:", state?._id);
      const data = {
        id: state._id,
        type: "address",
      };
      await dispatch(
        EmployeeDetailsByTypeAction({
          type: "address",
          body: { id: state._id }, // or { userId: state._id } if your backend expects userId
        })
      );
      console.log("Request body for EmployeeDetailsByTypeAction:", data);
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  useEffect(() => {
    if (state?._id) {
      getUserAddressDetails();
    }
  }, [dispatch, state?._id]);

  const handleTabClick = (targetTab) => {
    setParams({ tab: targetTab });
    nav(`/user/edit?tab=${targetTab}`, { state });
  };
  //  const handleSubmit = async (values) => {
  //     try {
  //     //   console.log(values, 'recived')

  //     //   const userPayload = removeEmptyStrings({
  //     //     name: {
  //     //       firstName: values?.firstName,
  //     //       lastName: values?.lastName,
  //     //     },

  //     //     id: values?.id

  //     //   })
  //     //   const result = await dispatch(EmployeeEditAction({ ...userPayload }));
  //     //   console.log(result?.meta?.requestStatus === "fulfilled");

  //       setIsEditAvaliable(!isEditAvaliable)
  //     }
  //     catch(error)
  //     {
  //         console.log(error)
  //     }
  // }

  // const handleSubmit = async (values) => {
  //   try {
  //     console.log(values, "=========================== address recived");

  //     //   const userPayload = removeEmptyStrings({
  //     //     name: {
  //     //       firstName: values?.firstName,
  //     //       lastName: values?.lastName,
  //     //     },

  //     //     id: values?.id

  //     //   })
  //     //   const result = await dispatch(EmployeeEditAction({ ...userPayload }));
  //     //   console.log(result?.meta?.requestStatus === "fulfilled");

  //     setIsEditAvaliable(!isEditAvaliable);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleSubmit = async (values) => {
    const payload = {
      isPermanentSame: values.isPermanentSame,
      id: state?._id,
      presentAddress: values.presentAddress.structuredAddress,
      permanentAddress: values.isPermanentSame
        ? values.presentAddress.structuredAddress
        : values.permanantAddress.structuredAddress,
    };

    const result = await dispatch(EmployeeAddressCreateAction(removeEmptyStrings(payload)));
    if (result?.meta?.requestStatus === "fulfilled") {
      await getUserAddressDetails();
      setIsEditAvaliable(false);
    }
  };

  const [isEditAvaliable, setIsEditAvaliable] = useState(true);

  return (
    <div className="flex flex-col w-full min-h-screen bg-white rounded-md overflow-auto p-2">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ submitForm, values, setFieldValue }) => {
          // Set data from API to Formik fields
          useEffect(() => {
            if (employeeAddressDetails.presentAddress) {
              const {
                address = {},
                geoLocation = {},
                geoJson = {},
              } = employeeAddressDetails.presentAddress;
              Object.entries(address).forEach(([key, value]) => {
                setFieldValue(
                  `presentAddress.${key}`,
                  value || geoLocation[key] || ""
                );
              });
              setFieldValue(
                `presentAddress.geoAddress`,
                geoLocation.address || ""
              );
              setFieldValue(`presentAddress.structuredAddress`, {
                address,
                geoLocation,
                geoJson,
              });
            }

            if (employeeAddressDetails.permanentAddress) {
              const {
                address = {},
                geoLocation = {},
                geoJson = {},
              } = employeeAddressDetails.permanentAddress;
              Object.entries(address).forEach(([key, value]) => {
                setFieldValue(
                  `permanantAddress.${key}`,
                  value || geoLocation[key] || ""
                );
              });
              setFieldValue(
                `permanantAddress.geoAddress`,
                geoLocation.address || ""
              );
              setFieldValue(`permanantAddress.structuredAddress`, {
                address,
                geoLocation,
                geoJson,
              });
            }

            // Default checkbox state from API
            setFieldValue(
              "isPermanentSame",
              employeeAddressDetails.isPermanentSame || false
            );
          }, [employeeAddressDetails, setFieldValue]);

          // Sync permanent address with present address if same
          useEffect(() => {
            if (values.isPermanentSame) {
              setFieldValue("permanantAddress", { ...values.presentAddress });
            }
          }, [values.isPermanentSame, values.presentAddress, setFieldValue]);

          return (
            <>
              <Header
                isBackHandler={false}
                headerLabel="Address"
                subHeaderLabel="Add/Edit  User Address Details"
                isEditAvaliable={isEditAvaliable}
                isButton={true}
                handleEdit={() => {
                  setIsEditAvaliable(!isEditAvaliable);
                }}
                handleClick={submitForm}
              />
              <Form>
                <AddressForm
                  isEditAvaliable={isEditAvaliable}
                  
                  // isPermanentSame={isPermanentSame}
                  // setisPermanentSame={setisPermanentSame}
                />
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default Address;
