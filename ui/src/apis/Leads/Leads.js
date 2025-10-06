import axiosInstance from "../../config/axiosInstance";

export const LeadsGetApi = async (data) => {
  try {
    const response = await axiosInstance.post("lead/get", data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const LeadCreateApi = async (data) => {
  try {
    const response = await axiosInstance.post("lead/create", data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};