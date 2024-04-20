import mongoose from "mongoose";

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@job-app-cluster.ego8yki.mongodb.net/?retryWrites=true&w=majority&appName=JOB-APP-CLUSTER`;
const clientOptions = {
  dbName: "MERN_JOB_SEEKER_APP",
  authSource: "admin",
  user: "saif007",
  pass: "DeSwCc1CWq1aqj3L",
  tls: true,
  tlsAllowInvalidCertificates: true,
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};
export const dbConnection = async () => {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
  }
};
dbConnection();
