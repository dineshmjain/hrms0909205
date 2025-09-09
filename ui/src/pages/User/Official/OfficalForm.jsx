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

const OfficialForm = ({ isEditAvailable }) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { values, setFieldValue } = useFormikContext();

  const { user } = useSelector((state) => state?.user);
  const { subOrgs } = useSelector((state) => state?.subOrgs);
  const { branchList } = useSelector((state) => state?.branch);
  const { assignedBranchDepartments } = useSelector((state) => state?.department);
  const { designationBranchDepartemnt } = useSelector((state) => state?.designation);
  const { rolesList } = useSelector((state) => state?.roles);
  const { employeeOfficial } = useSelector((state) => state?.employee);

  /** 
   * 1️⃣ Load employee data first if editing
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
      setFieldValue("id", state._id);
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

  return (
    <div className="w-full p-2">
      <Form>
        <div className="flex flex-col lg:flex-row justify-between py-2 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 flex-1 flex-wrap gap-4">
            
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
                handleClick={(selected) => setFieldValue("subOrgId", selected?._id)}
                selectedOption={values?.subOrgId}
                editValue={subOrgs?.find((d) => d._id === values.subOrgId)?.name}
                selectedOptionDependency="_id"
              />
            )}

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
              handleClick={(selected) => setFieldValue("branchId", selected?._id)}
              selectedOption={values?.branchId}
              editValue={branchList?.find((d) => d._id === values.branchId)?.name}
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
              handleClick={(selected) => setFieldValue("departmentId", selected?._id)}
              selectedOption={values?.departmentId}
              editValue={assignedBranchDepartments?.find((d) => d._id === values.departmentId)?.name}
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
              handleClick={(selected) => setFieldValue("designationId", selected?._id)}
              selectedOption={values?.designationId}
              editValue={designationBranchDepartemnt?.find((d) => d._id === values?.designationId)?.name}
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
               max={moment().subtract(14, "y").endOf("Year").format("yyyy-MM-DD")}
            />

          </div>
        </div>
      </Form>
    </div>
  );
};

export default OfficialForm;
