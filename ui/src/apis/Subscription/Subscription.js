import axiosInstance, { plansAxiosInstance } from "../../config/axiosInstance";

export const PlansGetActiveListApi = async (plans) => {
  try {
    const response = await plansAxiosInstance.post("plan/List/Active", plans);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};