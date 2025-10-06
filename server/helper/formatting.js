import { promises } from 'fs';
import path from 'path';
import moment from 'moment';
import ExcelJS from 'exceljs';

import { networkInterfaces } from 'os';
import { dirname } from 'path';
import fs from 'fs';
import xlsx from 'xlsx';
import * as apiResponse  from '../helper/apiResponse.js'
import { logger } from '../helper/logger.js'
import { defaultGraceTime } from './constants.js';
// import "jspdf-autotable"
// import {jsPDF} from "jspdf"


const __dirname =  path.resolve(path.dirname(''))

export function getData(result) {
    let inputData = []
    if (result && result.recordsets && result.recordsets[0]) {
        inputData = result.recordsets[0]
    }
    return inputData
}

export function rowsAffected(result) {
    let inputData = []
    if (result && result.rowsAffected) {
        inputData = result.rowsAffected[0]
    }
    return inputData
}

export function generateReferralcode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


export const getLastMonthCount = (userData) => {
    
    userData = userData.filter(u=>{
        let CreatedDatetime = moment(u.CreatedDate)
        // console.log("******CREATED DATE TIME***********");
        // console.log(CreatedDatetime);
        let lastMonthStartDate = new Date()
        lastMonthStartDate.setMonth(lastMonthStartDate.getMonth()-1)
        // console.log({lastMonthStartDate:moment(lastMonthStartDate)});
        // console.log({CreatedDatetime});
        if(CreatedDatetime>moment(lastMonthStartDate)){
            return u
        }
    });


    return userData;
}

export const getLastYearCount = (userYear) => {
     userYear = userYear.filter(u=>{
               
        let CreatedDatetime = moment(u.CreatedDate)
        let lastYearStartDate = new Date()
        
        lastYearStartDate.setYear(lastYearStartDate.getFullYear()-1)
        
        // console.log({lastYearStartDate:moment(lastYearStartDate)});
       
        if(CreatedDatetime>moment(lastYearStartDate)){
            return u
        }
    });

    return userYear;
}

export const getGraphPoints= (dataList) => {

      var dt;    
    dataList= dataList.filter(d=>d.DateBit==1)


    try {
        const points = {
            "Jan":0,
            "Feb":0,
            "Mar":0,
            "Apr":0,
            "May":0,
            "Jun":0,
            "Jul":0,
            "Aug":0,
            "Sep":0,
            "Oct":0,
            "Nov":0,
            "Dec":0
        };
        
        dataList.forEach(d => {
          const createdDate = moment(d.CreatedDate).format("DD MMM YYYY");
          const month = moment(createdDate, 'DD MMM YYYY').format('MMM');
            
          if(d.total){
            points[month] += d.smsCount
          }
          else  points[month] += 1;
        });
      
        return points;
    } catch (error) {
        console.log(dt);
        console.log(error);
        return {}
    }
    // var dt;    
    // dataList= dataList.filter(d=>d.DateBit==1)
    // try {
    //     let points={}
    //     dataList.map(d=>{
    //         let CreatedDate = moment(d.CreatedDate).format("DD MMM YYYY")
    //         points[CreatedDate] = points[CreatedDate]==undefined ? 1 : points[CreatedDate]+1
    //     })
    //     return points;
    // } catch (error) {
    //     console.log(dt);
    //     console.log(error);
    //     return {}
    // }
}

export const getAnalysisData= (data,type) => {
    try {
        return {
            type,
            count:data.filter(d=>d.DateBit==1).length,
            categories:Object.keys(getGraphPoints(data)),
            points:Object.values(getGraphPoints(data))
        }
    }catch (error) {
        console.log(error);
        return {}
    }
}

export const getDurationDates= (duration) => {
    try {
        let startDate = moment().subtract(duration*2,'days').format('YYYY-MM-DD')
        let midDate = moment().subtract(duration,'days').format('YYYY-MM-DD')
        let endDate = moment().format('YYYY-MM-DD');
        
        return {startDate, midDate,endDate}
    } catch (error) {
        console.log(error);
        return {}
    }
}

export function getCurrentDateTime(){
    let currentDate = new Date();
    return currentDate

}

export function getDiffDateTime(days){
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate()+days)
    return currentDate

}
export function getDiffDateTimeMin(min){
    let currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes()+min)
    return currentDate

}

export function get24HoursPrevTime(diffDays){
    const currentUtcTime = new Date();
    const timezoneOffset = new Date().getTimezoneOffset();
    const localTime = currentUtcTime - (timezoneOffset * 60 * 1000);
    const oneDayBefore = localTime - (diffDays * 24 * 60 * 60 * 1000);
    const oneDayBeforeDate = new Date(oneDayBefore);
    return oneDayBeforeDate
}

export const getServerIP = () => {
    try {
      const nets = networkInterfaces();
      const results = {};
  
      for (const name of Object.keys(nets)) {
          for (const net of nets[name]) {
              // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
              // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
              const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
              if (net.family === familyV4Value && !net.internal) {
                  if (!results[name]) {
                      results[name] = [];
                  }
                  results[name].push(net.address);
              }
          }
      }
     
      let IP = results?.Ethernet ? results?.Ethernet :  results['Wi-Fi'] ? results['Wi-Fi'] : []
      return IP != [] ? IP[0] : ""
    } catch (error) {
         console.log(error);
         return ""
    }
}

export function getClientIP(req) {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
      const ips = forwardedFor.split(',');
      return ips[0];
    }
    return req.connection.remoteAddress;
}

// export const logRequest = async (logInfo) => {
//     try {
      
//     let ip = logInfo?.ip || ""
//     let endpoint = logInfo?.endpoint || ""
//     let queryString = logInfo?.queryString || ""
//     let body = logInfo?.body || {}
//     let activity = logInfo?.activity || false

//     const parentDirectory = path.join(__dirname, "..")
//     const logDirectory = path.join(parentDirectory, 'Logs');
  
//       try {
//         await promises.mkdir(logDirectory);
//       } catch (error) {
//         if (error.code !== 'EEXIST') {
//           throw error;
//         }
//       }
  
//         const currentDate = moment().format('YYYY-MM-DD');
//         const logFilePath = path.join(logDirectory, `${currentDate}.txt`);
//         const logMessage = `[${moment().format('HH:mm:ss')}]\nIP ADDRESS : ${ip}\nAPI_ENDPOINT: ${endpoint}\nREQUEST_BODY: ${JSON.stringify(body)}\nQUERY : ${queryString}\n\n`;

//         if(activity && activity?.ModuleKey){
//             let db = await connectToDB();
//             const collection = db.collection("Activity");
//             await collection.insertOne({ip, endpoint, ...activity, CreatedDate : getCurrentDateTime()}); 
//         }
//         await promises.appendFile(logFilePath, logMessage);

//     } catch (error) {
//       console.error('Error logging request:', error);
//     }
// };

export const findLastIndex = (array, value) => {
    for (let i = array.length - 1; i >= 0; i--) {
      if (JSON.stringify(array[i]) === JSON.stringify(value)) {
        return i; // Return the index of the last occurrence
      }
    }
    return -1; // Return -1 if the value is not found in the array
}

export const convertUtcToIst = (dateString) => {
    // Parse the UTC time string
    const utcDate = utc(dateString);
  
    // Set the time zone to IST (Indian Standard Time)
    const istDate = utcDate.clone().tz('Asia/Kolkata');
  
    // Format the date as 'YYYY-MM-DD'
    const formattedDate = istDate.format('YYYY-MM-DD');
  
    return formattedDate;
}


export const getUpdatedFields = (oldData, newData) => {
    
    let newObj = {}
    let oldObj = {}

    for(const key in newData) {
        if((Array.isArray(newData[key]) && !JSON.stringify(newData[key]) == JSON.stringify(oldData[key]) )
        ) {
           
            newObj[key] = newData[key]
            oldObj[key] = oldData[key]
        }
        else if(newData[key] != oldData[key]){
            newObj[key] = newData[key]
            oldObj[key] = oldData[key]
        }
       
    }

    return {new : newObj, old : oldObj}
}

export function isTimeDifferenceInMinutes(date1, date2,timeDiff) {
    const diffInMilliseconds = Math.abs(date2 - date1);
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    return diffInMinutes <= timeDiff; //true if timediff in min is within range of difference
}

export function convertToYYYYMMDD(incomingDate) {
    // Convert the incoming date to "YYYY-MM-DD" format using Moment.js
    const format = identifyDateFormat(incomingDate)
    const formattedDate = moment(incomingDate, format, true).format("YYYY-MM-DD");
  
    return formattedDate;
}

export function convertToDDMMYYYY(incomingDate) {
    // Convert the incoming date to "YYYY-MM-DD" format using Moment.js
    const format = identifyDateFormat(incomingDate)
    const formattedDate = moment(incomingDate, format, true).format("DD-MM-YYYY");
  
    return formattedDate;
}

export function identifyDateFormat(incomingDate) {
    const possibleFormats = [
      "YYYY-MM-DD",
      "DD-MM-YYYY",
      "MM-DD-YYYY",
      // Add more formats as needed
    ];
  
    let detectedFormat = null;
  
    for (const format of possibleFormats) {
      const parsedDate = moment(incomingDate, format, true); // Enable strict parsing
      if (parsedDate.isValid()) {
        detectedFormat = format;
        break;
      }
    }
  
    return detectedFormat;
}

//old report format
export const generateExcel = async(data, reportDetails) => {
    try {
        // Create a new workbook and add a worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Inventory Report');

        // Sample data for the "Excess Items" and "Short Items" tables
        const excessAndShortItemsData = data;

        // Merge cells for the main table
        worksheet.mergeCells('A1:H1');
        worksheet.getCell('A1').value = `Organization Name: ${reportDetails.orgName}`;
        worksheet.getCell('A1').font = { bold: true, size: 16 };

        worksheet.getCell('A2').value = `Godown Mismatched Items Report`;
        worksheet.getCell('A2').font = { bold: true, size: 10 };

        worksheet.getCell('A3').value = `Date: ${reportDetails.stockDate}`;
        worksheet.getCell('A3').font = { bold: true };

        worksheet.getCell('E2').value = reportDetails.godownName ? `Godown name: ${reportDetails.godownName}` : "";
        worksheet.getCell('E2').font = { bold: true };

        worksheet.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('A2').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('A3').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E2').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };


        // Merge cells for the "Excess Items" and "Short Items" sections inside the main table
        worksheet.mergeCells('A4:D4');
        worksheet.getCell('A4').value = 'Excess Items';
        worksheet.getCell('A4').font = { bold: true };
        worksheet.getCell('A4').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('A4').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

        worksheet.mergeCells('E4:H4');
        worksheet.getCell('E4').value = 'Short Items';
        worksheet.getCell('E4').font = { bold: true };
        worksheet.getCell('E4').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('E4').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

        // Add the "Excess Items" and "Short Items" table data inside the main table
        excessAndShortItemsData.forEach((row) => {
            worksheet.addRow(row).eachCell((cell) => {
                // Apply styling for subtable cells
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        });

        // Set column widths to 30 for each column
        worksheet.columns.forEach((column) => {
            column.width = 20;
        });

        // Center the entire main table
        worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

        // Save the workbook to a file
        const fileName = `Report_` + moment().format('YYYYMMDDHHmmss') + `.xlsx`;
        const filePath = path.join(__dirname, 'assets', 'report', fileName);

        try {
            await workbook.xlsx.writeFile(filePath);
            return { status: true, filePath: `/reports/${fileName}` };
          } catch (error) {
            return { status: false, error };
          }
    } catch (error) {
        return { status: false, message: error.message }
    }
}



export const generatePDF = async (exceessItems,shortItems, reportDetails) => {
    try {
        // // Sample dynamic data
        // const data = [
        //   [1, 20, "Item1", 1, 89, "Item2fwefwefweefwefwefwefwefwefwefwefwef"],
        //   [1, 40, "Item2", 1, 86, "Item2"],
        //   [1, 20, "Item3", 1, 23, "Item3"],
        //   [1, 20, "Item4", 1, 45, "Item4"],
        // ];

        // Create a new jsPDF document
        const pdfDoc = new jsPDF();

        // Title
        pdfDoc.setFontSize(18);
        pdfDoc.setFont("helvetica", "bold");
        // pdfDoc.setTextColor(0, 0, 139); //dark blue
        pdfDoc.text(`Organization Name: ${reportDetails.orgName}`, 50, 20);

        // Mismatched Item list Report
        pdfDoc.setFontSize(16);

        pdfDoc.text("Mismatched Item list Report", 10, 40);
        pdfDoc.setFontSize(12);
        pdfDoc.text(`Date : ${convertToDDMMYYYY(reportDetails.stockDate)}`, 150, 40);

        pdfDoc.setFontSize(12);
        reportDetails.godownName ? pdfDoc.text(`Godown : ${reportDetails.godownName}`, 10, 60) : undefined;



        // Set up first subtable (Excess items)
        const excessItemsData = exceessItems
        const excessItemsColumns = ["SL No", "Packets", "Item"];

        // Title row for Excess items
        pdfDoc.autoTable({
            head: [["Excess Items"]],
            startY: 70,
            margin: { horizontal: "center" }, // Center align the title
            styles: {
                fillColor: false,
                fontStyle: "bold",
                textColor: [0, 0, 0],
                align: "center",
            }, // Bold text and black color
        });

        pdfDoc.autoTable({
            head: [excessItemsColumns],
            body: excessItemsData,
            theme: "striped",
            margin: { left: 10, right: 5 },
        });

        // Set up second subtable (Short items)
        const shortItemsData = shortItems
        const shortItemsColumns = ["SL No", "Packets", "Item"];

        // Title row for Short items
        pdfDoc.autoTable({
            head: [["Short Items"]],
            startY: pdfDoc.autoTable.previous.finalY + 10,
            margin: { horizontal: "center" }, // Center align the title
            styles: { fillColor: false, fontStyle: "bold", textColor: [0, 0, 0] }, // Bold text and black color
        });

        pdfDoc.autoTable({
            head: [shortItemsColumns],
            body: shortItemsData,
            theme: "striped",
            margin: { left: 10, right: 5 },
        });

        // Save the workbook to a file
        const fileName = `PDF_` + moment().format('YYYYMMDDHHmmss') + `.pdf`;
        const filePath = path.join(__dirname, 'assets', 'pdf', fileName);

        try {
            pdfDoc.save(filePath);
            return { status: true, message: "PDF generated successfully", filePath: `/pdf/${fileName}` }
        } catch (error) {
            return { status: false, message: "Failed to generate PDF" }
        }

    } catch (error) {
        console.error(error);
        return { status: false, error: error.message }
    }
}

//set start date and end date
export const setStartAndEndDate=(params) =>{
    const { startDate, endDate } = params;

    // If only startDate is provided, use it for both startDate and endDate
    const finalStartDate = startDate || endDate;
    const finalEndDate = endDate || startDate;

    // If both are undefined, return current date for both startDate and endDate
    if (!finalStartDate || !finalEndDate) {
        const currentDate = new Date();
        return {
            startDate: new Date(currentDate.setUTCHours(0, 0, 0, 0)),   // Start of the current day
            endDate: new Date(currentDate.setUTCHours(23, 59, 59, 999)) // End of the current day
        };
    }

    // Convert the finalStartDate to Date object and set it to the start of the day
    const start = new Date(finalStartDate);
    start.setUTCHours(0, 0, 0, 0); // Start of the day

    // Convert the finalEndDate to Date object and set it to the end of the day
    const end = new Date(finalEndDate);
    end.setUTCHours(23, 59, 59, 999); // End of the day
    // end.setUTCHours(0, 0, 0, 0); // End of the day

    return {
        startDate: start,
        endDate: end,
    };
}

export const getUTCDateRange = (dateUTC, numberOfDays) => {
    // Parse the provided UTC date string
    const date = new Date(dateUTC);
  
    // Extract the year, month, and day from the provided date
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
  
    // Create the start of the day in UTC
    const startOfDayUTC = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    const newDay = numberOfDays === 0 ? day : day + numberOfDays;
    // Create the end of the day in UTC
    const endOfDayUTC = new Date(Date.UTC(year, month, newDay, 23, 59, 59, 999));
  
    return {
      startDate: startOfDayUTC,
      endDate: endOfDayUTC
    };
}

export const matchesConditions = (obj, keys, dict, values) => {
  return keys.every(key => obj[key[dict]].toString() != values[key[dict].toString()]);
};

// checkig validation on extractedExcelData
export const isCheckValidations = (excelData) => {
    try {
      const validData = [];
      const inValidData = [];
  
      for (let each of excelData) {
        let status = [];
  
        const {
          name,
          businessType,
          branchName,
          NoOfShifts,
          noOfMaleSupervisors,
          noOfFemaleSupervisors,
          noOfMaleGuards,
          noOfFemaleGuards,
          dutyPoint,
          checkPoint,
          panNo,
          gstNo,
          ownerName,
          firstName,
          mobile
        } = each;

        //String required fields
        if (!name ) status.push("Name should not be empty");
        if (!businessType) status.push("Business Type should not be empty");
        if (!branchName) status.push("Branch Name should not be empty");
        
        if (!firstName) status.push("First Name should not be empty");
  
        // Number validations
        if(!dutyPoint || isNaN(Number(dutyPoint))) status.push('Duty Point should be a valid number');
        if(!checkPoint || isNaN(Number(checkPoint))) status.push('check Point should be a valid number');
        if (!NoOfShifts || isNaN(Number(NoOfShifts))) status.push("No Of Shifts should be a valid number");
        if (!noOfMaleSupervisors || isNaN(Number(noOfMaleSupervisors))) status.push("No Of Male Supervisors should be a valid number");
        if (!noOfFemaleSupervisors || isNaN(Number(noOfFemaleSupervisors))) status.push("noOfFemaleSupervisors should be a valid number");
        if (!noOfMaleGuards || isNaN(Number(noOfMaleGuards))) status.push("noOfMaleGuards should be a valid number");
        if (!noOfFemaleGuards || isNaN(Number(noOfFemaleGuards))) status.push("noOfFemaleGuards should be a valid number");
  
        // PAN format check (optional)
        if (panNo && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNo.trim())) {
          status.push("Invalid PAN number format");
        }
  
        // GST format check (optional)
        if (gstNo && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNo.trim())) {
          status.push("Invalid GST number format");
        }
  
        // Mobile number check
        if (!mobile || !/^\d{10}$/.test(mobile.toString())) {
          status.push("mobile should be a 10-digit number");
        }
  
        
        if (status.length === 0) {
          validData.push(each);
        } else {
          inValidData.push({ ...each, status: status.join(", ") });
        }
      }
  
      return { validData, inValidData };
    } catch (error) {
      console.error(".....error....", error.message);
      throw error;
    }
};

/**
 * Utility: Normalize value for Excel import
 */
const normalize = (value) => {
    if (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && ['null', 'undefined', ''].includes(value.trim().toLowerCase()))
    ) {
        return null;
    }
    return typeof value === 'string' ? value.trim() : value;
};

/**
 * extractimportclientExcel - optimized
 */

// validation for employess after extract excel data
const isCheckEmployeeValidations = (excelData = []) => {
    const validData = [];
    const inValidData = [];

    for (const each of excelData) {
        const status = [];
        const {
            employeeId,
            firstName,
            mobile,
            password,
            subOrganization,
            branch,
            department,
            designation,
            email,
            gender,
            dateOfBirth,
            joinDate
        } = each;

        if (!employeeId) status.push("EmployeeId is required");
        if (!firstName) status.push("First Name is required");
        if (!mobile || !/^\d{10}$/.test(mobile)) status.push("Mobile must be 10 digits");
        //   if (!password) status.push("Password is required");
        if (!password) {
            status.push("Password is required");
        } else if (
            password.length < 6 ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/[0-9]/.test(password) ||
            !/[!@#$%^&*(),.?":{}|<>]/.test(password)
        ) {
            status.push("Password must be at least 6 characters and contain 1 uppercase, 1 lowercase, 1 number, 1 special char");
        }
        if(subOrganization){
            if(!subOrganization)status.push("Organization is required")
        }
        if(branch){
            if(!branch)status.push("branch is required")
        }
        // if (!branch) status.push("Branch is required");
        if (!department) status.push("Department is required");
        if (!designation) status.push("Designation is required");
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) status.push("Invalid Email");
        if (gender && !['male', 'female', 'other'].includes(gender.toLowerCase()))status.push("Invalid Gender");
        
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
            status.push("DOB must be in yyyy-mm-dd format");
        } else {
            const dob = new Date(dateOfBirth);
            const age = new Date().getFullYear() - dob.getFullYear();
            if (isNaN(dob.getTime())) {
                status.push("Invalid DOB");
            } else if (age < 15) {
                status.push("Employee must be at least 15 years old");
            }
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(joinDate)) {
            status.push("DOJ must be in yyyy-mm-dd format");
        } else {
            const doj = new Date(joinDate);
            const dob = new Date(dateOfBirth);
            const today = new Date();

            if (isNaN(doj.getTime())) {
                status.push("Invalid DOJ");
            } else {
                if (doj > today) {
                    status.push("DOJ cannot be a future date");
                }
                if (!isNaN(dob.getTime()) && doj <= dob) {
                    status.push("DOJ must be after DOB");
                }
            }
        }

        if (status.length === 0) {
            validData.push(each);
        } else {
            inValidData.push({ ...each, status: status.join(', ') });
        }
    }

    return { validData, inValidData };
};

/**
 * Utility: Parse Excel date to YYYY-MM-DD
 */
const parseExcelDate = (value) => {
    if (typeof value === 'number') {
        const date = new Date(Date.UTC(1900, 0, value - 1));
        if (value > 59) date.setUTCDate(date.getUTCDate() - 1); // Excel leap year bug
        return date.toISOString().slice(0, 10);
    }
    const parsed = new Date(value);
    return !isNaN(parsed) ? parsed.toISOString().slice(0, 10) : null;
};

/**
 * Utility: Read Excel file and return rows as JSON
 */
const readExcelRows = (filePath, sampleRows = [], headerRow = 0) => {
    const workbook = xlsx.readFile(filePath);
    const sheetnames = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetnames[0]];
    const range = xlsx.utils.decode_range(sheet['!ref']);
    const headers = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = sheet[xlsx.utils.encode_cell({ r: headerRow, c: C })];
        headers.push(cell ? cell.v : `UNKNOWN_${C}`);
    }
    const rows = xlsx.utils.sheet_to_json(sheet, {
        range: headerRow + 1,
        header: headers,
        defval: ''
    });
    // Filter out sample rows if sampleRows provided
    return rows.filter(row => {
        const mobile = row['Owner Mobile Number'] || row['Mobile Number'] || row['EmployeeId'];
        return !sampleRows.includes(mobile);
    });
};  

/**
 * Utility: Remove duplicates from array of objects based on keys
 */
const removeDuplicates = (dataArray, uniqueKeys) => {
    const unique = [];
    const duplicates = [];
    dataArray.forEach(row => {
        const isDuplicate = unique.find(u =>
            uniqueKeys.every(key => u[key] === row[key])
        );
        if (!isDuplicate) {
            unique.push(row);
        } else {
            duplicates.push({ ...row, status: 'duplicate data' });
        }
    });
    return { unique, duplicates };
};

/**
 * Modular Excel Extractor
 * @param {Object} options
 * @returns {Object} { validData, inValidData, duplicates }
 */
const extractExcelData = async ({request, response, sampleRows = [], mapRowFn, uniqueKeys, validateFn, dirPath="asset/files/others"}) => {
    try {
        const tmpDir = '/tmp';
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
        const file = request.files?.file;
        if (!file) return apiResponse.validationError(response, 'No file uploaded');
        let reqfileName = file?.name;
        request.body.fileExtension = reqfileName?.split('.')?.slice(-1)[0]
        let fileName = "File_" + moment(getCurrentDateTime()).format('YYYYMMDDHHmmss') + "." + request.body.fileExtension
        const filePath = `${tmpDir}/${fileName}`;
        fs.writeFileSync(filePath, file.data);

        const excelRows = readExcelRows(filePath, sampleRows);

        // Map and normalize
        const dataArray = excelRows.map(mapRowFn);

        // Remove duplicates
        const { unique, duplicates } = removeDuplicates(dataArray, uniqueKeys);

        if (duplicates.length > 0 && unique.length < 1) {
            return { validData: [], inValidData: [], duplicates };
        }
        if (!unique.length) {
            return { validData: [], inValidData: [], duplicates };
        }

        // Validate
        const { validData, inValidData } = validateFn(unique);

        if (validData.length < 1 && inValidData.length > 0) {
            return { validData: [], inValidData, duplicates };
        }

        return { employExtractData:validData, inValidData, duplicates };
    } catch (error) {
        request.logger?.error('Error in extractExcelData', { stack: error.stack });
        throw error;
    }
};

export const clientExcelFormat = async () => {
    try {
        const businessTypes = ['Security Agency', 'Hospital', 'Garment Manufacturer','Cleaning Service','Construction Company'];
        

        const headers = [
            'Organization', 'Bussiness Type', 'Owner First Name', 'Owner Last Name', 'Owner Mobile Number',
            'Branch Name', 'PAN', 'GST', 'No. of Shifts','No.of Male Supervisors','No.of Female Supervisors','No.of Male Guards','No.of Female Guards','DutyPoint', 'CheckPoint', 
            'Hno(optional)', 'Street(optional)', 'LandMark(optional)', 'City(optional)', 'District(optional)', 'State(optional)', 'Country(optional)', 'Pincode(optional)'
        ];

        const sampleRows = [
            ['MWb EnterPrises', 'Security Agency', 'Bafna', 'Mukesh', '9553737837',
                'Mwb Trading', 'ABCDE1234F', '27ABCDE1234F1Z5', '3', '1','5','5','12','3', '7', 
                '12A', 'MG Road', 'Near City Mall', 'Pune', 'Pune', 'Maharashtra', 'India', '411001'],
            ['MWb EnterPrises', 'Security Agency',  'Bafna', 'Mukesh', '9553737838',
                'Mwb Technologies',  'ABCDE1235F', '27ABCDE1234F1Z6', '3', '1','5','5','12','2', '8',
                '13A', 'MG Road5', 'Near City Mall1', 'Pune', 'Pune', 'Maharashtra', 'India', '411002'],
            ['MWb EnterPrises', 'Security Agency',  'Bafna', 'Mukesh', '9553737839',
                'Mwb manufacturing', 'ABCDE1236F', '27ABCDE1234F1Z7', '3', '1','5','5','12','3', '9',
                '14A', 'MG Road6', 'Near City Mall2', 'Pune', 'Pune', 'Maharashtra', 'India', '411003']
        ];

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Client Template');

        sheet.columns = headers.map(header => ({ header, key: header }));

        // Unlock all cells initially
        sheet.eachRow({ includeEmpty: true }, row => {
            row.eachCell(cell => {
                cell.protection = { locked: false };
            });
        });

        // Header formatting & lock
        const headerRow = sheet.getRow(1);
        headerRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFCCE5FF' }
            };
            cell.protection = { locked: true };
        });

        // Add sample data and lock
        sampleRows.forEach((rowData) => {
            const row = sheet.addRow(rowData);
            row.eachCell(cell => {
                cell.protection = { locked: true };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE6E6E6' }
                };
            });
        });

        // Apply dropdowns to data rows (from row 5 to 105)
        const applyDropdown = (colLetter, options) => {
            for (let i = 5; i <= 105; i++) {
                sheet.getCell(`${colLetter}${i}`).dataValidation = {
                    type: 'list',
                    allowBlank: true,
                    formulae: [`"${options.join(',')}"`],
                    showDropDown: true
                };
            }
        };

        applyDropdown('B', businessTypes);  // BussinessType
        

        //  Apply dropdowns to header cells for visibility without changing value
        const headerDropdowns = {
            B: businessTypes,
        };

        for (const [colLetter, options] of Object.entries(headerDropdowns)) {
            const cell = sheet.getCell(`${colLetter}1`);
            cell.dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: [`"${options.join(',')}"`],
                showDropDown: true
            };
            const originalValue = cell.value;
            cell.value = originalValue; // Reinforce original header value
        }

        // Unlock cells from row 5 to 105
        for (let i = 5; i <= 105; i++) {
            const row = sheet.getRow(i);
            for (let j = 1; j <= headers.length; j++) {
                row.getCell(j).protection = { locked: false };
            }
        }

        // Protect sheet
        await sheet.protect('teju123', {
            selectLockedCells: true,
            selectUnlockedCells: true
        });

        // Auto width
        sheet.columns.forEach(col => {
            let maxLen = col.header.length;
            col.eachCell({ includeEmpty: true }, cell => {
                const len = cell.value ? cell.value.toString().length : 0;
                maxLen = Math.max(maxLen, len + 2);
            });
            col.width = maxLen;
        });

        const destFolder = `assets/client/excelformat`;
        const fileName = `ClientImportTemplate_${Date.now()}.xlsx`;
        if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder, { recursive: true });
        }
        const filePath = path.join(destFolder, fileName);
        await workbook.xlsx.writeFile(filePath);

        return { status: true, data: `/api/v1/client/excel/format/${fileName}` };
    } catch (error) {
        console.error("Error while generating Excel:", error);
        return { status: false, message: "Failed to generate Excel" };
    }
};

export const extractImportClientExcel = async (request, response, next) => {
    const sampleRows = ['9553737837', '9553737838', '9553737839'];
    const mapRowFn = (row) => ({
        name: normalize(row?.Organization),
        businessType: normalize(row?.['Bussiness Type']),
        branchName: normalize(row?.['Branch Name']),
        panNo: normalize(row?.PAN),
        gstNo: normalize(row?.GST),
        NoOfShifts: Number(normalize(row?.['No. of Shifts'])),
        noOfMaleSupervisors: Number(normalize(row?.['No.of Male Supervisors'])),
        noOfFemaleSupervisors: Number(normalize(row?.['No.of Female Supervisors'])),
        noOfMaleGuards: Number(normalize(row?.['No.of Male Guards'])),
        noOfFemaleGuards: Number(normalize(row?.['No.of Female Guards'])),
        dutyPoint: normalize(row?.['DutyPoint']),
        checkPoint: normalize(row?.['CheckPoint']),
        hno: normalize(row?.['Hno(optional)']),
        street: normalize(row?.['Street(optional)']),
        landmark: normalize(row?.['LandMark(optional)']),
        city: normalize(row?.['City(optional)']),
        district: normalize(row?.['District(optional)']),
        state: normalize(row?.['State(optional)']),
        country: normalize(row?.['Country(optional)']) ?? 'India',
        pincode: normalize(row?.['Pincode(optional)']),
        ownerName:{
            firstName: normalize(row?.['Owner First Name']),
            lastName: normalize(row?.['Owner Last Name']),
        },
        firstName: normalize(row?.['Owner First Name']),
        lastName: normalize(row?.['Owner Last Name']),
        mobile: normalize(row?.['Owner Mobile Number'])
    });
    const uniqueKeys = [
        'name', 'mobile', 'businessType', 'branchName', 'panNo', 'gstNo', 'NoOfShifts',
        'dutyPoint', 'checkPoint', 'hno', 'street', 'landmark', 'city', 'district', 'state', 'country', 'pincode'
    ];
    const validateFn = isCheckValidations;

    return extractExcelData({
        request,
        response,
        sampleRows,
        mapRowFn,
        uniqueKeys,
        validateFn,
        dirPath:'assets/files/import/client',
    });
};



export const employeeExcelFormat= async (body) => {
    try {

        const genderType=['Male','Female']

        let headers = [
            'EmployeeId',  'First Name',  'Last Name', 'Mobile Number','Password','Email(optional)','Gender(optional)','DOB','DOJ','Branch','Department','Designation','Hno(optional)', 'Street(optional)', 'LandMark(optional)', 'City(optional)', 'District(optional)', 'State(optional)', 'Country(optional)', 'Pincode(optional)'
        ];

        let sampleRows = [
            ['EMP001', 'Mukesh', 'Bafna', '9553737837', 'test@1234', 'mukesh.bafna@example.com','Male', '1990-01-01', '2022-06-15', 'Mwb Trading', 'Accounts','Accountant','12A', 'MG Road', 'Near City Mall', 'Pune', 'Pune', 'Maharashtra', 'India', '411001'],
            ['EMP002', 'Abani', 'Bafna', '9553737838', 'test@1234', 'abani.bafna@example.com', 'Male','1992-03-10', '2023-01-12', 'Mwb Trading', 'Accounts','Auditor','13A', 'MG Road5', 'Near City Mall1', 'Pune', 'Pune', 'Maharashtra', 'India', '411002'],
            ['EMP003', 'Mukesh', 'Ramesh', '9553737839', 'test@1234', 'ramesh.bafna@example.com','Male', '1991-05-20', '2021-11-01', 'MWb Manufacturing','Cleaning','Supervisor','14A', 'MG Road6', 'Near City Mall2', 'Pune', 'Pune', 'Maharashtra', 'India', '411003']
        ];
        if(body.orgDetails?.structure==='group'){
            headers = [
                'EmployeeId',  'First Name',  'Last Name', 'Mobile Number','Password','Email(optional)','Gender(optional)','DOB','DOJ','Organization','Branch','Department','Designation','Hno(optional)', 'Street(optional)', 'LandMark(optional)', 'City(optional)', 'District(optional)', 'State(optional)', 'Country(optional)', 'Pincode(optional)'
            ];
            sampleRows = [
                ['EMP001', 'Mukesh', 'Bafna', '9553737837', 'test@1234', 'mukesh.bafna@example.com', 'Male','1990-01-01', '2022-06-15', 'MWB EnterPrise','Mwb Trading', 'Accounts','Accountant','12A', 'MG Road', 'Near City Mall', 'Pune', 'Pune', 'Maharashtra', 'India', '411001'],
                ['EMP002', 'Abani', 'Bafna', '9553737838', 'test@1234', 'abani.bafna@example.com', 'Male','1992-03-10', '2023-01-12', 'MWB EnterPrise', 'Mwb Trading', 'Accounts','Auditor','13A', 'MG Road5', 'Near City Mall1', 'Pune', 'Pune', 'Maharashtra', 'India', '411002'],
                ['EMP003', 'Mukesh', 'Ramesh', '9553737839', 'test@1234', 'ramesh.bafna@example.com', 'Male','1991-05-20', '2021-11-01',  'MWB EnterPrise','MWb Manufacturing', 'Cleaning','Supervisor','14A', 'MG Road6', 'Near City Mall2', 'Pune', 'Pune', 'Maharashtra', 'India', '411003']
            ];
        }

        if(body.orgDetails?.structure==='branch'){
            headers = [
                'EmployeeId',  'First Name',  'Last Name', 'Mobile Number','Password','Email(optional)','Gender(optional)','DOB','DOJ','Department','Designation','Hno(optional)', 'Street(optional)', 'LandMark(optional)', 'City(optional)', 'District(optional)', 'State(optional)', 'Country(optional)', 'Pincode(optional)'
            ];
            sampleRows = [
                ['EMP001', 'Mukesh', 'Bafna', '9553737837', 'test@1234', 'mukesh.bafna@example.com', 'Male','1990-01-01', '2022-06-15', 'Accounts','Accountant','12A', 'MG Road', 'Near City Mall', 'Pune', 'Pune', 'Maharashtra', 'India', '411001'],
                ['EMP002', 'Abani', 'Bafna', '9553737838', 'test@1234', 'abani.bafna@example.com', 'Male','1992-03-10', '2023-01-12',  'Accounts','Auditor','13A', 'MG Road5', 'Near City Mall1', 'Pune', 'Pune', 'Maharashtra', 'India', '411002'],
                ['EMP003', 'Mukesh', 'Ramesh', '9553737839', 'test@1234', 'ramesh.bafna@example.com', 'Male','1991-05-20', '2021-11-01', 'Cleaning','Supervisor','14A', 'MG Road6', 'Near City Mall2', 'Pune', 'Pune', 'Maharashtra', 'India', '411003']
            ];
        }

        
          

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Employee Template');

        sheet.columns = headers.map(header => ({ header, key: header }));

        // Unlock all cells initially
        sheet.eachRow({ includeEmpty: true }, row => {
            row.eachCell(cell => {
                cell.protection = { locked: false };
            });
        });

        // Header formatting & lock
        const headerRow = sheet.getRow(1);
        headerRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFCCE5FF' }
            };
            cell.protection = { locked: true };
        });

        // Add sample data and lock
        sampleRows.forEach((rowData) => {
            const row = sheet.addRow(rowData);
            row.eachCell(cell => {
                cell.protection = { locked: true };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE6E6E6' }
                };
            });
        });


         // Apply dropdowns to data rows (from row 5 to 105)
         const applyDropdown = (colLetter, options) => {
            for (let i = 5; i <= 105; i++) {
                sheet.getCell(`${colLetter}${i}`).dataValidation = {
                    type: 'list',
                    allowBlank: true,
                    formulae: [`"${options.join(',')}"`],
                    showDropDown: true
                };
            }
        };

        applyDropdown('G', genderType);  // BussinessType
        

       
        

        

        // Unlock cells from row 5 to 105
        for (let i = 5; i <= 105; i++) {
            const row = sheet.getRow(i);
            for (let j = 1; j <= headers.length; j++) {
                row.getCell(j).protection = { locked: false };
            }
        }

        // Protect sheet
        await sheet.protect('teju123', {
            selectLockedCells: true,
            selectUnlockedCells: true
        });

        // Auto width
        sheet.columns.forEach(col => {
            let maxLen = col.header.length;
            col.eachCell({ includeEmpty: true }, cell => {
                const len = cell.value ? cell.value.toString().length : 0;
                maxLen = Math.max(maxLen, len + 2);
            });
            col.width = maxLen;
        });

        const destFolder = `assets/employee/excelformat`;
        const fileName = `EmployeeImportTemplate_${Date.now()}.xlsx`;
        if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder, { recursive: true });
        }
        const filePath = path.join(destFolder, fileName);
        await workbook.xlsx.writeFile(filePath);

        return { status: true, data: `/api/v1/employee/excel/format/${fileName}` };
    } catch (error) {
        console.error("Error while generating employee Excel:", error);
        return { status: false, message: "Failed to generate employee Excel" };
    }
};

export const extractImportEmployeeExcel = async (request, response, next) => {
    const sampleRows = ['EMP001', 'EMP002', 'EMP003', '9553737837', '9553737838', '9553737839'];
    const mapRowFn = (row) => {
        const dateOfBirth = parseExcelDate(row['DOB']);
        const joinDate = parseExcelDate(row['DOJ']);
        const emp = {
            employeeId: normalize(row['EmployeeId']),
            firstName: normalize(row['First Name']),
            lastName: normalize(row['Last Name']),
            mobile: normalize(row['Mobile Number']),
            password: normalize(row['Password']),
            email: normalize(row['Email(optional)']),
            gender: normalize(row['Gender(optional)']),
            dateOfBirth: normalize(dateOfBirth),
            joinDate: normalize(joinDate),
            // branch: normalize(row['Branch']),
            department: normalize(row['Department']),
            designation: normalize(row['Designation']),
            address: {
                hno: normalize(row['Hno(optional)']),
                street: normalize(row['Street(optional)']),
                landmark: normalize(row['LandMark(optional)']),
                city: normalize(row['City(optional)']),
                district: normalize(row['District(optional)']),
                state: normalize(row['State(optional)']),
                country: normalize(row['Country(optional)']) ?? 'India',
                pincode: normalize(row['Pincode(optional)'])
            }
        };
        if (request.body.orgDetails?.structure === 'group') {
            emp.subOrganization = normalize(row['Organization']);
        }
        if (request.body.orgDetails?.structure === 'organization' || request.body.orgDetails?.structure === 'group') {
            emp.branch = normalize(row['Branch']);
        }
        return emp;
    };
    let uniqueKeys = [
        'employeeId', 'mobile', 'department', 'designation'
    ];
    if (request.body.orgDetails?.structure === 'organization' || request.body.orgDetails?.structure === 'group') {
        uniqueKeys = [
            'employeeId', 'mobile', 'branch', 'department', 'designation'
        ];
    }
    const validateFn = isCheckEmployeeValidations;

    return extractExcelData({
        request,
        response,
        sampleRows,
        mapRowFn,
        uniqueKeys,
        validateFn,
        dirPath:'assets/files/import/employee',
    });
};

export const getWorkingDaysTillToday=(year, month)=>{
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && (today.getMonth() + 1) === month;
  
    const endDay = isCurrentMonth ? today.getDate() : new Date(year, month, 0).getDate();
  
    let workingDays = 0;
    const date = new Date(year, month - 1, 1);
  
    while (date.getDate() <= endDay && date.getMonth() === (month - 1)) {
      const day = date.getDay(); // Sunday = 0
      if (day !== 0) workingDays++;
      date.setDate(date.getDate() + 1);
    }

    const monthDays = moment(`${year}-${month}`, 'YYYY-M').daysInMonth();
  
    // return workingDays,monthDays;
    return { workingDays, monthDays };
}
  


// export const clientResponseExcelFormat = async (data) => {
//     try {
//       const formattedData = data.map((item) => ({
//         'Status': item.status || '',
//         'Organization': item.name || '',
//         'Bussiness Type': item.businessType || item.bussinesstype || '',
//         'Owner First Name': item.ownerName?.firstName || item.firstName || '',
//         'Owner Last Name': item.ownerName?.lastName || item.lastName || '',
//         'Owner Mobile Number': item.mobile || '',
//         'Branch Name': item.branchName || '',
//         'PAN': item.panNo || '',
//         'GST': item.gstNo || '',
//         'No. of Shifts': item.NoOfShifts || '',
//         'No.of Male Supervisors': item.noOfMaleSupervisors || '',
//         'No.of Female Supervisors': item.noOfFemaleSupervisors || '',
//         'No.of Male Guards': item.noOfMaleGuards || '',
//         'No.of Female Guards': item.noOfFemaleGuards || '',
//         'DutyPoint': item.dutyPoint || '',
//         'CheckPoint': item.checkPoint || '',
//         'Hno(optional)': item.address?.hno || item.hno || '',
//         'Street(optional)': item.address?.street || item.street || '',
//         'LandMark(optional)': item.address?.landmark || item.landmark || '',
//         'City(optional)': item.address?.city || item.city || '',
//         'District(optional)': item.address?.district || item.district || '',
//         'State(optional)': item.address?.state || item.state || '',
//         'Country(optional)': item.address?.country || item.country || 'India',
//         'Pincode(optional)': item.address?.pincode || item.pincode || ''
//       }));
  
//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet('Duplicate Data');
  
//       //  First define headers
//       const headers = Object.keys(formattedData[0]);
  
//       worksheet.columns = headers.map(header => ({
//         header,
//         key: header,
//         width: header === 'Status' ? 80 : 25,
//         style: {
//           font: { bold: true },
//           alignment: {
//             vertical: 'middle',
//             horizontal: 'center',
//             wrapText: true
//           }
//         }
//       }));
  
//       // Insert Note row (top of sheet)
//       const lastColLetter = String.fromCharCode(64 + headers.length); // A-Z
//       worksheet.insertRow(1, []);
//       worksheet.mergeCells(`A1:${lastColLetter}1`);
//       const noteCell = worksheet.getCell('A1');
//       noteCell.value = '?? Note: Upload this same file after correcting the issues mentioned in the Status column.';
//       noteCell.font = { bold: true, italic: true, size: 12 };
//       noteCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
//       noteCell.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: 'FFFFF2CC' }
//       };
//       worksheet.getRow(1).height = 35; // Free space top/bottom of note
  
//       // Add data rows
//       formattedData.forEach(row => {
//         worksheet.addRow(row);
//       });
  
//       // Header row (2nd row) styling
//       worksheet.getRow(2).eachCell(cell => {
//         cell.protection = { locked: true };
//         cell.fill = {
//           type: 'pattern',
//           pattern: 'solid',
//           fgColor: { argb: 'FFDCE6F1' }
//         };
//         cell.font = { bold: true };
//         cell.alignment = {
//           vertical: 'middle',
//           horizontal: 'center',
//           wrapText: true
//         };
//       });
//       worksheet.getRow(2).height = 35;
  
//       // Unlock data rows
//       worksheet.eachRow((row, rowNumber) => {
//         if (rowNumber > 2) {
//           row.eachCell(cell => {
//             cell.protection = { locked: false };
//           });
//           row.alignment = { vertical: 'top', wrapText: true };
//           row.height = 30; // More vertical space for data
//         }
//       });
  
//       // Freeze headers
//       worksheet.views = [{ state: 'frozen', ySplit: 2 }];
  
//       // Protect Sheet
//       await worksheet.protect('mwb@123', {
//         selectLockedCells: true,
//         selectUnlockedCells: true,
//         formatCells: false,
//         insertRows: false,
//         deleteRows: false,
//         editObjects: false
//       });
  
//       // Save Excel file
//       const destFolder = `assets/client/excelduplicate`;
//       const fileName = `duplicate_clients_${Date.now()}.xlsx`;
//       if (!fs.existsSync(destFolder)) {
//         fs.mkdirSync(destFolder, { recursive: true });
//       }
//       const filePath = path.join(destFolder, fileName);
//       await workbook.xlsx.writeFile(filePath);
  
//       return {
//         status: true,
//         data: `/api/v1/client/excel/duplicate/${fileName}`
//       };
//     } catch (error) {
//       console.error('Excel generation failed:', error);
//       return { status: false, message: 'Failed to generate Excel' };
//     }
// };

// export const employeeResponseExcelFormat = async (data) => {
//     try {
//         const formattedData = data.map((item) => ({
//             'Status': item.status || 'Duplicate',
//             'EmployeeId': item.employeeId || '',
//             'First Name': item.firstName || '',
//             'Last Name': item.lastName || '',
//             'Mobile Number': item.mobile || '',
//             'Password': item.password || '',
//             'Email(optional)': item.email || '',
//             'Gender(optional)': item.gender || '',
//             'DOB': item.dob || item.dateOfBirth || '',
//             'DOJ': item.doj || item.joinDate || '',
//             ...(item.subOrganization && { 'Organization': item.subOrganization || '' }),
//             'Branch': item.branch || '',
//             'Department': item.department || '',
//             'Designation': item.designation || '',
//             'Hno(optional)': item.address?.hno || item.hno || '',
//             'Street(optional)': item.address?.street || item.street || '',
//             'LandMark(optional)': item.address?.landmark || item.landmark || '',
//             'City(optional)': item.address?.city || item.city || '',
//             'District(optional)': item.address?.district || item.district || '',
//             'State(optional)': item.address?.state || item.state || '',
//             'Country(optional)': item.address?.country || item.country || 'India',
//             'Pincode(optional)': item.address?.pincode || item.pincode || ''
//         }));
  
//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet('Duplicate Employees');
  
//       const headers = Object.keys(formattedData[0]);
  
//       worksheet.columns = headers.map(header => ({
//         header,
//         key: header,
//         width: header === 'Status' ? 80 : 25,
//         style: {
//           font: { bold: true },
//           alignment: {
//             vertical: 'middle',
//             horizontal: 'center',
//             wrapText: true
//           }
//         }
//       }));
  
//       // Insert Note Row
//       const lastColLetter = String.fromCharCode(64 + headers.length);
//       worksheet.insertRow(1, []);
//       worksheet.mergeCells(`A1:${lastColLetter}1`);
//       const noteCell = worksheet.getCell('A1');
//       noteCell.value = '?? Note: Upload this same file after correcting the issues mentioned in the Status column.';
//       noteCell.font = { bold: true, italic: true, size: 12 };
//       noteCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
//       noteCell.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: 'FFFFF2CC' }
//       };
//       worksheet.getRow(1).height = 35;
  
//       // Add data rows
//       formattedData.forEach(row => {
//         worksheet.addRow(row);
//       });
  
//       // Style header row (2nd row)
//       worksheet.getRow(2).eachCell(cell => {
//         cell.protection = { locked: true };
//         cell.fill = {
//           type: 'pattern',
//           pattern: 'solid',
//           fgColor: { argb: 'FFDCE6F1' }
//         };
//         cell.font = { bold: true };
//         cell.alignment = {
//           vertical: 'middle',
//           horizontal: 'center',
//           wrapText: true
//         };
//       });
//       worksheet.getRow(2).height = 35;
  
//       // Unlock data rows
//       worksheet.eachRow((row, rowNumber) => {
//         if (rowNumber > 2) {
//           row.eachCell(cell => {
//             cell.protection = { locked: false };
//           });
//           row.alignment = { vertical: 'top', wrapText: true };
//           row.height = 60;
//         }
//       });
  
//       // Freeze header
//       worksheet.views = [{ state: 'frozen', ySplit: 2 }];
  
//       // Protect sheet
//       await worksheet.protect('mwb@123', {
//         selectLockedCells: true,
//         selectUnlockedCells: true,
//         formatCells: false,
//         insertRows: false,
//         deleteRows: false,
//         editObjects: false
//       });
  
//       const destFolder = `assets/employee/excelduplicate`;
//       const fileName = `duplicate_employees_${Date.now()}.xlsx`;
//       if (!fs.existsSync(destFolder)) {
//         fs.mkdirSync(destFolder, { recursive: true });
//       }
  
//       const filePath = path.join(destFolder, fileName);
//       await workbook.xlsx.writeFile(filePath);
  
//       return {
//         status: true,
//         data: `/api/v1/employee/excel/duplicate/${fileName}`
//       };
//     } catch (error) {
//       console.error('Excel generation failed:', error);
//       return { status: false, message: 'Failed to generate employee Excel' };
//     }
// };


const generateDuplicateExcel = async ({
    data,
    headers,
    sheetName,
    note,
    destFolder,
    filePrefix
}) => {
    try {
        if (!data || !data.length) {
            return { status: false, message: 'No data to export' };
        }

        const formattedData = data.map(item => {
            const row = {};
            headers.forEach(h => {
                row[h.key] = typeof h.value === 'function' ? h.value(item) : (item[h.key] ?? '');
            });
            return row;
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);

        worksheet.columns = headers.map(h => ({
            header: h.header,
            key: h.key,
            width: h.width || 25,
            style: {
                font: { bold: true },
                alignment: {
                    vertical: 'middle',
                    horizontal: 'center',
                    wrapText: true
                }
            }
        }));

        // Insert Note row (top of sheet)
        // const lastColLetter = String.fromCharCode(64 + headers.length);
        // worksheet.insertRow(1, []);
        // worksheet.mergeCells(`A1:${lastColLetter}1`);
        // const noteCell = worksheet.getCell('A1');
        // noteCell.value = note;
        // noteCell.font = { bold: true, italic: true, size: 12 };
        // noteCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        // noteCell.fill = {
        //     type: 'pattern',
        //     pattern: 'solid',
        //     fgColor: { argb: 'FFFFF2CC' }
        // };
        // worksheet.getRow(1).height = 35;

        // Add data rows
        formattedData.forEach(row => worksheet.addRow(row));


        // Header row (1st row) styling
        worksheet.getRow(1).eachCell(cell => {
            cell.protection = { locked: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFDCE6F1' }
            };
            cell.font = { bold: true };
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true
            };
        });
        worksheet.getRow(1).height = 35;

        // Apply red fill to "Status" column header after default styling
        const statusColIndex = headers.findIndex(h => h.key === 'status') + 1;
        const statusHeaderCell = worksheet.getRow(1).getCell(statusColIndex);
        statusHeaderCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF0000' } // Red background
        };
        statusHeaderCell.font = {
            bold: true,
            color: { argb: 'FFFFFFFF' } // White text
        };

        // Unlock data rows
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 2) {
                row.eachCell(cell => {
                    cell.protection = { locked: false };
                });
                row.alignment = { vertical: 'top', wrapText: true };
                row.height = sheetName === 'Duplicate Employees' ? 60 : 30;
            }
        });

        // Freeze headers
        worksheet.views = [{ state: 'frozen', ySplit: 2 }];

        // Protect Sheet
        // await worksheet.protect('mwb@123', {
        //     selectLockedCells: true,
        //     selectUnlockedCells: true,
        //     formatCells: false,
        //     insertRows: false,
        //     deleteRows: false,
        //     editObjects: false
        // });

        if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder, { recursive: true });
        }
        const fileName = `${filePrefix}_${Date.now()}.xlsx`;
        const filePath = path.join(destFolder, fileName);
        await workbook.xlsx.writeFile(filePath);

        return {
            status: true,
            data: `/api/v1/${filePrefix.includes('client') ? 'client' : 'employee'}/excel/duplicate/${fileName}`
        };
    } catch (error) {
        console.error('Excel generation failed:', error);
        return { status: false, message: 'Failed to generate Excel' };
    }
};

/**
 * Optimized: clientResponseExcelFormat
 */
export const clientResponseExcelFormat = async (data) => {
    const headers = [
        { header: 'Status', key: 'status', value: item => item.status || '' },
        { header: 'Organization', key: 'name', value: item => item.name || '' },
        { header: 'Bussiness Type', key: 'businessType', value: item => item.businessType || item.bussinesstype || '' },
        { header: 'Owner First Name', key: 'firstName', value: item => item.ownerName?.firstName || item.firstName || '' },
        { header: 'Owner Last Name', key: 'lastName', value: item => item.ownerName?.lastName || item.lastName || '' },
        { header: 'Owner Mobile Number', key: 'mobile', value: item => item.mobile || '' },
        { header: 'Branch Name', key: 'branchName', value: item => item.branchName || '' },
        { header: 'PAN', key: 'panNo', value: item => item.panNo || '' },
        { header: 'GST', key: 'gstNo', value: item => item.gstNo || '' },
        { header: 'No. of Shifts', key: 'NoOfShifts', value: item => item.NoOfShifts || '' },
        { header: 'No.of Male Supervisors', key: 'noOfMaleSupervisors', value: item => item.noOfMaleSupervisors || '' },
        { header: 'No.of Female Supervisors', key: 'noOfFemaleSupervisors', value: item => item.noOfFemaleSupervisors || '' },
        { header: 'No.of Male Guards', key: 'noOfMaleGuards', value: item => item.noOfMaleGuards || '' },
        { header: 'No.of Female Guards', key: 'noOfFemaleGuards', value: item => item.noOfFemaleGuards || '' },
        { header: 'DutyPoint', key: 'dutyPoint', value: item => item.dutyPoint || '' },
        { header: 'CheckPoint', key: 'checkPoint', value: item => item.checkPoint || '' },
        { header: 'Hno(optional)', key: 'hno', value: item => item.address?.hno || item.hno || '' },
        { header: 'Street(optional)', key: 'street', value: item => item.address?.street || item.street || '' },
        { header: 'LandMark(optional)', key: 'landmark', value: item => item.address?.landmark || item.landmark || '' },
        { header: 'City(optional)', key: 'city', value: item => item.address?.city || item.city || '' },
        { header: 'District(optional)', key: 'district', value: item => item.address?.district || item.district || '' },
        { header: 'State(optional)', key: 'state', value: item => item.address?.state || item.state || '' },
        { header: 'Country(optional)', key: 'country', value: item => item.address?.country || item.country || 'India' },
        { header: 'Pincode(optional)', key: 'pincode', value: item => item.address?.pincode || item.pincode || '' }
    ];
    return generateDuplicateExcel({
        data,
        headers,
        sheetName: 'Duplicate Data',
        note: '⚠️ Note: Upload this same file after correcting the issues mentioned in the Status column.',
        destFolder: `assets/client/excelduplicate`,
        filePrefix: 'duplicate_clients'
    });
};

/**
 * Optimized: employeeResponseExcelFormat
 */
export const employeeResponseExcelFormat = async (data) => {
    const headers = [
        { header: 'Status', key: 'status', value: item => item.status || 'Duplicate', width: 80 },
        { header: 'EmployeeId', key: 'employeeId', value: item => item.employeeId || '' },
        { header: 'First Name', key: 'firstName', value: item => item.firstName || '' },
        { header: 'Last Name', key: 'lastName', value: item => item.lastName || '' },
        { header: 'Mobile Number', key: 'mobile', value: item => item.mobile || '' },
        { header: 'Password', key: 'password', value: item => item.password || '' },
        { header: 'Email(optional)', key: 'email', value: item => item.email || '' },
        { header: 'Gender(optional)', key: 'gender', value: item => item.gender || '' },
        { header: 'DOB', key: 'dob', value: item => item.dob || item.dateOfBirth || '' },
        { header: 'DOJ', key: 'doj', value: item => item.doj || item.joinDate || '' },
        { header: 'Organization', key: 'subOrganization', value: item => item.subOrganization || '', width: 25 },
        { header: 'Branch', key: 'branch', value: item => item.branch || '' },
        { header: 'Department', key: 'department', value: item => item.department || '' },
        { header: 'Designation', key: 'designation', value: item => item.designation || '' },
        { header: 'Hno(optional)', key: 'hno', value: item => item.address?.hno || item.hno || '' },
        { header: 'Street(optional)', key: 'street', value: item => item.address?.street || item.street || '' },
        { header: 'LandMark(optional)', key: 'landmark', value: item => item.address?.landmark || item.landmark || '' },
        { header: 'City(optional)', key: 'city', value: item => item.address?.city || item.city || '' },
        { header: 'District(optional)', key: 'district', value: item => item.address?.district || item.district || '' },
        { header: 'State(optional)', key: 'state', value: item => item.address?.state || item.state || '' },
        { header: 'Country(optional)', key: 'country', value: item => item.address?.country || item.country || 'India' },
        { header: 'Pincode(optional)', key: 'pincode', value: item => item.address?.pincode || item.pincode || '' }
    ];
    // Remove Organization column if not present in any row
    const hasOrg = data.some(item => item.subOrganization);
    const hasBranch=data.some(item=> item.branch);
    const filteredHeaders = headers.filter((h) => {
        if(!hasOrg && h.key === 'subOrganization') return false;
        if(!hasBranch && h.key === 'branch') return false;
        return true;
    });
    return generateDuplicateExcel({
        data,
        headers: filteredHeaders,
        sheetName: 'Duplicate Employees',
        note: '⚠️ Note: Upload this same file after correcting the issues mentioned in the Status column.',
        destFolder: `assets/employee/excelduplicate`,
        filePrefix: 'duplicate_employees'
    });
};

export const calcuateTime = (seconds) => {
    if (seconds < 60 * 1000) {
        return `${Math.round(seconds / 1000)} second${Math.round(seconds / 1000) === 1 ? '' : 's'}`;
    } else if (seconds < 60 * 60 * 1000) {
        const mins = Math.round(seconds / (60 * 1000));
        return `${mins} minute${mins === 1 ? '' : 's'}`;
    } else {
        const hours = (seconds / (60 * 60 * 1000)).toFixed(2).replace(/^0+/, '');
        return `${hours} hour${hours === "1.00" ? '' : 's'}`;
    }                
}


export const extractUniqueValues = (data, fields) => {
  const seen = {}
  const result = {}

  for (const field of fields) {
    seen[field] = new Set();
    result[field] = [];
  }

  for (let i = 0; i < data.length; i++) {
    const doc = data[i];

    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];
      const value = doc[field];

      // Skip invalid values
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) continue;

      // Convert to string for comparison
      const key = typeof value === "object" && value?.toString ? value.toString() : String(value);

      if (!seen[field].has(key)) {
        seen[field].add(key);
        result[field].push(value); // Keep original value
      }
    }
  }

  return result;
}


export const calculateBreakMinutesFromLogs = (logs) => {
    let lastOut = null;
    let totalBreakMinutes = 0;
  
    for (const log of logs) {
      if (log.type === 'checkOut') {
        lastOut = moment(log.transactionDate);
      }
      if (log.type === 'checkIn' && lastOut) {
        const currentIn = moment(log.transactionDate);
        const diff = currentIn.diff(lastOut, 'minutes');
        if (diff > 0) totalBreakMinutes += diff;
        lastOut = null;
      }
    }
  
    return totalBreakMinutes;
  };

export const matchisActiveStr = (str) => {
    if (!str) return null;

    const isMatchActive = "active".includes(str);
    const isMatchInactive = "inactive".includes(str);

    if (isMatchActive && !isMatchInactive) return true;
    if (!isMatchActive && isMatchInactive) return false;

    // If both match, decide based on closeness (length or index)
    if (isMatchActive && isMatchInactive) {
        const indexActive = "active".indexOf(str);
        const indexInactive = "inactive".indexOf(str);

        // Prefer earlier index match or shorter distance
        return indexActive <= indexInactive ? true : false;
    }

    return null; // No match
}

export const findMatchingShift = (shifts, targetDateTime, currentShift = []) => {
try {
    const matchingShifts = [];
    const upcomingShifts = [];
    // Loop for today and tomorrow's shifts
    const dayOffsets = [0]; // 0 = today, 1 = tomorrow
    
    if(currentShift && currentShift.length > 0) {
        let shiftIds = currentShift.map(cs => cs._id.toString());
       shifts = shifts.filter(cs => shiftIds.includes(cs._id.toString()));
    }
    for (const shift of shifts) {
        for (const offset of dayOffsets) {
            const shiftStart = new Date(targetDateTime);
            shiftStart.setDate(shiftStart.getDate() + offset);
            const [startHour, startMin] = shift.startTime.split(":").map(Number);
            shiftStart.setHours(startHour, startMin, 0, 0);

            const shiftEnd = new Date(shiftStart);
            const [endHour, endMin] = shift.endTime.split(":").map(Number);
            shiftEnd.setHours(endHour, endMin, 0, 0);

            // Handle overnight shift
            if (shiftEnd <= shiftStart) {
                shiftEnd.setDate(shiftEnd.getDate() + 1);
            }

            // Apply grace period
            const adjustedShiftStart = new Date(shiftStart);
            const adjustedShiftEnd = new Date(shiftEnd);

            if (shift.minIn) {
                const [minHour, minMin] = shift.minIn.split(":").map(Number);
                adjustedShiftStart.setHours(minHour, minMin, 0, 0);
            }

            if (shift.maxOut) {
                const [maxHour, maxMin] = shift.maxOut.split(":").map(Number);
                adjustedShiftEnd.setHours(maxHour, maxMin, 0, 0);
            }

            // if (adjustedShiftStart > targetDateTime) {
            //     matchingShifts.push({
            //         ...shift,
            //         shiftStart,
            //         shiftEnd,
            //         timeDiff: Math.abs(shift.adjustedShiftStart - targetDateTime),
            //         matchType: "upcoming",
            //         source: "upcoming",
            //         adjustedShiftStart,
            //         adjustedShiftEnd
            //     });
            // }

            let matchType = null;
            // if (targetDateTime >= adjustedShiftStart && targetDateTime <= adjustedShiftEnd) {
                if (targetDateTime <= adjustedShiftStart) matchType = "early";
                else if (targetDateTime >= shiftStart && targetDateTime <= adjustedShiftStart)
                    matchType = "on-time";
                else matchType = "late";

                matchingShifts.push({
                    ...shift,
                    matchType,
                    source: adjustedShiftStart > targetDateTime ? "upcoming" : "user",
                    timeDiff: Math.abs(adjustedShiftStart - targetDateTime),
                    shiftStart,
                    shiftEnd,
                    adjustedShiftStart,
                    adjustedShiftEnd
                });
            // }
        }
    }

    if (matchingShifts.length > 0) {
        return matchingShifts.reduce((a, b) => a.timeDiff < b.timeDiff ? a : b);
    } 
    // else if (upcomingShifts.length > 0) {
    //     return upcomingShifts.reduce((a, b) => (a.timeDiff < b.timeDiff ? a : b));
    // } else {
    //     return null;
    // }
}
catch (error) {
    throw error
}

}

export const getShiftDates = (shift, transactionDate = new Date()) => {
    const shiftStart = new Date(transactionDate);
    shiftStart.setDate(shiftStart.getDate() + 0);
    const [startHour, startMin] = shift.startTime.split(":").map(Number);
    shiftStart.setHours(startHour, startMin, 0, 0);

    const shiftEnd = new Date(shiftStart);
    const [endHour, endMin] = shift.endTime.split(":").map(Number);
    shiftEnd.setHours(endHour, endMin, 0, 0);

    // Handle overnight shift
    if (shiftEnd <= shiftStart) {
        shiftEnd.setDate(shiftEnd.getDate() + 1);
    }

    // Apply grace period
    const adjustedShiftStart = new Date(shiftStart);
    const adjustedShiftEnd = new Date(shiftEnd);

    if (shift.minIn) {
        const [minHour, minMin] = shift.minIn.split(":").map(Number);
        adjustedShiftStart.setHours(minHour, minMin, 0, 0);
    }

    if (shift.maxOut) {
        const [maxHour, maxMin] = shift.maxOut.split(":").map(Number);
        adjustedShiftEnd.setHours(maxHour, maxMin, 0, 0);
    }

    return { adjustedShiftStart, adjustedShiftEnd };
}


export const setGraceTime = (dateTime, startTime, graceTime, seconds) => {
    let [hour,minute] = graceTime ? graceTime.split(':') : startTime.split(':');
    dateTime.set({ hours: hour, minutes: minute, seconds: seconds, milliseconds: seconds == 0 ? 0 : 999 }); 
    return dateTime;
}


export const formatModulesWithNames = (roleModules, moduleNames,disabledModules) => {
    if (!roleModules) return null;
  
    const formattedModules = roleModules.modules?.map(roleMod => {
      const match = moduleNames.find(
        m => m._id?.toString() === roleMod.moduleId?.toString()
      );
  
      return {
        moduleId: roleMod.moduleId,
        name: match?.name ?? null,
        moduleKey: match?.moduleKey ?? null,
        permissions: roleMod.permissions
      };
    }) ?? [];

    const formatDisableModules = disabledModules.map(mod => {
        const match = moduleNames.find(
          m => m._id?.toString() === mod.moduleId?.toString()
        );
    
        return {
          moduleId: mod.moduleId,
          name: match?.name ?? null,
          moduleKey: match?.moduleKey ?? null,
          permissions: mod.permissions
        };
      }) ?? [];
  
    return {
      _id: roleModules._id,
      name: roleModules.name,
      description: roleModules.description,
      modules: formattedModules,
      disabledModules: formatDisableModules
    };
  };

export const formatEmergencyContacts=(data)=>{
    const contacts=data.map(item=>{
        return item.contacts.map(c=>({"_id":item._id,...c}));
    });

    return {
        "orgId":data[0]?._id,
        "clientmappedId":data[0]?.clientmappedId,
        "createdBy":data[0]?.createdBy,
        "isActive":data[0]?.isActive,
        contacts:contacts.flat()
    }

}

export const getMaximumSerialContact=(data)=>{
    let maxSerial=0;
    data.forEach(item=>{
        item.contacts.forEach(c=>{
            if(c.serialNo > maxSerial) maxSerial=c.serialNo;
        })
    });
    return maxSerial;
}


export const mergeExistingAndNewContact=(existingContacts,newContacts)=>{
    const contactMap={};
    existingContacts.forEach(c=>{
        contactMap[c.serialNo]=c;
    });

    newContacts.forEach(c=>{
        if(c.serialNo && contactMap[c.serialNo]){
            // Update existing contact
            contactMap[c.serialNo]= {...contactMap[c.serialNo],...c};
        }else{
            // Add new contact
            const randomNegative = -Math.floor(Math.random() * 1000000); 
            contactMap[randomNegative]={serialNo:randomNegative,...c};
        }
    });

    return Object.values(contactMap);
}

export const validatePolygonBoundary=(polygon)=>{
    if (polygon.type !== "Polygon") {
      return { valid: false, reason: "Not a Polygon type" };
    }
   
    const rings = polygon.coordinates;
    if (!Array.isArray(rings) || rings.length === 0) {
      return { valid: false, reason: "No coordinates found" };
    }
   
    for (let i = 0; i < rings.length; i++) {
      const ring = rings[i];
   
      // Check closed ring
      const first = ring[0];
      const last = ring[ring.length - 1];
   
      if (first[0] !== last[0] || first[1] !== last[1]) {
        return { valid: false, reason: `Ring ${i} is not closed` };
      }
   
      // Optional: Check minimum 4 points (triangle + closure)
      if (ring.length < 4) {
        return { valid: false, reason: `Ring ${i} has less than 4 points` };
      }
    }
   
    return { valid: true };
}

export const adjustMinutes = (timeStr, minutes) => {
  // Split "HH:mm" into hours and minutes
  let [hours, mins] = timeStr.split(":").map(Number);

  // Create a Date with today’s date and that time
  let date = new Date();
  date.setHours(hours, mins, 0, 0);

  // Add (positive) or subtract (negative) minutes
  date.setMinutes(date.getMinutes() + minutes);

  // Format back to HH:mm
  let hh = String(date.getHours()).padStart(2, "0");
  let mm = String(date.getMinutes()).padStart(2, "0");

  return `${hh}:${mm}`;
}

export const getDaysBetweenDates = (expiryDate, selectedDate) => {
  const firstDate = moment(expiryDate);
  const secondDate = moment(selectedDate);

  // Use the `diff` method in days
  return Math.abs(firstDate.diff(secondDate, 'days'));
}

  