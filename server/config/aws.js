import { logger } from '../helper/logger.js';
import { RekognitionClient, CreateCollectionCommand, ListCollectionsCommand ,IndexFacesCommand,SearchFacesByImageCommand} from "@aws-sdk/client-rekognition";
// import AWS  from 'aws-sdk';
import fs from "fs"

// Temporarily disabled AWS config for Replit setup
// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION,
//   });

const client = new RekognitionClient({ region: process.env.AWS_REGION });

export async function createFaceCollection(collectionId = "my-face-collection") {
  try {
    // List existing collections
    const listCommand = new ListCollectionsCommand({});
    const listResponse = await client.send(listCommand);

    // Check if the collection already exists
    if (listResponse.CollectionIds.includes(collectionId)) {
      logger.debug(`Collection '${collectionId}' already exists.`);
      return;
    }

    // Create the
    const createCommand = new CreateCollectionCommand({ CollectionId: collectionId });
    const createResponse = await client.send(createCommand);
    logger.info(`Collection '${collectionId}' created successfully!`, createResponse);
  } catch (err) {
    console.error("Error managing collection:", err);
    throw err;
  }
}



export async function indexUserFace(imagePath,employeeId) {
  // const { employeeId} = body;
  // const imageBytes = fs.readFileSync(imagePath);

  const command = new IndexFacesCommand({
    CollectionId: "my-face-collection",
    Image: { Bytes: imagePath.data },
    ExternalImageId: employeeId, 
  });

  try {
    const response = await client.send(command);
    logger.debug("Face Indexed:", response.FaceRecords);
    return response.FaceRecords;
  } catch (err) {
   logger.error("Error indexing face:", err);
    throw err;
  }
}

export async function searchUserFace( imagePath) {
  //const imageBytes = fs.readFileSync(imagePath);

  const command = new SearchFacesByImageCommand({
    CollectionId: "my-face-collection",
    Image: { Bytes: imagePath.data },
    MaxFaces: 1, // Limit to the closest match
  });

  try {
    const response = await client.send(command);
    if (response.FaceMatches && response.FaceMatches.length > 0) {
      console.log("Match Found:", response.FaceMatches[0]);
      return response.FaceMatches[0]; // Return match details
    } else {
      console.log("No Match Found");
      return null;
    }
  } catch (err) {
    console.error("Error searching face:", err);
    throw err;
  }
}
