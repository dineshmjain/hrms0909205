import { logger } from "../../helper/logger.js";
import { ObjectId } from "mongodb";
import { create,getOne,findWithPegination,findOneAndUpdate, getMany, updateOne,createMany, aggregationWithPegination } from "../../helper/mongo.js";
// import { QueryBuilder } from "../../helper/filter.js";
import MongoDBService from "../../helper/mongoDbService.js";
import { QueryBuilder } from "../../helper/filter.js";
import { getCurrentDateTime } from "../../helper/formatting.js";
import * as constants from "../../helper/constants.js";
import { report } from "process";


const collection_name = "shift";

export const getShiftList = async (body) => {
    try
    {
        body.orgId = body.orgDetails?._id;

        const query = new QueryBuilder(body)
            .addId()
            .addOrgId()
            .addName()
            .addStartTime()
            .addEndTime()

        const params = query.getQueryParams();

        if(body.branchId) params['branchId'] = new ObjectId(body.branchId);

         params.isActive = params.isActive === false ? false : true;

        return await getMany(params,collection_name);

    }
    catch(error)
    {
        logger.error("Error while getShiftList in shift module");
        throw error;
    }
}
export const createShift = async (body) => {
    try {
        const baseShiftObj = {
            name: body.name,
            startTime: body.startTime,
            endTime: body.endTime,
            orgId: body.clientMappedId 
                ? new ObjectId(body.clientMappedId) 
                : body.orgDetails._id,
            isActive: true,
            createDate: new Date(),
            createdBy: new ObjectId(body.authUser._id),
            bgColor: body.bgColor,
            textColor: body.textColor,
            ...(body.minIn && { minIn: body.minIn }),
            ...(body.minOut && { minOut: body.minOut }),
            ...(body.maxIn && { maxIn: body.maxIn }),
            ...(body.maxOut && { maxOut: body.maxOut }),
            ...(body.reportTimeIn && { reportTimeIn: body.reportTimeIn }),
            ...(body.reportTimeOut && { reportTimeOut: body.reportTimeOut }),
        };

        // mark as day pass if endTime < startTime
        if (+body.endTime.split(':')[0] < +body.startTime.split(':')[0]) {
            baseShiftObj['isDayPass'] = true;
        }

        // Convert other optional ObjectId fields
        const otherFields = ['subOrgId', 'designationId', 'otMin', 'otMax', 'clientId'];
        otherFields.forEach(f => {
            if (body[f]) baseShiftObj[f] = new ObjectId(body[f]);
        });

        // handle optional branchIds
        const branchIds = Array.isArray(body.branchIds)
            ? body.branchIds
            : [];

        // if branchIds provided, create multiple docs; else create one doc
        if (branchIds.length > 0) {
            const shiftsToCreate = branchIds.map(bId => ({
                ...baseShiftObj,
                branchId: new ObjectId(bId),
            }));
            return await createMany(shiftsToCreate, collection_name);
        } else {
            // create single shift without branchId
            return await create(baseShiftObj, collection_name);
        }

    } catch (error) {
        logger.error("Error while createShift in shift module", { stack: error.stack });
        throw error;
    }
};

export const listShift = async (body) => {
  try {
    const matchStage = {};

    if (body.orgId) matchStage.orgId = new ObjectId(body.orgId);
    else if (body.orgDetails?._id) matchStage.orgId = new ObjectId(body.orgDetails._id);

    if (body.branchId) matchStage.branchId = new ObjectId(body.branchId);
    else if (body.branchIds && Array.isArray(body.branchIds) && body.branchIds.length > 0) {
      matchStage.branchId = { $in: body.branchIds.map(id => new ObjectId(id)) };
    }

    if (body.clientMappedId) matchStage.orgId = new ObjectId(body.clientMappedId);
    if (body.subOrgId) matchStage.subOrgId = new ObjectId(body.subOrgId);

    matchStage.isActive = true;

    const aggregationPipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "branches",
          localField: "branchId",
          foreignField: "_id",
          as: "branchDetails"
        }
      },
      {
        $unwind: {
          path: "$branchDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "client",
          localField: "branchDetails.orgId",
          foreignField: "_id",
          as: "clientDetails"
        }
      },
      {
        $unwind: {
          path: "$clientDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          startTime: 1,
          endTime: 1,
          orgId: 1,
          clientId: 1,
          branchId: 1,
          subOrgId: 1,
          isActive: 1,
          createDate: 1,
          createdBy: 1,
          bgColor: 1,
          textColor: 1,
          minIn: 1,
          minOut: 1,
          maxIn: 1,
          maxOut: 1,
          reportTimeIn: 1,
          reportTimeOut: 1,
          createdAt: 1,
          updatedAt: 1,
          reportTimeIn:1,
          branchDetails: {
            branchName: "$branchDetails.name",
            clientName: "$clientDetails.nickName"
        }
        }
      }
    ];

    const paginationQuery = {
      page: body.page ? parseInt(body.page) : 1,
      limit: body.limit ? parseInt(body.limit) : 10,
      sortOrder: body.sortOrder ? parseInt(body.sortOrder) : -1,
      sortBy: body.sortBy || "createDate"
    };

    const result = await aggregationWithPegination(
      aggregationPipeline,
      paginationQuery,
      collection_name
    );

    return {
      status: true,
      message: "Shifts fetched successfully",
      totalRecord: result.totalRecord,
      next_page: result.next_page,
      data: result.data
    };
  } catch (error) {
    logger.error("Error while listShift:", error);
    return { status: false, message: "Unable to fetch shifts" };
  }
};


export const getOneShift = async (body) => {
    try{

        body.orgId = body?.orgDetails?._id ? body.orgDetails._id : new ObjectId(body.user.orgId);
        const queryBuilder = new QueryBuilder(body)
            .addShiftId()
            .addName()
            .addOrgId()
            .getQueryParams();

            queryBuilder['isActive'] = true
        console.log(JSON.stringify(queryBuilder));
        
        return await getOne(queryBuilder,collection_name);
    }catch(error){
        logger.error("Error while getOneShift in shift module");
        throw error;
    }
}

export const getAllShifts = async (body) => {
    try{

        let query  = {
            $or: [
                {orgId : body.user.orgId},
                {orgId : {$in : body.clientIds.map(cl => cl._id)}}
            ]
        }
        
        return await getMany(query,collection_name);
    }catch(error){
        logger.error("Error while getOneShift in shift module");
        throw error;
    }
}

export const updateShift = async (body) => {
    try{

        let query = {_id : new ObjectId(body.shiftId)}

        let fields = ['name', "startTime", "endTime", "isActive", "bgColor", "textColor","branchId", "minIn", "minOut", "maxIn", "maxOut","reportTimeIn","reportTimeOut", "modifiedDate", "modifiedBy"]
        let updateObj = {}
        let unsetObj = {}
        fields.forEach(f => {
            // if(body[f]) {
            //     updateObj[f] = body[f]
            // }
            if(body.hasOwnProperty(f) && body[f] !== undefined && body[f] !== null) {
                updateObj[f] = body[f]
            }
            else {
                if(f == "minIn" || f == "minOut" || f == "maxIn" || f == "maxOut") {
                    if(body[f] == "") unsetObj[f] = ""
                }
                if(f == 'modifiedBy' || f == 'modifiedDate' || f == 'isActive') updateObj[f] = f == 'modifiedBy' ? new ObjectId(body.userId) : f == 'modifiedDate' ? getCurrentDateTime() : f == 'isActive' && body['isActive']==undefined ? true : body[f];
            }
        })

        let update = {
            $set : updateObj,
            $unset : unsetObj
        }
        return await updateOne(query,update,collection_name);
    }catch(error){
        logger.error("Error while update in shift module");
        throw error;
    }
}

export const isShiftValid = async (body) => {
    try{
        let query = {orgId : body.clientMappedId ? new ObjectId(body.clientMappedId) : body.user.orgId,_id : new ObjectId(body.shiftId)}

        return await getOne(query,collection_name);
    }catch(error){
        logger.error("Error while getOneShift in shift module");
        throw error;
    }
}

// export class Shift extends MongoDBService {
//     constructor() {
//         super("shift");
//         //this.collection_name = collection_name;
//     }

//     async writeData(body) {
//         try {
//             const shiftObj = {
//                 name: body.name,
//                 startTime: body.startTime,
//                 endTime: body.endTime,
//                 orgId: body.orgDetails._id,
//                 isActive: true,
//                 createdAt: new Date(),
//                 // updatedAt: new Date(),
//                 createdBy: new ObjectId(body.userId),
//                 bgColor: body.bgColor,
//                 textColor: body.textColor,
//                 ...(body.minIn && {minIn : body.minIn}),
//                 ...(body.minOut && {minOut : body.minOut}),
//                 ...(body.maxIn && {maxIn : body.maxIn}),
//                 ...(body.maxOut && {maxOut : body.maxOut}),

//             };
//             return await this.create(shiftObj)

//         } catch (error) {
//             logger.error("Error while createShift in shift module");
//             throw error;
//         }
//     };


//     async getOneData(body) {
//         try {

//             body.orgId = body.orgDetails._id;
//             this.query = body;
//             this.addName();
//             this.addOrgId();

//             this.params = this.getQueryParams();

//             return await this.getOne();

//         } catch (error) {
//             logger.error("Error while getOneShift in shift module");
//             throw error;
//         }
//     }

//     async getData(query) {
//         try {
//             this.query = query


//             this.addId()
//             this.addOrgId()
//             this.addName()
//             this.addStartTime()
//             this.addEndTime()
//             this.addIsActive()
//             this.addCreatedAt()
//             this.addUpdatedAt()
//             this.getNameAgregationPipeLIne()

            //this.addId()
            //this.addOrgId()
            //this.addName()
            //this.addStartTime()
            //this.addEndTime()
            //this.addIsActive()
            //this.addCreatedDate()
            //this.addUpdatedAt()
            //this.getNameAgregationPipeLIne()

//             return await this.aggregationWithPagination(this.query);
//         } catch (error) {
//             logger.error("Error while listShift in shift module");
//             throw error;
//         }
//     }

//     async isExist(body) {
//         try {

//             let shiftIds = []
//             for (const element of body.shiftIds) {
//                 if (ObjectId.isValid(element)) {
//                     shiftIds.push(new ObjectId(element));
//                 } else if (element !== "WO") {
//                     return { success: false, message: "List should contain a valid objectId or 'WO' for week off" };
//                 }
//             }

//             const query = {
//                 orgId: body.orgDetails._id,
//                 _id: {
//                     $in: shiftIds
//                 }
//             }
//             let existing = await this.getMany(query);
//             if(!existing.data.length) return {success: false}
//             existing = existing.data.map(data => data._id.toString());
//             shiftIds = shiftIds.map(id => id.toString())
//             const notFound = shiftIds.filter(id => !existing.includes(id));

//             if (notFound.length) {
//                 return {
//                     success: false,
//                     shiftIds: notFound,
//                     message: "These ids are not found"
//                 }
//             }
//             return { success: true ,message: "Success",}
//         } catch (error) {
//             logger.error("Error while checking shift exist or not.");
//             throw error;
//         }
//     }

//     async editData (body) {
//         try{
//             const { user,orgDetails,token,shiftId,userId,...updateData} = body;
//             if(!ObjectId.isValid(shiftId)){
//                 return {
//                     status:false,
//                     message:"Invalid mongoId"
//                 }
//             }
//             updateData.updatedAt = new Date(Date.now())
//             return await this.updateOne({_id:new ObjectId(shiftId),orgId:orgDetails._id},updateData)
//         }catch(error){
//             logger.error("Error while shift update in shift module.");
//             throw error;
//         }
//     }

// }

// create Default shifts
export const createDefaultShifts = async (body) => {
    try{

        let orgId=body.user?.orgId
        const defaultShifts = constants.defaultShifts;
        if(body.isClient){
            orgId=new ObjectId(body.clientData.insertedId)
        }

        const shifts = defaultShifts.map(shift => ({
            name:shift.name,
            startTime:shift.startTime,
            endTime:shift.endTime,
            minIn:shift.startTime,
            minOut:shift.endTime,
            maxIn:shift.startTime,
            maxOut:shift.endTime,
            bgColor:shift.bgColor,
            textColor:shift.textColor,
            orgId,
            isActive: true,
            createDate: new Date(),
            createdBy:new ObjectId(body.userId)
          }));

        return await createMany(shifts,collection_name);

    }catch(error){
        logger.error("Error while createShift in shift module");
        throw error;
    }
};

export const createClientDefaultShifts = async (body) => {
    try{

        let clients = body.clientShifts;
        const defaultShifts = constants.defaultShifts;
        let shifts = [];
        clients.forEach(client => {
            defaultShifts.forEach(shift => (
                shifts.push({
                    name:shift.name,
                    startTime:shift.startTime,
                    endTime:shift.endTime,
                    bgColor:shift.bgColor,
                    textColor:shift.textColor,
                    orgId: client.clientId,
                    isActive: true,
                    createDate: new Date(),
                    createdBy:new ObjectId(body.userId)
                })
            ));
        })

        return await createMany(shifts,collection_name);

    }catch(error){
        logger.error("Error while createShift in shift module");
        throw error;
    }
};


export const getShiftByIds = async (body) => {
    try{
        if(!body.shiftIds || !body.shiftIds.length) return {status: false, error: "Shift ids are required"};
        const query = {
            _id: {$in: body.shiftIds.map((id) => {return id !=='WO' ? new ObjectId(id):'WO'})}
        }
        console.log(JSON.stringify(query));
        return await getMany(query,collection_name);
    }catch(error){
        logger.error("Error while getShiftByIds in shift module");
        throw error;
    }
}

export const activateDeactivateShift= async (body) => {
    try{
        if(!body.shiftId || !ObjectId.isValid(body.shiftId)) return {status: false, error: "Invalid shift id"};
        const query = {_id: new ObjectId(body.shiftId)}
        const update = {
            $set: {
                isActive: body.isActive,
                modifiedBy: new ObjectId(body.user._id),
                modifiedDate: new Date()
            }
        }
        return await findOneAndUpdate(query,update,collection_name);
    }catch(error){
        logger.error("Error while activateDeactivateShift in shift module");
        throw error;
    }
}

export const getCurrentShift = async (body) => {
    try{
        const query = {_id: new ObjectId(body.currentShiftId)}
        return await getOne(query,collection_name);
    }catch(error){
        logger.error("Error while get current Shift in shift module");
        throw error;
    }
}

export const getShiftIdOnName = async (body) => {
    try{
        
        body.orgId = body?.orgDetails?._id ? body.orgDetails._id : new ObjectId(body.user.orgId);
        const query={
            orgId:new ObjectId(body.orgId),
            isActive:true,
            name:body.name
        }
       
        return await getOne(query,collection_name);
    }catch(error){
        logger.error("Error while getShiftIdOnName in shift module");
        throw error;
    }
}