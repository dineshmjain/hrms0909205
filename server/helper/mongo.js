
import { connectToDB } from '../config/mongoConfig.js';
// import {logRequest} from '../helper/formatting.js';

export const create = async (query,collection_name,logInfo) => {
    let db;
    try {
      db = await connectToDB();
      const collection = db.collection(collection_name);
      const result = await collection.insertOne(query);

      try {
        // Log the request details
        // await logRequest(logInfo);
      } catch (logError) {
        return {status:true, data:result}  
      }

      return {status:true, data:result}
    } catch (error) {
      throw error;
      return {status:false,error}
    } 
    // finally {
    //   db?.client.close();
    // }
}
export const createMany = async (query,collection_name,logInfo) => {
    let db;
    try {
      db = await connectToDB();
      const collection = db.collection(collection_name);
      
      const result = await collection.insertMany(query);

      try {
        // Log the request details
        // await logRequest(logInfo);
      } catch (logError) {
        return {status:true, data:result}  
      }

      return {status:true, data:result}
    } catch (error) {
      return {status:false,error}
    } 
    // finally {
    //   db?.client.close();
    // }
}

export const getMany = async (query = {},collection_name,projection) => {
  let db;
  try {
    db = await connectToDB();
    const collection = db.collection(collection_name);
    projection = projection || {};
    const result = await collection.find(query).project(projection).toArray();

    if (result.error)  throw {error:result.error}
    
    return { status: true, data: result };
  } catch (error) {
    console.error('An error occurred:', error);
    throw error
    return { status: false, error };
  } 
}

export const getOne = async (query,collection_name,projection, sort = {}) => {
    let db;
    try {
      db = await connectToDB();
      const collection = db.collection(collection_name);
      projection = projection || {};
     
      const result = await collection.findOne(query,{ projection : projection },sort);
      if(result == null || result.length==0) return {status:false}
      
      return {status:true, data:result}  
    } catch (error) {
      throw error;
    } 
    // finally {
    //   db?.client.close();
    // }
}

export const aggregate = async(query, collection_name) => {
  let db;
    try {
      db = await connectToDB();
      const collection = db.collection(collection_name);
      const cursor = collection.aggregate(query);
      if(cursor == null) throw {};

      const result = await cursor.toArray();
      if(result == null) throw {}
      return {status:true, data:result}
    } catch (error) {
      return {status:false,error}
    } 
    // finally {
    //   db?.client.close();
    // }
}

export const updateOne = async (query, update, collection_name, logInfo) => {
  let db;
  try {
    db = await connectToDB();
    const collection = db.collection(collection_name);
    const result = await collection.updateOne(query, update);
 
   if (result.matchedCount <= 0 && result.modifiedCount === 0) {

        throw {};
    }
  
    return { status: true, message: "Document updated successfully" };
  } catch (error) {
    console.log(error);
    console.error('An updateError occurred:', error);
    throw error;
    return { status: false, message: "Failed to update document" };
  } 
  // finally {
  //   db?.client.close();
  // }
}


export const updateOneWithupsert = async (query, update, collection_name,options = {}, logInfo) => {
  let db;
  try {
    db = await connectToDB();
    const collection = db.collection(collection_name);
    const result = await collection.updateOne(query, update, options);
    
    if (result.matchedCount === 0 && result.modifiedCount === 0 && result.upsertedId === null) {
      throw{}
    }
    
    try {
      // Log the request details
      // await logRequest(logInfo);
    } catch (logError) {
      return { status: true, message: "Document updated successfully", data: {upsertId : result?.upsertedId} };
    }
    return { status: true, message: "Document updated successfully",data: {upsertId : result?.upsertedId}  };
  } catch (error) {
    console.log(error);
    console.error('An updateError occurred:');
    return { status: false, message: "Failed to update document" };
  } 
  // finally {
  //   db?.client.close();
  // }
}

export const updateManyWithupsert = async (query, update, collection_name,options = {}, logInfo) => {
  let db;
  try {
    db = await connectToDB();
    const collection = db.collection(collection_name);
    const result = await collection.updateMany(query, update, options);
    
    if (result.matchedCount === 0 && result.modifiedCount === 0 && result.upsertedId === null) {
      throw{}
    }
    
    try {
      // Log the request details
      // await logRequest(logInfo);
    } catch (logError) {
      return { status: true, message: "Document updated successfully" };
    }
    return { status: true, message: "Document updated successfully" };
  } catch (error) {
    console.log(error);
    console.error('An updateError occurred:');
    return { status: false, message: "Failed to update document" };
  } 
  // finally {
  //   db?.client.close();
  // }
}

export const updateMany = async (query, update, collection_name, logInfo) => {
  let db;
  try {
    db = await connectToDB()
    const collection = db.collection(collection_name)
    const result = await collection.updateMany(query, update)
    // if (result.matchedCount <= 0 && result.modifiedCount === 0) throw {}
    // Check if no documents matched the query
    if (result.matchedCount === 0) {
      return { status: false, message: "No documents found matching the query." };
    }

    // Check if no documents were modified
    if (result.modifiedCount === 0) {
      return { status: true, message: "No documents were updated as the data was already up-to-date." };
    }

    try {
      // Log the request details
      // await logRequest(logInfo);
    } catch (logError) {
      return { status: true, message: "Document updated successfully" };
    }
    
    return { status: true, message: "Documents updated successfully" }
  } catch (error) {
    console.error('An updateError occurred:', error)
    return { status: false, message: "Failed to update documents" }
  } 
  // finally {
  //   db?.client.close()
  // }
};

export const distinct = async(query,field,collection_name) => {
  let db;
  try {
    db = await connectToDB();
    const collection = db.collection(collection_name);
    const result = await collection.distinct(field,query);
    return { status: true, data: result };
  } catch (error) {
    console.error('An distinctError occurred:', error);
    return { status: false, error };
  } 
  // finally {
  //   db?.client.close();
  // }
}

export const sort = async (query, collection_name, sortQuery,fields) => {
  let db;
  try {
    db = await connectToDB();
    const collection = db.collection(collection_name);
    const cursor =  collection.find(query).project(fields).sort(sortQuery);
    const result = await cursor.toArray();
    // if (result.length === 0) throw {};
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error };
  } 
  // finally {
  //   db?.client.close();
  // }
};

export const removeMany = async (query, collection_name,logInfo) => {
  let db;
  try {
    db = await connectToDB();
    const collection = db.collection(collection_name);
    const result =  await collection.deleteMany(query);
    if (result.length === 0) throw {};

    try {
      // Log the request details
      // await logRequest(logInfo);
    } catch (logError) {
      return { status: true, data: result };
    }

    return { status: true, data: result };
  } catch (error) {
    return { status: false, error };
  } 
  // finally {
  //   db?.client.close();
  // }
};

export const removeOne = async (query, collection_name,logInfo) => {
  let db;
  try {
    db = await connectToDB();
    const collection = db.collection(collection_name);
    const result = await collection.deleteOne(query);
    if (result.deletedCount === 0) throw {};

    try {
      // Log the request details
      // await logRequest(logInfo);
    } catch (logError) {
      return { status: true, data: result };
    }

    return { status: true, data: result };
  } catch (error) {
    return { status: false, error };
  } 
  // finally {
  //   db?.client.close();
  // }
};

export const bulkWriteOperations = async (operations, collection_name, logInfo) => {
  let db;
  try {
    db = await connectToDB();
    const collection = db.collection(collection_name);
    const res = await collection.bulkWrite(operations);

    // Check the res for errors or successful operations
    if (res.result.ok != 1) {
      throw new Error(`Bulk write failed with errors: ${res.result.writeErrors}`);
    }

    try {
      // Log the request details
      // await logRequest(logInfo);
    } catch (logError) {
      return { status: true, message: "Bulk write operations completed with errors" };
    }

    return { status: true, message: "Bulk write operations completed successfully" };
  } catch (error) {
    console.log(error);
    console.error('A bulkWriteError occurred:');
    return { status: false, message:error.code === 11000 ? "Data Existed Already, Not allowed Duplicates":"Failed to execute bulk write operations" };
  } 
  // finally {
  //   // Ensure the database connection is closed
  //   db?.client.close();
  // }
};


export const findOneAndUpdate = async (query, update, collectionName, logInfo) => {
  let db;
  try {
      db = await connectToDB();
      const collection = db.collection(collectionName);
      
      const options = {
          returnOriginal: false, // Return the updated document
          upsert: true, // Create a new document if no matching document is found
          new:true
      };
      // console.log("query",query)
      // const result = await collection.findOneAndUpdate(query,{$set: update}, options);
      const result = await collection.findOneAndUpdate(query,update, options);
      if(!result) return {status:false};
      try {
          
          // await logRequest(logInfo);
      } catch (logError) {
          return { status: true, data: result };
      }

      return { status: true, data: result };
  } catch (error) {
    throw error;
  } 
}

export const findWithPegination = async (params,projection,query,collectionName) => {
  try{
    const db = await connectToDB();
    const collection = db.collection(collectionName);

    const page = query.page ? parseInt(query.page) : 1;
    let limit = query.limit ? parseInt(query.limit) : 1000;
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder ? parseInt(query.sortOrder) : -1;

    const sortOptions = {
      [sortBy]: sortOrder,
    };

    const projectionObj = projection ? projection : {};

    const totalRecord = await collection.countDocuments(params);
    const data = await collection.find(params)
      .project(projectionObj) // Use projection here
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // console.log("...data...",data)

    return {
      status: true,
      totalRecord: totalRecord,
      data: data,
      next_page: totalRecord > page * limit ? true : false,
    }
    
  }catch(error){
    throw error
  }
}

export const aggregationWithPegination = async (aggregationPipeline,query,collectionName) => {
  try{
    const db = await connectToDB();
    const collection = db.collection(collectionName);

    const page = query.page ? parseInt(query.page) : 1;
    const  limit = query.limit ? parseInt(query.limit) : 1000;
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder ? parseInt(query.sortOrder) : -1;

    const sortOptions = {
      [sortBy]: sortOrder,
    };


    const [result] = await collection.aggregate([
      {
        $facet: {
          totalRecord: [
                ...aggregationPipeline,
                {$count:"totalRecord"}
            ],
            data: [
                ...aggregationPipeline,
                { $sort: sortOptions },
                { $skip: (page - 1) * limit },
                { $limit: limit }
            ]
        }
    }
    ])
      .toArray();

    const totalRecord = result.totalRecord.length > 0 ? result.totalRecord[0].totalRecord : 0;
    const data = result.data;
    return {
      status: true,
      totalRecord: totalRecord,
      data: data,
      next_page: totalRecord > page * limit ? true : false,
    }
    
  }catch(error){
    throw error
  }
}