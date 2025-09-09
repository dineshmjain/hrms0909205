import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  EmployeeBulkUploadAction,
  EmployeeClientListAction,
  EmployeeCreateAction,
  EmployeeDetailsByTypeAction,
  EmployeeEditAction,
  EmployeeGetAction,
  EmployeeOfficialDetailsAction,
  EmployeeOfficialEditAction,
  EmployeeSampleFormatAction,
  EmployeeAddressCreateAction,
  EmployeeUpdatePasswordAction,
  EmployeeGetActionForFilter,
  GetEmployeeDesginationRoleAction,
  UpdateEmployeeDisabledModulesAction,
} from "../Action/Employee/EmployeeAction";

const initialState = {
  // employeeList: [],
  employeeList: [],
  loading: false,
  status: "idle",
  error: "",
  employee: {},
  employeeDetails: {},
  totalRecord: 0,
  employeeOfficial: {},
  employeePassword: {},
  employeeBulkCreate: {},
  sampleFilePath: {},
  pageNo: 1,
  limit: 10,
  employeePersonalDetails: {}, //  add this
  employeeAddressDetails: {}, //  add this
  clientPageNo: 1,
  clientLimit: 10,
  clientTotalRecord: 0,
  employeesFilters: [],
  employeeRoleDetails :[],
  employeeDisabled:{}
};

const EmployeeReducer = createSlice({
  name: "EmployeeList",
  initialState,
  reducers: {
    // to change client user mapping status on ui
    changeMappingStatus(state, action) {
      const { id, isActive } = action.payload;
      const emp = state.employeeList.find((emp) => emp._id === id);
      if (emp) {
        emp.clientAssigned = isActive;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(EmployeeGetAction.pending, (state, action) => {
        state.pageNo = action?.meta?.arg?.page || 1;
        state.limit = action?.meta?.arg?.limit || 10;
        state.status = "loading";
        state.error = false;
        state.loading = true;
        // state.totalRecord = 0
      })

      .addCase(EmployeeGetAction.fulfilled, (state, action) => {
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.totalRecord = action.payload.totalRecord;
        state.employeeList = action.payload.data; // This should work as per your payload structure
        console.log("Employee list:", action.payload.data); // This should also show the array
      })

      .addCase(EmployeeGetAction.rejected, (state, action) => {
        state.status = "error";
        state.error = "";
        state.loading = false;
        state.employeeList = [];

        // state.totalRecord = 0;
      });
    builder
      .addCase(EmployeeClientListAction.pending, (state, action) => {
        state.clientPageNo = action?.meta?.arg?.page || 1;
        state.clientLimit = action?.meta?.arg?.limit || 10;
        state.status = "loading";
        state.error = false;
        state.loading = true;
        state.clientTotalRecord = 0;
      })

      .addCase(EmployeeClientListAction.fulfilled, (state, action) => {
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.clientTotalRecord = action.payload.data?.totalRecord || 0;
        state.employeeList = action.payload.data?.data || []; // This should work as per your payload structure
        console.log("Employee Client list:", action.payload.data); // This should also show the array
      })

      .addCase(EmployeeClientListAction.rejected, (state, action) => {
        state.status = "error";
        state.error = "";
        state.loading = false;
        state.clientTotalRecord = 0;
        state.employeeList = [];
      });

    //create Employee
    builder
      .addCase(EmployeeCreateAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })

      .addCase(EmployeeCreateAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Check this log
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.employee = action.payload.data; // This should work as per your payload structure
        console.log("Employee list:", action.payload.data); // This should also show the array
      })

      .addCase(EmployeeCreateAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage = !backendError?.data?.validation
          ? backendError?.data?.message
          : backendError?.data?.validation?.body?.message ||
            backendError?.message ||
            "Something went wrong";

        state.error = validationMessage;
        console.log("Employee Create Error:", backendError?.data);

        toast.error(validationMessage);
      });

    //get Employee details By Type
    builder
      .addCase(EmployeeDetailsByTypeAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })

      .addCase(EmployeeDetailsByTypeAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Check this log
        state.status = "success";
        state.error = "";
        state.loading = false;
        // state.employeeDetails = action.payload.data; // This should work as per your payload structure
        if (action.meta.arg.type === "personal") {
          state.employeePersonalDetails = action.payload.data;
        } else if (action.meta.arg.type === "address") {
          state.employeeAddressDetails = action.payload.data;
        }
        state.employeeDetails = action.payload.data;
        console.log("Employee type:", action.payload.data); // This should also show the array
      })

      .addCase(EmployeeDetailsByTypeAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage = !backendError?.data?.validation
          ? backendError?.data?.message
          : backendError?.data?.validation?.body?.message ||
            backendError?.message ||
            "Something went wrong";

        state.error = validationMessage;
        console.log("Employee Details by  Error:", backendError?.data);

        toast.error(validationMessage);
      });

    //update User Basic Details
    builder
      .addCase(EmployeeEditAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })

      .addCase(EmployeeEditAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Check this log
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.employee = action.payload.data; // This should work as per your payload structure
        console.log("Employee list:", action.payload.data); // This should also show the array
        toast.success(action.payload?.message);
      })

      .addCase(EmployeeEditAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage = !backendError?.data?.validation
          ? backendError?.data?.message
          : backendError?.data?.validation?.body?.message ||
            backendError?.message ||
            "Something went wrong";

        state.error = validationMessage;
        console.log("Employee Create Error:", backendError?.data);

        toast.error(validationMessage);
      });

    //get User Officaial Details
    builder
      .addCase(EmployeeOfficialDetailsAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })

      .addCase(EmployeeOfficialDetailsAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Check this log
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.employeeOfficial = action.payload.data; // This should work as per your payload structure
        console.log("Employee list:", action.payload.data); // This should also show the array
        toast.success(action.payload?.message);
      })

      .addCase(EmployeeOfficialDetailsAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage = !backendError?.data?.validation
          ? backendError?.data?.message
          : backendError?.data?.validation?.body?.message ||
            backendError?.message ||
            "Something went wrong";

        state.error = validationMessage;
        console.log("Employee Create Error:", backendError?.data);

        // toast.error(validationMessage);
      });
    //bulk upload employee/user
    builder
      .addCase(EmployeeBulkUploadAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(EmployeeBulkUploadAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.employeeBulkCreate = action?.payload || {}; // Ensure this is the correct path to the data
        console.log("employeee bulk Create :", action);
        toast.success(action.payload.message);
      })
      .addCase(EmployeeBulkUploadAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";

        state.error = validationMessage;
        console.log("Deg Create Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });
    //sample download fileFormat
    builder
      .addCase(EmployeeSampleFormatAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(EmployeeSampleFormatAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.sampleFilePath = action?.payload || {}; // Ensure this is the correct path to the data
        console.log("employee bulk Create :", action);
        toast.success("Sample File Downloaded Successfully");
      })
      .addCase(EmployeeSampleFormatAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Failed to download File";

        state.error = validationMessage;
        console.log("sample File Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });
    // Employee Offical Details Edit
    builder
      .addCase(EmployeeOfficialEditAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })

      .addCase(EmployeeOfficialEditAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Check this log
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.employeeOfficial = action.payload.data; // This should work as per your payload structure
        console.log("Employee list:", action.payload.data); // This should also show the array
        toast.success(action.payload?.message);
      })

      .addCase(EmployeeOfficialEditAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage = !backendError?.data?.validation
          ? backendError?.data?.message
          : backendError?.data?.validation?.body?.message ||
            backendError?.message ||
            "Something went wrong";

        state.error = validationMessage;
        console.log("Employee Create Error:", backendError?.data);

        // toast.error(validationMessage);
      });

    //Employee Address Update
    builder
      .addCase(EmployeeAddressCreateAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })

      .addCase(EmployeeAddressCreateAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Check this log
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.employeeOfficial = action.payload.data; // This should work as per your payload structure
        console.log("Employee list:", action.payload.data); // This should also show the array
        toast.success(action.payload?.message);
      })

      .addCase(EmployeeAddressCreateAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage = !backendError?.data?.validation
          ? backendError?.data?.message
          : backendError?.data?.validation?.body?.message ||
            backendError?.message ||
            "Something went wrong";

        state.error = validationMessage;
        console.log("Employee Create Error:", backendError?.data);

        // toast.error(validationMessage);
      });
    //employeeForFilter
    builder
      .addCase(EmployeeGetActionForFilter.pending, (state, action) => {
        state.clientPageNo = action?.meta?.arg?.page || 1;
        state.clientLimit = action?.meta?.arg?.limit || 10;
        state.status = "loading";
        state.error = false;
        state.loading = true;
        state.clientTotalRecord = 0;
      })

      .addCase(EmployeeGetActionForFilter.fulfilled, (state, action) => {
        state.status = "success";
        state.error = "";
        state.loading = false;
        // state.clientTotalRecord = action.payload.data?.totalRecord || 0;

        console.log(
          "Full payload:====================================",
          action.payload
        ); // Check this log

        const filteredData =
          action.payload?.data?.map((d) => {
            return { ...d, mergedName: `${d?.firstName} ${d?.lastName}` };
          }) || [];
        state.employeesFilters = filteredData || []; // This should work as per your payload structure
        console.log("Employee Client list:", filteredData); // This should also show the array
      })

      .addCase(EmployeeGetActionForFilter.rejected, (state, action) => {
        state.status = "error";
        state.error = "";
        state.loading = false;
        state.clientTotalRecord = 0;
        state.employeeList = [];
      });
    // Employee Update Password  Edit
    builder
      .addCase(EmployeeUpdatePasswordAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })

      .addCase(EmployeeUpdatePasswordAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Check this log
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.employeePassword = action.payload.data; // This should work as per your payload structure
        console.log("Employee Update Password  :", action.payload.data); // This should also show the array
        toast.success(action.payload?.message);
      })

      .addCase(EmployeeUpdatePasswordAction.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;

        const message =
          action.payload?.message || // ✅ Use message from rejectWithValue
          action.error?.message ||
          "Something went wrong";

        state.error = message;
        toast.error(message); // ✅ Now you'll see: Password must contain...
      })
      //employee Role Details
       builder
      .addCase(GetEmployeeDesginationRoleAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })

      .addCase(GetEmployeeDesginationRoleAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Check this log
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.employeeRoleDetails = action.payload.data; // This should work as per your payload structure
        console.log("Employee list:", action.payload.data); // This should also show the array
        toast.success(action.payload?.message);
      })

      .addCase(GetEmployeeDesginationRoleAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage = !backendError?.data?.validation
          ? backendError?.data?.message
          : backendError?.data?.validation?.body?.message ||
            backendError?.message ||
            "Something went wrong";

        state.error = validationMessage;
        console.log("Employee Create Error:", backendError?.data);

        toast.error(validationMessage);
      });

         //employee Role Modules Update
       builder
      .addCase(UpdateEmployeeDisabledModulesAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })

      .addCase(UpdateEmployeeDisabledModulesAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Check this log
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.employeeDisabled = action.payload.data; // This should work as per your payload structure
        console.log("Employee list:", action.payload.data); // This should also show the array
        toast.success(action.payload?.message);
      })

      .addCase(UpdateEmployeeDisabledModulesAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage = !backendError?.data?.validation
          ? backendError?.data?.message
          : backendError?.data?.validation?.body?.message ||
            backendError?.message ||
            "Something went wrong";

        state.error = validationMessage;
        console.log("Employee Create Error:", backendError?.data);

        toast.error(validationMessage);
      });

  },
});

export const { changeMappingStatus } = EmployeeReducer.actions;

export default EmployeeReducer.reducer;
