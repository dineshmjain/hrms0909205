import { create, getOne, removeOne } from '../../helper/mongo.js';
import { ObjectId } from 'mongodb';

const collectionName = 'assignment';

export const createMapping = async (branchId, departmentId, designationId, user) => {
    try {
        const mappingData = {
            branchId: new ObjectId(branchId),
            departmentId: departmentId ? new ObjectId(departmentId) : null,
            designationId: designationId ? new ObjectId(designationId) : null,
            orgId: user?.orgId,
            createdAt: new Date(),
        };

        return await create(mappingData, collectionName);
    } catch (error) {
        throw new Error('Error creating mapping');
    }
};

export const findMapping = async (branchId, departmentId, designationId, user) => {
    try {
        const query = {
            branchId: new ObjectId(branchId),
            orgId: user?.orgId,
        };
        
        if (departmentId) query.departmentId = new ObjectId(departmentId);
        if (designationId) query.designationId = new ObjectId(designationId);

        return await getOne(query, collectionName);
    } catch (error) {
        throw new Error('Error finding mapping');
    }
};

export const deleteMapping = async (branchId, departmentId, designationId, user) => {
    try {
        const query = {
            branchId: new ObjectId(branchId),
            orgId: user?.orgId,
        };
        
        if (departmentId) query.departmentId = new ObjectId(departmentId);
        if (designationId) query.designationId = new ObjectId(designationId);

        return await removeOne(query, collectionName);
    } catch (error) {
        console.log("....error...",error?.message)
        return {status:false,message:error?.message??'Something went wrong in deleting mapping'}
        
    }
};

//checking all fileds in collection 
export const checkingAllFileds=async(body)=>{
    try{
        const {branchId, orgId,departmentId,designationId}=body
        let params = Object.create(null);
        params["orgId"] = new ObjectId(orgId);
        params["branchId"] = new ObjectId(branchId);
        params["departmentId"] = new ObjectId(departmentId)
        params["designationId"] = new ObjectId(designationId)

        const checkingFiledsstatus= await getOne(params,collectionName);
        if(checkingFiledsstatus.status){
            return {status:true,message:"Data Found",result:checkingFiledsstatus.data}
        }
        return {status:false,message:" No Data Found"}

    }catch(error){
        console.log("....error...",error?.message)
        return {status:false,message:error?.message??'Something went wrong'}
    }
}

export const assignAllFileds=async(body)=>{
    try{
        const {branchId, orgId,departmentId,designationId}=body
        let params = Object.create(null);
        params["orgId"] = new ObjectId(orgId);
        params["branchId"] = new ObjectId(branchId);
        params["departmentId"] = new ObjectId(departmentId)
        params["designationId"] = new ObjectId(designationId)
        params["createdAt"] = new Date();
        const assignAllFiledsStatus= await create(params,collectionName);
        if(assignAllFiledsStatus.status){
            return {status:true,result:assignAllFiledsStatus.data}
        }
        return {status:false,result:{insertedId:null},message:"Assignment failed to User"}

    }catch(error){
        console.log("...error....",error?.message??'Something went wrong')
        return {status:false,message:error?.message??'Something went wrong'}
    }
}

