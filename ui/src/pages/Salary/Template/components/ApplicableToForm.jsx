import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormikContext } from "formik";

import SubCardHeader from "../../../../components/header/SubCardHeader";
import FormikInput from "../../../../components/Input/FormikInput";
import { SubOrgListAction } from "../../../../redux/Action/SubOrgAction/SubOrgAction";
import { BranchGetAction } from "../../../../redux/Action/Branch/BranchAction";
import { DepartmentGetAssignedAction } from "../../../../redux/Action/Department/DepartmentAction";
import { DesignationGetAssignedAction } from "../../../../redux/Action/Designation/DesignationAction";

const ApplicableToForm = () => {
  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormikContext();

  const { user } = useSelector((state) => state?.user);
  const { subOrgs } = useSelector((state) => state?.subOrgs);
  const { branchList } = useSelector((state) => state?.branch);
  const { assignedBranchDepartments } = useSelector((state) => state?.department);
  const { designationBranchDepartemnt } = useSelector((state) => state?.designation);

  useEffect(() => {
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

  return (
    <div>
      <SubCardHeader headerLabel="Applicable To" />

      <div className="flex flex-col lg:flex-row justify-between py-2 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 flex-1 flex-wrap gap-4">
          {user?.modules?.["suborganization"]?.r && (
            <FormikInput
              name="subOrgId"
              size="sm"
              label="Organization"
              inputType="dropdown"
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
              selectedOptionDependency="_id"
            />
          )}

          <FormikInput
            name="branchId"
            size="sm"
            label="Branch"
            inputType="dropdown"
            listData={branchList}
            inputName="Select Branch"
            feildName="name"
            hideLabel
            showTip={false}
            showSerch
            handleClick={(selected) =>
              setFieldValue("branchId", selected?._id)
            }
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
            inputType="dropdown"
            listData={assignedBranchDepartments}
            inputName="Select Department"
            feildName="name"
            hideLabel
            showTip={false}
            showSerch
            handleClick={(selected) => setFieldValue("departmentId", selected?._id)}
            selectedOption={values?.departmentId}
            selectedOptionDependency="_id"
          />
          <FormikInput
            name="designationId"
            size="sm"
            label="Designation"
            inputType="dropdown"
            listData={designationBranchDepartemnt}
            inputName="Select Designation"
            feildName="name"
            hideLabel
            showTip={false}
            showSerch
            handleClick={(selected) => setFieldValue("designationId", selected?._id)}
            selectedOption={values?.designationId}
            selectedOptionDependency="_id"
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicableToForm;
