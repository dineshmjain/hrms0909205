import { createServer } from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url';
import {errors} from "celebrate";
import { fork } from 'child_process';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import routes from './routes/apiRoute.js';

import dotenv from 'dotenv'
dotenv.config()

// import { KafkaService } from './utils/kafka/kafka.js';
// import { KafkaService } from './utils/kafka/kafka.js';
import { setupCronJobs } from './helper/cronjob.js';
import {autoApprovedAttendance} from './helper/autoApprove.js'
import morgan from 'morgan';
import connectRedis from './config/redis.js'; 
import { rateLimit } from "express-rate-limit";
import {logger , logRequestIp} from "./helper/logger.js"
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
//image upload
app.use(express.json());
app.use(fileUpload());
app.disable('etag');
// const kafka = new KafkaService();
// kafka.createTopic({
//   topic:"user-logs",
//   partitions: 1
// })
// kafka.createTopic({
//   topic:"user-update",
//   partitions: 1
// })
// kafka.createTopic({
//   topic:"attendance-update",
//   partitions: 1
// })

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const consumerProcess = fork("./utils/consumerWorker.js");
// import {createFaceCollection} from "./config/aws.js";
// createFaceCollection();
// // consumerProcess.on('message', (message) => {
//   logger.info('Message from Kafka Consumer Worker:', message);
// });

// consumerProcess.on('error', (error) => {
//   logger.error('Error in Kafka Consumer Worker:', error);
// });

// consumerProcess.on('exit', (code) => {
//   logger.info(`Kafka Consumer Worker exited with code ${code}`);
// });

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
app.set('trust proxy', 1)
const limiter = rateLimit({
  windowMs : 10 * 60 * 1000, //10 min
  max : parseInt(process.env.REQUESTLIMIT) || 150000, //1.5 lakh requests from same IP
  message : "Too many request from this IP. Please try again after some time!"
})

 app.use(limiter)
app.use(morgan("dev", { stream: logger.stream }));
app.use(logRequestIp)

app.use('/api/v1/images/profile',express.static(path.join(__dirname, '/assets/images/profileImages')))
app.use('/api/v1/client/excel/format',express.static(path.join(__dirname, 'assets/client/excelformat')))
app.use('/api/v1/client/excel/duplicate',express.static(path.join(__dirname, 'assets/client/excelduplicate')))
app.use('/api/v1/employee/excel/format',express.static(path.join(__dirname, 'assets/employee/excelformat')))
app.use('/api/v1/employee/excel/duplicate',express.static(path.join(__dirname, 'assets/employee/excelduplicate')))
// Connect to Redis when starting the app
// const startApp = async () => {
//   await connectRedis(); // Connect to Redis
//   console.log('App started and connected to Redis');
// };

// // Start and stop redis service.
// startApp();


//Routes
app.use('/api/v1', routes);
app.use(errors());
app.use((err, request, responce, next) => {
  // logger.error(err);
  console.log(err.details)
  let resObj = {};
  const error = err.stack ? err.stack : err;
  const status = err.status ? err.status : 500;
  console.error("ERROR -> ", error);
  
    resObj = {
      success: false,
      description: err.message,
      message: "Service unavailable. please try again later",
      error,
    };
  

    responce.status(status).json(resObj);
});

process.on("uncaughtException", (error) => {
  logger.error("UNCAUGHT EXCEPTION", error);
  process.exit(1);
});

// process.on("uncaughtException", (error) => {
//   logger.error("UNCAUGHT EXCEPTION", error);
//   process.exit(1);
// });

app.all("*", (request, response) => {
  response.status(404).json({
    success: false,
    error: "No such API exists",
  });
});


var port = 8050;

// Start the cron jobs for absent
//setupCronJobs();
//setupCronJobs();

//start the cron job for auto approval
//autoApprovedAttendance();

createServer(app).listen(port, "0.0.0.0", () => {
  console.log('\n================================== \x1b[35measyPagarEnterprise API is running at ' + port +" \x1B[39m==================================\n");
});