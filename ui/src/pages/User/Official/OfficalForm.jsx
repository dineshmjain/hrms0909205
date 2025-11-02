// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";
// import { Form, useFormikContext } from "formik";
// import moment from "moment";

// import FormikInput from "../../../components/input/FormikInput";
// import { SubOrgListAction } from "../../../redux/Action/SubOrgAction/SubOrgAction";
// import { BranchGetAction } from "../../../redux/Action/Branch/BranchAction";
// import { DepartmentGetAssignedAction } from "../../../redux/Action/Department/DepartmentAction";
// import { DesignationGetAssignedAction } from "../../../redux/Action/Designation/DesignationAction";
// import { RoleGetAction } from "../../../redux/Action/Roles/RoleAction";
// import { EmployeeOfficialDetailsAction } from "../../../redux/Action/Employee/EmployeeAction";
// import { Avatar, Typography } from "@material-tailwind/react";
// import SingleSelectDropdown from "../../../components/SingleSelectDropdown/SingleSelectDropdown";
// const OfficialForm = ({ isEditAvailable }) => {
//   const shiftList = useSelector((state) => state.shift?.shiftList || []);
//   const dispatch = useDispatch();
//   const { state } = useLocation();
//   const { values, setFieldValue } = useFormikContext();

//   const { user } = useSelector((state) => state?.user);
//   const { subOrgs } = useSelector((state) => state?.subOrgs);
//   const { branchList } = useSelector((state) => state?.branch);
//   const { assignedBranchDepartments } = useSelector(
//     (state) => state?.department
//   );
//   const { designationBranchDepartemnt } = useSelector(
//     (state) => state?.designation
//   );
//   const { rolesList } = useSelector((state) => state?.roles);
//   const { employeeOfficial } = useSelector((state) => state?.employee);

//   const settingOptions = [
//     { label: "Branch Setting", value: "branch" },
//     { label: "Shift Setting", value: "shift" },
//   ];
//   const filteredShifts = values.branchId
//     ? shiftList.filter((shift) => shift.branchId === values.branchId)
//     : [];
//   useEffect(() => {
//     if (state?._id) {
//       dispatch(EmployeeOfficialDetailsAction({ id: state._id }));
//     } else {
//       // New employee → reset form
//       setFieldValue("subOrgId", "");
//       setFieldValue("branchId", "");
//       setFieldValue("departmentId", "");
//       setFieldValue("designationId", "");
//       setFieldValue("joinDate", "");
//       setFieldValue("roleId", "");
//       setFieldValue("id", "");
//     }
//   }, [dispatch, state?._id, setFieldValue]);

//   useEffect(() => {
//     if (employeeOfficial && state?._id) {
//       setFieldValue("roleId", employeeOfficial?.roleId || "");
//       setFieldValue("branchId", employeeOfficial?.branchId?.[0] || "");
//       setFieldValue("subOrgId", employeeOfficial?.subOrgId || "");
//       setFieldValue("departmentId", employeeOfficial?.departmentId || "");
//       setFieldValue("designationId", employeeOfficial?.designationId || "");
//       setFieldValue(
//         "joinDate",
//         employeeOfficial?.joinDate
//           ? moment(employeeOfficial.joinDate).format("YYYY-MM-DD")
//           : ""
//       );
//       setFieldValue("id", state._id);
//     }
//   }, [employeeOfficial, state?._id, setFieldValue]);

//   useEffect(() => {
//     dispatch(RoleGetAction());
//     if (user?.modules?.["suborganization"]?.r) {
//       dispatch(SubOrgListAction());
//     }
//   }, [dispatch, user]);

//   useEffect(() => {
//     if (values?.subOrgId) {
//       dispatch(
//         BranchGetAction({
//           mapedData: "branch",
//           orgLevel: true,
//           subOrgId: values.subOrgId,
//         })
//       );
//     }
//   }, [dispatch, values?.subOrgId]);

//   useEffect(() => {
//     if (values?.branchId) {
//       const params = new URLSearchParams({
//         branchId: values.branchId,
//         mapedData: "department",
//         category: "assigned",
//       });
//       dispatch(DepartmentGetAssignedAction(params));
//     }
//   }, [dispatch, values?.branchId]);

//   useEffect(() => {
//     if (values?.branchId && values?.departmentId) {
//       const params = new URLSearchParams({
//         branchId: values.branchId,
//         department: values.departmentId,
//         mapedData: "designation",
//         category: "assigned",
//       });
//       dispatch(DesignationGetAssignedAction(params));
//     }
//   }, [dispatch, values?.branchId, values?.departmentId]);

//   return (
//     <div className="w-full p-2">
//       <Form>
//         <div className="flex flex-col lg:flex-row justify-between py-2 gap-4">
//           <div className="text-start grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 flex-1 flex-wrap gap-4">
//             {user?.modules?.["suborganization"]?.r && (
//               <FormikInput
//                 name="subOrgId"
//                 size="sm"
//                 label="Organization"
//                 inputType={isEditAvailable ? "edit" : "dropdown"}
//                 listData={subOrgs}
//                 inputName="Select Organization"
//                 feildName="name"
//                 hideLabel
//                 showTip={false}
//                 showSerch
//                 handleClick={(selected) =>
//                   setFieldValue("subOrgId", selected?._id)
//                 }
//                 selectedOption={values?.subOrgId}
//                 editValue={
//                   subOrgs?.find((d) => d._id === values.subOrgId)?.name
//                 }
//                 selectedOptionDependency="_id"
//               />
//             )}

//             <FormikInput
//               name="branchId"
//               size="sm"
//               label="Branch"
//               inputType={isEditAvailable ? "edit" : "dropdown"}
//               listData={branchList}
//               inputName="Select Branch"
//               feildName="name"
//               hideLabel
//               showTip={false}
//               showSerch
//               handleClick={(selected) =>
//                 setFieldValue("branchId", selected?._id)
//               }
//               selectedOption={values?.branchId}
//               editValue={
//                 branchList?.find((d) => d._id === values.branchId)?.name
//               }
//               selectedOptionDependency="_id"
//             />

//             <FormikInput
//               name="departmentId"
//               size="sm"
//               label="Department"
//               inputType={isEditAvailable ? "edit" : "dropdown"}
//               listData={assignedBranchDepartments}
//               inputName="Select Department"
//               feildName="name"
//               hideLabel
//               showTip={false}
//               showSerch
//               handleClick={(selected) =>
//                 setFieldValue("departmentId", selected?._id)
//               }
//               selectedOption={values?.departmentId}
//               editValue={
//                 assignedBranchDepartments?.find(
//                   (d) => d._id === values.departmentId
//                 )?.name
//               }
//               selectedOptionDependency="_id"
//             />

//             <FormikInput
//               name="designationId"
//               size="sm"
//               label="Designation"
//               inputType={isEditAvailable ? "edit" : "dropdown"}
//               listData={designationBranchDepartemnt}
//               inputName="Select Designation"
//               feildName="name"
//               hideLabel
//               showTip={false}
//               showSerch
//               handleClick={(selected) =>
//                 setFieldValue("designationId", selected?._id)
//               }
//               selectedOption={values?.designationId}
//               editValue={
//                 designationBranchDepartemnt?.find(
//                   (d) => d._id === values?.designationId
//                 )?.name
//               }
//               selectedOptionDependency="_id"
//             />

//             <FormikInput
//               name="joinDate"
//               size="sm"
//               label="Join Date"
//               type="date"
//               inputType={isEditAvailable ? "edit" : "input"}
//               value={values?.joinDate}
//               editValue={values?.joinDate}
//               //  max={moment().subtract(14, "y").endOf("Year").format("yyyy-MM-DD")}
//             />
//           </div>
//         </div>
//       </Form>
//       <Typography variant="h6" className="font-semibold text-gray-800 mt-6">
//         Employee Settings
//       </Typography>
//       <div className="col-span-full flex items-center gap-6 mb-4 mt-2 flex-wrap">
//         {settingOptions.map((option) => (
//           <label
//             key={option.value}
//             className="flex items-center gap-2 cursor-pointer"
//           >
//             <input
//               type="radio"
//               name="workTimingType"
//               value={option.value}
//               className="accent-blue-600"
//               checked={values.workTimingType === option.value}
//               onChange={() => {
//                 setFieldValue("workTimingType", option.value);
//                 if (option.value !== "shift") setFieldValue("shiftIds", []);
//               }}
//             />
//             <span className="text-gray-700">{option.label}</span>
//           </label>
//         ))}

//         {values.workTimingType === "shift" && (
//           <div className="w-64">
//             {!values.branchId ? (
//               <p className="text-sm text-gray-500 italic">
//                 Please select a branch first to view shifts
//               </p>
//             ) : filteredShifts.length === 0 ? (
//               <p className="text-sm text-gray-500 italic">
//                 No shifts available for selected branch
//               </p>
//             ) : (
//               <SingleSelectDropdown
//                 inputName="Shift"
//                 placeholder="Select Shift"
//                 listData={filteredShifts}
//                 selectedOption={values.shiftIds[0] || ""}
//                 selectedOptionDependency="_id"
//                 feildName="name"
//                 handleClick={(option) =>
//                   setFieldValue("shiftIds", [option._id])
//                 }
//                 hideLabel={true}
//               />
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OfficialForm;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Form, useFormikContext } from "formik";
import moment from "moment";

import FormikInput from "../../../components/Input/FormikInput";
import { SubOrgListAction } from "../../../redux/Action/SubOrgAction/SubOrgAction";
import { BranchGetAction } from "../../../redux/Action/Branch/BranchAction";
import { DepartmentGetAssignedAction } from "../../../redux/Action/Department/DepartmentAction";
import { DesignationGetAssignedAction } from "../../../redux/Action/Designation/DesignationAction";
import { RoleGetAction } from "../../../redux/Action/Roles/RoleAction";
import { EmployeeOfficialDetailsAction } from "../../../redux/Action/Employee/EmployeeAction";
import { ShiftGetAction } from "../../../redux/Action/Shift/ShiftAction";
import { Avatar, Typography } from "@material-tailwind/react";
import SingleSelectDropdown from "../../../components/SingleSelectDropdown/SingleSelectDropdown";

const settingOptions = [
  { label: "Branch Setting", value: "branch" },
  { label: "Shift Setting", value: "shift" },
];

const OfficialForm = ({ isEditAvailable }) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { values, setFieldValue } = useFormikContext();

  const { user } = useSelector((state) => state?.user);
  const { subOrgs } = useSelector((state) => state?.subOrgs);
  const { branchList } = useSelector((state) => state?.branch);
  const { assignedBranchDepartments } = useSelector(
    (state) => state?.department
  );
  const { designationBranchDepartemnt } = useSelector(
    (state) => state?.designation
  );
  const { rolesList } = useSelector((state) => state?.roles);
  const { employeeOfficial } = useSelector((state) => state?.employee);
  const shiftList = useSelector((state) => state.shift?.shiftList || []);
  const selectedBranch = branchList?.find((b) => b._id === values.branchId);
  console.log("ShiftList in OfficialForm:", shiftList);
  console.log("Selected branchId:", values.branchId);

  // Filter shifts based on selected branch
  const filteredShifts = values.branchId
    ? shiftList.filter((shift) => shift.branchId === values.branchId)
    : [];

  console.log("Filtered Shifts:", filteredShifts);

  /**
   * Load employee data first if editing
   */
  useEffect(() => {
    if (state?._id) {
      dispatch(EmployeeOfficialDetailsAction({ id: state._id }));
    } else {
      // New employee → reset form
      setFieldValue("subOrgId", "");
      setFieldValue("branchId", "");
      setFieldValue("departmentId", "");
      setFieldValue("designationId", "");
      setFieldValue("joinDate", "");
      setFieldValue("roleId", "");
      setFieldValue("id", "");
      setFieldValue("workTimingType", "");
      setFieldValue("employeeId", "");
      setFieldValue("shiftIds", []);
    }
  }, [dispatch, state?._id, setFieldValue]);

  useEffect(() => {
    if (employeeOfficial && state?._id) {
      setFieldValue("roleId", employeeOfficial?.roleId || "");
      setFieldValue("branchId", employeeOfficial?.branchId?.[0] || "");
      setFieldValue("subOrgId", employeeOfficial?.subOrgId || "");
      setFieldValue("departmentId", employeeOfficial?.departmentId || "");
      setFieldValue("designationId", employeeOfficial?.designationId || "");
      setFieldValue(
        "joinDate",
        employeeOfficial?.joinDate
          ? moment(employeeOfficial.joinDate).format("YYYY-MM-DD")
          : ""
      );
      setFieldValue("workTimingType", employeeOfficial?.workTimingType || "");
      setFieldValue("shiftIds", employeeOfficial?.shiftIds || []);
      setFieldValue("id", state._id);
      setFieldValue("employeeId", employeeOfficial?.employeeId);
    }
  }, [employeeOfficial, state?._id, setFieldValue]);

  useEffect(() => {
    dispatch(RoleGetAction());
    if (user?.modules?.["suborganization"]?.r) {
      dispatch(SubOrgListAction());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (values?.subOrgId) {
      dispatch(
        BranchGetAction({
          mapedData: "branch",
          orgLevel: true,
          subOrgId: values.subOrgId,
        })
      );
    }
  }, [dispatch, values?.subOrgId]);

  useEffect(() => {
    if (values?.branchId) {
      const params = new URLSearchParams({
        branchId: values.branchId,
        mapedData: "department",
        category: "assigned",
      });
      dispatch(DepartmentGetAssignedAction(params));
    }
  }, [dispatch, values?.branchId]);

  useEffect(() => {
    if (values?.branchId && values?.departmentId) {
      const params = new URLSearchParams({
        branchId: values.branchId,
        department: values.departmentId,
        mapedData: "designation",
        category: "assigned",
      });
      dispatch(DesignationGetAssignedAction(params));
    }
  }, [dispatch, values?.branchId, values?.departmentId]);

  // ✅ Fetch shifts when branch is selected
  useEffect(() => {
    if (values?.branchId) {
      console.log("Fetching shifts for branch:", values.branchId);
      dispatch(ShiftGetAction({ branchId: values.branchId }));
    }
  }, [dispatch, values?.branchId]);

  return (
    <div className="w-full p-2">
      <Form>
        <div className="flex flex-col lg:flex-row justify-between py-2 gap-4">
          <div className="text-start grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 flex-1 flex-wrap gap-4">
            {user?.modules?.["suborganization"]?.r && (
              <FormikInput
                name="subOrgId"
                size="sm"
                label="Organization"
                inputType={isEditAvailable ? "edit" : "dropdown"}
                listData={subOrgs}
                inputName="Select Organization"
                feildName="name"
                hideLabel
                showTip={false}
                showSerch
                handleClick={(selected) =>
                  setFieldValue("subOrgId", selected?._id)
                }
                selectedOption={values?.subOrgId}
                editValue={
                  subOrgs?.find((d) => d._id === values.subOrgId)?.name
                }
                selectedOptionDependency="_id"
              />
            )}
            <FormikInput
              name="employeeId"
              size="sm"
              label="Employee ID"
              inputType={isEditAvailable ? "edit" : "input"}
              editValue={values?.employeeId}
            />
            <FormikInput
              name="branchId"
              size="sm"
              label="Branch"
              inputType={isEditAvailable ? "edit" : "dropdown"}
              listData={branchList}
              inputName="Select Branch"
              feildName="name"
              hideLabel
              showTip={false}
              showSerch
              handleClick={(selected) => {
                console.log("Branch changed to:", selected?._id);
                setFieldValue("branchId", selected?._id);
                // Reset shift and work timing when branch changes
                setFieldValue("shiftIds", []);
                setFieldValue("workTimingType", "");
                // Fetch shifts for new branch
                dispatch(ShiftGetAction({ branchId: selected?._id }));
              }}
              selectedOption={values?.branchId}
              editValue={
                branchList?.find((d) => d._id === values.branchId)?.name
              }
              selectedOptionDependency="_id"
            />

            <FormikInput
              name="departmentId"
              size="sm"
              label="Department"
              inputType={isEditAvailable ? "edit" : "dropdown"}
              listData={assignedBranchDepartments}
              inputName="Select Department"
              feildName="name"
              hideLabel
              showTip={false}
              showSerch
              handleClick={(selected) =>
                setFieldValue("departmentId", selected?._id)
              }
              selectedOption={values?.departmentId}
              editValue={
                assignedBranchDepartments?.find(
                  (d) => d._id === values.departmentId
                )?.name
              }
              selectedOptionDependency="_id"
            />

            <FormikInput
              name="designationId"
              size="sm"
              label="Designation"
              inputType={isEditAvailable ? "edit" : "dropdown"}
              listData={designationBranchDepartemnt}
              inputName="Select Designation"
              feildName="name"
              hideLabel
              showTip={false}
              showSerch
              handleClick={(selected) =>
                setFieldValue("designationId", selected?._id)
              }
              selectedOption={values?.designationId}
              editValue={
                designationBranchDepartemnt?.find(
                  (d) => d._id === values?.designationId
                )?.name
              }
              selectedOptionDependency="_id"
            />

            <FormikInput
              name="joinDate"
              size="sm"
              label="Join Date"
              type="date"
              inputType={isEditAvailable ? "edit" : "input"}
              value={values?.joinDate}
              editValue={values?.joinDate}
            />
            {/* <div className="col-span-full flex gap-4">
              {settingOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="workTimingType"
                    value={option.value}
                    className="accent-blue-600"
                    checked={values.workTimingType === option.value}
                    onChange={() => {
                      setFieldValue("workTimingType", option.value);
                      if (option.value !== "shift")
                        setFieldValue("shiftIds", []);
                    }}
                    disabled={isEditAvailable}
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}

              {values.workTimingType === "shift" && (
                <div className="w-64">
                  {!values.branchId ? (
                    <p className="text-sm text-gray-500 italic">
                      Please select a branch first to view shifts
                    </p>
                  ) : filteredShifts.length === 0 ? (
                    <p className="text-sm text-orange-500 italic">
                      No shifts available for selected branch. Total shifts
                      loaded: {shiftList.length}
                    </p>
                  ) : (
                    <SingleSelectDropdown
                      inputName="Shift"
                      placeholder="Select Shift"
                      listData={filteredShifts}
                      selectedOption={values.shiftIds[0] || ""}
                      selectedOptionDependency="_id"
                      feildName="name"
                      handleClick={(option) =>
                        setFieldValue("shiftIds", [option._id])
                      }
                      hideLabel={true}
                      disabled={isEditAvailable}
                    />
                  )}
                </div>
              )}
            </div> */}
            <div className="col-span-full flex flex-col gap-2">
              <div className="flex gap-4">
                {settingOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="workTimingType"
                      value={option.value}
                      className="accent-blue-600"
                      checked={values.workTimingType === option.value}
                      onChange={() => {
                        setFieldValue("workTimingType", option.value);
                        if (option.value !== "shift")
                          setFieldValue("shiftIds", []);
                      }}
                      disabled={isEditAvailable}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}

                {values.workTimingType === "shift" && (
                  <div className="w-64">
                    {!values.branchId ? (
                      <p className="text-sm text-gray-500 italic">
                        Please select a branch first to view shifts
                      </p>
                    ) : filteredShifts.length === 0 ? (
                      <p className="text-sm text-orange-500 italic">
                        No shifts available for selected branch. Total shifts
                        loaded: {shiftList.length}
                      </p>
                    ) : (
                      <SingleSelectDropdown
                        inputName="Shift"
                        placeholder="Select Shift"
                        listData={filteredShifts}
                        selectedOption={values.shiftIds[0] || ""}
                        selectedOptionDependency="_id"
                        feildName="name"
                        handleClick={(option) => {
                          setFieldValue("shiftIds", [option._id]);
                          // Store the full shift details
                          setFieldValue("workTiming", {
                            name: option.name,
                            startTime: option.startTime,
                            endTime: option.endTime,
                          });
                        }}
                        hideLabel={true}
                        disabled={isEditAvailable}
                      />
                    )}
                  </div>
                )}
                {/* Display branch timing below */}
                {values.workTimingType === "branch" && selectedBranch && (
                  <div className="ml-4 px-4 py-2 bg-green-50 border-l-4 border-green-500 rounded">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        Branch Timing:
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        {selectedBranch.name}
                      </span>
                      {selectedBranch.startTime && selectedBranch.endTime && (
                        <span className="text-sm font-semibold text-gray-800">
                          {`${selectedBranch.startTime} - ${selectedBranch.endTime}`}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Display shift timing below */}
              {values.workTimingType === "shift" && values.shiftIds[0] && (
                <div className="ml-4 px-4 py-2 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Shift Timing:</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {(() => {
                        const selectedShift = filteredShifts.find(
                          (shift) => shift._id === values.shiftIds[0]
                        );
                        return selectedShift
                          ? `${selectedShift.startTime} - ${selectedShift.endTime}`
                          : "N/A";
                      })()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* <Typography variant="h6" className="font-semibold text-gray-800 mt-6">
          Employee Settings
        </Typography>
        <div className="col-span-full flex items-center gap-6 mb-4 mt-2 flex-wrap">
          {settingOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="workTimingType"
                value={option.value}
                className="accent-blue-600"
                checked={values.workTimingType === option.value}
                onChange={() => {
                  setFieldValue("workTimingType", option.value);
                  if (option.value !== "shift") setFieldValue("shiftIds", []);
                }}
                disabled={isEditAvailable}
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}

          {values.workTimingType === "shift" && (
            <div className="w-64">
              {!values.branchId ? (
                <p className="text-sm text-gray-500 italic">
                  Please select a branch first to view shifts
                </p>
              ) : filteredShifts.length === 0 ? (
                <p className="text-sm text-orange-500 italic">
                  No shifts available for selected branch. Total shifts loaded:{" "}
                  {shiftList.length}
                </p>
              ) : (
                <SingleSelectDropdown
                  inputName="Shift"
                  placeholder="Select Shift"
                  listData={filteredShifts}
                  selectedOption={values.shiftIds[0] || ""}
                  selectedOptionDependency="_id"
                  feildName="name"
                  handleClick={(option) =>
                    setFieldValue("shiftIds", [option._id])
                  }
                  hideLabel={true}
                  disabled={isEditAvailable}
                />
              )}
            </div>
          )}
        </div> */}
      </Form>
    </div>
  );
};

export default OfficialForm;
