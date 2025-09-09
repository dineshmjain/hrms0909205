import * as apiResponse from '../../helper/apiResponse.js';
import { UserLogs } from '../../models/user/userlogs.js';
import { Controller } from '../../helper/controllerService.js';

export class UserLoges extends Controller{
    constructor(request,response,next){
        super(request,response,next,UserLoges);
    }
}