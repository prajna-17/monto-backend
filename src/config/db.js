import mongoose from "mongoose";

export const connectDB = async () => {
  try {
     const connectionInstant = await mongoose.connect(`mongodb://127.0.0.1:27017/AuthDemo`);
      console.log(`/n Mongodb connected !! DB HOST : ${connectionInstant.connection.host}`)
  } catch (error) {
    console.log('mongodb connection error',error)
        process.exit(1)
  }
};
