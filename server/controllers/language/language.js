import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import formidable from 'formidable';
import * as apiResponse from '../../helper/apiResponse.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const downloadSelectedLanguage = async (request, response, next) => {
    try {
        const filePath = path.join(__dirname, '/../../assets/LanguagesJSONFile/', `${request.query.key}.json`);

        if (!fs.existsSync(filePath)) {
            request.logger.error(`File not found: ${filePath}`);
            return apiResponse.notFoundResponse(response, "File not found");
        }

        response.download(filePath, (err) => {
            if (err) {
                request.logger.error("Error during file download", { stack: err.stack });
                return apiResponse.somethingResponse(response, "Error during file download");
            }
        });
    } catch (error) {
        request.logger.error("Error while fetching selected language", { stack: error.stack });
        return apiResponse.somethingResponse(response, error.message);
    }
};

export const uploadSelectedLanguage = async (request,response,next)=>{
    try{
        let buffer = request?.files?.file?.data
        if(!buffer) return apiResponse.notFoundResponse(response,"File not found. please upload file.")
        let fileName = request?.files?.file.name;
        buffer = buffer.filter(byte => byte !== 0)
        if(!fileName) return apiResponse.notFoundResponse(response,"File not found. please upload file.")

        // request.body.fileExtension = fileName?.split('.')?.slice(-1)[0]
        // let generatedFileName = "File_" + moment(getCurrentDateTime()).format('YYYYMMDDHHmmss') + "." + request.body.fileExtension
        const filePath = path.join(__dirname, '/../../assets/LanguagesJSONFile/', `${fileName}`);


        if(buffer){
            let bufferString = buffer.toString()
            bufferString  = bufferString.replace(/&#4;/g,"")
            bufferString  = bufferString.split("\ufffd").join("");
            buffer = Buffer.from(bufferString)
        }

        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                return apiResponse.somethingResponse(response, "Failed to upload file, please try again later.")
            }
            console.log("success");
            
            return next()
        });

        //=========== Using Stream ===============
        // const writableStream = fs.createWriteStream(request.body.fileName);
        // const readableStream = Stream.Readable.from(buffer);
        // readableStream.pipe(writableStream);

        // writableStream.on("finish", () => {
        //     return next()
        // });

        // writableStream.on("error", () => {
        //     return apiResponse.somethingResponse(response, "Failed to upload file, please try again later.");
        // })
    }catch(err){
        return apiResponse.somethingResponse(response,err.message)
    }
 }