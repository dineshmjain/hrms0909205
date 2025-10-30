import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useLocation } from 'react-router-dom';

import FormikInput from '../../../components/Input/FormikInput';
import SubCardHeader from '../../../components/header/SubCardHeader';

import { SubOrgListAction } from '../../../redux/Action/SubOrgAction/SubOrgAction';
import { BranchGetAction } from '../../../redux/Action/Branch/BranchAction';
import { DepartmentGetAssignedAction } from '../../../redux/Action/Department/DepartmentAction';
import { DesignationGetAssignedAction } from '../../../redux/Action/Designation/DesignationAction';
import { RoleGetAction } from '../../../redux/Action/Roles/RoleAction';
import { Form, useFormikContext } from 'formik';
import { EmployeeOfficialDetailsAction } from '../../../redux/Action/Employee/EmployeeAction';



const OfficialInformation = ({ isEditAvailable }) => {


    const dispatch = useDispatch();
    const { state } = useLocation();
    const { values, setFieldValue } = useFormikContext();

    const { user } = useSelector((state) => state?.user);
    const { subOrgs } = useSelector((state) => state?.subOrgs);
    const { branchList } = useSelector((state) => state?.branch);
    const { assignedBranchDepartments } = useSelector(state => state?.department);
    const { designationBranchDepartemnt } = useSelector(state => state?.designation);
    const { rolesList } = useSelector((state) => state?.roles);
    const { employeeOfficial } = useSelector((state) => state?.employee)
    // 🔁 Fetch dropdowns
    useEffect(() => {
        dispatch(RoleGetAction());
    }, [dispatch]);

    useEffect(() => {
        if (user?.modules['suborganization'].r) {
            dispatch(SubOrgListAction());
        }
    }, [dispatch, user]);
    useEffect(() => {
        dispatch(EmployeeOfficialDetailsAction({ id: state?._id }));

    }, [dispatchEvent, state?._id])
    useEffect(() => {

        setFieldValue('branchId', employeeOfficial?.branchId)
        setFieldValue('subOrgId', employeeOfficial?.subOrgId)
        setFieldValue('departmentId', employeeOfficial?.departmentId)
        setFieldValue('designationId', employeeOfficial?.designationId)

        // setFieldValue('lastName', employeeDetails?.name?.lastName)
        // setFieldValue('mobile', employeeDetails?.mobile)
        // setFieldValue('id',state?._id)
    }, [employeeOfficial])

    console.log(employeeOfficial, "user")

    useEffect(() => {
        if (values?.subOrgId) {
            dispatch(BranchGetAction({
                mapedData: 'branch',
                orgLevel: true,
                subOrgId: values.subOrgId,
            }));
        }
    }, [dispatch, values.subOrgId]);

    useEffect(() => {
        if (values?.branchId) {
            const params = new URLSearchParams({
                branchId: values.branchId,
                mapedData: 'department',
                category: 'assigned',
            });
            dispatch(DepartmentGetAssignedAction(params));
        }
    }, [dispatch, values.branchId]);

    useEffect(() => {
        if (values?.branchId && values?.departmentId) {
            const params = new URLSearchParams({
                branchId: values.branchId,
                department: values.departmentId,
                mapedData: 'designation',
                category: 'assigned',
            });
            dispatch(DesignationGetAssignedAction(params));
        }
    }, [dispatch, values.branchId, values.departmentId]);

    return (
        <div className="w-full p-2">
            {/* <SubCardHeader headerLabel="Official Information" /> */}
            <Form>
                <div className="flex flex-col lg:flex-row justify-between py-2 gap-4">
                    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xxl:grid-cols-5 flex-1 flex-wrap gap-4">
                        {user?.modules['suborganization'].r && (
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
                                showSerch={true}
                                handleClick={(selected) => setFieldValue('subOrgId', selected?._id)}
                                selectedOption={values?.subOrgId}
                                editValue={subOrgs?.filter((d) => d._id == values.subOrgId)[0]?.name}
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
                            showSerch={true}
                            handleClick={(selected) => setFieldValue('branchId', selected?._id)}
                            selectedOption={values?.branchId}
                            selectedOptionDependency="_id"
                        // editValue={branchList?.filter((d)=>d._id==values.branchId)}
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
                            showSerch={true}
                            handleClick={(selected) => setFieldValue('departmentId', selected?._id)}
                            selectedOption={values?.departmentId}
                            editValue={assignedBranchDepartments?.filter((d) => d._id == values.departmentId)[0]?.name}
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
                            showSerch={true}
                            handleClick={(selected) => setFieldValue('designationId', selected?._id)}
                            selectedOption={values?.designationId}
                            selectedOptionDependency="_id"
                            editValue={designationBranchDepartemnt?.filter((d) => d._id == values.designationId)[0]?.name}
                        />

                    </div>
                </div>
            </Form>
        </div>
    );
};

export default OfficialInformation;
