import axiosInstance from "../../config/axiosInstance";

export const LeavePolicyCreateApi = async (policy) => {
  try {
    const response = await axiosInstance.post("leave/policy/add", policy);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const LeavePolicyUpdateApi = async (policy) => {
  try {
    const response = await axiosInstance.post("leave/policy/edit", policy);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const LeavePolicyGetApi = async (policy) => {
  try {
    const response = await axiosInstance.post("leave/policy/get", policy);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const LeavePolicyStatusApi = async (policy) => {
  try {
    const response = await axiosInstance.post("leave/policy/active/deactivate", policy);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const LeaveRequestGetApi = async (requestget) => {
  try {
    const response = await axiosInstance.post("leave/get/user", requestget);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const LeaveRequestApproveRejectCreateApi = async (request) => {
  try {
    const response = await axiosInstance.post("leave/aprove/reject", request);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const LeaveBalanceUserCreateApi = async (request) => {
  try {
    const response = await axiosInstance.post("leave/balance", request);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const LeavePolicyNameGetApi = async (policy) => {
  try { 
      const response = await axiosInstance.get("leave/policy/get/policies/dropdown");
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    } 
};
