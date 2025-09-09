import { taskAxiosFormInstance } from "../../config/taskAxiosInstance";

export const uploadMediaApi = async (data) => {
    let { type, ...rest } = data;
    console.log(data);

    try {
        const response = await taskAxiosFormInstance.post(`upload/${data?.type}`, rest);
        console.log(response);
        return response.data;
    } catch (error) {
        console.log(error);

        throw error?.response?.data || error?.message;
    }
};