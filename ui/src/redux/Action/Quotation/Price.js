import { createAsyncThunk } from "@reduxjs/toolkit";
import { addStandardPrice, getDesignationQuotationPrice, getStandardPrice, updateQuotationPrice } from "../../../apis/Quotation/Price";


export const QuotationStandardPriceCreate = createAsyncThunk('quotationStandardPriceCreate', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        const data = await addStandardPrice(userCredentials);
        console.log('QuotationStandardPriceCreate Successs -->', data)
        return data;
    } catch (error) {
        console.log('QuotationStandardPriceCreate Error -->',error, error.message)
         return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});

export const QuotationStandardPriceList = createAsyncThunk('quotationStandardPriceList', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        const data = await getStandardPrice(userCredentials);
        console.log('QuotationStandardPriceList Successs -->', data)
        return data;
    } catch (error) {
        console.log('QuotationStandardPriceList Error -->',error, error.message)
         return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});

export const QuotationStandardPriceUpdate = createAsyncThunk('quotationStandardPriceUpdate', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        const data = await updateQuotationPrice(userCredentials);
        console.log('QuotationStandardPriceUpdate Successs -->', data)
        return data;
    } catch (error) {
        console.log('QuotationStandardPriceUpdate Error -->',error, error.message)
         return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});
export const QuotationStandardDesignationPrice = createAsyncThunk('quotationStandardDesignationPrice', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        const data = await getDesignationQuotationPrice(userCredentials);
        console.log('QuotationStandardDesignationPrice Successs -->', data)
        return data;
    } catch (error) {
        console.log('QuotationStandardDesignationPrice Error -->',error, error.message)
         return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});


