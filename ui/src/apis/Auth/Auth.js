import axiosInstance from "../../config/axiosInstance";

// Login API
export const loginApi = async (userCredentials) => {
    try {
        const response = await axiosInstance.post('auth/login', userCredentials);
        console.log(response?.data)
        return response?.data;
    } catch (error) {
        throw error?.response?.data || error?.message;
    }
};

// Register API
export const registerApi = async (userDetails) => {
    try {
        console.log(userDetails)
        const { confirmPassword, ...rest } = userDetails
        const response = await axiosInstance.post('auth/register', rest);
        console.log(response.data)
        return response.data;
    } catch (error) {

        console.log(error, 'register')
        throw error.response.data || error.message;
    }
};

// verify OTP
export const verifyOTPApi = async (userDetails) => {
    try {
        console.log(userDetails)
        const response = await axiosInstance.post('auth/verify', userDetails);
        console.log(response.data)
        return response.data;

    } catch (error) {
        console.log(error)
        throw error.response.data || error.message;
    }
};

export const getUserDetails = async (reqbody) => {
    try {
        const response = await axiosInstance.post('user/getDetails', reqbody);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
}

//resend OTP or Send OTP
export const sendOTPApi = async (userDetails) => {
    console.log(userDetails)
    try {
        const response = await axiosInstance.post('auth/send/otp', userDetails);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};


//role Modules 


