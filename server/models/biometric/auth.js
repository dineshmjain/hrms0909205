import { create, aggregate } from "../../helper/mongo.js";


const collection_name = "biometricToken"


export const addDeviceAccessToken = async (body) => {
    try {
        const query = {
            ...body,
            createdAt: new Date(),
        }
        console.log("query", query);
        return await create(query, collection_name);
    }
    catch (error) {
        console.log(error);
        return { status: false, message: "Unable to Add Token Data" };
    }
}

export const getDeviceAccessToken = async (body) => {
    try {
        const query = [
            {
                $match: {
                    ...body
                }
            }, {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $limit: 1
            }
        ]
        const tokens = await aggregate(query, collection_name);
        return { status: true, data: tokens };
    } catch (error) {
        console.log(error);
        return { status: false, message: "Unable to Get Token Data" };
    }
}