import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "MERN_JOB_SEEKER_APP",
    })
    .then(() => console.log("Connected to database!"))
    .catch((err) =>
      console.log(`Error occured while connecting to database: ${err}`)
    );
};
