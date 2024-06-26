import app from "./app.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 3000;

if (!PORT) {
  console.error("PORT environment variable is not defined.");
  process.exit(1); // Exit the process with an error code
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// import crypto from "crypto";
// const randBytes = crypto.randomBytes(32);
// const genKey = randBytes.toString("hex");
// console.log(genKey);
