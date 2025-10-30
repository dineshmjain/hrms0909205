import toast from "react-hot-toast";
import axiosInstance from "../../config/axiosInstance";
import { getParamsFromObject } from "../../constants/reusableFun";

// Login API
export const add = async (orgDetails) => {
  try {
    const response = await axiosInstance.post("organization/add", orgDetails);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error, "error");
    throw error.response.data || error.message;
  }
};
//this is for Second and Third structure while registering organization
export const groupAdd = async (orgGroupDetails) => {
  try {
    const response = await axiosInstance.post(
      "organization/add/group",
      orgGroupDetails
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error, "error");
    throw error.response.data || error.message;
  }
};
//this is for first structure while registering organization
export const singleOrg = async (orgDetails) => {
  try {
    const response = await axiosInstance.post("branch/add", orgDetails);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error, "error");
    throw error.response.data || error.message;
  }
};
export const subOrgAddApi = async (orgDetails) => {
  try {
    const response = await axiosInstance.post("organization/add", orgDetails);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error, "error");
    return rejectWithValue(error);
    throw error;
  }
};
export const subOrgListApi = async (orgDetails) => {
  let params = getParamsFromObject(orgDetails || {});
  try {
    const response = await axiosInstance.post(`organization/get`, {
      ...orgDetails,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error, "error");
    throw error.response.data || error.message;
  }
};



export const subOrgEditAPi = async (orgDetails) => {
  try {
    const response = await axiosInstance.post(
      "organization/update",
      orgDetails
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error, "error");
    throw error.response.data || error.message;
  }
};
