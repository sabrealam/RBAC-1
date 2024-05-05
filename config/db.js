const mongoose = require("mongoose");
require("dotenv").config();


const connectDB = async () => {
    try {
            let connection = await mongoose.connect(process.env.DB_URL);
            console.log("database connected");
    } catch (error) {
        console.log(error);
    }
}


module.exports = connectDB