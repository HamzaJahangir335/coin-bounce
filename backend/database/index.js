const mongoose = require('mongoose');

const MONGO_DB_CONNECTION_STRING ='mongodb://0.0.0.0:27017/coin-bounce';


const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(MONGO_DB_CONNECTION_STRING);
    console.log(`Database connected at Host ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error ${error}`);
  }
};

module.exports = dbConnect;