import axiosInstance from "../../config/axiosInstance";

export const createRoleApi= async (userDetails) => {
    try {
        console.log(userDetails)
        const response = await axiosInstance.get('role/add');
        console.log(response,'ffffffffffffffffffffffffffffffffffffffffff')
        return response.data;
        
    } catch (error) {
        console.log(error)
        throw error.response.data || error.message;
    }
};
export const getRoleApi= async (userDetails) => {
    try {
        console.log(userDetails)
        const response = await axiosInstance.get(`role/list`);
        console.log(response.data,'ffffffffffffffffffffffffffffffffffffffffff')
        return response.data;
        
    } catch (error) {
        console.log(error)
        throw error.response.data || error.message;
    }
};
export const saveDesinationRoleApi= async (userDetails) => {
    try {
        console.log(userDetails)
        const response = await axiosInstance.post('/role/assign/designation',{...userDetails});
        console.log(response,'ffffffffffffffffffffffffffffffffffffffffff')
        return response.data;  
    } catch (error) {
        console.log(error)
        throw error.response.data || error.message;
    }
};