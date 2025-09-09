import axiosInstance from "../../config/axiosInstance";


export const clientBranchListApi = async (reqbody) => {
    try {
        const response = await axiosInstance.post(`client/branch/list`, reqbody);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};
export const clientBranchAddApi = async (reqbody) => {
    try {
        const response = await axiosInstance.post(`client/branch/add`, reqbody);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};