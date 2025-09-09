import { aggregate, create, getOne } from "../../helper/mongo.js";

const collection_name = "devices"


export const getDeviceList = async (body) => {
    try {
        const query = [
            {
                $match: {
                   orgId: body.orgId
                }
            }, 
        ]
        const tokens = await aggregate(query, collection_name);
        return { status: true, data: tokens };
    } catch (error) {
        console.log(error);
        return { status: false, message: "Unable to Get Token Data" };
    }
}
export const addDevice = async (body) => {
    try {
        const query = [
            {
                ...body,
                createdAt: new Date(),
               
            }, 
        ]
        const tokens = await create(query, collection_name);
        return { status: true, data: tokens };
    } catch (error) {
        console.log(error);
        return { status: false, message: "Unable to Get Token Data" };
    }
}