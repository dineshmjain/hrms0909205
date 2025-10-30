import React, { useState, useRef } from "react";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import Header from "../../components/header/Header";
import TabSection from "../../components/TabSection/TabSection";
import BasicInformationEdit, {
  BasicConfig,
} from "./BasicInformation/BasicInformationEdit";
import Official from "./Official/Official";
import Address from "./Address/Address";
import Password from "./Password/Password";

import { removeEmptyStrings } from "../../constants/reusableFun";
import { EmployeeEditAction } from "../../redux/Action/Employee/EmployeeAction";
import { EmployeeDetailsByTypeAction } from "../../redux/Action/Employee/EmployeeAction";
import { useEffect } from "react";
import AccessManagement from "./AccessManagement/AccessManagement";

const Edit = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [params, setParams] = useSearchParams({ tab: "Official" });
  const tab = params.get("tab") || "Official";

  const [isEditAvailable, setIsEditAvailable] = useState(true);
  const { employeePersonalDetails } = useSelector((state) => state.employee);
  // Create refs for each section
  const officialRef = useRef(null);
  const addressRef = useRef(null);
  const passwordRef = useRef(null);
  const accessManagementRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const BasicCon = BasicConfig();

  const initialValues = {
    ...BasicCon.initialValues,
  };

  const validationSchema = Yup.object({
    ...BasicCon.validationSchema,
  });
  const handleTabClick = (targetTab) => {
    setParams({ tab: targetTab });
    navigate(`/user/edit?tab=${targetTab}`, { state: location.state });
  };

  // ADD THIS NEW useEffect AFTER handleTabClick
  useEffect(() => {
    const refs = {
      Official: officialRef,
      Address: addressRef,
      Password: passwordRef,
      AccessMangement: accessManagementRef,
    };

    const targetRef = refs[tab];

    if (targetRef?.current && scrollContainerRef?.current) {
      setTimeout(() => {
        const container = scrollContainerRef.current;
        const element = targetRef.current;

        // Calculate scroll position
        const containerTop = container.getBoundingClientRect().top;
        const elementTop = element.getBoundingClientRect().top;
        const scrollTop = container.scrollTop;
        const offset = elementTop - containerTop + scrollTop - 20;

        // Smooth scroll
        container.scrollTo({
          top: offset,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [tab]);

  const handleSubmit = async (values) => {
    try {
      console.log("Received values:", values);

      const userPayload = removeEmptyStrings({
        name: {
          firstName: values?.firstName,
          lastName: values?.lastName,
        },
        profileImage: values?.profileImage,
        email: values?.email,
        dateOfBirth: values?.dateOfBirth,
        id: values?.id,

        bloodGroup: values?.bloodGroup,
        gender: values?.gender,
        guardianNumber: values?.guardianNumber,
        emergencyNumber: values?.emergencyNumber,
        guardianName: values?.guardianName,
      });

      const result = await dispatch(EmployeeEditAction(userPayload));
      if (result?.meta?.requestStatus === "fulfilled") {
        setIsEditAvailable(!isEditAvailable);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };
  useEffect(() => {
    if (tab === "Official" && location.state?._id) {
      dispatch(
        EmployeeDetailsByTypeAction({
          type: "personal",
          body: { id: location.state._id },
        })
      );
    }
    if (tab === "Address" && location.state?._id) {
      dispatch(
        EmployeeDetailsByTypeAction({
          type: "address",
          body: { id: location.state._id },
        })
      );
    }
  }, [tab, location.state?._id, dispatch]);
  return (
    <div className="flex flex-col w-full h-screen bg-white border border-gray-100 rounded-md">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ submitForm, errors }) => {
          console.log(errors);
          return (
            <>
              <Header
                isBackHandler
                headerLabel="Employee"
                subHeaderLabel="Edit Employee Details"
                handleClick={submitForm}
                isEditAvaliable={isEditAvailable}
                isButton
                handleEdit={() => setIsEditAvailable((prev) => !prev)}
                handleBack={() => {
                  navigate("../");
                }}
              />
              <div className="mx-10 flex flex-col gap-4 py-4">
                <div className="border-gray-300 pb-2">
                  <Form>
                    <BasicInformationEdit isEditAvailable={isEditAvailable} />
                  </Form>
                </div>
              </div>
            </>
          );
        }}
      </Formik>

      <TabSection
        tabs={["Official", "Address", "Password", "AccessMangement"]}
        selectedTab={tab}
        handleTabClick={handleTabClick}
        scrollContainerRef={scrollContainerRef} // Pass the ref to TabSection
      >
        <div className="flex-1 min-h-0 p-2 w-full flex flex-col gap-6">
          {/* Official Section */}
          <div ref={officialRef} id="Official" className="pt-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Official Information
            </h3>
            <Official />
          </div>

          {/* Address Section */}
          <div ref={addressRef} id="Address">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Address
            </h3>
            <Address />
          </div>

          {/* Password Section */}
          <div ref={passwordRef} id="Password">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Password
            </h3>
            <Password />
          </div>

          {/* Access Management Section */}
          <div ref={accessManagementRef} id="AccessMangement">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Access Management
            </h3>
            <AccessManagement />
          </div>
        </div>
      </TabSection>
    </div>
  );
};

export default Edit;
