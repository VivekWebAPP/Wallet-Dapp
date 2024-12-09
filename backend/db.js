import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const ConnectionString = process.env.CONNECTION_STRING;

const ConnectToBackend = async () => {
    try {
        await mongoose.connect(ConnectionString);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Failed To Connect to Database');
    }
}

export default ConnectToBackend;