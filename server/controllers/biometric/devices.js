

import { addDeviceAccessToken, getDeviceAccessToken } from "../../models/biometric/auth.js";
import * as apiResponse from "../../helper/apiResponse.js";
import axios from "axios";

import { addDevice, getDeviceList } from "../../models/biometric/devices.js";
// ✅ Corrected function name

export const devicesFromCloud = async (request, response, next) => {
    try {
        const token = request?.body?.deviceAccessToken;

        const apiRes = await axios.post(
            `${process.env.BIOMETRIC_BASE_URL}/api/hccgw/platform/v1/token/get`,
            { pageIndex: 1, pageSize: 10, filter: { category: 'accessControllerDevice' } }, // empty body (or actual data if needed)
            {
                headers: {
                    Token: token
                }
            }
        );
        console.log("apiRes", apiRes?.data);

        if (apiRes?.data) {
            return apiRes.data; // ✅ return actual token data
        } else {
            throw new Error("Empty token response from Biometric API");
        }
    } catch (error) {
        console.error("Error creating device token", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
};
export const DeviceList = async (request, response, next) => {
    try {
        const devices = await getDeviceList({ orgId: request?.body?.user?.orgId });
        // const cloudDevices = await devicesFromCloud(request, response, next);

        // console.log("cloudDevices", cloudDevices);
        if (devices.status && devices.data.length > 0) {

            request.body.deviceList = devices.data;
            return next();
        } else {
            return apiResponse.notFoundResponse(response, "No devices found!");
        }
    } catch (error) {
        console.error("Error in getDeviceList", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
};

export const DeviceAdd = async (request, response, next) => {
    try {
        const devices = await addDevice({ orgId: request?.body?.user?.orgId });
        // const cloudDevices = await devicesFromCloud(request, response, next);

        // console.log("cloudDevices", cloudDevices);
        if (devices.status && devices.data.length > 0) {

            request.body.deviceList = devices.data;
            return next();
        } else {
            return apiResponse.notFoundResponse(response, "No devices found!");
        }
    } catch (error) {
        console.error("Error in getDeviceList", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
};
