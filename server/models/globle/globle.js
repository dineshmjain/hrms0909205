import { logger } from "../../helper/logger.js";
import {ObjectId} from "mongodb";
import { create,getMany,getOne,findWithPegination,findOneAndUpdate, createMany } from "../../helper/mongo.js";


const collection_name = "language";


export const getSavedLanguage = async (body) => {
    try{

        return await getMany({},collection_name);

    }catch(error){
        console.log(error);
        logger.error("Error while getSavedLanguage in globle module");
        throw error;
    }
};


export const createGlobalLeave = async (body) => {
    try {
        let leaveTypes = body.leaveTypes

        let leaveDocuments = leaveTypes.map(leave => ({
            global: 'true',
            name: leave,
            isActive: true,
            createdAt: new Date()
        }));

        // Use createMany to insert multiple documents at once
        return await createMany(leaveDocuments, 'leave');
    } catch (error) {
        logger.error("Error while creating leave documents in globalLeave function");
        throw error;
    }
};


export const isLeaveExist = async (body) => {
    try {
        let query = {
            name : {$in : body.leaveTypes}
        }
        return await getMany( query ,'leave');
    } catch (error) {
        logger.error("Error while getting leave documents in globalLeave function");
        throw error;
    }
};

export const listOrgType = async (body) => {
    try{
       return await getMany({name:{$ne:null}},"typesOfOrganization");

    }catch(error) {
            console.log(error);
        logger.error("Error while creating org type in createOrgType function");
        throw error;
    }
}

// is address type exists
export const isAddressTypeExist= async (body) => {
    try {
        let query = {
            name : {$in : body.addressType}
        }
        return await getMany( query ,"addressTypes");
    } catch (error) {
        logger.error("Error while getting leave documents in globalLeave function");
        throw error;
    }
};

// add address type
export const createAddressType= async (body) => {
    try {
        const address = body.addressType.map(address => ({
            global: 'true',
            name: address,
            isActive: true,
            createdAt: new Date()
        }));

        // Use createMany to insert multiple documents at once
        return await createMany(address, 'addressTypes');
    } catch (error) {
        logger.error("Error while creating address types in address type model");
        throw error;
    }
};

// get address types
export const listAddressType= async (body) => {
    try{
       return await getMany({isActive:true},"addressTypes");

    }catch(error) {
        logger.error("Error while listAddressType in listAddressType model function");
        throw error;
    }
}

// create orgType/bussinesstype
export const createOrgType= async (body) => {
    try {
        // Use upsert for each orgType in the array
        const orgTypes = Array.isArray(body.orgType) ? body.orgType : [];
        if (orgTypes.length < 1) {
            return { status: true, data: [] };
        }

        const upserted = [];
        for (const type of orgTypes) {
            const doc = {
                name: type ?? type.name,
                category: 'Other',
                description: type ?? type.name,
                isActive: true,
                createdAt: new Date()
            };
            // upsert: update if exists, otherwise insert
            const result = await create(
                doc,
                // { name: type.name },
                // { $setOnInsert: doc },
                'typesOfOrganization'
            );
            upserted.push({name: type, "_id": result.data.insertedId});
        }
        return { status: true, data: upserted };
    } catch (error) {
        logger.error("Error while creating org types in createOrgType model");
        throw error;
    }
};