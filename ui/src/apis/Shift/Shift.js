
import axiosInstance from "../../config/axiosInstance";
import { getParamsFromObject } from "../../constants/reusableFun";

export const ShiftCreateApi = async (userCredentials) => {
    try {
        const response = await axiosInstance.post('shift/create', userCredentials);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error
    }
};
export const ShiftGetApi = async (shiftDetails) => {
    let params = shiftDetails || {}
    try {
        const response = await axiosInstance.post(`shift/list`, params);
        console.log(response.data,'red')
        return response.data;
    } catch (error) {
       throw error ;
    }
};

export const ShiftUpdateApi = async (userCredentials) => {
    try {
        const response = await axiosInstance.post('shift/update', userCredentials);
        console.log(response.data)
        return response.data;
    } catch (error) {

        console.log(error,'bk')
throw error ;
    }
};

export const createShiftByDateApi =async (userCredentials)=>{
   try {
        const response = await axiosInstance.post('shift/date/create', userCredentials);
        console.log(response.data)
        return response.data;
    } catch (error) {

        console.log(error,'bk')
throw error ;
    } 
}
export const updateShiftByDateApi =async (userCredentials)=>{
   try {
        const response = await axiosInstance.post('shift/date/update', userCredentials);
        console.log(response.data)
        return response.data;
    } catch (error) {

        console.log(error,'bk')
throw error ;
    } 
}
export const getShiftByDateApi =async (userCredentials)=>{
   try {

    // const {employeeIds,...rest}=userCredentials
    // const params ={...rest,userIds:userCredentials?.employeeIds}
        const response = await axiosInstance.post('shift/date/list',{...userCredentials});
        console.log(response.data)
        return response.data;
    } catch (error) {

        console.log(error,'bk')
throw error ;
    } 
}
export const swapShiftByDateApi =async (userCredentials)=>{
   try {

    // const {employeeIds,...rest}=userCredentials
    // const params ={...rest,userIds:userCredentials?.employeeIds}
        const response = await axiosInstance.post('shift/date/swap',{...userCredentials});
        console.log(response.data)
        return response.data;
    } catch (error) {

        console.log(error,'bk')
throw error ;
    } 
}

export const ShiftActivateApi = async (userCredentials) => {
    try {
        const response = await axiosInstance.post('shift/activate/deactivate', userCredentials);
        console.log(response.data)
        return response.data;
    } catch (error) {

        console.log(error,'bk')
throw error ;
    }
};