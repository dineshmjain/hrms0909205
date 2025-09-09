import axiosInstance from "../../config/axiosInstance";

export const GetShiftDetails = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "attendance/get/currentDay",
      userCredentials
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};
export const addAttendenceApi = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "attendance/add",
      userCredentials
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};

export const getMonthlyUserAttendance = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "attendance/list",
      userCredentials
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};

export const getSingleDayUserAttendance = async (userCredentials) => {
  try {
    const response = await axiosInstance.post(
      "attendance/attendanceLog/list",
      userCredentials
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};
export const getAttendanceReportApi = async (filters) => {
  try {
    const response = await axiosInstance.post(
      "attendance/month/analytics",
      filters
    );
    console.log("Attendance Report API Success -->", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Attendance Report API Error:",
      error.response?.data || error.message
    );
    throw (
      error.response?.data || {
        message: error.message || "Something went wrong",
      }
    );
  }
};
export const getAttendanceMonthLogsApi = async (filters) => {
  try {
    const response = await axiosInstance.post("attendance/month/logs", filters);
    return response.data;
  } catch (error) {
    console.error(
      "Attendance Month Logs API Error:",
      error.response?.data || error.message
    );
    throw (
      error.response?.data || {
        message: error.message || "Something went wrong",
      }
    );
  }
};
export const getAttendanceshiftMonthLogsApi = async (filters) => {
  try {
    const response = await axiosInstance.post(
      "attendance/date/wise/log/list",
      filters
    );
    return response.data;
  } catch (error) {
    console.error(
      "Attendance Shift Days Logs API Error:",
      error.response?.data || error.message
    );
    throw (
      error.response?.data || {
        message: error.message || "Something went wrong",
      }
    );
  }
};


export const getAttendanceApprovals = async (data) => {
  try {
    const response = await axiosInstance.post("/attendance/status/get", data);
    console.log("Attendance Approvals API Success -->", response.data);
    return response.data;
  } catch (error) {
    console.log("Attendance Approvals API Error:", error);
    throw (
      error.response?.data || {
        message: error.message || "Something went wrong",
      }
    );
  }
};

export const getAttendanceDayApprovalsApi = async (data) => {
  try {
    const response = await axiosInstance.post("/attendance/approve/reject", data);
    console.log("Attendance Day Approvals API Success -->", response.data);
    return response.data;
  } catch (error) {
    console.log("Attendance Day Approvals API Error:", error);
    throw (
      error.response?.data || {
        message: error.message || "Something went wrong",
      }
    );
  }
};

