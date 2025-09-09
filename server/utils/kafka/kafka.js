import { Kafka } from "kafkajs";
import { logger } from "../../helper/logger.js";

export class KafkaService {
    constructor(){
        try{
            this.kafka = new Kafka({
                clientId: "easy-pagar-enterprise",
                brokers:["localhost:9092"],
                retry: {
                    retries: 10, // Number of retries
                    initialRetryTime: 300, // Time in ms to wait before the first retry
                    maxRetryTime: 5000,    // Max time in ms between retries
                    factor: 0.2,           // Exponential backoff factor
                  },
            })
        }catch(error){
            logger.error("Error while connecting to kafka",error.toString())
        }
        
    }

    async createTopic (topicDetails) {
        try{
           const {topic,replicationFactor,partitions} = topicDetails;
            const admin = this.kafka.admin();
            await admin.connect();
            const topics = await admin.listTopics();

            if (!topics.includes(topic)) {
                await admin.createTopics({
                  topics: [{
                    topic,
                    numPartitions: partitions,
                    replicationFactor: 1,
                  }],
                });
                logger.info(`Topic with name ${topic} created`)
                return {
                    success:true,
                    message:"Topic created"
                }
            }
            logger.info(`Topic with name ${topic} already exist`);
            await admin.disconnect();
            return {
                success:false,
                message:"Topic already exist"
            }
        }catch(error){
            logger.error("Error while creating topic for kafka");
            throw error;
        }
    }
    
    async sendMessage(topic,message) {
        try{
            const producer = this.kafka.producer();
            await producer.connect();
            logger.debug("Producer conected");

            await producer.send({
                topic:topic,
                messages: message
            });

            await producer.disconnect();
            logger.debug("Message sent and producer is disconnected");
            return;
        }catch(error){
            logger.error("Error while sendMessage in kafka srvice.");
            throw error;
        }
    }

    // Single consumer that dynamically assigns tasks based on topic
    async receiveMessages(topics, taskMap) {
        try {
            const consumer = this.kafka.consumer({ groupId: 'dynamic-group' });
            await consumer.connect();

            for (const topic of topics) {
                await consumer.subscribe({ topic, fromBeginning: true });
            }

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    logger.info(`Received message on topic ${topic}: ${message.value.toString()}`);
                    // Dynamically handle the message based on the topic
                    const taskHandler = taskMap[topic];
                    if (taskHandler) {
                        await taskHandler(message.value.toString());
                    } else {
                        logger.error(`No task handler found for topic ${topic}`);
                    }
                },
            });
        } catch (error) {
            logger.error('Error while consuming messages with dynamic tasks', error);
            // if (error.code === 'ECONNREFUSED') {
            //     logger.error('Kafka connection refused. Retrying...');
            //     setTimeout(() => {
            //       startConsumer();  
            //     }, 5000); 
            //   } else {
            //     logger.error('Non-retriable error occurred:', error);
            //   }
            throw error;
        }
    }

}