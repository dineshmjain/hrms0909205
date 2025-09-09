import { create, getOne, removeOne, findOneAndUpdate, aggregationWithPegination, updateOne, findWithPegination, getMany, bulkWriteOperations } from '../../helper/mongo.js';
import { ObjectId } from 'mongodb';
import { logger } from '../../helper/logger.js';
 


const collectionName = 'serviceCharges';

// checking exist service charges
export const existServiceCharges=async(body)=>{
    try {
       
        let userId = body?.user?._id;
        let orgId = body?.user?.orgId;
        
        // Ensure both are valid ObjectId instances
        userId = typeof userId === "string" ? new ObjectId(userId) : userId;
        orgId = typeof orgId === "string" ? new ObjectId(orgId) : orgId;
    
        if (!userId || !orgId) return { status: false, message: "either userId or orgId Not found" }
       
        
        const query = {
            orgId: orgId,
            isActive:true
        };

        

        if (body?._id) { 
            if (ObjectId.isValid(body._id)) {
                query["_id"] = new ObjectId(body._id);
            } else {
                throw new Error('Invalid ObjectId');
            }
        }else{
            const keys = [
                "serviceType",
                "employeeLevel",
                "employeeType",
                "experienceLevel",
                "ratePerUnit",
                "overtimeRate",
                "tax",
                "discount",
                "uniformCharge",
                "transportCharge",
                "projectType"
            ];

            
            keys.forEach(key=>{
                
                if(body[key] !== null && body[key] !== undefined ){
                    // console.log(`${key}`,body[key])
                    query[key]=body[key]
                }
            })
            
        }
          
        

        const projection={
            createdBy:0,
            createdAt:0,
            modifiedBy:0,
            modifiedAt:0
        }



        
        // console.log(".........query......",query)
        return await getOne(query,collectionName,projection);

    } catch (error) {
        logger.error("Error while creating addComment in comments model ");
        throw error
    }

}


//this below function for add  charges
export const createCharges = async (body) => {
    try {
        const { user, ...bodyData } = body;
        if (!user || !user._id || !user.orgId) {
            return { status: false, message: "User ID or Organization ID is missing" };
        }

        const userId = user._id instanceof ObjectId ? user._id : new ObjectId(user._id);
        const orgId = user.orgId instanceof ObjectId ? user.orgId : new ObjectId(user.orgId);

        // Define allowed fields for filtering
        const allowedFields = new Set([
            "serviceType", "employeeLevel", "employeeType", "experienceLevel",
            "ratePerUnit", "overtimeRate", "tax", "discount",
            "uniformCharge", "transportCharge", "contractType"
        ]);

        // Ensure at least one required field exists
        if (!bodyData.serviceType) {
            return { status: false, message: "Missing required fields" };
        }

        // Optimized filtering using Object.entries()
        const filteredData = Object.fromEntries(
            Object.entries(bodyData).filter(([key, value]) => 
                allowedFields.has(key) && value !== undefined && value !== null
            )
        );

        // Construct final object for insertion
        const chargesOnService = {
            orgId,
            ...filteredData,
            isActive: true,
            createdBy: userId,
            createdAt: new Date()
        };

        return await create(chargesOnService, collectionName);

    } catch (error) {
        logger.error(`Error in createCharges: ${error.message}`, { error });
        throw error;
    }
};


// get service charges
export const getServiceCharges=async (body) => {
    try {

        const {user,...bodyData}=body

        if(!user || !user._id ||! user.orgId ) return { status: false, message: "either userId or orgId Not found" }
        if(!body._id && !body.serviceType) return { status: false, message: "need service charge _id  or serviceType in body" }
        
        // Ensure both are valid ObjectId instances
        const orgId = user.orgId instanceof ObjectId ? user.orgId : (ObjectId.isValid(user.orgId) ? new ObjectId(user.orgId) : null);

        if (!orgId) {
            return { status: false, message: "Invalid orgId" };
        }
        const query = {
            orgId: orgId,
            isActive:true
        };

        if (bodyData._id) { 
            if (ObjectId.isValid(bodyData._id)) {
                query["_id"] = new ObjectId(bodyData._id);
            } else {
                throw new Error('Invalid ObjectId');
            }
        }
        
        // Define allowed fields for filtering
        const allowedFields = new Set([
            "serviceType", "employeeLevel", "employeeType", "experienceLevel"
        ]);
        
       
        let invalidFields = [];

        for (const key in bodyData) {
            // Check if the field is allowed and if the value is valid
            if (allowedFields.has(key) && (bodyData[key] == null || bodyData[key] === '' || bodyData[key] === undefined)) {
                invalidFields.push(key);  // Add invalid fields to the list
            } else {
                query[key] = bodyData[key];  // Add valid fields to the query
            }
        }

        if (invalidFields.length > 0) {
            return { 
                status: false, 
                message: `Invalid parameters: ${invalidFields.join(', ')}`
            };
        }
        


        const projection={
            createdBy:0,
            createdAt:0,
            modifiedBy:0,
            modifiedAt:0
        }

        

        return await findWithPegination(query,projection,{},collectionName);

    } catch (error) {
        logger.error("Error while getting service charges: ", error.message);
        throw error
    }
}

// edit service charges
export const editServiceCharges = async (body) => {
    try {

        let userId = body?.user?._id;
        let orgId = body?.user?.orgId;

        // Ensure both are valid ObjectId instances
        userId = userId instanceof ObjectId ? userId  : new ObjectId(userId) ;
        orgId = orgId instanceof ObjectId ? orgId : new ObjectId(orgId) ;

        if (!userId || !orgId) return { status: false, message: "Either userId or orgId not found" };

        const keys = [
            "serviceType",
            "employeeLevel",
            "employeeType",
            "experienceLevel",
            "ratePerUnit",
            "overtimeRate",
            "tax",
            "discount",
            "uniformCharge",
            "transportCharge",
            "projectType"
        ];
        
        

        const chargesOnService = keys.reduce((acc, key) => {
            if (body && body[key] !== undefined && body[key] !== null) {
                acc[key] = body[key];
            }
            return acc;
        }, {});
        
        

        if(Object.keys(chargesOnService).length === 0)return { status: false, message: "No valid fields provided to update" };


        // Ensure _id is valid if provided
        const query = {
            orgId: orgId,
            isActive: true,
        };

        if (body._id) {
            if (ObjectId.isValid(body._id)) {
                query["_id"] = new ObjectId(body._id);
            } else {
                throw new Error("Invalid ObjectId");
            }
        }

        const update = { $set: {...chargesOnService,modifiedBy:userId,modifiedDate:new Date()}};

        

        // Update the database
        return await updateOne(query, update, collectionName);
        

       

    } catch (error) {
        logger.error("Error while updating service charges: ", error.message);
        throw error;
    }
};


//delete service charge
export const deleteServiceCharge= async (body) => {
    try {
        let userId = body?.user?._id;
        let orgId = body?.user?.orgId;

        // Ensure both are valid ObjectId instances
        userId = typeof userId === "string" ? new ObjectId(userId) : userId;
        orgId = typeof orgId === "string" ? new ObjectId(orgId) : orgId;

        if (!userId || !orgId) return { status: false, message: "Either userId or orgId not found" };

        

        // Ensure _id is valid if provided
        const query = {
            orgId: orgId,
            isActive: true,
        };

        if (body._id) {
            if (ObjectId.isValid(body._id)) {
                query["_id"] = new ObjectId(body._id);
            } else {
                throw new Error("Invalid ObjectId");
            }
        }

        

        const update = { $set: {isActive: false,modifiedBy:userId,modifiedDate:new Date()}};

        // Update the database
        return  await updateOne(query, update, collectionName);
        
       

    } catch (error) {
        logger.error("Error while deleting service charges: ", error.message);
        throw error;
    }
};

// get employees quote price
        
export const getEmployeesQuotePrice = async (body) => {
    try {
        const { serviceType, employeeLevel, requiredEmployees, duration, overtimeHours, contractType, experienceLevel } = body;
        
        if (!serviceType || !employeeLevel || !requiredEmployees || !duration || !contractType) {
            return { status:false,message: 'Missing required fields' };
        }

        const charge=body.serviceChargeData

        

        

        // Base cost calculation
        const baseRate = charge.ratePerUnit
        * requiredEmployees * duration;

        // Apply overtime charges if applicable
        const overtimeCharges = overtimeHours > 0 ? overtimeHours * requiredEmployees * charge.overtimeRate : 0;

        // Calculate uniform charges (apply exemption if applicable)
        const uniformCharges = charge.uniformExemption ? 0 : charge.uniformCharge * requiredEmployees;

        // Calculate transport charges (apply exemption if applicable)
        const transportCharges = charge.transportExemption ? 0 : charge.transportCharge * requiredEmployees;

        // Apply discount based on project type
        const discount = (charge.discount / 100) * baseRate;

        // Subtotal after discount
        const subtotal = baseRate - discount + overtimeCharges + uniformCharges + transportCharges;

        // Calculate tax based on the project type
        const tax = (charge.tax/ 100) * subtotal;

        // Total cost after tax
        const totalCost = subtotal + tax;

        const data={
            baseRate,
            overtimeCharges,
            uniformCharges,
            transportCharges,
            discount,
            subtotal,
            tax,
            totalCost
        };

        return {status:true,data}


    } catch (error) {
        logger.error("Error while deleting service charges: ", error.message);
        throw error;
    }
}



export const getEmployeesQuotePriceArray = async (body) => {
    try {
        
        const requirements = body.requirement || [];
        const quotePrices = 
            requirements.map((req) => {
                const {
                    serviceChargeData,
                    serviceType,
                    employeeLevel,
                    requiredEmployees,
                    duration,
                    overtimeHours,
                    contractType,
                } = req;

                if (!serviceChargeData || !serviceType || !employeeLevel || !requiredEmployees || !duration || !contractType) {
                    throw new Error('Missing required fields in one or more entries.');
                }

                const charge = serviceChargeData;

                // Base cost calculation
                const baseRate = charge.ratePerUnit * requiredEmployees * duration;

                // Apply overtime charges if applicable
                const overtimeCharges = overtimeHours > 0 ? overtimeHours * requiredEmployees * charge.overtimeRate : 0;

                // Calculate uniform charges (apply exemption if applicable)
                const uniformCharges = charge.uniformExemption ? 0 : charge.uniformCharge * requiredEmployees;

                // Calculate transport charges (apply exemption if applicable)
                const transportCharges = charge.transportExemption ? 0 : charge.transportCharge * requiredEmployees;

                // Apply discount based on project type
                const discount = (charge.discount / 100) * baseRate;

                // Subtotal after discount
                const subtotal = baseRate - discount + overtimeCharges + uniformCharges + transportCharges;

                // Calculate tax based on the project type
                const tax = (charge.tax / 100) * subtotal;

                // Total cost after tax
                const totalCost = subtotal + tax;

                // Include context data
                return {
                    serviceType,
                    employeeLevel,
                    projectType,
                    baseRate,
                    overtimeCharges,
                    uniformCharges,
                    transportCharges,
                    discount,
                    subtotal,
                    tax,
                    totalCost,
                };
            })
        

        // Aggregate total cost for all entries
        const totalCostSummary = quotePrices.reduce((acc, item) => acc + item.totalCost, 0);

        // // Final response structure
        // request.body.response = {
        //     totalCostSummary,
        //     details: quotePrices,
        // };

        return {status:true,data:{
            totalCostSummary,
            details: quotePrices,
        }}
        
    } catch (error) {
        logger.error("Error while deleting service charges: ", error.message);
        throw error;
    }
};

