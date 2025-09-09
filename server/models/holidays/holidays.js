import { create,createMany, getOne, removeOne, findOneAndUpdate, aggregationWithPegination, aggregate, updateOne, findWithPegination, getMany, bulkWriteOperations,updateMany} from '../../helper/mongo.js';
import { ObjectId } from 'mongodb';
import { logger } from '../../helper/logger.js';
import { generateExcel, generatePDF } from '../../helper/fileGen.js'


const collectionName = 'holidays';


export const createHoliday = async (body) => {
  try {
    const orgId = body?.user?.orgId;
    const userId = body?.user?._id;

    if (!userId || !orgId) {
      return { status: false, message: "either userId or orgId Not found" };
    }

    const holidays = [];
    body.holidays.forEach((dayObj) => {
      const createHoliday = {
        orgId: orgId,
        name: dayObj?.name,
        date: new Date(dayObj.date),
        description: dayObj.description,
        holidayType: dayObj.holidayType,
        duration: dayObj.duration,
        isActive: true,
        createdBy: userId,
        createdAt: new Date(),
        modifiedBy: userId,
        modifiedDate: new Date(),
        ...(dayObj?.subOrgId && { subOrgId: new ObjectId(dayObj.subOrgId) }),
        ...(dayObj?.branchIds?.length > 0 && { branchIds: dayObj.branchIds.map(id => new ObjectId(id)) }),
        ...(dayObj?.clientMappedId && { clientMappedId: new ObjectId(dayObj.clientMappedId) }),
        ...(dayObj?.clientBranchIds?.length > 0 && { clientBranchIds: dayObj.clientBranchIds.map(id => new ObjectId(id)) }),
      };
      holidays.push(createHoliday);
    });

    const holidayDates = holidays.map((holiday) => holiday.date);

    const existingHolidays = await getMany(
      {
        orgId: orgId,
        date: { $in: holidayDates },
      },
      collectionName
    );

    const existingDates = new Set(
      existingHolidays.data.map((holiday) => holiday.date.toISOString())
    );
    const newHolidays = holidays.filter(
      (holiday) => !existingDates.has(holiday.date.toISOString())
    );

    if (newHolidays.length === 0) {
      return {
        status: false,
        message: "No new holidays to create, all holidays already exist",
      };
    }

    const result = await createMany(newHolidays, collectionName);

    return result
      ? {
          status: true,
          message: "New Holidays Created Successfully",
          data: result,
        }
      : { status: false, message: "Failed to create new holidays" };
  } catch (error) {
    console.log("..error...", error?.message);
    logger.error("Error while creating holidays in createHoliday model");
    throw error;
  }
};

// update holiday
export const updateHoliday = async (body) => {
  try {
    const orgId = body?.user?.orgId;
    const userId = body?.user?._id;

    if (!userId || !orgId) {
      return { status: false, message: "User ID or Org ID missing" };
    }

    if (!body._id) {
      return { status: false, message: "Holiday ID is required for update" };
    }

    const updateData = {
      modifiedBy: userId,
      modifiedDate: new Date(),
    };

    // Only set the fields if they are explicitly provided
    if (body.name !== undefined) updateData.name = body.name;
    if (body.date !== undefined) updateData.date = new Date(body.date);
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.holidayType !== undefined)
      updateData.holidayType = body.holidayType;
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.subOrgId !== undefined) updateData.subOrgId = body.subOrgId;
    if (body.branchIds !== undefined) updateData.branchIds = body.branchIds;
    if (body.clientMappedId !== undefined) updateData.clientMappedId = body.clientMappedId;
    if (body.clientBranchIds !== undefined) updateData.clientBranchIds = body.clientBranchIds;

    const result = await updateOne(
      { _id: new ObjectId(body._id), orgId: new ObjectId(orgId) },
      { $set: updateData },
      collectionName
    );

    return result
      ? { status: true, message: "Holiday Updated Successfully", data: result }
      : { status: false, message: "Failed to update holiday" };
  } catch (error) {
    console.log("..error in updateHoliday...", error?.message);
    logger.error("Error while updating holiday in updateHoliday model");
    throw error;
  }
};

export const getHolidays = async (body) => {
  try {
    const orgId = body?.user?.orgId;
    const userId = body?.user?._id;
    const year = body?.year;
    const month = parseInt(body?.month) || 0;
    const page = parseInt(body?.page) || 1;
    const limit = parseInt(body?.limit) || 10;
    const skip = (page - 1) * limit;

    if (!userId || !orgId) {
      return { status: false, message: "parameters are missing" };
    }
    
    let startDate, endDate;
    if (body.startDate && body.endDate) {
        // Use provided range
        startDate = new Date(body.startDate);
        startDate.setUTCHours(0, 0, 0, 0);
      
        endDate = new Date(body.endDate);
        endDate.setUTCHours(23, 59, 59, 999);
    }else if (month > 0 && month <= 12) {
      startDate = new Date(Date.UTC(year, month - 1, 1));
      endDate = new Date(Date.UTC(year, month, 1));
    } else {
      startDate = new Date(Date.UTC(year, 0, 1));
      endDate = new Date(Date.UTC(year + 1, 0, 1));
    }

    // Base match stage
    const matchStage = {
      orgId: new ObjectId(orgId)
    };
    // this below condition usefor shiftdatelist api for defaultely avoid clientMappedId in holidays collection
    if(body.isClient===false){
        matchStage.clientMappedId = { $exists: false };
    }

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        matchStage.date = { $gte: startDate, $lte: endDate };
    }

    if (typeof body.isActive === "boolean") {
      matchStage.isActive = body.isActive;
    }

    if (body.orgIds?.length > 0) {
      matchStage.subOrgId = { $in: body.orgIds?.map(id => new ObjectId(id)) };
    }

    if (body.clientMappedIds?.length > 0) {
      matchStage.clientMappedId = { $in: body.clientMappedIds?.map(id => new ObjectId(id))  };
    }

    if (body.branchIds?.length > 0) {
      matchStage.branchIds = { $in: body.branchIds?.map(id => new ObjectId(id)) };
    }

    if (body.clientBranchIds?.length > 0) {
      matchStage.clientBranchIds = { $in: body.clientBranchIds?.map(id => new ObjectId(id))  };
    }

    // console.log(matchStage)

    const searchStage = body.search
    ? {
        $match: {
            $or: [
            { name: { $regex: body.search, $options: "i" } },
            { holidayType: { $regex: body.search, $options: "i" } },
            { duration: { $regex: body.search, $options: "i" } },
            { description: { $regex: body.search, $options: "i" } },
            ],
        },
        }
    : null;

    const pipeline = [
      { $match: matchStage },
      ...(searchStage ? [searchStage] : []),
      { $sort: { date: 1 } },
    ];

    if (body.generate === "xlsx") {
      const url =  await generateExcel(pipeline, collectionName);
      return {
        status: true,
        message: "Excel generated",
        url
      };
    }

    if (body.generate === "pdf") {
      const url = await generatePDF(pipeline, collectionName);
       return {
        status: true,
        message: "PDF generated",
        url
        };
    }

    const paginationQuery = {
      page,
      limit,
      sortOrder: 1,
      sortBy: "date",
    };
   
    // console.log("....pipeline...", JSON.stringify(pipeline));

    // console.log("....pipeline...",JSON.stringify(pipeline));

    return await aggregationWithPegination(
      pipeline,
      paginationQuery,
      collectionName
    );
  } catch (error) {
    console.log("...error..", error?.message);
    logger.error("Error while getting getHolidays data in holidays model");
    throw error;
  } 
};



//get holidays based on branch/dept/desg
export const getHolidaysOnBranchDeptDesg=async(body)=>{
    try{
        const { branchId, departmentId, designationId} = body;
        const orgId = body?.user?.orgId
        const userId = body?.user?._id
        

        if (!userId || !orgId ) return { status: false, message: "parameters are missing" }
        
        
        
        const query = {
            orgId,
            branchId,
            departmentId,
            designationId
        }


        

        return await getOne(query, 'holidaysAssignment');



    }catch (error) {
        console.log("...error..", error?.message)
        logger.error("Error while getting getHolidays  data in holidays model ");
        throw error
    }
}

//get holidays on branch or dept or desg
export const getHolidaysOnBranchOrDeptOrDesg= async (body) => {
    try {
        const { branchId, departmentId, designationId } = body;
        const orgId = body?.user?.orgId;
        const userId = body?.user?._id
        
        let query={
            orgId
        }
        

        // Add optional filters based on request query parameters
        if (branchId&&!designationId&&!departmentId){
            query.branchId = new ObjectId(branchId);
            query.departmentId= { $exists: false }, // Exclude records with departmentId
            query.designationId= { $exists: false } // Exclude records with designationId
        } 
        if (departmentId && branchId && !designationId){
            query.branchId = new ObjectId(branchId);
            query.departmentId = new ObjectId(departmentId);
            query.designationId= { $exists: false } // Exclude records with designationId
        } 
        if (designationId && departmentId && branchId){
            query.branchId = new ObjectId(branchId);
            query.departmentId = new ObjectId(departmentId);
            query.designationId = new ObjectId(designationId);
        } 
        // Fetch holidays from the holidaysAssignment collection
        return await getMany(query, 'holidaysAssignment');
        
        

    } catch (error) {
        console.log("...error..", error?.message)
        logger.error("Error while getHolidaysOnBranchOrDeptOrDesg   data in holidays model ");
        throw error
    }
};


//activate and deactivate holidays
export const activateDeactivateHolidays=async(body)=>{
    try{
        const orgId = body?.user?.orgId
        const userId = body?.user?._id
        

        if (!userId || !orgId ) return { status: false, message: "parameters are missing" }

        // const updateStructure=body.holidays.map((data)=>({...data,orgId:orgId}))
        // Prepare the bulk operations array
        const bulkOps = body.holidays.map(holiday => {
            if (holiday._id) {
                // Update operation if _id exists
                return {
                    updateOne: {
                        filter: { _id: new ObjectId(holiday._id)},
                        update: {
                            $set: {
                                orgId:orgId,
                                name: holiday.name,
                                date: new Date(holiday.date),
                                holidayType: holiday.holidayType,
                                activate: holiday.activate ?? true,
                                updatedBy: userId,
                                updatedAt: new Date()
                            }
                        },
                        upsert: false // Only update, don't create a new document if not found
                    }
                };
            } else {
                // Insert operation if _id does not exist
                return {
                    insertOne: {
                        document: {
                            orgId: orgId,
                            name: holiday.name,
                            date: new Date(holiday.date),
                            holidayType: holiday.holidayType,
                            activate: holiday.activate ?? true,
                            createdBy: userId,
                            createdAt: new Date()
                        }
                    }
                };
            }
        });

        return await bulkWriteOperations(bulkOps,collectionName)

    }catch(error){
        console.log("...error..", error?.message)
        logger.error("Error while getting activateDeactivateHolidays data in holidays model ");
        throw error
    }
}

// Model method to update holidays on branch, department, or designation level
export const updateHolidaysOnBranchOrDeptOrDesg = async (body) => {
    try {
        const { branchId, departmentId, designationId, holidays } = body;
        const orgId = body?.user?.orgId;
        const userId = body?.user?._id;
        
        let query = {
            orgId
        };

        // Set query conditions based on branch, department, and designation IDs
        if (branchId && !departmentId && !designationId) {
            query.branchId = new ObjectId(branchId);
            query.departmentId = { $exists: false };
            query.designationId = { $exists: false };
        }
        if (branchId && departmentId && !designationId) {
            query.branchId = new ObjectId(branchId);
            query.departmentId = new ObjectId(departmentId);
            query.designationId = { $exists: false };
        }
        if (branchId && departmentId && designationId) {
            query.branchId = new ObjectId(branchId);
            query.departmentId = new ObjectId(departmentId);
            query.designationId = new ObjectId(designationId);
        }

        // Step 1: Fetch existing holidays
        const existingRecord = await getOne(query, 'holidaysAssignment');
        let existingHolidays = existingRecord?.data.holidays || [];
        console.log("....existingHolidays...",existingHolidays)
        // Step 2: Extract dates from the request body holidays
        const requestHolidayDates = holidays.map(h => h.date);
        
        // // Step 3: Replace holidays that match by date
        // let updatedHolidays = existingHolidays.map(existingHoliday => {
        //     // Find if the holiday in the existing list has a match in the request body
        //     const matchingHoliday = holidays.find(h => h.date === existingHoliday.date);
        //     return matchingHoliday ? matchingHoliday : existingHoliday; // Replace if matching, else keep existing
        // });

        // Step 3: Replace holidays that match by date
        let updatedHolidays = existingHolidays.map(existingHoliday => {
            // Find if the holiday in the existing list has a match in the request body
            const matchingHoliday = holidays.find(h => h.date === existingHoliday.date);
            
            if (matchingHoliday) {
                // Replace the existing holiday's properties with the new ones from the request body
                return {
                    ...matchingHoliday, // Keep the existing properties
                    // name: matchingHoliday.name, // Replace name
                    // holidayType: matchingHoliday.holidayType // Replace holidayType
                };
            }
            
            return existingHoliday; // If no match, keep the existing holiday
        });

        // Step 4: Insert new holidays (which are in the request body but not in the existing data)
        const newHolidays = holidays.filter(h => 
            !existingHolidays.some(existingHoliday => existingHoliday.date === h.date)
        );

        // Step 5: Append the new holidays to the updated list
        updatedHolidays = [...updatedHolidays, ...newHolidays];
        
        // Step 6: Update the document with the modified holidays array
        const updateResult = await updateOne(
            query, // Matching condition
            { 
                $set: { holidays: updatedHolidays, modifiedBy: userId, modifiedDate: new Date() } 
            }, // Update holidays and modified details
            'holidaysAssignment' // Collection name
        );

        // Check if any documents were updated
        return updateResult.status  
                ? { status: true, data: updateResult } 
                : { status: false, message: 'No records found to update' };

    } catch (error) {
        console.log("Error in updateHolidaysOnBranchOrDeptOrDesg: ", error.message);
        logger.error("Error while updating holidays data in holidays model");
        throw error;
    }
};


//holidays assigned to branch/department/designation
export const assignHolidays=async(body)=>{
    try{
        const { branchId, departmentId, designationId, holidays } = body;
        const orgId = body?.user?.orgId
        const userId = body?.user?._id
        

        if (!userId || !orgId ) return { status: false, message: "parameters are missing" }

        // Create a new holiday assignment
        const holidayAssignment = {
            orgId,
            branchId:new ObjectId(branchId),
            departmentId :new ObjectId(departmentId),
            designationId:new ObjectId(designationId),
            holidays, // List of holiday objects being assigned
            createdDate: new Date(),
        };

        // Insert into the Holiday Assignment collection
        const result = await create(holidayAssignment,'holidaysAssignment');
        
        

        // Update the designation collection with holidayAssignmentId
        if (result.status) {
            const updateResult = await updateOne(
            { _id: new ObjectId(designationId) },
            { $set: { holidayAssignmentId: result.data.insertedId } },
            'designation'
            );
    
            if (updateResult.status) {
            return { status: true, message: 'Holidays assignment updated successfully' };
            } else {
            return { status: false, message: 'Failed to update the designation with the holiday assignment ID' };
            }
        } else {
            return { status: false, message: 'Holidays assignment creation failed' };
        }
        


    }catch(error){
        console.log("...error..", error?.message)
        logger.error("Error while assignHolidays  in holidays model ");
        throw error
    }
}



// Checking validations when mapping holidays assigned to branch, department, or designation
export const checkingValidations = async (body) => {
    try {
        const { branchId, departmentId, designationId, holidays } = body;
        const orgId = body?.user?.orgId;
        const userId = body?.user?._id;

        let params = {
            orgId
        };

        // Case 1: Only branchId is provided
        if (branchId && !departmentId && !designationId) {
            params["branchId"] = new ObjectId(branchId);
            params["$or"] = [
                { departmentId: { $exists: false }, designationId: { $exists: false } }, // Only branchId
                { departmentId: { $exists: true }, designationId: { $exists: false } },  // branchId + departmentId
                { departmentId: { $exists: true }, designationId: { $exists: true } }    // branchId + departmentId + designationId
            ];
        }

        // Case 2: Both branchId and departmentId are provided
        if (branchId && departmentId && !designationId) {
            params["branchId"] = new ObjectId(branchId);
            params["departmentId"] = new ObjectId(departmentId);
            params["$or"] = [
                { designationId: { $exists: false } },  // branchId + departmentId
                { designationId: { $exists: true } }    // branchId + departmentId + designationId
            ];
        }

        // Case 3: branchId, departmentId, and designationId are all provided
        if (branchId && departmentId && designationId) {
            params["branchId"] = new ObjectId(branchId);
            params["departmentId"] = new ObjectId(departmentId);
            params["designationId"] = new ObjectId(designationId);
        }

        // Check if this combination already exists in the 'assignment' collection
        const checkingMapped = await getMany(params, 'assignment');

        if (checkingMapped && checkingMapped.data.length == 0) {
            return { status: false, message: "no mapping created under barnch/departmet/designation not exist in  assignment collection." };
        }

        const assignmentIds=checkingMapped.data.map((assignment)=>(assignment._id))
        console.log(".....assignmentIds....",assignmentIds)

        
        const query={
            orgId:orgId,
            assignmentId: { $in: assignmentIds }
        }
      
        const result= await getMany(query,'user')
        if(result.status && result.data.length>=1){
            return {status:true,message:'users found under that assignmentids',data:result.data,assignmentIds}
        }
        return {status:false,message:'No users found under branch/department/designation',data:[]}

        

    } catch (error) {
        console.log("...error..", error?.message);
        if (error?.errorResponse?.code) {
            return { status: false, message: "Holiday assignment already exists; this combination is not allowed." };
        }
        logger.error("Error while assigning branch-wise holidays in holidays model");
        throw error;
    }
};


//assign holidays to branchwise,departmentwise.designationwise
export const assignBranchWiseOrDeptOrDesgHolidays=async(body)=>{
    try{
        const { employeeUserId,branchId, departmentId,designationId, holidays } = body;
        const orgId = body?.user?.orgId
        const userId = body?.user?._id
        

       
        // Validation
        if (!userId || !orgId  || !holidays || holidays.length === 0) {
            return { status: false, message: "Missing parameters or empty holidays" };
        }

        // Create a new holiday assignment
        let  holidayAssignment = {
            orgId,
            holidays, // List of holiday objects being assigned
            createdDate: new Date(),
        };
        
        
        
        if(branchId && !departmentId && !designationId ){
            holidayAssignment["branchId"] = new ObjectId(branchId);
        }
        if(branchId && departmentId && !designationId){
            holidayAssignment["branchId"] = new ObjectId(branchId);
            holidayAssignment["departmentId"] = new ObjectId(departmentId);
        }
        if(branchId && departmentId && designationId){
            holidayAssignment["branchId"] = new ObjectId(branchId);
            holidayAssignment["departmentId"] = new ObjectId(departmentId);
            holidayAssignment["designationId"] = new ObjectId(designationId);
        }

        

        //employee level holidays mapping
        if(employeeUserId && branchId && departmentId && designationId){
            holidayAssignment["employeeUserId"] = new ObjectId(employeeUserId);
            holidayAssignment["branchId"] = new ObjectId(branchId);
            holidayAssignment["departmentId"] = new ObjectId(departmentId);
            holidayAssignment["designationId"] = new ObjectId(designationId);
        }

        // Insert into the Holiday Assignment collection
        const createResult = await create(holidayAssignment,'holidaysAssignment');
        
        

        // Update the user  collection with holidayAssignmentId
        if (createResult.status) {
            // let bulkOps
            // //user level mapping
            // if(employeeUserId){
            //     bulkOps = body.assignmentIds.map((assignmentId) => ({
            //         updateMany: {
            //             filter: { orgId: orgId, _id: employeeUserId },
            //             update: { $set: { holidayAssignmentId: createResult.data.insertedId } }
            //         }
            //     }));
            // }else{
            //      bulkOps = body.assignmentIds.map((assignmentId) => ({
            //         updateMany: {
            //             filter: { orgId: orgId, assignmentId: assignmentId },
            //             update: { $set: { holidayAssignmentId: createResult.data.insertedId } }
            //         }
            //     })); 
            // }

            const  bulkOps = body.assignmentIds.map((assignmentId) => ({
                updateMany: {
                    filter: employeeUserId 
                        ? { orgId: orgId, _id: employeeUserId }  // User level mapping
                        : { orgId: orgId, assignmentId: assignmentId },  // Assignment level mapping
                    update: { $set: { holidayAssignmentId: createResult.data.insertedId } }
                }
            }));
               
            

            
            
            const updateResult = await bulkWriteOperations(bulkOps, 'user');
    
            if (updateResult.status) {
            return { status: true, message: 'Holidays assignment updated successfully' };
            } else {
            return { status: false, message: 'Failed to update  with the holiday assignment ID' };
            }
        } else {
            return { status: false, message: 'Holidays assignment   creation failed' };
        }
        


    }catch(error){
        console.log("...error..", error?.message)
        if(error?.errorResponse?.code) return { status: false, message: "holiday assignment already exists; this combination is not allowed." }
        logger.error("Error while assign branchwise Holidays  in holidays model ");
        throw error
    }
}


export const unmapBranchWiseOrDeptOrDesgHolidays = async (body) => {
    try {
        const { branchId, departmentId, designationId } = body;
        const orgId = body?.user?.orgId;

        if (!orgId) {
            return { status: false, message: "Missing organization ID" };
        }

        let params = { orgId };
        // let newAssignmentIds = [];
        let query={
            orgId
        }

        
        if(branchId && !departmentId && !designationId ){
            params["branchId"] = new ObjectId(branchId); // if unmap branch level query parmeter automatically updates org level mapping holidays 
            query.branchId= { $exists: false }, // Exclude records with departmentId
            query.departmentId= { $exists: false }, // Exclude records with departmentId
            query.designationId= { $exists: false } // Exclude records with designationId
            
           
        }
        if(branchId && departmentId && !designationId){
            params["branchId"] = new ObjectId(branchId);
            params["departmentId"] = new ObjectId(departmentId);
            query["branchId"] = new ObjectId(branchId); //if unmap department automatically usersupdate with bracnh level holidays
            query.departmentId= { $exists: false }, // Exclude records with departmentId
            query.designationId= { $exists: false } // Exclude records with designationId
        }
        if(branchId && departmentId && designationId){
            params["branchId"] = new ObjectId(branchId);
            params["departmentId"] = new ObjectId(departmentId);
            params["designationId"] = new ObjectId(designationId);
            query["branchId"] = new ObjectId(branchId); // if unmap designation level automatically update map holidays department level
            query["departmentId"] = new ObjectId(departmentId);
            query.designationId= { $exists: false } // Exclude records with designationId

        }

        const getUnMapId=await getOne(params,'holidaysAssignment')
        const getUpdateId=await getOne(query,'holidaysAssignment')
        let holidayAssignmentId=null
        let updateQuery={}
        if(getUnMapId?.data?._id){
            updateQuery["holidayAssignmentId"]=getUnMapId.data._id // here find this data  of unmap id before unmap id for update that particular unmapid
        }else{
            return {status:false,message:"No mapping found for this combination. Please create a mapping before unmapping."}
        }
        if(getUpdateId?.data?._id){
            holidayAssignmentId=getUpdateId.data._id
        }
        
        

        
        const unMapStatus=await updateMany(updateQuery,{$set:{holidayAssignmentId}},'user')
        if(!unMapStatus.status){
            return {status:false,message:'No User Mapped neither branch , department nor designation holidays '}
        }
        return unMapStatus

        

    } catch (error) {
        console.log("...error..", error?.message);
        logger.error("Error while unmapping holidays in holidays model");
        throw error;
    }
};


export const updateHolidaysOnBranchDeptDesg=async(body)=>{
    try{
        const { branchId, departmentId, designationId, holidays } = body;
        const orgId = body?.user?.orgId
        const userId = body?.user?._id
        

        if (!userId || !orgId ) return { status: false, message: "parameters are missing" }


        const query = {
            orgId,
            branchId,
            departmentId,
            designationId
        };

        const updateWithSet = {
            $set: {
                holidays: holidays, // Update the holidays array
                modifiedDate: new Date() 
            },
           
        };
        return await updateOne(query, updateWithSet, 'holidaysAssignment')

    }catch(error){
        console.log("...error..", error?.message)
        logger.error("Error while updateHolidaysOnBranchDeptDesg  in holidays model ");
        throw error
    }
}
