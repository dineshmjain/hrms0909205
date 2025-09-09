import axios from "axios";
import axiosInstance from "../../config/axiosInstance";
import { getParamsFromObject } from "../../constants/reusableFun";



export const getOverAllDashboard = async (data) => {

    try {
        const response =await axiosInstance.post('dashboard/overall')

        return response?.data;
    } catch (error) {
        throw error?.response?.data || error?.message || error;
    }
};

