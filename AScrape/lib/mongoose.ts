import mongoose from "mongoose";

let isConnected = false;//tracks connection status to database

export const connectToDB = async () => {
    mongoose.set("strictQuery", true); 

    if(!process.env.MongoDB_URI)
        return console.log("MongoDB_URI is not defined");//no database found

    if(isConnected)
        return console.log("=> using existing database connection");//if connected to a database, just use it 

    try {
        await mongoose.connect(process.env.MongoDB_URI);
        isConnected = true;//sets to true if connection goes through in line 16
        console.log("MongoDB Connected");//lets us know in terminal that a database is connected to

    } catch (error) {
        console.log(error)
    }
}