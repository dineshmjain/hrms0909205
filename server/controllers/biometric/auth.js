import { addDeviceAccessToken, getDeviceAccessToken } from "../../models/biometric/auth.js";
import * as apiResponse from "../../helper/apiResponse.js";
import axios from "axios";

// ✅ Corrected function name
export const createDeviceToken = async (request, response, next) => {
    try {
        const data = {
            appKey: process.env.BIOMETRIC_APP_KEY,       // ✅ use process.env for Node
            secretKey: process.env.BIOMETRIC_SECERET_KEY,
        };
        const baseurl = `${process.env.BIOMETRIC_BASE_URL}/api/hccgw/platform/v1/token/get`
        console.log("baseurl", data, baseurl)
        const apiRes = await axios.post(
            baseurl,
            data
        );

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

export const isTokenDeviceExists = async (request, response, next) => {
    try {
        // ✅ check existing token in DB
        const token = await getDeviceAccessToken({ type: "HikVision" });

        if (token.status && token.data?.data.length > 0) {
            // only assign actual token
            request.body.deviceAccessToken = token.data?.data[0]?.accessToken;
            return next();
        } else {

            // ✅ create new token
            const tokenData = await createDeviceToken(request, response, next);
            console.log("tokenData", tokenData);
            const body = {
                type: "HikVision",
                ...tokenData?.data,
            }
            console.log("body", body);
            const createToken = await addDeviceAccessToken(body);
            console.log("createToken", createToken);
            if (createToken.status) {
                request.body.deviceAccessToken = createToken.data?.accessToken;
                return next();
            } else {
                return apiResponse.ErrorResponse(response, "Unable to create token!");
            }
        }
    } catch (error) {
        console.error("Error in isTokenExists", { stack: error.stack });
        return apiResponse.somethingResponse(response, error?.message);
    }
};
export const getDeviceToken = async (request, response, next) => {
    try {
        const tokenResult = await getDeviceAccessToken({ type: "HikVision" });

        const existingToken = tokenResult?.data?.data?.[0];

        if (tokenResult.status && existingToken?.accessToken) {
            const now = Date.now(); // Current time in milliseconds
            const expireTime = new Date(existingToken.expireTime).getTime(); // Token expiry time in ms

            if (!expireTime || isNaN(expireTime)) {
                console.warn("⚠️ Invalid expireTime format in token:", existingToken.expireTime);
                return apiResponse.ErrorResponse(res, "Invalid token expiry format.");
            }

            if (expireTime > now) {
                // ✅ Token is still valid
                request.body.deviceAccessToken = existingToken.accessToken;
                return next();
            } else {
                // ❌ Token expired

                const tokenData = await createDeviceToken(request, response, next);
                console.log("tokenData", tokenData);
                const body = {
                    type: "HikVision",
                    ...tokenData?.data,
                }
                console.log("body", body);
                const createToken = await addDeviceAccessToken(body);
                console.log("createToken", createToken);
                if (createToken.status) {
                    request.body.deviceAccessToken = createToken.data?.accessToken;
                    return next();
                } else {
                    return apiResponse.ErrorResponse(response, "Unable to create token!");
                }
            }
        } else {
            const tokenData = await createDeviceToken(request, response, next);
            console.log("tokenData", tokenData);
            const body = {
                type: "HikVision",
                ...tokenData?.data,
            }
            console.log("body", body);
            const createToken = await addDeviceAccessToken(body);
            console.log("createToken", createToken);
            if (createToken.status) {
                request.body.deviceAccessToken = createToken.data?.accessToken;
                return next();
            } else {
                return apiResponse.ErrorResponse(response, "Unable to create token!");
            }
        }
    } catch (error) {
        console.error("❌ Error in getDeviceToken:", error.stack);
        return apiResponse.somethingResponse(response, error.message || "Unexpected error");
    }
};
