import axiosInstance from "../../config/axiosInstance";

// ---------- Salary Components ----------
export const SalaryComponentsGetApi = async (payload) => {
  try {
    const response = await axiosInstance.post(`/salary/component/list`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const SalaryComponentCreateApi = async (payload) => { 
  try {
    const response = await axiosInstance.post(`/salary/component/create`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const SalaryComponentUpdateApi = async (payload) => {
  try {
    const response = await axiosInstance.post(`/salary/component/update`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const SalaryComponentToggleApi = async (payload) => {
  try {
    const response = await axiosInstance.post(`/salary/component/toggle`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ---------- Salary Templates ----------
export const SalaryTemplatesGetApi = async (payload) => {
  try {
    const response = await axiosInstance.post(`/salary/template/list`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const SalaryTemplateCreateApi = async (payload) => {
  try {
    const response = await axiosInstance.post(`/salary/template/create`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ---------- Salary Template Preview ----------
export const SalaryTemplatePreviewApi = async (payload) => {
  try {
    const response = await axiosInstance.post(`/salary/template/preview`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
