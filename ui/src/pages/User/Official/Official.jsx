// import { Formik, Form, useFormikContext } from "formik";
// import React, { useEffect, useState } from "react";

// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
// // import { EmployeeDetailsByTypeAction, EmployeeEditAction } from '../../redux/Action/Employee/EmployeeAction';
// import {
//   useLocation,
//   useNavigate,
//   useParams,
//   useSearchParams,
// } from "react-router-dom";
// import OfficialForm from "./OfficalForm";
// import Header from "../../../components/header/Header";
// import {
//   EmployeeDetailsByTypeAction,
//   EmployeeOfficialDetailsAction,
//   EmployeeOfficialEditAction,
// } from "../../../redux/Action/Employee/EmployeeAction";
// import { removeEmptyStrings } from "../../../constants/reusableFun";
// import { EmployeeOfficailDetailsEdit } from "../../../apis/Employee/Employee";
// import { ShiftGetAction } from "../../../redux/Action/Shift/ShiftAction";
// import * as Yup from "yup";
// const Official = () => {
//   const { state } = useLocation();
//   const dispatch = useDispatch();
//   const emp = useSelector((state) => state?.employeee);
//   const [tab, setTab] = useState("Official");
//   const [params, setParams] = useSearchParams({ tab: "Official" });
//   const { employeeOfficial } = useSelector((state) => state?.employee);

//   console.log(employeeOfficial, "fm");
//   const employeeDetails = {};
//   const nav = useNavigate();

//   const initialValues = {
//     firstName: "",
//     lastName: "",
//     email: "",
//     branchId: "",
//     departmentId: "",
//     designationId: "",
//     roleId: "",
//     subOrgId: "",
//     joinDate: "",
//     workTimingType: "",
//     shiftIds: [],
//   };
//   const handleTabClick = (targetTab) => {
//     setParams({ tab: targetTab });
//     nav(`/user/edit?tab=${targetTab}`, { state });
//   };

//   const handleSubmit = async (values) => {
//     try {
//       console.log(values, "recived for edit");

//       const userPayload = removeEmptyStrings({
//         branchId: [values?.branchId],
//         departmentId: values?.departmentId,
//         designationId: values?.designationId,
//         roleId: values?.roleId,
//         id: values?.id,
//         subOrgId: values?.subOrgId,
//         joinDate: values?.joinDate,
//       });
//       console.log("Payload sent to backend:", userPayload);
//       const result = await dispatch(
//         EmployeeOfficialEditAction({ ...userPayload })
//       );

//       console.log("result", "edit syc");
//       setIsEditAvaliable(!isEditAvaliable);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const [isEditAvaliable, setIsEditAvaliable] = useState(true);

//   return (
//     <div className="flex flex-col gap-4 w-full pb-4 flex-1 bg-white border border-gray-100 rounded-md p-2 overflow-auto">
//       <Formik initialValues={initialValues} onSubmit={handleSubmit}>
//         {({ submitForm }) => (
//           <>
//             <Header
//               isBackHandler={false}
//               headerLabel="Offical"
//               subHeaderLabel="Add/Edit  User Official Details"
//               handleClick={submitForm}
//               isEditAvaliable={isEditAvaliable}
//               isButton={true}
//               handleEdit={() => {
//                 setIsEditAvaliable(!isEditAvaliable);
//               }}
//             />
//             <Form>
//               <OfficialForm isEditAvailable={isEditAvaliable} />
//             </Form>
//           </>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default Official;
import { Formik, Form, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import * as Yup from "yup";

import OfficialForm from "./OfficalForm";
import Header from "../../../components/header/Header";
import {
  EmployeeDetailsByTypeAction,
  EmployeeOfficialDetailsAction,
  EmployeeOfficialEditAction,
} from "../../../redux/Action/Employee/EmployeeAction";
import { ShiftGetAction } from "../../../redux/Action/Shift/ShiftAction";
import { removeEmptyStrings } from "../../../constants/reusableFun";

const Official = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [tab, setTab] = useState("Official");
  const [params, setParams] = useSearchParams({ tab: "Official" });
  const [isEditAvaliable, setIsEditAvaliable] = useState(true);

  const emp = useSelector((state) => state?.employeee);
  const { employeeOfficial } = useSelector((state) => state?.employee);

  console.log(employeeOfficial, "fm");

  // Initial values for the form
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    branchId: "",
    departmentId: "",
    designationId: "",
    roleId: "",
    subOrgId: "",
    joinDate: "",
    workTimingType: "",
    shiftIds: [],
    employeeId: "",
  };

  // Fetch employee details on mount
  useEffect(() => {
    if (state?._id) {
      dispatch(EmployeeOfficialDetailsAction({ id: state._id }));
    }
  }, [dispatch, state?._id]);

  // Fetch shifts when component mounts or when employee data is loaded
  useEffect(() => {
    // Fetch all shifts initially
    dispatch(ShiftGetAction());
  }, [dispatch]);

  // Optionally fetch branch-specific shifts when branch is selected
  useEffect(() => {
    if (employeeOfficial?.branchId?.[0]) {
      dispatch(ShiftGetAction({ branchId: employeeOfficial.branchId[0] }));
    }
  }, [dispatch, employeeOfficial?.branchId]);

  const handleTabClick = (targetTab) => {
    setParams({ tab: targetTab });
    nav(`/user/edit?tab=${targetTab}`, { state });
  };

  const handleSubmit = async (values) => {
    try {
      console.log(values, "received for edit");

      const userPayload = removeEmptyStrings({
        branchId: [values?.branchId],
        departmentId: values?.departmentId,
        designationId: values?.designationId,
        roleId: values?.roleId,
        id: values?.id,
        subOrgId: values?.subOrgId,
        joinDate: values?.joinDate,
        workTimingType: values?.workTimingType,
        shiftIds: values?.shiftIds || [],
        // employeeId: values?.employeeId,
      });

      console.log("Payload sent to backend:", userPayload);
      const result = await dispatch(
        EmployeeOfficialEditAction({ ...userPayload })
      );

      console.log("result", "edit sync");
      setIsEditAvaliable(!isEditAvaliable);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ submitForm, values }) => (
        <>
          {/* <Header
            handleClick={() => {
              if (!isEditAvaliable) {
                submitForm();
              } else {
                setIsEditAvaliable(!isEditAvaliable);
              }
            }}
            buttonText={isEditAvaliable ? "Edit" : "Save"}
          /> */}
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
          <OfficialForm isEditAvailable={isEditAvaliable} />
        </>
      )}
    </Formik>
  );
};

export default Official;
