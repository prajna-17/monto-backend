import mongoose from "mongoose";

export const connectDB = async () => {
  try {
     const connectionInstant = await mongoose.connect(`${process.env.MONGO_URI}`);
      console.log(`/n Mongodb connected !! DB HOST : ${connectionInstant.connection.host}`)
  } catch (error) {
    console.log('mongodb connection error',error)
        process.exit(1)
  }
};
