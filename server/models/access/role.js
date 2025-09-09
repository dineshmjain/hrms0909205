import { ObjectId } from 'mongodb';
import { create,updateOne,getOne, aggregate, updateMany} from '../../helper/mongo.js';
import { getCurrentDateTime } from '../../helper/formatting.js';
import * as constants from '../../helper/constants.js';

const collection_name = "roles"

//get admin role for admin registration defaultely
export const getAdminRole=async(body)=>{
    try{
      
      let query = {
        name:constants.role.ADMIN,
        priority: 1,
        isActive: true
    }
  
     return await getOne(query,collection_name)
  
  }catch (error) {
      return  {status : false, message: "Failed to get admin role", error}
      
  }
  }

export const getRoleModules = async (body) => {
  try {
    let role = body?.updatingUserDetails ? body.updatingUserDetails?.role[0] : body.user?.role[0]
    let query = [
      {
        $match: {
          _id: role
        },
      },
      {
        $unwind: "$modules",
      },
      {
        $lookup: {
          from: "modules",
          localField: "modules.moduleId",
          foreignField: "_id",
          as: "module",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          priority: 1,
          Description: 1,
          moduleKey: {
            $arrayElemAt: ["$module.moduleKey", 0],
          },
          permissions: "$modules.permissions",
          isRoleActive: "$isActive",
          isModuleActive: {
            $arrayElemAt: ["$module.isActive", 0],
          }
        }
      },
      {
        $match: {
          isModuleActive: 1,
          isRoleActive: true
        }
      },
      {
        $project: {
          _id: 0,
          moduleKey: 1,
          permissions: 1,
          priority: 1
        }
      }
    ]
    let data = await aggregate(query, collection_name)

    return data

  } catch (error) {
    console.log(".....error....", error)
    return { status: false, message: "something went wrong", error }
  }
}