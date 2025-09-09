import axiosInstance from "../../config/axiosInstance";
import { getParamsFromObject } from "../../constants/reusableFun";

export const EmployeeCreateApi = async (empDetails) => {
  try {
    const response = await axiosInstance.post("user/create", empDetails);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const EmployeeListApi = async (empDetails) => {
  try {
    const response = await axiosInstance.post(`user/get`, { ...empDetails });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

export const EmployeeEditApi = async (empDetails) => {
  try {
    const response = await axiosInstance.post(`user/update`, { ...empDetails });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response.data);
    throw error.response.data || error.message;
  }
};

export const EmployeeGetById = async (empDetails) => {
  try {
    console.log("Get employee with ID:", empDetails.type);
    const response = await axiosInstance.post(`user/get/${empDetails.type}`, {
      ...empDetails?.body,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error.response.data || error.message;
  }
};

export const EmployeeDetailsbyType = async (empDetails) => {
  try {
    console.log("Get employee with ID:", empDetails.id);
    const response = await axiosInstance.post(`user/get/:${empDetails?.type}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response.data);
    throw error.response.data || error.message;
  }
};

export const EmployeeOfficailDetailsGet = async (empDetails) => {
  console.log(
    empDetails,
    "employeeeeeeeeeeeeeeeeeeeee================================"
  );
  try {
    console.log("Get employee with ID:", empDetails.id);
    const response = await axiosInstance.post(`user/get/official`, empDetails);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response.data);
    throw error.response.data || error.message;
  }
};

export const EmployeeClientMapApi = async (reqbody) => {
  try {
    const response = await axiosInstance.post(
      `user/client/multiple/mapping`,
      reqbody
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response.data);
    throw error.response.data || error.message;
  }
};
export const EmployeeClientUnMapApi = async (reqbody) => {
  try {
    const response = await axiosInstance.post(
      `user/client/multiple/un-map`,
      reqbody
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response.data);
    throw error.response.data || error.message;
  }
};

export const EmployeeExcelBlukUpload = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "user/import/excel",
      userCredentials,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

export const EmployeeSampleFileDownload = async (userCredentials) => {
  try {
    const response = await axiosInstance.get("user/excel/format");
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};
export const EmployeeClientListApi = async (reqbody) => {
  try {
    const { orgIds,employeeIds, ...rest } = reqbody;
    const data = { ...rest, subOrgIds: reqbody?.orgIds };
    console.log(data, "resnt");
    const response = await axiosInstance.post(`user/client/list`, data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response.data);
    throw error.response.data || error.message;
  }
};

export const EmployeeOfficailDetailsEdit = async (empDetails) => {
  console.log(
    empDetails,
    "employeeeeeeeeeeeeeeeeeeeee Edit================================"
  );
  try {
    console.log("Get employee with ID:", empDetails.id);
    const response = await axiosInstance.post(
      `user/update/official`,
      empDetails
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response.data);
    throw error.response.data || error.message;
  }
};
export const EmployeeUpdatePasswordApi = async (passwordData) => {
  try {
    const { id, password } = passwordData;

    console.log("Password data payload:", { id, password });

    const response = await axiosInstance.post(`auth/reset/password`,
      { password,id } // Password in body
    
    );

    console.log("Update Password Success -->", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Update Password API Error:",
      error.response?.data || error.message
    );
    throw {
      response: {
        data: error.response?.data || { message: "Something went wrong" },
      },
    };
  }
};

export const EmployeeAddressCreateApi = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `user/update/address`, // ✅ Fixed endpoint
      payload
    );
    console.log("employee address", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data);
    throw error.response?.data || error.message;
  }
};
export const GetEmployeeDesginationRoleApi = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `user/designation/role/modules`,
      payload
    );
    console.log("employee role", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data);
    throw error.response?.data || error.message;
  }
};
export const UpdateEmployeeDisabledModulesApi = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `user/update/disabled/modules`,
      payload
    );
    console.log("employee role", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data);
    throw error.response?.data || error.message;
  }
};
