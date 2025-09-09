import axiosInstance from "../../config/axiosInstance";

export const HolidayCreateApi = async (holidayDetails) => {
  try {
    const response = await axiosInstance.post("holiday/create", holidayDetails);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error, "error");
    // return rejectWithValue(error);
    throw error;
  }
};

export const HolidayListApi = async (holidayDetails) => {
  try {
    const response = await axiosInstance.post(`holiday/get`, holidayDetails);
    return response.data;
  } catch (error) {
    console.log(error, "errorererereere");
    throw error.response?.data || error.message;
  }
};

export const HolidayEditAPi = async (holidayDetails) => {
  try {
    const response = await axiosInstance.post(
      "holiday/update",
      holidayDetails
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error, "error");
    throw error.response.data || error.message;
  }
};