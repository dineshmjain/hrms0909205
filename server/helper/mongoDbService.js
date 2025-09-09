import { MongoClient, ObjectId } from 'mongodb';
import config from '../config/index.js';
import { logger } from './logger.js';
import { QueryBuilder } from './filter.js';

class MongoDBService extends QueryBuilder{
  constructor(collection_name) {
    super();
    this.uri = config.mongoURI;
    this.dbName = config.dbName;
    this.client = new MongoClient(this.uri, { /*useNewUrlParser: true, */useUnifiedTopology: true });
    this.db = null;
    this.collectionName = collection_name;
  }

  // Establish connection to the database
  async connect() {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      logger.info(`Database connected with ${this.uri}${this.dbName}`)
    }
  }

  // Get the collection
  async getCollection() {
    await this.connect();
    return this.db.collection(this.collectionName);
  }

  // Create a single document
  async create(document) {
    try {
      const collection = await this.getCollection(this.collectionName);
      const result = await collection.insertOne(document);
      return { status: true, data: result };
    } catch (error) {
      console.error('Error creating document:', error);
      throw error
    }
  }

  // Create multiple documents
  async createMany(documents) {
    try {
      const collection = await this.getCollection(this.collectionName);
      const result = await collection.insertMany(documents);
      return { status: true, data: result };
    } catch (error) {
      console.error('Error creating documents:', error);
      throw error
    }
  }

  // Fetch multiple documents
  async getMany(query = {}, projection = {}) {
    try {
      const collection = await this.getCollection(this.collectionName);
      const result = await collection.find(query).project(projection).toArray();
      return { status: true, data: result };
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error
    }
  }

  // Fetch a single document
  async getOne(projection = {}) {
    try {
      const collection = await this.getCollection(this.collectionName);
      const result = await collection.findOne(this.params, { projection });
      return result ? { status: true, data: result } : { status: false, message: 'Document not found' };
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error
    }
  }

  // Update a single document
  async updateOne( query, update, options = {}) {
    try {
      const collection = await this.getCollection(this.collectionName);
      const result = await collection.updateOne(query, { $set: update }, options);
      if (result.matchedCount === 0) {
        return { status: false, message: 'No document matched the query' };
      }
      return { status: true, message: 'Document updated successfully' };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error
    }
  }

  // Delete a single document
  async deleteOne(collectionName, query) {
    try {
      const collection = await this.getCollection(collectionName);
      const result = await collection.deleteOne(query);
      if (result.deletedCount === 0) {
        return { status: false, message: 'No document found to delete' };
      }
      return { status: true, message: 'Document deleted successfully' };
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error
    }
  }

  // Find documents with pagination support
  async findWithPagination(options = {}) {
    //const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = -1 } = options;
    const page = options.page ? parseInt(options.page) : 1;
    let limit = options.limit ? parseInt(options.limit) : 10;
    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder ? parseInt(options.sortOrder) : -1;

    const sortOptions = {
      [sortBy]: sortOrder,
    };
    try {
      const collection = await this.getCollection(this.collectionName);
      const totalRecords = await collection.countDocuments(this.params);
      const data = await collection.find(this.params)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
      
      return {
        status: true,
        totalRecords,
        data,
        nextPage: totalRecords > page * limit
      };
    } catch (error) {
      console.error('Error fetching paginated documents:', error);
      throw error
    }
  }


  async aggregationWithPagination(options = {}) {
    //const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = -1 } = options;
    const page = options.page ? parseInt(options.page) : 1;
    let limit = options.limit ? parseInt(options.limit) : 10;
    const sortBy = options.sortBy || "createdDate";
    const sortOrder = options.sortOrder ? parseInt(options.sortOrder) : -1;

    const sortOptions = {
      [sortBy]: sortOrder,
    };
    try {
      const collection = await this.getCollection(this.collectionName);
      const totalRecord = await collection.countDocuments(this.params);
      const data = await collection.aggregate(this.aggrigationPipeline)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
      
      return {
        status: true,
        totalRecord,
        data,
        next_page: totalRecord > page * limit
      };
    } catch (error) {
      console.error('Error fetching paginated documents:', error);
      throw error
    }
  }

  // Close the database connection
  async close() {
    await this.client.close();

  }
}

export default MongoDBService;
