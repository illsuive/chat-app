import mongoose from "mongoose";
import dotenv  from "dotenv";
dotenv.config()

let connectTodb = async () => {
    try {
        await mongoose.connect(process.env.DBURL)
        console.log("Connected to MongoDB")
    }catch(error){
        console.log('Database error: ', error)     
    }
}

export default connectTodb;