const dotenv = require('dotenv').config();

const PORT  = process.env.PORT;
const MONGO_DB_CONNECTION_STRING =  process.env.MONGO_DB_STRING;
const PATH = process.env.BACKEND_SERVER_PATH;

module.exports= {
    PORT,
    MONGO_DB_CONNECTION_STRING,
    PATH
}