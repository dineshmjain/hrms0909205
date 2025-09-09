//packages
import moment from 'moment';

//helper
import * as apiResponse from './apiResponse.js' 


export const uploadImage = (request,response, next) => {
    
    try{
        if(request.body?.skip) return next()

        // console.log(request.files); 
        if (!request.files || Object.keys(request.files).length === 0) {
            return response.status(400).send('No files were uploaded.');
        }
        let file = request.files.file;
        var type = request.files.file.mimetype.split('/')
        var fileName = `Image_`+ moment().format('YYYYMMDDHHmmss')+`.${type[1]}`

        //consider actual file name for add banner api
        if(request.body.actualFileNameFlag) fileName = file.name
        
        file.mv(request.body.folderPath + `/${fileName}`, (err) => {
            if (err) {
                console.log(err);
                return response.status(500).send(err);
            }
            request.body.ImagePath = request.body.dbfolderPath + `${fileName}`;
            // console.log(request.body.ImagePath);
            
            return next()
        });      
    }catch(err){
        console.log(err);
        return apiResponse.ErrorResponse(response,err.message,)
    }
}