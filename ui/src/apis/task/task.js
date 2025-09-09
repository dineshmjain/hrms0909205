
import taskAxiosInstance from "../../config/taskAxiosInstance";

export const addTaskApi = async (reqbody) => {
    try {

        console.log(reqbody, 'reqbody')
        const response = await taskAxiosInstance.post(`task/add`, reqbody);

        // console.log(response)
        return response.data;
    } catch (error) {
        console.log(error);
        throw error?.response?.data || error?.message;
    }
};

export const getTaskListApi = async (reqbody) => {
    try {
        let body = { ...reqbody, isActive: true };
        console.log(reqbody, 'reqbody')
        const response = await taskAxiosInstance.post(`task/get`, body);

        // console.log(response)
        return response.data;
    } catch (error) {
        console.log(error);
        throw error?.response?.data || error?.message;
    }
};
export const updateTaskApi = async (body) => {
    let { query, reqbody } = body;
    try {

        console.log(reqbody, 'reqbody')
        const response = await taskAxiosInstance.post(`task/edit/${query}`, reqbody);

        // console.log(response)
        return response.data;
    } catch (error) {
        console.log(error);
        throw error?.response?.data || error?.message;
    }
};


