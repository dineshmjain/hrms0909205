import axiosInstance from "../../config/axiosInstance";


export const ShiftGroupCreateApi  = async (payload) =>  {
    try {
        payload = Object.fromEntries(
            Object.entries(payload).filter(([_, value]) => {
                return value !== "" && value !== undefined && !(Array.isArray(value) && value.length === 0);
            })
        );
        const response = await axiosInstance.post('shiftGroup/create', payload);
        return response.data;
    } catch (error) {
        throw error
    }
};
export const ShiftGroupGetApi = async (shiftGroupDetails) => {
    try {
        const response = await axiosInstance.get('shiftGroup/list', shiftGroupDetails);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error
    }
};