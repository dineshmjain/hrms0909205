import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import {logger} from "../helper/logger.js";
dotenv.config()

// const username = process.env.MONGO_USERNAME
// const password = process.env.MONGO_PASSWORD
const hostname = process.env.MONGO_HOSTNAME
const port = process.env.MONGO_PORT 
const dbName = process.env.MONGO_DBNAME

const uri = /*"mongodb://192.168.1.118:27022/?authMechanism=DEFAULT&authSource=stockTaker"*/`mongodb://${hostname}:${port}/${dbName}`
// const uri = "mongodb://localhost:27017/easyPagarEnterprise"
//const uri = "mongodb://192.168.1.118:27022/easyPagarEnterprise"

let client;

export async function connectToDB() {
  try {
    if (!client) {
      client = new MongoClient(uri, { useUnifiedTopology: true })

      await client.connect()
      const db = client.db(dbName)
      logger.debug("Database connected")
      return db
    }
    return client.db(dbName)
  } catch (error) {
    console.error('Failed to connect to the database:', error)
    throw error
  }
}
