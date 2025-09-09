import redis from 'redis';

const client = redis.createClient({
    socket: {host: 'localhost', // Replace with your Redis server host
    port:6380
    }, // Replace with your Redis server port
    // password: 'your_password' // Replace with your Redis server password
});

client.on('connect', () => {
    console.log('Connected to Redis server');
});

client.on('error', (err) => {
    console.error('Redis error:', err);
}); 


// Connect to Redis
const connectRedis = async () => {
    try {
        await client.connect();
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
};

// Function to get data from Redis
export const getDetails = async (group, key) => {
    try {
        const data = await client.hGet(group, key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        throw error;
    }
};

// Function to set data in Redis
export const setDetails = async (group, key, details) => {
    try {
        await client.hSet(group, key, JSON.stringify(details));
        return true;
    } catch (error) {
        throw error;
    }
};

export const setDetailsArray = async (group, keys, details) => {
    try {
        for (let i = 0; i < keys.length; i++) {
            await client.hSet(group, keys[i], JSON.stringify(details[i]));
        }
        return true;
    } catch (error) {
        throw error;
    }
};


export const getDetailsArray = async (group, keys) => {
    try {
        const results = {};
        for (const key of keys) {
            const data = await client.hGet(group, key);
            results[key] = data ? JSON.parse(data) : null;
        }
        return results;
    } catch (error) {
        throw error;
    }
};


export default connectRedis;

