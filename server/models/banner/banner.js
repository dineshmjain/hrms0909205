import { ObjectId } from 'mongodb';
import { aggregate, create, getMany, getOne, updateOne, sort, removeOne } from '../../helper/mongo.js';
import { convertToYYYYMMDD, getCurrentDateTime,setStartAndEndDate} from '../../helper/formatting.js';


export const addBanner = async (body) => {
    try {
        let query = {
            orgId: new ObjectId(body.user.orgId),
            image: body.ImagePath,
            ...(body.time && { time: body.time }),
            ...(body.title && { title: body.title }),
            ...(body.description && { description: body.description }),
            isActive: true,
            createdDate: getCurrentDateTime(),
            createdBy: new ObjectId(body.user._id)
            // order : parseInt(body.order)
        }
        // if both startDate and endDate are provided
        if (body.startDate && body.endDate) {
            const start = new Date(body.startDate);
            const end = new Date(body.endDate);

            query.startDate = new Date(start.setUTCHours(0, 0, 0, 0));
            query.endDate = new Date(end.setUTCHours(23, 59, 59, 999));
        }
        // only startDate
        else if (body.startDate) {
            const start = new Date(body.startDate);
            query.startDate = new Date(start.setUTCHours(0, 0, 0, 0));
        }
        // only endDate
        else if (body.endDate) {
            const end = new Date(body.endDate);
            query.endDate = new Date(end.setUTCHours(23, 59, 59, 999));
        }
        return await create(query, "banner" )
    } catch {
        return { status: false, message: "Failed to Add Banner Image" }
    }
}

export const getBanner = async (body) => {
    try {
        let query = {
            orgId : new ObjectId(body.user.orgId),
            isActive: true
        }
        
        if (body.portalType === false) {
            const currentDate = new Date();
            
            query.startDate = { $lte: currentDate };
            query.endDate = { $gte: currentDate };
            if (body.time) {
                // time is coming as "22:00"
                query.time = { $gte: body.time };
            }
        }
        
        return await getMany(query, "banner")
    } catch (error){
        return { status: false, message: "Failed to get Banner Images" }
    }
}


export const updateBannerOrder = async (body) => {
    try {
        let query = {
            _id: new ObjectId(body.bannerId)
        }

        let update = {
            $set: { order: body.orderNo }
        }
        return await updateOne(query, update, "banner")
    } catch (error) {
        return { status: false, message: "Failed to update Banner Images order" }
    }
}

export const update = async (body) => {
    try {
        let query = {
            _id: new ObjectId(body.bannerId)
        }
        const updateObj = {
            ...(body.time && { time: body.time }),
            ...(body.title && { title: body.title }),
            ...(body.description && { description: body.description }),
        }
        if (body.startDate && body.endDate) {
            const start = new Date(body.startDate);
            const end = new Date(body.endDate);

            updateObj.startDate = new Date(start.setUTCHours(0, 0, 0, 0));
            updateObj.endDate = new Date(end.setUTCHours(23, 59, 59, 999));
        }
        // only startDate
        else if (body.startDate) {
            const start = new Date(body.startDate);
            updateObj.startDate = new Date(start.setUTCHours(0, 0, 0, 0));
        }
        // only endDate
        else if (body.endDate) {
            const end = new Date(body.endDate);
            updateObj.endDate = new Date(end.setUTCHours(23, 59, 59, 999));
        }

        let update = {
            $set: {...updateObj,
                modifiedDate: new Date(), 
                modifiedBy: new ObjectId(body.user._id)
            },
            // $set: { isActive: fasle},
        }

        return await updateOne(query, update, "banner")
    } catch (error) {
        return { status: false, message: "Failed update Banner Image" }
    }
}

export const updateBannerImage = async (body) => {
    try {
        let query = {
            _id: new ObjectId(body.bannerId)
        }

        let update = {
            $set: {  image: body.ImagePath,modifiedDate: getCurrentDateTime(), modifiedBy: new ObjectId(body.user._id) }
        }

        return await updateOne(query, update, "banner")

        // return await removeOne(query, "banner")
    } catch (error) {
        return { status: false, message: "Failed delete Banner Image" }
    }
}

export const isBannerValid = async (body) => {
    try {
        let query = {
            _id: new ObjectId(body.bannerId),
            isActive: true
        }

        return await getOne(query, "banner")
    } catch (error) {
        return { status: false, message: "Failed delete Banner Image" }
    }
}

export const deleteBannerImage= async (body) => {
    try {
        let query = {
            _id: new ObjectId(body.bannerId)
        }

        let update = {
            $set: {  isActive: false,modifiedDate: getCurrentDateTime(), modifiedBy: new ObjectId(body.user._id) }
        }

        return await updateOne(query, update, "banner")

        // return await removeOne(query, "banner")
    } catch (error) {
        return { status: false, message: "Failed delete Banner Image" }
    }
}