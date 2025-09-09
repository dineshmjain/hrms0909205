import taskAxiosInstance, { taskAxiosFormInstance } from "../../config/taskAxiosInstance";

export const addComment = async (reqbody) => {
    try {

        console.log(reqbody, 'reqbody')
        const response = await taskAxiosInstance.post(`comment/add`, reqbody);

        // console.log(response)
        return response.data;
    } catch (error) {
        console.log(error);
        throw error?.response?.data || error?.message;
    }
};
export const addCommentWithFile = async (reqbody) => {
    try {

        console.log(reqbody, 'reqbody')
        const response = await taskAxiosFormInstance.post(`comment/add`, reqbody);

        // console.log(response)
        return response.data;
    } catch (error) {
        console.log(error);
        throw error?.response?.data || error?.message;
    }
};

export const getCommentList = async (reqbody) => {
    try {

        console.log(reqbody, 'reqbody')
        const response = await taskAxiosInstance.post(`comment/get`, reqbody);

        // console.log(response)
        return response.data;
    } catch (error) {
        console.log(error);
        throw error?.response?.data || error?.message;
    }
};


export const deleteComment = async (reqbody) => {
    try {

        console.log(reqbody, 'reqbody')
        const response = await taskAxiosInstance.post(`comment/delete`, reqbody);

        // console.log(response)
        return response.data;
    } catch (error) {
        console.log(error);
        throw error?.response?.data || error?.message;
    }
}
export const editComment = async (reqbody) => {
    try {

        console.log(reqbody, 'reqbody')
        const response = await taskAxiosInstance.post(`comment/edit`, reqbody);

        // console.log(response)
        return response.data;
    } catch (error) {
        console.log(error);
        throw error?.response?.data || error?.message;
    }
}