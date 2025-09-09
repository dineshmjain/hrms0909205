
const port = process.env.MONGO_PORT || "27017";
const hostname = process.env.MONGO_HOSTNAME || "localhost";

const config = {

    development:{

        mongoURI:  `mongodb://${hostname}:${port}/`,
        dbName: process.env.MONGO_DBNAME || 'easyPagarEnterprise',
    }
  
};

export default config[`development`];