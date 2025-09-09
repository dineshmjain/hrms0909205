import { createSlice } from "@reduxjs/toolkit";
import { HolidayListAction } from "../Action/Holiday/holiday";
import toast from "react-hot-toast";

const initialState = {
  holidays: [],
  loading: false,
  status: "idle",
  error: "",
  errorMessage: "",
  totalRecord: 0,
  limit: 10,
  pageNo: 1,
};

const HolidayReducer = createSlice({
  name: "holidays",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(HolidayListAction.pending, (state, action) => {
        state.pageNo = action?.meta?.arg?.page || 1;
        state.limit = action?.meta?.arg?.limit || 10;
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(HolidayListAction.fulfilled, (state, action) => {
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.holidays = action.payload?.data || [];
        state.totalRecord = action.payload?.totalRecord || 0;
        // if (state.holidays.length > 0) {
        //     toast.success(action.payload.message || "Holiday data loaded successfully");
        // }
      })
      .addCase(HolidayListAction.rejected, (state, action) => {
        toast.dismiss();
        console.log("HolidayListAction Error:", action);
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message || "Failed to load holidays";
        toast.error(state.error);
      });
  },
});

export default HolidayReducer.reducer;
