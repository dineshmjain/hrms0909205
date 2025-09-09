import axiosInstance from "../../config/axiosInstance";

export const typeOfIndustryApi= async (userDetails) => {
    try {
        console.log(userDetails)
        const response = await axiosInstance.get('globle/orgType/list');
        console.log(response.data)
        return response.data;
        
    } catch (error) {
        console.log(error)
        throw error.response.data || error.message;
    }
};
export const getAddressTypes= async (userDetails) => {
    try {
        console.log(userDetails)
        const response = await axiosInstance.get('globle/address/type/list');
        console.log(response.data)
        return response.data;
        
    } catch (error) {
        console.log(error)
        throw error.response.data || error.message;
    }
};