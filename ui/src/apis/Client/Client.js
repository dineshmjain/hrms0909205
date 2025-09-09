import axiosInstance from "../../config/axiosInstance";
import { getParamsFromObject } from "../../constants/reusableFun";

export const clientCreateApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post("client/add", userCredentials);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};
export const clientListApi = async (userCredentials = {}) => {
  try {
    const response = await axiosInstance.post(`client/list`, userCredentials);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};
export const clientListEmpWiseApi = async (userCredentials = {}) => {
  try {
    const response = await axiosInstance.post(`user/clients`, userCredentials);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};
export const clientUpdateApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post("client/edit", userCredentials);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

export const clientUpdateKYCApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "client/updateKYC",
      userCredentials
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

//create client owner
export const clientOwnerCreateApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "client/add/owner",
      userCredentials
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

//create client edit
export const clientOwnerEditApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "client/add/owner",
      userCredentials
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};
//Get client owner
export const clientOwnerGetApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "client/get/owner",
      userCredentials
    );
    console.log(response.data, "owner details get");
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};
export const clientKYCCreateApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "client/add/kyc",
      userCredentials
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

export const clientKYCGetApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "client/get/kyc",
      userCredentials
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};
export const clientKYCEditApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "client/edit/kyc",
      userCredentials
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

export const clientExcelBlukUpload = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "client/import/excel",
      userCredentials,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

export const clientSampleFileDownload = async (userCredentials) => {
  try {
    const response = await axiosInstance.get("client/excel/format");
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

export const clientDepartments = async (userCredentials) => {
  try {
    const response = await axiosInstance.post("client/user/department/get", {
      ...userCredentials,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};
export const clientDesignations = async (userCredentials) => {
  try {
    const response = await axiosInstance.post("client/user/designation/get", {
      ...userCredentials,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

export const ClientStatusUpdateApi = async (clientDetails) => {
  try {
    console.log(
      clientDetails,
      "<=========================================sent to api"
    );
    const response = await axiosInstance.post(
      `client/active/deactivate`,
      clientDetails
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};

export const ClientBranchStatusUpdateApi = async (clientbranchDetails) => {
  try {
    console.log(
      clientbranchDetails,
      "<=========================================sent to api"
    );
    const response = await axiosInstance.post(
      `client/branch/active/deactivate`,
      clientbranchDetails
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};
export const ClientEmergencyContactsGetApi = async (clientemergencycontacts) => {
  try {
    console.log(
      clientemergencycontacts,
      "<=========================================sent to api"
    );
    const response = await axiosInstance.post(
      `emergency/contacts/list`,
      clientemergencycontacts
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};
export const ClientEmergencyContactsAddApi = async (clientemergencycontactsadd) => {
  try {
    console.log(
      clientemergencycontactsadd,
      "<=========================================sent to api"
    );
    const response = await axiosInstance.post(
      `emergency/contacts/add`,
      clientemergencycontactsadd
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};
export const ClientEmergencyContactsEditApi = async (clientemergencycontactsadd) => {
  try {
    console.log(
      clientemergencycontactsadd,
      "<=========================================sent to api"
    );
    const response = await axiosInstance.post(
      `emergency/contacts/update`,
      clientemergencycontactsadd
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};
export const ClientDefaultSettingsListApi = async (clientdefaultsettingsget) => {
  try {
    console.log(
      clientdefaultsettingsget,
      "<==========sent to api"
    );
    const response = await axiosInstance.post(
      `settings/client/report/time/get`,
      clientdefaultsettingsget
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};
export const ClientDefaultSettingsAddApi = async (clientdefaultsettingsadd) => {
  try {
    console.log(
      clientdefaultsettingsadd,
      "<==========sent to api"
    );
    const response = await axiosInstance.post(
      `settings/client/report/time`,
      clientdefaultsettingsadd
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};

