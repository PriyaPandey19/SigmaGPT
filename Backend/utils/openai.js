import "dotenv/config"
import axios from "axios";

const getOpenAPIRespone = async(message) =>{
    try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        model: "gemini-3-flash-preview",
        input: message
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        }
      }
    );

     const reply = response.data.outputs.find(o => o.type === "text")?.text;
     return reply;
    
  } catch (error) {
    console.error(error.response?.data || error.message);
       throw new Error("Something went wrong"); 
  }
}

export default getOpenAPIRespone;