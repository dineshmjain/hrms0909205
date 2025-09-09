import * as apiResponse from './apiResponse.js';
import { logger } from './logger.js';

/**
 * Base controller for CURD opration.
 */
export class Controller {
    constructor(request,response,next,Service) {
        this.request = request;
        this.response = response;
        this.next = next;
        this.service = new Service();
    }

    async create () {
        try{
            // const newService = new this.service();
            const result = await this.service.writeData(this.request.body);
            if(!result.status) {
                return apiResponse.somethingResponse(this.response,"Something went worng");
            }
            this.request.body[`${this.service.constructor.name}`] = result.data;
            return this.next();
        }catch(error){
            logger.error(`Error while ${this.service.constructor.name} creation.`,{ stack: error.stack });
            return apiResponse.somethingResponse(this.response, error.message)
        }
        
    };

    async getOne () {
        try{

            const result = await this.service.getOneData(this.request.body,this.request.params);
            this.request.body[`${this.service.constructor.name}`] = result;
            return this.next();

        }catch(error){
            logger.error(`Error while featching single ${this.service.constructor.name}.`,{ stack: error.stack });
            return apiResponse.somethingResponse(this.response, error.message)
        }

    }

    //Get data with pagination
    async get () {
        try{
            if(this.request.body.orgDetails){
                this.request.query.orgId = this.request.body.orgDetails._id;
            }            
            const result = await this.service.getData(this.request.query);
            this.request.body[`${this.service.constructor.name}`] = result;
            return this.next();

        }catch(error){
            logger.error(`Error while listing ${this.service.constructor.name}.`,{ stack: error.stack });
            return apiResponse.somethingResponse(this.response, error.message)
        }
    }

    //Get data without pagination
    async getAll () {
        try{
            if(this.request.body.orgDetails){
                this.request.query.orgId = this.request.body.orgDetails._id;
            }            
            const result = await this.service.getAll(this.request.body);
            this.request.body[`${this.service.constructor.name}`] = result;
            return this.next();

        }catch(error){
            logger.error(`Error while listing ${this.service.constructor.name}.`,{ stack: error.stack });
            return apiResponse.somethingResponse(this.response, error.message)
        }
    }

    async edit() {
        try{
            const result = await this.service.editData(this.request.body);
            if(!result.status) {
                return apiResponse.somethingResponse(this.response,result.message)
            }
            this.request.body[`${this.service.constructor.name}`] = result;
            return this.next();

        }catch(error){
            logger.error(`Error while listing ${this.service.constructor.name}.`,{ stack: error.stack });
            return apiResponse.somethingResponse(this.response, error.message)
        }
    }

}