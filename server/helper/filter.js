import { ObjectId } from "mongodb";

/**
 * All the comman query in app. 
 */
export class QueryBuilder {
    constructor(query) {
        this.query = query;
        this.params = {};
    }

    addOrgId(){
        // if(this.query.orgId && this.query.user.orgId.toString() === this.query.orgId.toString()) {
        //     this.params["orgId"] = this.query.user.orgId;
        // }
        if(this.query.orgId) {
            this.params["orgId"] = this.query.orgId;
        }

        if(this.query.clientMappedId){
            this.params["orgId"] = new ObjectId(this.query.clientMappedId);
        }
        // if(this.query.orgId && this.query?.user?.orgId.toString() !== this.query.orgId.toString()) {
        //     this.params["subOrgId"] = this.query.orgId;
        // }
        // if(this.query.subOrgId){
        //     this.params["subOrgId"] = new ObjectId(this.query.subOrgId);
        // }
        return this;
    };

    addClientId(){
        if(this.query.clientId){
            this.params["clientId"] = new ObjectId(this.query.clientId);
        }
        return this;
    };

    isClient(){
        if(this.query.isClient){
            this.params["isClient"] = this.query.isClient === "true";
        }
        return this;
    }

    addClientBranchId(){
        if(this.query.clientBranchId){
            this.params["clientBranchId"] = new ObjectId(this.query.clientBranchId);
        }
        return this;
    };

    addId(){
        if(this.query.id) {
            this.params["_id"] = new ObjectId(this.query.id);
        }
        return this;
    };

    addShiftId(){
        if(this.query.shiftId) {
            this.params["_id"] = new ObjectId(this.query.shiftId);
        }
        return this;
    };

    addUserId(){
        if(this.query.employeeId) {
            this.params["employeeId"] = new ObjectId(this.query.employeeId);
        }
        return this;
    };

    addUserIds() 
    {
        if(this.query.userIds && Array.isArray(this.query.userIds) && this.query.userIds.length) 
        {
          this.params._id = { $in: this.query.userIds.map(id => new ObjectId(id)) };
          delete this.query.userIds; // Remove original userIds array
        }
        return this;
    }

    addEmployeeIds() 
    {
        if(this.query.employeeIds && Array.isArray(this.query.employeeIds) && this.query.employeeIds.length) 
        {
          this.params.employeeId = { $in: this.query.employeeIds.map(id => new ObjectId(id)) };
        }
        return this;
    }

    addDate() {
        if(this.query.startDate && this.query.endDate) 
        {
            this.params["date"] = {
                $gte: new Date(this.query.startDate),
                $lte: new Date(this.query.endDate)
            }
        }
        else if(this.query.startDate) 
        {
            const start = new Date(this.query.startDate);
            const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
            this.params["date"] = { $gte: start, $lt: end };
        }
        
        return this;
    }

    addClientBranchId(){
        if(this.query.clientBranchId) {
            this.params["clientBranchId"] = new ObjectId(this.query.clientBranchId);
        }
        return this;
    }

    addName() {
        if(this.query.name) {
            this.params["name"] = new RegExp(`${this.query.name}`,"i");
        }
        return this;
    }
   
    addClientName() {
        if(this.query.clientName) {
            this.params["clientName"] = new RegExp(`${this.query.clientName}`,"i");
        }
        return this;
    }
    
    addNameWithoutRegex() {
        if(this.query.name) {
            this.params["name"] = this.query.name
        }
        return this;
    }

    isGloble(){
        if (this.query.global) {
            this.params["global"] = this.query.global === "true";
        }
        return this;
    }

     addCreatedAt() {
        if (this.query.createdAt) {
            const start = new Date(this.query.createdAt);
            const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
            this.params["createdAt"] = { $gte: start, $lt: end };
        }
        return this;
    }



    addCreatedDate() {
        if (this.query.createdDate) {
            const start = new Date(this.query.createdDate);
            const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
            this.params["createdDate"] = { $gte: start, $lt: end };
        }
        return this;
    }


    addUpdatedAt() {
        if (this.query.updatedAt) {
            const start = new Date(this.query.updatedAt);
            const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
            this.params["updatedAt"] = { $gte: start, $lt: end };
        }
        return this;
    }

    addStartTime() {
        if (this.query.startTime) {
            this.params["startTime"] = new RegExp(this.query.startTime, "i");
        }
        return this;
    }

    addEndTime() {
        if (this.query.endTime) {
            this.params["endTime"] = new RegExp(this.query.endTime, "i");
        }
        return this;
    }

    addIsActive() {
        if (this.query.isActive) {
            this.params["isActive"] = this.query.isActive === "true";
        }
        return this;
    }
    
    addIsClient() {
        if (this.query.isClient) {
            this.params["isClient"] = this.query.isClient === "true";
        }
        return this;
    }

    getNameAgregationPipeLIne () {
            
        let aggrigationPipeline = [
            {
                $match:this.params
            },
            {
                $lookup:{
                    from: "user",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "user",
                }
            },
            {
                $unwind:"$user"
            },
            {
                $addFields: {
                    createdByName: "$user.name",
                }
            },
            {
                $project: {
                    "user":0
                }
            }
        ]
        this.aggrigationPipeline = aggrigationPipeline;
        return aggrigationPipeline;
    }

    addParentOrgId(){
        if (this.query.parentOrgId) {
            this.params["parentOrg"] = new ObjectId(this.query.parentOrgId);
        }
        return this;
    }

    addSubOrgId(){
        if(this.query.subOrgId) {
            this.params["subOrgId"] = new ObjectId(this.query.subOrgId);
        }
        return this;
    }

    getQueryParams(){
        return this.params;
    }
}