import taskAxiosInstance from "../../config/taskAxiosInstance";

export const getSubTaskListApi = async (reqbody) => {
    try {
        let body = { ...reqbody, isActive: true };
        console.log(reqbody, 'reqbody')
        const response = await taskAxiosInstance.post(`task/get/subTask`, body);

        console.log(response)
        return response.data;
    } catch (error) {
        console.log(error);
        throw error?.response?.data || error?.message;
    }
};

export const updateSubtaskApi = async (body) => {
    let { query, reqbody } = body;
    try {
        console.log(reqbody, 'reqbody')
        const response = await taskAxiosInstance.post(`task/edit/subTask/${query}`, reqbody);
        console.log(response)
        return response.data;
    } catch (error) {
        console.log(error);
        throw error?.response?.data || error?.message;
    }
}

