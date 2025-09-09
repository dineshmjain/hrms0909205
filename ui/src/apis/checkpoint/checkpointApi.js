import taskAxiosInstance from "../../config/taskAxiosInstance";
import { getParamsFromObject } from "../../constants/reusableFun";

export const createCheckPointApi = async (userCredentials) => {
  try {
    const response = await taskAxiosInstance.post(`checkpoint/create`, userCredentials);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);

    throw error?.response?.data || error?.message;
  }
};
export const getCheckPointApi = async (userCredentials = {}) => {

  try {
    const response = await taskAxiosInstance.post(`checkpoint/get`, userCredentials);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);

    throw error?.response?.data || error?.message;
  }
};
export const updateCheckPointApi = async (userCredentials) => {
  try {
    const response = await taskAxiosInstance.post(`checkpoint/update`, userCredentials);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);

    throw error?.response?.data || error?.message;
  }
};
