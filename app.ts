// src/app.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import  { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
const genAIKey = process.env.genAI;

const genAI = new GoogleGenerativeAI(genAIKey!);

const generateResponse = async (prompt :string) => {

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { maxOutputTokens: 30, temperature: 0.9 },
   
    systemInstruction: {
        text:
"You are a physcologist who get questions from patients about their mental healtha and you are here to help "
}
});

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
console.log(response.text())
    return response.text();
  } catch (error) {
    return error
  }
}

const app = express();
app.use(cors());
app.use(express.raw({ type: 'text/plain', limit: '1mb' }));

app.post('/question', async (req: Request, res: Response) =>  {
  try {
    const prompt = req.body.toString();
    console.log('Received prompt:', prompt);
    if (!prompt) {
       res.status(400).send('Question is required.');
    }
    const result = await generateResponse(prompt); // Make sure generateResponse is defined and returns a promise
    console.log(result);
     res.status(200).json(result); 
  } catch (err) {
    console.error('Error occurred:', err);
     res.status(500).send('Something went wrong!');
  }
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
