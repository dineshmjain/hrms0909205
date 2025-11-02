import { logger } from "../../helper/logger.js";
import {ObjectId} from "mongodb";
import { create,getOne,findWithPegination,findOneAndUpdate,getMany, createMany, aggregationWithPegination,updateOne, aggregate } from "../../helper/mongo.js";
// import { QueryBuilder } from "../../helper/filter.js";
import MongoDBService from "../../helper/mongoDbService.js";
// import { getOne } from "../../helper/mongo.js";
import moment from 'moment';
const collection_name = "leave";


export class Leave extends MongoDBService {
    constructor() {
        super("leave");
        //this.collection_name = collection_name;
    }

    async writeData (body) {
        try{
            const leaveObj = {
                name:body.name,
                type : 'local',
                orgId: body.orgDetails._id,
                isActive:true,
                createdAt:new Date(),
                updatedAt:new Date(),
                createdBy:new ObjectId(body.userId),

            };
            return await this.create(leaveObj)
    
        }catch(error){
            logger.error("Error while creating leave in leave module");
            throw error;
        }
    };


    async getOneData (body,params) {
        try{  
            body.id = params.id
            body.orgId = body.orgDetails._id     
            this.query = body;
            if (Object.keys(params).length === 0) {
                this.addNameWithoutRegex();
            }
            this.addId()
            this.addOrgId();

            this.params = this.getQueryParams();

            return await this.getOne();

        }catch(error){
            logger.error("Error while getting one leave in leave module");
            throw error;
        }
    }

    async getData(query) {
        try {
            this.query = query;
            this.addId();
            this.addOrgId();
            this.isGloble();
            this.addNameWithoutRegex();
            this.getNameAgregationPipeLIne();
            this.addName();
            // let queryString = {};
            // if (this.params.global && !this.params.orgId) {
            //     queryString = {};
            // } else if (this.params.global && this.params.orgId) {
            //     queryString = {
            //         $or: [
            //             { global: this.params.global },
            //             { orgId: this.params.orgId }
            //         ]
            //     };
            // } else if (this.query.isGlobal && this.params.orgId) {
            //     queryString = {
            //         global : this.params.global
            //     };
            // } else if (this.params._id && !this.params.orgId) {
            //     queryString = { _id: this.params._id };
            //     return await this.getOne();
            // } else {
            //     this.getNameAgregationPipeLIne();
            //     return await this.aggregationWithPagination(this.params);
            // }
            
            return await this.aggregationWithPagination( this.query);

        } catch (error) {
            logger.error("Error while listing leave in leave module", error);
            throw error;
        }
    }
    

    async editData(body) {
        try {
            let { userId, orgId, orgDetails, Leave, token, id, user, ...leaveData } = body
            body.orgId = body.orgDetails._id;
            this.query = body;
            this.addId()
            this.addOrgId()

            let updateObj= {}
            for(let details in leaveData){
                if(details == 'isActive'){
                    updateObj[details] = leaveData[details]
                }
                updateObj[details] = leaveData[details]
            }

            let update = updateObj  
            
            this.params = this.getQueryParams();

            return await this.updateOne('leave', this.params, update);
        } catch (error) {
            logger.error("Error while listing leave in leave module");
            throw error;
        }
    }

}

export const isValidLeave = async (body, orgId) => {
    try {
        let leaveId
        if(body.leaveTypeId){
           leaveId = body.leaveTypeId
        }
        let query = {
            _id : new ObjectId(leaveId),
            isActive : true
            // orgId : body.user?.orgId
        }
        // if(orgId){
        //     query.orgId = orgId
        // }

        return await getOne(query, collection_name)
    } catch (error) {
        logger.error("Error while checking leave in leave module");
            throw error;
    }
}

//user applied leave
export const UserApplyLeave=async(body)=>{
    try{
        const orgId = body?.user?.orgId
        const userId=body?.user._id
        const query={
            orgId: new ObjectId(orgId),
            userId:new ObjectId(userId),
            leavePolicyId:new ObjectId(body.leavePolicyId),
            from:new Date(body.from),
            ...(body.to&&{to: new Date(body.to)}), // Only include 'to' if it exists
            reason:body.reason,
            status:'pending',
            days:body.days, 
            paidDays:body.paidDays ,
            unpaidDays:body.unpaidDays ,
            noOfDaysAppliedLeave:body.noOfDaysAppliedLeave , 
            supportingDocuments: body.supportingDocuments || [],
            isWorkFromHome: body.isWorkFromHome || false,
            isActive:true,
            createdBy:new ObjectId(userId),
            createdDate:new Date()
        }
        if(body.subOrgId){
            query["subOrgId"]=new ObjectId(body.subOrgId)
        }
        if(body.branchId){
            query["branchId"]=new ObjectId(body.branchId)
        }
        if(body.departmentId){
            query["departmentId"]=new ObjectId(body.departmentId)
        }

        return await create(query,collection_name)

    }catch (error) {
        logger.error("Error while UserApplyLeave in leave module");
        throw error;
    }
}

// get leaves
export const getUserLeaveTransaction=async(body)=>{
    try{
        const userId=new ObjectId(body.user._id)
        const query={
            orgId:new ObjectId(body.user.orgId),
            isActive:true
            // $or:[]
        }

       if(body?.status)
        {
            query.status={ $regex: new RegExp(`^${body.status}$`, 'i') };
        }
        // if (body.subOrgIds && body.subOrgIds.length > 0) {
        //     query.subOrgId= { $in: body.subOrgIds.map(id => new ObjectId(id)) } ;
        // }
        // if (body.branchIds && body.branchIds.length > 0) {
        //     query.branchId={ $in: body.branchIds.map(id => new ObjectId(id)) } ;
        // }
        // if (body.departmentIds && body.departmentIds.length > 0) {
        //     query.departmentId={ $in: body.departmentIds.map(id => new ObjectId(id)) } ;
        // }
        // if(body.branchIds){
        //     query["branchId"]=new ObjectId(body.branchId)
        // }
        if(body.departmentIds){
            query["departmentId"]=new ObjectId(body.departmentId)
        }

        // if(userId){
        //     query['userId']=userId
        // }
        
        if (body.fromDate || body.toDate) {
            query['createdDate'] = {};
        
            if (body.fromDate) {
                const from = new Date(body.fromDate);
                from.setUTCHours(0, 0, 0, 0); 
                query['createdDate'].$gte = from;
            }
        
            if (body.toDate) {
                const to = new Date(body.toDate);
                to.setUTCHours(23, 59, 59, 999); 
                query['createdDate'].$lte = to;
            }
        }
        // thsi below one using for update leave status  checking user leave
        if(body.userLeaveId){
            query["_id"]=new ObjectId(body.userLeaveId)
        }

        // const { startDate, endDate } = helper.setStartAndEndDate(body);

        if(body.leavePolicyId){
            query["leavePolicyId"]=new ObjectId(body.leavePolicyId)
        }
        if(body.employeeId){
            query["userId"]=new ObjectId(body.employeeId)
        }

        const pipeline=[
            {
                $match:query
            },
            {
                $addFields: {
                  dayApproverIds: {
                    $map: {
                      input: { $objectToArray: "$days" },
                      as: "day",
                      in: "$$day.v.approvedBy"
                    }
                  }
                }
            },
            {
                $addFields: {
                  uniqueDayApproverIds: {
                    $setUnion: ["$dayApproverIds", []]
                  }
                }
            },
            {
                $lookup: {
                  from: "user",
                  localField: "uniqueDayApproverIds",
                  foreignField: "_id",
                  as: "dayApproverDetails"
                }
            },
            {
                $addFields: {
                  days: {
                    $arrayToObject: {
                      $map: {
                        input: { $objectToArray: "$days" },
                        as: "dayItem",
                        in: {
                          k: "$$dayItem.k",
                          v: {
                            $mergeObjects: [
                              "$$dayItem.v",
                              {
                                $let: {
                                  vars: {
                                    approver: {
                                      $arrayElemAt: [
                                        {
                                          $filter: {
                                            input: "$dayApproverDetails",
                                            as: "user",
                                            cond: {
                                              $eq: ["$$user._id", "$$dayItem.v.approvedBy"]
                                            }
                                          }
                                        },
                                        0
                                      ]
                                    }
                                  },
                                  in: {
                                    approvedBy:'$$approver.name' 
                                  }
                                }
                              }
                            ]
                          }
                        }
                      }
                    }
                  }
                }
            },
              
            {
                $lookup:{
                    from:'leavePolicyList',
                    localField:'leavePolicyId',
                    foreignField:'_id',
                    as:'leavePolicyDetails'
                }
            },
            {
                $unwind:'$leavePolicyDetails'
            },
            {
                $lookup:{
                    from:'user',
                    localField:'userId',
                    foreignField:'_id',
                    as:'userDetails'
                }
            },
            {
                $unwind:'$userDetails'
            },
            {
                $lookup: {
                  from: "assignment",
                  localField: "userDetails.assignmentId",
                  foreignField: "_id",
                  as: "matchedAssignments"
                }
            },
            {
                $unwind: {path:"$matchedAssignments", preserveNullAndEmptyArrays: true}
            },
            {
                $lookup: {
                  from: "designation",
                  localField: "matchedAssignments.designationId",
                  foreignField: "_id",
                  as: "designations"
                }
            },

            {
                $lookup:{
                    from:'organization',
                    localField:'userDetails.orgId',
                    foreignField:'_id',
                    as:'orgDetails'
                }
            },
            {
                $unwind:'$orgDetails'
            },
            // {
            //     $lookup:{
            //         from:'user',
            //         localField:'approvedBy',
            //         foreignField:'_id',
            //         as:'adminDetails'
            //     }
            // },
            // {
            //     $unwind:'$adminDetails'
            // },
            {
                $project:{
                    _id:1,
                    userId:1,
                    leavePolicyId:1,
                    from:1,
                    to:1,
                    reason:1,
                    status:1,
                    days:1,
                    paidDays:1,
                    unpaidDays:1,
                    approvedDays:1,
                    pendingDays:1,
                    rejectedDays:1,
                    // approvedBy:'$adminDetails.name',
                    approvedAt:1,
                    noOfDaysAppliedLeave:1,
                    supportingDocuments:1,
                    isWorkFromHome:1,
                    createdDate:1,
                    modifiedDate:1,
                    leavePolicyName:'$leavePolicyDetails.name',
                    userDetails:{
                        firstName:'$userDetails.name.firstName',
                        lastName:'$userDetails.name.lastName',
                        email:'$userDetails.email'
                    },
                    "designation": { $arrayElemAt: ["$designations.name", 0] },
                    orgName:'$orgDetails.name',
                }
            }
        ]

        let matchQuery = {};
        if(body.orgIds && body.orgIds.length>0) matchQuery["matchedAssignments.subOrgId"] = {$in: body.orgIds.map(id => new ObjectId(id))}
        if(body.branchIds && body.branchIds.length>0) matchQuery["matchedAssignments.branchId"] = {$in: body.branchIds.map(id => new ObjectId(id))}
        if(body.departmentIds && body.departmentIds.length>0) matchQuery["matchedAssignments.departmentId"] = {$in: body.departmentIds.map(id => new ObjectId(id))}
        if(body.designationIds && body.designationIds.length>0) matchQuery["matchedAssignments.designationId"] = {$in: body.designationIds.map(id => new ObjectId(id))}
        if(body.employeeIds && body.employeeIds.length>0) matchQuery["userDetails._id"] = {$in: body.employeeIds.map(id => new ObjectId(id))}

        if (Object.keys(matchQuery).length > 0) {
            pipeline.splice(10, 0, { $match: matchQuery })
        }

        // console.log('pipeline',JSON.stringify(pipeline,null,2))
        

        return await  aggregationWithPegination(pipeline,{page:body?.page||1,limit:body?.limit||10},collection_name)
        // if(result.data.length>=1){
        //     return{totalRecord:result.totalRecord,data:result.data,next_page:result.next_page} 

        // }
        // return { status:false,data:[]}


    }catch(error){
        logger.error('Error while getLleave Transactions in leave module')
        throw error
    }
}



// update leave status
export const updateLeaveStatus=async(body)=>{
    try{
        const query={
            isActive:true
        }
        if(body.userLeaveId){
            query['_id']=new ObjectId(body.userLeaveId)
        }

        const daysMap = body.days || {};
        const existingDays=body.existingDBDays || {}

        // Merge updated days into existing days
        const mergedDays = { ...existingDays };
        for (const [date, updateInfo] of Object.entries(daysMap)) {
            const isRejected = updateInfo.status === 'rejected';

            mergedDays[date] = {
                ...mergedDays[date], // keep existing type, paid, etc.
                ...updateInfo,
                approvedBy: new ObjectId(body.userId),
                approvedAt: new Date(),
                ...(isRejected && updateInfo.remarks ? { remarks: updateInfo.remarks } : {})
            };
        }

        let approvedDays = 0;
        let rejectedDays = 0;
        let pendingDays = 0;
        let totalAppliedDays = 0;

        let prevApprovedDays = 0;
        let newApprovedDays = 0;

        for (const [date, info] of Object.entries(existingDays)) {
            const value = info.type === 'full' ? 1 : 0.5;
            if (info.status === 'approved') prevApprovedDays += value;
        }
          
        for (const [date, info] of Object.entries(mergedDays)) {
        const value = info.type === 'full' ? 1 : 0.5;
            if (info.status === 'approved') newApprovedDays += value;
        }

        // Step Calculate how much approval count changed (+ means approved, - means reverted)
        const approvedChange = newApprovedDays - prevApprovedDays;

        // Store it in the return data so next function can use it
        // body.approvedChange = approvedChange;

        for (const day of Object.values(mergedDays)) {
            const value = day.type === 'full' ? 1 : 0.5;
            totalAppliedDays += value;
            // Status counts
            switch (day.status) {
                case 'approved': approvedDays += value; break;
                case 'rejected': rejectedDays += value; break;
                case 'pending': pendingDays += value; break;
            }

            // Paid/unpaid counts
            // if (day.paid) paidDays += value;
            // else unpaidDays += value;
        }

        // const totalDays = Object.keys(mergedDays).length;


        let finalStatus = "Pending";
        // if (approvedDays > 0 && (rejectedDays > 0 || pendingDays > 0)) {
        //     finalStatus = "Partially-Approved";
        // } else if (approvedDays === totalDays) {
        //     finalStatus = "Approved";
        // } else if (rejectedDays === totalDays) {
        //     finalStatus = "Rejected";
        // }

        if (approvedDays === totalAppliedDays) {
            finalStatus = "Approved";
        } else if (rejectedDays === totalAppliedDays) {
            finalStatus = "Rejected";
        } else if (approvedDays > 0 && (rejectedDays > 0 || pendingDays > 0)) {
            finalStatus = "Partially-Approved";
        } else if (pendingDays === totalAppliedDays) {
            finalStatus = "Pending";
        }

        const update={
            $set:{
                days: mergedDays,
                status: finalStatus,
                approvedDays,
                rejectedDays,
                pendingDays,
                // paidDays:body.paidDays,
                // unpaidDays:body.unpaidDays,
                // noOfDaysAppliedLeave:body.noOfDaysAppliedLeave,
                approvedBy:new ObjectId(body.userId),
                approvedAt:new Date(),
                updatedBy:new ObjectId(body.userId),
                modifiedDate:new Date(),
                // ...(!body.status?{reMarks:body?.remarks||'provide validreason or submit valid proof documents'}:{})
            }
        }
        const result= await updateOne(query,update,collection_name)
        if(result.status){
            return { status:true,message:'updated succesfully',approvedDays,approvedChange}
        }
        return { status: false, message: "Failed to update document" };

    }catch(error){
        logger.error('Error while updateLeaveStatus in leave module')
        throw error
    }
}


// create leave balance
export const createLeaveBalance = async (body) => {
    try {

        const now = moment(); // current date
        // const policy = body.policyData[0]; 
        const joinDate = moment(body.user.joinDate).startOf("day");

        const policywiseUserLeaveBalance = body.policydata.filter(policy => !body.userBalancePolicyIds.includes(policy.leavePolicyId.toString()))
            .map(policy => {

                const leaveBalance = {
                    userId: body.employeeId !== undefined ? new ObjectId(body.employeeId) : new ObjectId(body.user._id),
                    orgId: new ObjectId(body.user.orgId),
                    isActive: true,
                    // policyId: new ObjectId(policy._id),
                    policyId:new ObjectId(policy.leavePolicyId),
                    totalAccrued: 0,
                    usedLeaves: 0,
                    currentBalance: 0,
                    firstCreditedMonth: null,
                    lastCreditedMonth: null,
                    nextCreditedDate: null,
                    transaction: [],
                    usedTransaction: [],
                    createdDate: new Date(),
                };

                let creditedDay = policy.cycle?.creditedDay || 1;

                if (policy.cycle?.type === "monthly") {
                    creditedDay = policy.cycle?.creditedDay || 1;
                    let firstCreditDate = moment(joinDate).date(creditedDay);
                    if (joinDate.date() > creditedDay) {
                        firstCreditDate.add(1, "month");
                    }

                    let cyclesPassed = now.diff(firstCreditDate, "months") + 1; // Include current month if eligible
                    const totalToCredit = cyclesPassed * policy.noOfDays;
                    // Limit to last 2 cycles only (previous + current month)
                    if (cyclesPassed > 2) cyclesPassed = 2;

                    for (let i = 0; i < cyclesPassed; i++) {
                        // const creditDate = moment(firstCreditDate).add(i, "month").startOf("day");
                        const creditDate = moment(now).subtract(cyclesPassed - 1 - i, "months").startOf("day");
                        leaveBalance.transaction.push({
                            date: creditDate.toISOString(),
                            credited: policy.noOfDays,
                            // credited: totalToCredit,
                        });
                    }

                    if (cyclesPassed > 0) {
                        const firstCredit = moment(now).subtract(cyclesPassed - 1, "months").date(creditedDay);
                        const lastCredit = moment(now).date(creditedDay);
                        leaveBalance.totalAccrued = cyclesPassed * policy.noOfDays;
                        leaveBalance.currentBalance = leaveBalance.totalAccrued;
                        // leaveBalance.firstCreditedMonth = firstCreditDate.format("YYYY-MM");
                        leaveBalance.firstCreditedMonth = firstCredit.format("YYYY-MM");
                        leaveBalance.lastCreditedMonth = lastCredit.format("YYYY-MM");
                        // leaveBalance.lastCreditedMonth = moment(firstCreditDate)
                        //     .add(cyclesPassed - 1, "month")
                        //     .format("YYYY-MM");
                        // leaveBalance.nextCreditingDate = moment(firstCreditDate)
                        //     .add(cyclesPassed, "month")
                        //     .date(creditedDay)
                        //     .toISOString();
                        // leaveBalance.nextCreditingDate = moment(firstCreditDate).add(cyclesPassed, "month").date(creditedDay).toDate()
                        leaveBalance.nextCreditingDate = moment(lastCredit)
                        .add(1, "month")
                        .date(creditedDay)
                        .startOf("day")
                        .toDate();
                    }

                } else if (policy.cycle?.type === "yearly") {
                    const creditedMonth = policy.cycle?.creditedMonth || "January"; // e.g., "January"
                    // Handle Yearly Cycle
                    const creditDate = moment()
                        .month(policy.cycle.creditedMonth)
                        .date(policy.cycle.creditedDay)
                        .startOf("day");


                    // If joined before or on credit date
                    if (joinDate.isSameOrBefore(creditDate)) {
                        if (now.isSameOrAfter(creditDate)) {
                            leaveBalance.totalAccrued = policy.noOfDays;
                            leaveBalance.currentBalance = policy.noOfDays;
                            leaveBalance.transaction.push({
                                date: creditDate.toISOString(),
                                credited: policy.noOfDays,
                            });
                            leaveBalance.firstCreditedMonth = creditDate.format("YYYY-MM");
                            leaveBalance.lastCreditedMonth = creditDate.format("YYYY-MM");
                            // leaveBalance.nextCreditingDate = moment(creditDate)
                            //     .add(1, "year")
                            //     .toISOString();
                            leaveBalance.nextCreditingDate = moment(creditDate).add(1, "year").toDate()
                        } else {
                            // leaveBalance.nextCreditingDate = creditDate.toISOString();
                            leaveBalance.nextCreditingDate = creditDate.toDate();
                        }
                    } else {
                        // Joined after credit date, next year
                        // const nextYearCredit = moment(creditDate).add(1, "year");
                        // leaveBalance.nextCreditingDate = nextYearCredit.toISOString();

                        //  Employee joined after credit date → apply pro-rata
                        const joinMonthIndex = joinDate.month(); // 0 = Jan
                        const endOfYearMonthIndex = 11; // December
                        const monthsLeftInYear = endOfYearMonthIndex - joinMonthIndex + 1;

                        const monthlyLeave = policy.noOfDays / 12;
                        const proratedLeave = parseFloat((monthlyLeave * monthsLeftInYear).toFixed(2));

                        leaveBalance.totalAccrued = proratedLeave;
                        leaveBalance.currentBalance = proratedLeave;
                        leaveBalance.transaction.push({
                            date: joinDate.startOf("day").toISOString(),
                            credited: proratedLeave,
                            remark: "Pro-rata yearly credit",
                        });

                        leaveBalance.firstCreditedMonth = joinDate.format("YYYY-MM");
                        leaveBalance.lastCreditedMonth = moment().format("YYYY-MM");
                        // leaveBalance.nextCreditingDate = moment(creditDate).add(1, "year").toISOString();
                        leaveBalance.nextCreditingDate = moment(creditDate).add(1, "year").toDate();
                    }
                }


                return leaveBalance;



            })

        if (policywiseUserLeaveBalance.length === 0) {
            return { status: false, message: "No leave policies to create balance for" };
        }

        // console.log("....policywiseUserLeaveBalance", JSON.stringify(policywiseUserLeaveBalance));

        return await createMany(policywiseUserLeaveBalance, 'leaveBalance')


    } catch (error) {
        logger.error("Error while createLeaveBalance in leave module");
        throw error;
    }
}


// get leave balance
export const getLeaveBalance=async(body)=>{
    try{
        const orgId = body?.user?.orgId
        const userId=body?.user._id

        

        const query={
            orgId:new ObjectId(orgId),
            userId:new ObjectId(userId),
            isActive:true
        }
        if(body.leavePolicyId){
            query["policyId"]=new ObjectId(body.leavePolicyId)
        }
        if(body.employeeId){
            query["userId"]=new ObjectId(body.employeeId)
        }

        if (body.userIds) {
            delete query.userId
            const userIds = body.userIds.map(u => new ObjectId(u._id));
            query.userId = { $in: userIds };
           
        } 
        const pipeline = [
            {
                $match: query
            },
            // {
            //     $lookup: {
            //         from: 'leavePolicy',
            //         localField: 'policyId',
            //         foreignField: '_id',
            //         as: 'policyDetails'
            //     }
            // },
            {
                $lookup: {
                    from: 'leavePolicyList',
                    localField: 'policyId',
                    foreignField: '_id',
                    as: 'policyDetails'
                }
            },
            {
                $unwind: {
                    path: '$policyDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    orgId: 1,
                    policyId: 1,
                    policyName: '$policyDetails.name',
                    totalAccrued: 1,
                    usedLeaves: 1,
                    currentBalance: 1,
                    lossOfPayUsed:1
                    // firstCreditedMonth: 1,
                    // lastCreditedMonth: 1,
                    // nextCreditedDate: 1,
                    // transaction: 1,
                    // usedTransaction: 1,
                    // createdDate: 1,
                }
            }
        ]

        // return await getMany(query,'leaveBalance')
        return await aggregate(pipeline,'leaveBalance')

    }catch (error) {
        logger.error("Error while getLeaveBalance in leave module");
        throw error;
    }
}


// update user balance
export const updateUserBalance = async (body) => {
    try {
        // const { used, available, lossOfPayUsed } = body.userLeaveBalance;
        const {totalAccrued, usedLeaves, currentBalance, lossOfPayUsed=0} = body.userLeaveBalance;
        // const approvedDays = body.approvedDays || 0
        const approvedDays = body.approvedChange || 0;
        const query = {
            isActive: true,
            userId: new ObjectId(body.employeeId),
            policyId: new ObjectId(body.leavePolicyId)
        };

        let updatedUsed = usedLeaves;
        // let updatedAvailable = available;
        let updatedAvailable = currentBalance;
        let updatedLossOfPayUsed = lossOfPayUsed ;
        if (approvedDays > 0) {
        if (currentBalance >= approvedDays) {
            updatedUsed += approvedDays;
            updatedAvailable -= approvedDays;
        } else if (currentBalance > 0) {
            updatedUsed += currentBalance;
            updatedLossOfPayUsed += (approvedDays - currentBalance);
            updatedAvailable = 0;
        } else {
            updatedLossOfPayUsed += approvedDays;
        }
    }else if (approvedDays < 0) {
        // Revert (restore balance) if approval was cancelled
        const absChange = Math.abs(approvedDays);
        updatedUsed -= absChange;
        updatedAvailable += absChange;
        if (updatedUsed < 0) updatedUsed = 0;
    }

       

        const update = {
            $set: {
                usedLeaves: updatedUsed,
                // available: updatedAvailable,
                currentBalance: updatedAvailable,
                lossOfPayUsed: updatedLossOfPayUsed,
                updatedBy:new ObjectId(body.userId),
                modifiedDate:new Date(),
            }
        };

        return await updateOne(query, update, 'leaveBalance');

    } catch (error) {
        logger.error("Error while updateUserBalance in leave module");
        throw error;
    }
};


export  const getUserAppliedLeavesTransaction=async (body) => {
    try {
        const userIds = body.assignmentUserIds || [];
        // Start of today in UTC
        const startOfDay = new Date(body?.startDate);
        startOfDay.setUTCHours(0, 0, 0, 0);

        // End of today in UTC
        const endOfDay = new Date(body?.endDate);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const query = {
            orgId: new ObjectId(body.user.orgId),
            isActive: true,
            userId: { $in: userIds},
            from:{ $gte:startOfDay},
            to: { $lte: endOfDay }
        };
        const pipeline=[
            {
                $match: query
            },
            {
                $lookup:{
                    from:'leavePolicy',
                    localField:'leavePolicyId',
                    foreignField:'_id',
                    as:'leavePolicyDetails'
                }
            },
            {
                $unwind:'$leavePolicyDetails'
            },
            {
                $project:{
                    userId:1,
                    reason:1,
                    status:1,
                    days:1,
                    leavePolicyName: '$leavePolicyDetails.name',
                }
            }
        ]


        // console.log('query',JSON.stringify(query))

        // return await getMany(query, collection_name,{userId:1,reason:1,status:1,days:1});

        return await aggregate(pipeline, collection_name);

    } catch (error) {
        logger.error("Error while getUserAppliedLeavesTransaction in leave module");
        throw error;
    }
}


export const leaveBalanceUsers=async(body)=>{
    try{
        
        // const startOfDay = moment().utc().startOf("day").toDate(); // 00:00 UTC
        // const endOfDay = moment().utc().endOf("day").toDate();     // 23:59:59 UTC

        const nowIST = moment().utcOffset("+05:30");
        const startOfDay = nowIST.clone().startOf("day").utc().toDate();
        const endOfDay = nowIST.clone().endOf("day").utc().toDate();
    
        const query={
            // policyId:new ObjectId("68f0ec1616f0bbe4d7b07813"),
            isActive:true,
            nextCreditingDate: { $gte: startOfDay, $lte: endOfDay }
        }

        const pipeline=[
            {
                $match:query
            }
        ]

        // const paginationQuery={
        //     page:body.page,
        //     limit:body.limit
        // }

        // return await aggregationWithPegination(pipeline,paginationQuery,'leaveBalance')
        console.log("....query..",JSON.stringify(query))
        return await aggregate(pipeline,'leaveBalance')

    }catch(error){
        logger.error('error in leave balance users',{ stack: error.stack })
        throw error
    }
}

export const leaveBalanceSalaryEnabledUsers=async(body)=>{
    try{
        
        const query={
            isActive:true,
            policyId:{$in:body.salaryPolicies},
            currentBalance: { $gt: 0 }
        }

        console.log(".....query...",query)

        return await getMany(query,'leaveBalance')

    }catch(error){
        logger.error('error in leaveBalanceSalaryEnabledUsers',{ stack: error.stack })
        throw error
    }
}


export const createLeaveBalanceForReports= async (body) => {
    try {
      const now = moment();
      const userIds = body.userIds || [];
      const branchPolicies = body.policydata || [];
      const existingBalances = body.userBalance || [];
  
      if (userIds.length === 0 || branchPolicies.length === 0) {
        return { status: false };
      }
  
      // Step 1: Build map of existing balances: { "userId_policyId": true }
      const existingMap = {};
      existingBalances.forEach(bal => {
        const key = `${bal.userId.toString()}_${bal.policyId.toString()}`;
        existingMap[key] = true;
      });
  
      const newBalances = [];
  
      // Step 2: Loop through EVERY user
      for (const emp of userIds) {
        const userIdStr = emp._id.toString();
        const joinDate = moment(emp.joinDate || now).startOf('day');
  
        // Step 3: Loop through EVERY branch policy
        for (const policy of branchPolicies) {
          const policyIdStr = policy.leavePolicyId.toString();
          const balanceKey = `${userIdStr}_${policyIdStr}`;
  
          // Step 4: SKIP if already exists
          if (existingMap[balanceKey]) {
            continue;
          }
  
          // Step 5: CREATE missing balance
          const balanceDoc = {
            userId: new ObjectId(emp._id),
            orgId: new ObjectId(body.user.orgId),
            policyId: new ObjectId(policy.leavePolicyId),
            isActive: true,
            totalAccrued: 0,
            usedLeaves: 0,
            currentBalance: 0,
            lossOfPayUsed: 0,
            transaction: [],
            usedTransaction: [],
            createdDate: new Date(),
            firstCreditedMonth: null,
            lastCreditedMonth: null,
            nextCreditingDate: null
          };
  
          // MONTHLY CYCLE
          if (policy.cycle?.type === 'monthly') {
            const creditedDay = policy.cycle.creditedDay || 1;
  
            let firstCredit = moment(joinDate).date(creditedDay);
            if (joinDate.date() > creditedDay) {
              firstCredit.add(1, 'month');
            }
  
            let cycles = now.diff(firstCredit, 'months') + 1;
            if (cycles < 0) cycles = 0;
            if (cycles > 2) cycles = 2; // Only last 2 months
  
            const accrued = cycles * policy.noOfDays;
            balanceDoc.totalAccrued = accrued;
            balanceDoc.currentBalance = accrued;
  
            for (let i = 0; i < cycles; i++) {
              const creditDate = moment(now)
                .subtract(cycles - 1 - i, 'months')
                .date(creditedDay)
                .startOf('day');
  
              balanceDoc.transaction.push({
                date: creditDate.toDate(),
                credited: policy.noOfDays
              });
            }
  
            if (cycles > 0) {
              balanceDoc.firstCreditedMonth = moment(now).subtract(cycles - 1, 'months').format('YYYY-MM');
              balanceDoc.lastCreditedMonth = moment(now).format('YYYY-MM');
              balanceDoc.nextCreditingDate = moment(now).date(creditedDay).add(1, 'month').toDate();
            }
          }
  
          // YEARLY CYCLE
          else if (policy.cycle?.type === 'yearly') {
            const creditMonth = policy.cycle.creditedMonth || 'January';
            const creditDay = policy.cycle.creditedDay || 1;
            const creditDate = moment().month(creditMonth).date(creditDay).startOf('day');
  
            if (joinDate.isSameOrBefore(creditDate, 'day') && now.isSameOrAfter(creditDate)) {
              balanceDoc.totalAccrued = policy.noOfDays;
              balanceDoc.currentBalance = policy.noOfDays;
              balanceDoc.transaction.push({
                date: creditDate.toDate(),
                credited: policy.noOfDays
              });
              balanceDoc.firstCreditedMonth = creditDate.format('YYYY-MM');
              balanceDoc.lastCreditedMonth = creditDate.format('YYYY-MM');
              balanceDoc.nextCreditingDate = creditDate.add(1, 'year').toDate();
            } else {
              // Pro-rata
              const monthsWorked = 12 - joinDate.month();
              const prorated = parseFloat((policy.noOfDays * monthsWorked / 12).toFixed(2));
              balanceDoc.totalAccrued = prorated;
              balanceDoc.currentBalance = prorated;
              balanceDoc.transaction.push({
                date: joinDate.toDate(),
                credited: prorated,
                remark: 'Pro-rata yearly leave'
              });
              balanceDoc.firstCreditedMonth = joinDate.format('YYYY-MM');
              balanceDoc.lastCreditedMonth = moment().format('YYYY-MM');
              balanceDoc.nextCreditingDate = creditDate.add(1, 'year').toDate();
            }
          }
  
          newBalances.push(balanceDoc);
        }
      }
  
      // Step 6: Insert all at once
      if (newBalances.length > 0) {
        await createMany(newBalances, 'leaveBalance');
      }
  
      return {
        status: true,
        createdCount: newBalances.length
      };
  
    } catch (error) {
      console.error('createLeaveBalance error:', error);
      throw error;
    }
  };