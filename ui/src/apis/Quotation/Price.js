import axiosInstance from "../../config/axiosInstance";
export const addStandardPrice = async (userCredentials) => {
    try {
        const response = await axiosInstance.post('quotation/add/standard/price', userCredentials);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
}

export const getStandardPrice = async (userCredentials) => {
    try {
        const response = await axiosInstance.post('quotation/list/standard/price', userCredentials);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
}
export const updateQuotationPrice = async (userCredentials) => {
    try {
        const response = await axiosInstance.post('quotation/update/standard/price', userCredentials);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
}

export const getDesignationQuotationPrice = async (userCredentials) => {
    try {
        const response = await axiosInstance.post('quotation/standard/designation/price', userCredentials);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
}
