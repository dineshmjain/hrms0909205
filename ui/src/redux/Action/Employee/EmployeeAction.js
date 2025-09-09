import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  EmployeeCreateApi,
  EmployeeListApi,
  EmployeeEditApi,
  EmployeeGetById,
  EmployeeDetailsbyType,
  EmployeeOfficailDetailsGet,
  EmployeeClientMapApi,
  EmployeeClientUnMapApi,
  EmployeeClientListApi,
  EmployeeExcelBlukUpload,
  EmployeeSampleFileDownload,
  EmployeeOfficailDetailsEdit,
  EmployeeUpdatePasswordApi,
  EmployeeAddressCreateApi,
  GetEmployeeDesginationRoleApi,
  UpdateEmployeeDisabledModulesApi,
} from "../../../apis/Employee/Employee";
import toast from "react-hot-toast";

export const EmployeeCreateAction = createAsyncThunk(
  "EmployeeCreate",
  async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials);
    try {
      const data = await EmployeeCreateApi(userCredentials);
      console.log("Employee Success -->", data);
      return data;
    } catch (error) {
      console.log("Employee create Error -->", error);
      return rejectWithValue(
        error?.response || error || { message: "Unknown error occurred" }
      );
    }
  }
);

export const EmployeeGetAction = createAsyncThunk(
  "employeeList",
  async (empDetails, { rejectWithValue }) => {
    console.log(empDetails);

    const { orgIds, ...rest } = empDetails;
    const updatedEmpDetails = {
      ...rest,
      orgIds: !orgIds ? [] : typeof orgIds == "object" ? orgIds : [orgIds], // Assuming orgIds is the same as subOrgIds
    };
    try {
      const data = await EmployeeListApi(updatedEmpDetails); // Pass the parameters to the API function
      console.log("EmployeeGet Success -->", data);
      return data;
    } catch (error) {
      console.log("EmployeeGet Error -->", error);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);
export const EmployeeEditAction = createAsyncThunk(
  "employeeEditBasic",
  async (empDetails, { rejectWithValue }) => {
    console.log(empDetails);
    try {
      const data = await EmployeeEditApi(empDetails); // Pass the parameters to the API function
      console.log("EmployeeEdit Success -->", data);
      return data;
    } catch (error) {
      console.log("EmployEmployeeEdit Error -->", error);
      return rejectWithValue(error || { message: "Unknown error occurred" });
    }
  }
);
export const EmployeeGetbyIdAction = createAsyncThunk(
  "employeeEdit",
  async (empDetails, { rejectWithValue }) => {
    console.log(empDetails);
    try {
      const data = await EmployeeGetById(empDetails); // Pass the parameters to the API function
      console.log("EmployeeEdit Success -->", data);
      return data;
    } catch (error) {
      console.log("EmployEmployeeEdit Error -->", error);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const EmployeeDetailsByTypeAction = createAsyncThunk(
  "employeeEdit",
  async (empDetails, { rejectWithValue }) => {
    console.log(empDetails, "employeeeeeeeeeeeeeeeeeeeee");
    try {
      const data = await EmployeeGetById(empDetails); // Pass the parameters to the API function
      console.log("EmployeeDetailsType Success -->", data);
      return data;
    } catch (error) {
      console.log("EmployDetailsType Error -->", error);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const EmployeeOfficialDetailsAction = createAsyncThunk(
  "employeeOfficial",
  async (empDetails, { rejectWithValue }) => {
    console.log(
      empDetails,
      "employeeeeeeeeeeeeeeeeeeeee================================"
    );
    try {
      const data = await EmployeeOfficailDetailsGet(empDetails); // Pass the parameters to the API function
      console.log("EmployeeDetailsType Success -->", data);
      return data;
    } catch (error) {
      console.log("EmployDetailsType Error -->", error);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const EployeeClientMappingAction = createAsyncThunk(
  "employeeMapping",
  async (empDetails, { rejectWithValue }) => {
    try {
      const data = await EmployeeClientMapApi(empDetails); // Pass the parameters to the API function
      console.log("EmployeeMap Success -->", data);
      // toast.success("Employee Mapped!")
      return data;
    } catch (error) {
      console.log("EmployeeMap Error -->", error);
      // toast.error("Error Mapping Employee!")

      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const EployeeClientUnMappingAction = createAsyncThunk(
  "employeeUnMapping",
  async (empDetails, { rejectWithValue }) => {
    try {
      const data = await EmployeeClientUnMapApi(empDetails); // Pass the parameters to the API function
      console.log("EmployeeUnMap Success -->", data);
      // toast.success("Employee Un-Mapped!")

      return data;
    } catch (error) {
      console.log("EmployeeUnMap Error -->", error);
      // toast.error("Error Un-Mapping Employee!")

      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);
export const EmployeeClientListAction = createAsyncThunk(
  "employeeList   ",

  async (empDetails, { rejectWithValue }) => {
    console.log("EmployeeClientListAction called", empDetails);
    try {
      const { orgIds, ...rest } = empDetails;
      const updatedEmpDetails = {
        ...rest,
        subOrgIds: !orgIds ? [] : typeof orgIds == "object" ? orgIds : [orgIds], // Assuming orgIds is the same as subOrgIds
      };
      const data = await EmployeeClientListApi(updatedEmpDetails); // Pass the parameters to the API function
      console.log("EmployeeList Success -->", data);

      return data;
    } catch (error) {
      console.log("EmployeeList Error -->", error);

      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const EmployeeBulkUploadAction = createAsyncThunk(
  "EmployeeBulkUpload",
  async (userDetails, { rejectWithValue }) => {
    console.log(userDetails);
    try {
      const data = await EmployeeExcelBlukUpload(userDetails);
      console.log("user Bulk Upload Successs -->", data);
      return data;
    } catch (error) {
      console.log("user Bulk Upload Error -->", error);
      throw rejectWithValue(error);
    }
  }
);

export const EmployeeSampleFormatAction = createAsyncThunk(
  "EmployeeSampleFormat",
  async (userDetails, { rejectWithValue }) => {
    console.log(userDetails);
    try {
      const data = await EmployeeSampleFileDownload(userDetails);
      console.log("userSampleFormat Upload Successs -->", data);
      return data;
    } catch (error) {
      console.log("userSampleFormat Upload Error -->", error);
      throw rejectWithValue(error);
    }
  }
);

export const EmployeeOfficialEditAction = createAsyncThunk(
  "employeeOfficialEdit",
  async (empDetails, { rejectWithValue }) => {
    console.log(
      empDetails,
      "employeeeeeeeeeeeeeeeeeeeee================================"
    );
    try {
      const data = await EmployeeOfficailDetailsEdit(empDetails); // Pass the parameters to the API function
      console.log("EmployeeDetailsOfficial Edit Success -->", data);
      return data;
    } catch (error) {
      console.log("EmployeeDetailsOfficial Error -->", error);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const EmployeeUpdatePasswordAction = createAsyncThunk(
  "updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const data = await EmployeeUpdatePasswordApi(passwordData); // calling separate API component
      console.log("EmployeeUpdatePasswordAction Success -->", data);
      return data;
    } catch (error) {
      console.log("EmployeeUpdatePasswordAction Error -->", error);
      // Return only the backend error message
      return rejectWithValue(
        error.response?.data || { message: "Unexpected error" }
      );
    }
  }
);

export const EmployeeAddressCreateAction = createAsyncThunk(
  "employee/updateAddress",
  async (userDetails, { rejectWithValue }) => {
    try {
      const data = await EmployeeAddressCreateApi(userDetails);
      console.log("Employee Address Successs -->", data);
      return data;
    } catch (error) {
      return rejectWithValue(error || { message: "Unknown error" });
    }
  }
);
export const EmployeeGetActionForFilter = createAsyncThunk(
  "employeeList/Filters",
  async (empDetails, { rejectWithValue }) => {
    console.log(empDetails, "EmployeeGetActionForFilter");
    try {
      const { orgIds, ...rest } = empDetails;
      const updatedEmpDetails = {
        ...rest,
        orgIds: !orgIds ? [] : typeof orgIds == "object" ? orgIds : [orgIds], // Assuming orgIds is the same as subOrgIds
      };
      const data = await EmployeeListApi(updatedEmpDetails); // Pass the parameters to the API function
      console.log("EmployeeGet Success filterrrrrrrrrrrrrrrrrr -->", data);
      return data;
    } catch (error) {
      console.log("EmployeeGet Error -->", error);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);
export const GetEmployeeDesginationRoleAction = createAsyncThunk(
  "employee/getDesignationRole",
  async (empDetails, { rejectWithValue }) => {
    console.log(empDetails, "GetEmployeeDesginationRoleAction");
    try {

      const data = await GetEmployeeDesginationRoleApi(empDetails); // Pass the parameters to the API function
      console.log("EmployeeGetRole Success filterrrrrrrrrrrrrrrrrr -->", data);
      return data;
    } catch (error) {
      console.log("EmployeeGetRole Error -->", error);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);
export const UpdateEmployeeDisabledModulesAction = createAsyncThunk(
  "employee/UpdateDisableRoleModule",
  async (empDetails, { rejectWithValue }) => {
    console.log(empDetails, "UpdateDisableRoleModule");
    try {

      const data = await UpdateEmployeeDisabledModulesApi(empDetails); // Pass the parameters to the API function
      console.log("UpdateDisableRoleModule Success filterrrrrrrrrrrrrrrrrr -->", data);
      return data;
    } catch (error) {
      console.log("UpdateDisableRoleModule Error -->", error);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);