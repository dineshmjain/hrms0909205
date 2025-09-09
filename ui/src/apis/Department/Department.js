import axiosInstance from "../../config/axiosInstance";
import { getParamsFromObject } from "../../constants/reusableFun";

export const DepartmentCreateApi = async (userCredentials) => {
    try {
        const response = await axiosInstance.post('department/create', userCredentials);
        console.log('DepartmentCreateApi-->', response.data)
        return response.data;
    } catch (error) {

        console.log(error)
        throw error.response.data || error.message;
    }
};
export const DepartmentGetApi = async (departmentDetails) => {

    let params = getParamsFromObject({ ...departmentDetails })
    try {
        const response = await axiosInstance.post(`department/get${params}`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};
export const DepartmentEditApi = async (departmentDetails) => {
    try {
        const response = await axiosInstance.post(`department/update`, departmentDetails);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};
export const DepartmentBranchGetAllApi = async (branchDetails) => {
    try {
        console.log(branchDetails)
        const response = await axiosInstance.post(`department/get?branchId=${branchDetails.params.branchId}&mapedData=department&${branchDetails?.params?.category ? `&category=${branchDetails.params.category}` : ''}`);
        console.log(response.data, 'dep branch list', `department/get?branchId=${branchDetails.params.branchId}&mapedData=department&${branchDetails?.params?.category ? `&category=${branchDetails.params.category}` : ''}`)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};
export const DepartmentAssignment = async (branchDetails) => {
    try {
        console.log(branchDetails)
        const response = await axiosInstance.post(`assignment/department`, { ...branchDetails.body });
        console.log(response.data, 'dep branch list',)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};



export const DepartmentGetAssigned = async (branchDetails) => {
    try {
        console.log(branchDetails)
        const response = await axiosInstance.post(`department/get?${branchDetails?.toString()}`);
        console.log(response.data, ' branch assigned dep list',)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};

export const DepartmentStatusUpdateApi = async (departmentDetails) => {
    try {
        console.log(departmentDetails, "<=========================================sent to api")
        const response = await axiosInstance.post(`department/update/status`, departmentDetails);
        console.log(response.data)
        return response.data;
    } catch (error) {

        console.log(error)
        throw error.response.data || error.message;
    }
};

export const departmentClientListApi = async (reqbody) => {
    try {
        const response = await axiosInstance.post(`/client/user/department/get`, reqbody);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('API Error:', error.response.data);
        throw error.response.data || error.message;
    }
}