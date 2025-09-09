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

import Header from "../../../components/header/Header";
import {
  EmployeeDetailsByTypeAction,
  EmployeeOfficialDetailsAction,
} from "../../../redux/Action/Employee/EmployeeAction";
import AddressNew from "../../../components/Address/AddressNew";
import SubCardHeader from "../../../components/header/SubCardHeader";
import { Checkbox, Typography } from "@material-tailwind/react";
import { EmployeeAddressCreateAction } from "../../../redux/Action/Employee/EmployeeAction";

const AddressForm = ({
  isEditAvaliable,
  isPermanentSame,
  setisPermanentSame,
}) => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const emp = useSelector((state) => state?.employeee);
  const [tab, setTab] = useState("Official");
  const [params, setParams] = useSearchParams({ tab: "Official" });
  const { employeeOfficial } = useSelector((state) => state?.employee);

  // console.log(employeeOfficial, 'fm')
  const employeeDetails = {};
  const nav = useNavigate();

  const handleTabClick = (targetTab) => {
    setParams({ tab: targetTab });
    nav(`/user/edit?tab=${targetTab}`, { state });
  };

  const { values, setFieldValue } = useFormikContext();

  return (
    <div className="flex flex-col w-full min-h-screen bg-white rounded-md overflow-auto">
      <Form>
        <SubCardHeader headerLabel={"Present Address"} />
        <AddressNew
          isEditAvaliable={isEditAvaliable}
          prefix={"presentAddress"}
          isCitySearchWithTimezone={false}
              isMap={true}
              isRadius={false}
        />
        <div className="flex-col gap-4">
          <Typography className="text-gray-900 text-sm font-medium">
            Is Permanant Address same as Registered Address ?
          </Typography>
          <div>
            <Checkbox
              type="radio"
              disabled={isEditAvaliable}
              checked={values.isPermanentSame === true}
              label="Yes"
              onClick={() => setFieldValue("isPermanentSame", true)}
            />
            <Checkbox
              type="radio"
              disabled={isEditAvaliable}
              checked={values.isPermanentSame === false}
              label="No"
              onClick={() => setFieldValue("isPermanentSame", false)}
            />
          </div>
        </div>
        {!values.isPermanentSame && (
          <>
            <SubCardHeader headerLabel={"Permanent Address"} />
            <AddressNew
              isEditAvaliable={isEditAvaliable}
              isCitySearchWithTimezone={false}
              isMap={true}
              isRadius={false}
              prefix={"permanantAddress"}
            />
          </>
        )}
      </Form>
    </div>
  );
};

export default AddressForm;
