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
import OfficialForm from "./OfficalForm";
import Header from "../../../components/header/Header";
import {
  EmployeeDetailsByTypeAction,
  EmployeeOfficialDetailsAction,
  EmployeeOfficialEditAction,
} from "../../../redux/Action/Employee/EmployeeAction";
import { removeEmptyStrings } from "../../../constants/reusableFun";
import { EmployeeOfficailDetailsEdit } from "../../../apis/Employee/Employee";
import * as Yup from "yup";
const Official = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const emp = useSelector((state) => state?.employeee);
  const [tab, setTab] = useState("Official");
  const [params, setParams] = useSearchParams({ tab: "Official" });
  const { employeeOfficial } = useSelector((state) => state?.employee);

  console.log(employeeOfficial, "fm");
  const employeeDetails = {};
  const nav = useNavigate();

  const initialValues = {
    // Define all your form fields here
    firstName: "",
    lastName: "",
    email: "",

    // Add more as needed
  };
  const handleTabClick = (targetTab) => {
    setParams({ tab: targetTab });
    nav(`/user/edit?tab=${targetTab}`, { state });
  };
 
  const handleSubmit = async (values) => {
    try {
      console.log(values, "recived for edit");

      const userPayload = removeEmptyStrings({
        branchId: [values?.branchId],
        departmentId: values?.departmentId,
        designationId: values?.designationId,
        roleId: values?.roleId,
        id: values?.id,
        subOrgId: values?.subOrgId,
        joinDate: values?.joinDate,
      });
      console.log("Payload sent to backend:", userPayload);
      const result = await dispatch(
        EmployeeOfficialEditAction({ ...userPayload })
      );

      console.log("result", "edit syc");
      setIsEditAvaliable(!isEditAvaliable);
    } catch (error) {
      console.log(error);
    }
  };

  const [isEditAvaliable, setIsEditAvaliable] = useState(true);

  return (
    <div className="flex flex-col gap-4 w-full pb-4 flex-1 bg-white border border-gray-100 rounded-md p-2 overflow-auto">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ submitForm }) => (
          <>
            <Header
              isBackHandler={false}
              headerLabel="Offical"
              subHeaderLabel="Add/Edit  User Official Details"
              handleClick={submitForm}
              isEditAvaliable={isEditAvaliable}
              isButton={true}
              handleEdit={() => {
                setIsEditAvaliable(!isEditAvaliable);
              }}
            />
            <Form>
              <OfficialForm isEditAvailable={isEditAvaliable} />
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default Official;
