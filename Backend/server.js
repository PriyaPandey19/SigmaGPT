import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js"

dotenv.config();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());
app.use("/api/auth",authRoutes);
app.use("/api", chatRoutes);


app.listen(PORT, () => {
  console.log("Server running on port 8080");
  connectDB();
});


const connectDB = async() => {
try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with Database!");
}catch(err){
    console.log("Failed to connect with Db", err);
}
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log("API KEY:", GEMINI_API_KEY);

// app.post("/test", async (req, res) => {
//   try {
//     const response = await axios.post(
//       "https://generativelanguage.googleapis.com/v1beta/interactions",
//       {
//         model: "gemini-3-flash-preview",
//         input: req.body.message
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "x-goog-api-key": GEMINI_API_KEY
//         }
//       }
//     );

//      const reply = response.data.outputs.find(o => o.type === "text")?.text;
//     res.json({ reply });
//     //console.log(reply);
//   } catch (error) {
//     console.error(error.response?.data || error.message);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

