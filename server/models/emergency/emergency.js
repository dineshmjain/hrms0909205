import { create, createMany, getOne, getMany, aggregate, removeOne,aggregationWithPegination,findWithPegination ,updateOne} from '../../helper/mongo.js'
import { ObjectId } from 'mongodb';
import { logger } from '../../helper/logger.js';

const collection_name = 'emergencyContacts'

export const addEmergencyContacts = async (body) => {
    try {
        const { contacts, user } = body;

        // Validate contacts
        if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
            return { status: false, message: "contacts is required and should be a non-empty array" };
        }

        let maxNum=body.maxSerialNo || 0

        let addContacts=[]

        // Validate and convert contacts
        for (const contact of contacts) {
            if (!contact.name || !contact.mobile) {
                return { status: false, message: "Each contact must have a name and mobile number" };
            }
            addContacts.push({serialNo: ++maxNum,...contact})

        }

        // Build the query object
        const query = {
            orgId: new ObjectId(user.orgId),
            clientmappedId: new ObjectId(body.clientmappedId),
            clientId: new ObjectId(body.clientId),
            contacts:addContacts,
            createdBy: new ObjectId(user._id),
            isActive: true,
            createdDate: new Date(),
        };

        // Insert into the database
        const result = await create(query, collection_name);
        if (result.status) {
            return { status: true, message: "Emergency contacts added successfully", data: result.data };
        } else {
            return { status: false, message: "Failed to add emergency contacts" };
        }
    } catch (error) {
        logger.error("Error while adding emergency contacts in emergency model", { stack: error.stack });
        throw error;
    }
}


export const emergencyContactsList = async (body) => {
    try {
        const { user, clientmappedId, clientId } = body;

        // Build the query object
        const query = {
            orgId: new ObjectId(user.orgId),
            clientmappedId: new ObjectId(clientmappedId),
            clientId: new ObjectId(clientId),
            isActive: true,
        };

        // Fetch from the database
        const result = await getMany(query, collection_name);
        if (result.status) {
            return { status: true, message: "Emergency contacts retrieved successfully", data: result.data };
        } else {
            return { status: false, message: "Failed to retrieve emergency contacts" };
        }
    } catch (error) {
        logger.error("Error while retrieving emergency contacts in emergency model", { stack: error.stack });
        throw error;
    }
}


export const isEmergencyContactId = async (body) => {
    try {
        const { emergencyContactId, user } = body;

        // Validate emergencyContactId
        if (!emergencyContactId) {
            return { status: false, message: "emergencyContactId is required" };
        }

        // Build the query object
        const query = {
            _id: new ObjectId(emergencyContactId),
            orgId: new ObjectId(user.orgId),
            isActive: true,
        };

        // Fetch from the database
        const result = await getOne(query, collection_name);
        if (result.status && result.data) {
            return { status: true, message: "Emergency contact ID is valid", data: result.data };
        } else {
            return { status: false, message: "Invalid emergencyContactId" };
        }
    } catch (error) {
        logger.error("Error while validating emergency contact ID in emergency model", { stack: error.stack });
        throw error;
    }
}


export const updateEmergencyContacts = async (body) => {
    try {
        const { contacts, user } = body;

       
        // Build the query object
        const query = {
            _id: new ObjectId(body.emergencyContactId),
            isActive: true,
        };

        // Build the update object
        const update = {
            $set: {
                contacts,
                modifiedBy: new ObjectId(user._id),
                modfiedDate: new Date()
            }
        };

      
        // Update in the database
        const result = await updateOne(query, update, collection_name);
        if (result.status) {
            return { status: true, message: "Emergency contact updated successfully"};
        } else {
            return { status: false, message: "Failed to update emergency contact or no changes made" };
        }
    } catch (error) {
        logger.error("Error while updating emergency contact in emergency model", { stack: error.stack });
        throw error;
    }
}
