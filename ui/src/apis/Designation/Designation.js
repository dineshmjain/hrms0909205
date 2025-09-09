
import axiosInstance from "../../config/axiosInstance";  
import { getParamsFromObject } from "../../constants/reusableFun";

// Login API
export const DesignationCreateApi= async (desgDetails) => { 
    try {
        const response = await axiosInstance.post('designation/create', desgDetails);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};


export const DesignationListApi= async (desgDetails) => {
    try {

        // let page=desgDetails.page
        let params = getParamsFromObject(desgDetails || {})
        // const response = await axiosInstance.get(`designation/get?page=${page}`, desgDetails);
        const response = await axiosInstance.post(`designation/get${params}`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};
export const DesignationEditApi= async (desgDetails) => {
    try {
        const response = await axiosInstance.post(`designation/update`, {...desgDetails});
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};

export const DesignationGetAssigned= async (branchDetails) => {
    try {console.log(branchDetails)
        const response = await axiosInstance.post(`designation/get?${branchDetails?.toString()}`);
        console.log(response.data,'  dep list',)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};

export const DesignationStatusUpdateApi = async (designationDetails) => {
    try {
        console.log(designationDetails,"<=========================================sent to api")
        const response = await axiosInstance.post(`designation/update/status`,designationDetails);
        console.log(response.data)
        return response.data;
    } catch (error) {

        console.log(error)
        throw error.response.data || error.message;
    }
};

export const designationClientListApi = async (reqbody) => {
    try {
        const response = await axiosInstance.post(`/client/user/designation/get`, reqbody);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('API Error:', error.response.data);
        throw error.response.data || error.message;
    }
}