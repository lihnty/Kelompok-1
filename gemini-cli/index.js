import readline from 'readline';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBJHMwtIN-_Rg0CA_TNYn79HFjfOD2e5K4");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Tanya apa ke Gemini AI? ", async function (prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("\nJawaban Gemini:\n" + text);
  } catch (error) {
    console.error("Error:", error.message);
  }

  rl.close();
});
