const express = require('express');
const router = express.Router();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyC98WYjTVoUM9Se_uKvhogAbVNx_l0-dhU");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: "You are an AI chatbot for a web app called WeatherWise, your name is WeatherWise Bot. The purpose of this app is to have all of the basic functionalities of a weather app, with the addition of a slide bar that gives recommendations of certain items that the user may want to bring to be fully prepared for the day based on weather conditions. Each prompt will begin with the current weather conditions and have a message from the user, all in JSON format. Use the information in the JSON format to come up with a response, and then respond not in JSON format."});
const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });


router.get('/chatBot/:message', async (req, res)=>{
    const message = req.params.message;

    console.log(message);
    const prompt = message;

    const result = await chat.sendMessage(message);
    console.log(result.response.text());

    res.send(result.response.text());
});

module.exports = router;