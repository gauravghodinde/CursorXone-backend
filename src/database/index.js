import mongoose from "mongoose";


const uri = "mongodb+srv://gauravghodinde:dp7kw9QqSbi8cx7K@cluster0.1gg4i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";



const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${uri}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        // client.connect()
        // client.db("myDatabase")
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB