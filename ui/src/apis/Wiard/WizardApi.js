import axiosInstance from "../../config/axiosInstance";
export const getStructureApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "organization/structure/get",
      userCredentials
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};
export const getOrganizationApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      // "/organization/wizard/add",
      "/organization/update/structure",
      userCredentials
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};
export const getOrganizationDetailsApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      // "/organization/wizard/add",
      "/organization/get/details",
      userCredentials
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};
export const getBranchCreationApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "/branch/wizard/add",
      userCredentials
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};

export const getWizardApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "/branch/wizard/get/all",
      userCredentials
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};
export const OtCreateApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post("/overtime/add", userCredentials);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};

export const OtUpdateApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "/overtime/update",
      userCredentials
    );
    return response.data;
  } catch (error) {
    console.log(error);

    throw error.response.data || error.message;
  }
};


export const OtGetApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "/overtime/get/list",
      userCredentials
    );
    return response.data;
  } catch (error) {
    console.log(error);

    throw error.response.data || error.message;
  }
};