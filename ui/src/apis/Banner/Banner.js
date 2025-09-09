import axiosInstance from "../../config/axiosInstance";

export const BannerGetApi = async (policy) => {
  try {
    const response = await axiosInstance.post("banner/get", policy);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};