import { useEffect, useState } from "react";
import { Typography, Button } from "@material-tailwind/react";
import { FaXmark } from "react-icons/fa6";
import SingleSelectDropdown from "../../../../components/SingleSelectDropdown/SingleSelectDropdown";
import MultiSelectDropdown from "../../../../components/MultiSelectDropdown/MultiSelectDropdown";
import { useDispatch, useSelector } from "react-redux";
import { SubOrgListAction } from "../../../../redux/Action/SubOrgAction/SubOrgAction";
import { BranchGetAction } from "../../../../redux/Action/Branch/BranchAction";
import { DepartmentGetAction } from "../../../../redux/Action/Department/DepartmentAction";
import { DesignationGetAction } from "../../../../redux/Action/Designation/DesignationAction";
import { EmployeeGetAction } from "../../../../redux/Action/Employee/EmployeeAction";
import { toTitleCase } from "../../../../constants/reusableFun";

const AssignTemplateSidebar = ({ open, onClose, selectedTemplate }) => {
  const dispatch = useDispatch();

  const { subOrgs } = useSelector((s) => s.subOrgs);
  const { branchList } = useSelector((s) => s.branch);
  const { departmentList } = useSelector((s) => s.department);
  const { designationList } = useSelector((s) => s.designation);
  const { employeeList } = useSelector((s) => s.employee);

  const [selected, setSelected] = useState({
    subOrgId: "",
    branchId: "",
    departmentId: "",
    designationId: "",
  });
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // Fetch base orgs
  useEffect(() => {
    dispatch(SubOrgListAction());
    dispatch(BranchGetAction({}));
  }, [dispatch]);

  // When org changes → branches & employees
  useEffect(() => {
    if (selected.subOrgId) {
      dispatch(BranchGetAction({ subOrgId: selected.subOrgId }));
      dispatch(EmployeeGetAction({ orgIds: [selected.subOrgId] }));
    }
  }, [dispatch, selected.subOrgId]);

  // When branch changes → depts & employees
  useEffect(() => {
    if (selected.branchId) {
      dispatch(
        DepartmentGetAction({
          subOrgId: selected.subOrgId,
          branchIds: [selected.branchId],
        })
      );
      dispatch(
        EmployeeGetAction({
          orgIds: [selected.subOrgId],
          branchIds: [selected.branchId],
        })
      );
    }
  }, [dispatch, selected.branchId]);

  // When department changes → designations & employees
  useEffect(() => {
    if (selected.departmentId) {
      dispatch(
        DesignationGetAction({
          subOrgId: selected.subOrgId,
          branchIds: [selected.branchId],
          departmentIds: [selected.departmentId],
        })
      );
      dispatch(
        EmployeeGetAction({
          orgIds: [selected.subOrgId],
          branchIds: [selected.branchId],
          departmentIds: [selected.departmentId],
        })
      );
    }
  }, [dispatch, selected.departmentId]);

  // When designation changes → employees
  useEffect(() => {
    if (selected.designationId) {
      dispatch(
        EmployeeGetAction({
          orgIds: [selected.subOrgId],
          branchIds: [selected.branchId],
          departmentIds: [selected.departmentId],
          designationIds: [selected.designationId],
        })
      );
    }
  }, [dispatch, selected.designationId]);

  const handleAssign = () => {
    const payload = {
      templateId: selectedTemplate?._id,
      ...selected,
      userIds: selectedEmployees,
    };
    console.log("Assign Template Payload:", payload);
    // TODO: dispatch API action here
    onClose();
  };

  return (
    <div
      className={`fixed sidebar overflow-y-scroll scrolls z-30 rounded-lg 
         w-[30vw] shadow-2xl transition-all ease-in-out duration-[.3s] top-[48px]  
         ${open ? `right-[-10px] visible` : `right-[-3000px]`} bg-white`}
    >
      <div className="gap-2 p-4 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-xl font-bold text-gray-800 m-0">
            Assign Salary Template
          </h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center text-gray-600 hover:text-pop 
              bg-primary hover:bg-primaryLight text-white hover:text-primary w-8 h-8 rounded-full"
          >
            <FaXmark className="text-lg" />
          </button>
        </div>

        {/* Template Info */}
        {selectedTemplate && (
          <div className="mt-2 px-2 py-2 shadow-hrms rounded-md bg-gray-50">
            <Typography className="font-semibold text-gray-900">
              {toTitleCase(selectedTemplate.templateName)}
            </Typography>
            <Typography className="text-sm text-gray-600">
              {selectedTemplate.description}
            </Typography>
          </div>
        )}

        {/* Dropdowns */}
        <div className="flex flex-col gap-4 mt-4">
          {/* Organization */}
          <SingleSelectDropdown
            selectedOption={selected.subOrgId}
            listData={subOrgs}
            selectedOptionDependency="_id"
            feildName="name"
            inputName="Organization"
            handleClick={(data) =>
              setSelected((prev) => ({
                ...prev,
                subOrgId: data?._id,
                branchId: "",
                departmentId: "",
                designationId: "",
              }))
            }
            hideLabel
          />

          {/* Branch */}
          <SingleSelectDropdown
            selectedOption={selected.branchId}
            listData={branchList}
            selectedOptionDependency="_id"
            feildName="name"
            inputName="Branch"
            handleClick={(data) =>
              setSelected((prev) => ({
                ...prev,
                branchId: data?._id,
                departmentId: "",
                designationId: "",
              }))
            }
            hideLabel
          />

          {/* Department */}
          <SingleSelectDropdown
            selectedOption={selected.departmentId}
            listData={departmentList}
            selectedOptionDependency="_id"
            feildName="name"
            inputName="Department"
            handleClick={(data) =>
              setSelected((prev) => ({ ...prev, departmentId: data?._id }))
            }
            hideLabel
          />

          {/* Designation */}
          <SingleSelectDropdown
            selectedOption={selected.designationId}
            listData={designationList}
            selectedOptionDependency="_id"
            feildName="name"
            inputName="Designation"
            handleClick={(data) =>
              setSelected((prev) => ({ ...prev, designationId: data?._id }))
            }
            hideLabel
          />

          {/* Employees */}
          <MultiSelectDropdown
            data={employeeList}
            FeildName="name"
            Dependency="_id"
            InputName="Select Employees"
            selectedData={selectedEmployees}
            setSelectedData={setSelectedEmployees}
            hideLabel
            type="object"
          />
        </div>

        {/* Action */}
        <div className="mt-6">
          <Button
            onClick={handleAssign}
            className="w-full bg-primary hover:bg-primaryLight hover:text-primary transition-all duration-200 text-sm flex justify-center items-center"
          >
            Assign Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignTemplateSidebar;
