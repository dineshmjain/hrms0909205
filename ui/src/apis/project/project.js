import taskAxiosInstance from "../../config/taskAxiosInstance";


export const addProjectApi = async (reqbody) => {
    try {

        console.log(reqbody, 'reqbody')
        const response = await taskAxiosInstance.post(`project/add`, reqbody);

        console.log(response)
        return response.data;
    } catch (error) {
        console.log(error);
        throw error?.response?.data || error?.message;
    }
};
export const getProjectListApi = async (reqbody) => {
    try {

        const body = { isActive: true, ...reqbody };
        console.log(body, 'reqbody')
        const response = await taskAxiosInstance.post(`project/get`, body);

        console.log(response)
        return response.data;
    } catch (error) {
        console.log(error);
        throw error?.response?.data || error?.message;
    }
};
export const updateProjectApi = async (reqbody) => {
    try {

        console.log(reqbody, 'reqbody')
        const response = await taskAxiosInstance.post(`project/update`, reqbody);

        console.log(response)
        return response.data;
    } catch (error) {
        console.log(error);
        throw error?.response?.data || error?.message;
    }
};

