import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
        //console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        // console.log(`\n MongoDB connected !! ConnectingInstance: ${connectionInstance}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB