import { create, createMany, getOne, getMany, aggregate, removeOne,aggregationWithPegination,findWithPegination ,updateOne} from '../../helper/mongo.js'
import { ObjectId } from 'mongodb';
import * as leaveModel from '../leave/leave.js'
import * as departmentModel from '../department/department.js'
import * as roleModel from '../role/role.js'
import { logger } from '../../helper/logger.js'
const collection_name = 'leavePolicy'

// Create leave policy for an organisation
export const createLeavePolicy = async (body) => {
    try {
        const { leaveTypes, applicableTo, user } = body;

        // Validate leaveTypes
        if (!leaveTypes || !Array.isArray(leaveTypes) || leaveTypes.length === 0) {
            return { status: false, message: "leaveTypes is required and should be a non-empty array" };
        }

        // Validate and convert leaveTypes
        for (const leave of leaveTypes) {
            const leaveData = await leaveModel.isValidLeave(leave, user?.orgId);
            if (!leaveData.status) throw new Error("Invalid LeaveId!");
            leave.leaveTypeId = new ObjectId(leave.leaveTypeId); // Convert to ObjectId
        }

        // Validate applicableTo object if provided
        if (applicableTo?.departments && Array.isArray(applicableTo.departments)) {
            for (let i = 0; i < applicableTo.departments.length; i++) {
                const departmentId = applicableTo.departments[i];
                const departmentData = {
                    departmentId,
                    orgDetails: { _id: user?.orgId },
                };
                const departmentExists = await departmentModel.getOneDepartment(departmentData);
                if (!departmentExists.status) throw new Error("Invalid departmentId");
                // Replace string with ObjectId in the original object
                applicableTo.departments[i] = new ObjectId(departmentId);
            }
        }

        if (applicableTo?.roles && Array.isArray(applicableTo.roles)) {
            for (let i = 0; i < applicableTo.roles.length; i++) {
                const roleId = applicableTo.roles[i];
                const roleExists = await roleModel.isRoleValid(roleId);
                if (!roleExists.status) throw new Error("Invalid roleId");
                // Replace string with ObjectId in the original object
                applicableTo.roles[i] = new ObjectId(roleId);
            }
        }

        // Build the query object
        const query = {
            name: body.name,
            createdBy: user?._id || 'system',
            isActive: true,
            createdDate: new Date(),
            leaveTypes,
        };

        if (user?.orgId) {
            query.orgId = user.orgId;
        }

        if (applicableTo) {
            query.applicableTo = applicableTo;
        }

        // Create leave policy in the database
        return await create(query, collection_name);

    } catch (error) {
        console.error("Error in createLeavePolicy:", error.message);
        logger.error("Error while creating leave policy in createLeavePolicy function");
        throw error;
    }
};

// Check whether leave policy alredy exists with name and for same leave id 
export const isPolicyExists = async (body) => {
    try {
        const query = {
            orgId: new ObjectId(body.user.orgId),
            _id: new ObjectId(body._id),
            isActive: true
        }
        if (body.leavePolicyId) {
            query._id = new ObjectId(body.leavePolicyId);
        }
        if(body.isActive!==undefined){
            delete query.isActive
        }
        return await getOne(query, collection_name)
    } catch (error) {
        logger.error("Error while isPolicyExists in createLeavePolicy function");
        throw error;
    }
}


// create leave policy 
export const createPolicyLeave=async(body)=>{
    try{
        const {name,noOfDays,cycle,genderEligibility,eligibleNoOfDays,approval,isPaid}=body
        const orgId = body?.user?.orgId
        const userId=body?.user._id
        const query={
            orgId: new ObjectId(orgId),
            name,
            noOfDays,
            cycle,
            isPaid,
            genderEligibility,
            eligibleNoOfDays,
            approval,
            isActive:true,
            createdBy:new ObjectId(userId),
            createdDate:new Date()
        }
        
        if(body.branchId){
            query["branchId"]=new ObjectId(body.branchId)
        }
        if(body.departmentId){
            query["departmentId"]=new ObjectId(body.departmentId)
        }

        return await create(query,collection_name)
    }catch (error) {
        logger.error("Error while createPolicyLeave in createLeavePolicy  model function");
        throw error;
    }
}

// get policy
export const getleavePolicy=async(body)=>{
    try{
        const orgId = body?.user?.orgId
        const userId=body?.user._id
        const paginationQuery={
            page: body.page || 1,
            limit: body.limit || 10
        }
        const query={
            orgId: new ObjectId(orgId),
            // _id:new ObjectId(body.leavePolicyId),
            // isActive:true
        }
        if(body.branchId){
            query["branchId"]=new ObjectId(body.branchId)
        }
        if(body.departmentId){
            query["branchId"]=new ObjectId(body.branchId)
        }
        if(body.leavePolicyId){
            query["_id"]=new ObjectId(body.leavePolicyId)
        }
        if (body.search && body.search.trim() !== "") {
            const regex = { $regex: body.search, $options: 'i' };
          
            query.$or = [
              { name: regex },
              { genderEligibility: regex },
              { 'cycle.type': regex },
              !isNaN(body.search) ? { 'cycle.creditedDay': Number(body.search) } : null
            ].filter(Boolean); // remove null if creditedDay is not a number
        }
        const aggregation=[
            {
                $match: query
            }
        ]

        console.log("aggregation",JSON.stringify(aggregation));
        
        return await aggregationWithPegination(aggregation,paginationQuery,collection_name)

    }catch (error) {
        logger.error("Error while getleavePolicy in createLeavePolicy  model function");
        throw error;
    }
}


export const updatePolicy=async(body)=>{
    try{
        const {_id,name,noOfDays,cycle,genderEligibility,eligibleNoOfDays,approval,isPaid,user,leaveExists} = body
        const query={
            _id:new ObjectId(_id),
            orgId:new ObjectId(user.orgId)
        }

        // Safely merge nested objects with existing data
        const updatedCycle = cycle ? { ...leaveExists.cycle, ...cycle } : undefined;
        const updatedApproval = approval ? { ...leaveExists.approval, ...approval } : undefined;

        const update = {
            $set: {
                ...(name && { name }),
                ...(noOfDays !== undefined && { noOfDays }),
                ...(updatedCycle && { cycle: updatedCycle }),
                ...(genderEligibility && { genderEligibility }),
                ...(eligibleNoOfDays !== undefined && { eligibleNoOfDays }),
                ...(updatedApproval && { approval: updatedApproval }),
                ...(isPaid !== undefined && { isPaid }),
                modifiedDate: new Date(),
                modifiedBy: new ObjectId(user._id)
            },
        };
        return await updateOne(query,update,collection_name)
    }catch (error) {
        logger.error("Error while updatePolicy in createLeavePolicy  model function");
        throw error;
    }
}

// activate and deactivate leave policy
export const activeDeactivatePolicy=async(body)=>{
    try{
        const query={
            orgId:new ObjectId(body.user.orgId),
            _id:new ObjectId(body._id)
        }
    

        const updateData = {
            isActive: body.isActive,
            modifiedDate: new Date(),
            modifiedBy: new ObjectId(body.user?._id)
        };

        return await updateOne(query, {$set:updateData},collection_name);

    }catch (error) {
        logger.error("Error while activeDeactivatePolicy in LeavePolicy  model function");
        throw error;
    }
}