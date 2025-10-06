import { createSlice } from "@reduxjs/toolkit";
import { HolidayListAction } from "../Action/Holiday/holiday";
import toast from "react-hot-toast";
import { QuotationStandardDesignationPrice, QuotationStandardPriceCreate, QuotationStandardPriceList, QuotationStandardPriceUpdate } from "../Action/Quotation/Price";

const initialState = {
  quotationPriceList: [],
  quotationPrice:{},
  loading: false,
  status: "idle",
  error: "",
  errorMessage: "",
  totalRecord: 0,
  limit: 10,
  pageNo: 1,
};

const QuotationStandardPrice = createSlice({
  name: "quotationStandardPrice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(QuotationStandardPriceList.pending, (state, action) => {
        state.pageNo = action?.meta?.arg?.page || 1;
        state.limit = action?.meta?.arg?.limit || 10;
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(QuotationStandardPriceList.fulfilled, (state, action) => {
        console.log("dds", action);
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.quotationPriceList = action.payload?.data || [];
        state.totalRecord = action.payload?.totalRecord || 0;
        // if (state.holidays.length > 0) {
        //     toast.success(action.payload.message || "Holiday data loaded successfully");
        // }
      })
      .addCase(QuotationStandardPriceList.rejected, (state, action) => {
        toast.dismiss();
        console.log("QuotationStandardPriceList Error:", action);
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message || "Failed to load quotation standard prices";
        toast.error(state.error);
      });
//create
      builder
      .addCase(QuotationStandardPriceCreate.pending, (state, action) => {
      state.quotationPrice= action?.meta?.arg || {};
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(QuotationStandardPriceCreate.fulfilled, (state, action) => {
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.quotationPrice = action.payload?.data || {};
        state.totalRecord = action.payload?.totalRecord || 0;
        // if (state.holidays.length > 0) {
        //     toast.success(action.payload.message || "Holiday data loaded successfully");
        // }
      })
      .addCase(QuotationStandardPriceCreate.rejected, (state, action) => {
        toast.dismiss();
        console.log("QuotationStandardPriceCreate Error:", action);
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message || "Failed to create quotation standard prices";
        toast.error(state.error);
      });
//update
      builder
      .addCase(QuotationStandardPriceUpdate.pending, (state, action) => {
      state.quotationPrice= action?.meta?.arg || {};
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(QuotationStandardPriceUpdate.fulfilled, (state, action) => {
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.quotationPrice = action.payload?.data || {};
        state.totalRecord = action.payload?.totalRecord || 0;
        // if (state.holidays.length > 0) {
        //     toast.success(action.payload.message || "Holiday data loaded successfully");
        // }
      })
      .addCase(QuotationStandardPriceUpdate.rejected, (state, action) => {
        toast.dismiss();
        console.log("QuotationStandardPriceUpdate Error:", action);
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message || "Failed to update quotation standard prices";
        toast.error(state.error);
      });

      // get by Designation
       builder
      .addCase(QuotationStandardDesignationPrice.pending, (state, action) => {
      state.quotationPrice= action?.meta?.arg || {};
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(QuotationStandardDesignationPrice.fulfilled, (state, action) => {
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.quotationPrice = action.payload?.data || {};
        state.totalRecord = action.payload?.totalRecord || 0;
        // if (state.holidays.length > 0) {
        //     toast.success(action.payload.message || "Holiday data loaded successfully");
        // }
      })
      .addCase(QuotationStandardDesignationPrice.rejected, (state, action) => {
        toast.dismiss();
        console.log("QuotationStandardDesignationPrice Error:", action);
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message || "Failed to create quotation standard prices";
        toast.error(state.error);
      });

  },
});

export default QuotationStandardPrice.reducer;
