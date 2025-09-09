
export const OfficialConfig = () => {
  return {
    initialValues: {
      subOrgId: '',
      branchId: '',
      departmentId: '',
      designationId: '',
      roleId: ''
    },
    validationSchema: {
// branchId:Yup.string().required('Branch is required')
    },
  };
};