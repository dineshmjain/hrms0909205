// consumerWorker.js
import { KafkaService } from './kafka/kafka.js';
import { taskMap } from './taskHandeler.js';

const kafkaService = new KafkaService();


const topics = ['user-logs',"user-update","attendance-update", "attendance-stats", "attendance-approvals"];


(async () => {
    try {
        await kafkaService.receiveMessages(topics, taskMap);
    } catch (error) {
        console.error('Error in consumer worker:', error);
    }
})();
