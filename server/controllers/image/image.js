import * as apiResponse from '../../helper/apiResponse.js'
import moment  from 'moment'
// import * as imageModel from '../../models/image/image.js'


export const uploadImage = (request, response, next) => {
    try {
        if (request.files?.file === undefined || request.files?.file === null || !request.files.file) {
            if (request.body?.skip) return next()
        }
        if(!request.files?.file) return apiResponse.validationError(response,"Key 'file' is required");
        // console.log(request.files); 
        if (!request.files || Object.keys(request.files).length === 0) {
            return apiResponse.notFoundResponse(response, "No Images Found")
        }
        let file = request.files.file;
        var type = request.files.file.mimetype.split('/')
        var fileName = `Image_` + moment().format('YYYYMMDDHHmmss') + `.${type[1]}`
        file.mv(request.body.folderPath + `/${fileName}`, (err) => {
            if (err) {
                console.log(err);
                return response.status(500).send(err);
            }
            request.body.ImagePath = request.body.dbfolderPath + `${fileName}`;
            // console.log(request.body.ImagePath);
            return next()
        });
    } catch (err) {
        console.log(err);
        return apiResponse.ErrorResponse(response, err.message,)
    }
}