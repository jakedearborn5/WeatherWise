import weatherStore, { getHourWeather } from './WeatherLogic.js';

document.addEventListener('DOMContentLoaded', () => {
    // All the interactive elements that make up the modal
    const aiButton = document.getElementById('ai-button');
    const aiModal = document.getElementById('ai-modal');
    const closeButton = aiModal.querySelector('.close-button');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const modalOverlay = document.createElement('div');
    const chatLog = document.getElementById("chat-log");

    // Check for stupidity
    if (!aiButton || !aiModal || !closeButton) {
        console.error("One or more elements are missing from the DOM.");
        return;
    }

    // Open the modal's transparent overlay
    modalOverlay.classList.add('modal-overlay');
    document.body.appendChild(modalOverlay);

    // Open modal and overlay when the AI button is clicked
    aiButton.addEventListener('click', () => {
        modalOverlay.style.display = 'flex';
        aiModal.style.display = 'block';
    });

    // Function to close modal and overlay
    const closeModal = () => {
        modalOverlay.style.display = 'none';
        aiModal.style.display = 'none';
    };

    // Close modal and overlay when 'x' is clicked
    closeButton.addEventListener('click', closeModal);

    // Close modal and overlay when clicking on overlay
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Functionality for sending the AI a chat
    sendButton.addEventListener('click', async () => {

        // Assign the chatInput to a variable 
        const message = chatInput.value.trim();

        // If there is a message, send it and clear the chatInput
        if (message) {
          addMessage("User" , message);
          chatInput.value = ''; // Clear the input

          const chatBotResponse = await getChatBotResponse(message);
          addMessage("Chatbot", chatBotResponse);
        }
      });

function addMessage(sender, message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(sender === "User" ? "message-user" : "message-other");
  messageElement.textContent = `${sender}: ${message}`;
  messageElement.style.overflow = "wrap";
  messageElement.style.maxWidth = "50%";
  if(sender === "User"){
    messageElement.style.alignSelf = "flex-end";
    messageElement.style.textAlign = "right";
  }
  else{
    messageElement.style.alignSelf = "flex-start";
    messageElement.style.textAlign = "left";
  }
  chatLog.appendChild(messageElement);
  chatLog.scrollTop = chatLog.scrollHeight;
}

});

async function getChatBotResponse(chatMessage){

  chatMessage = chatMessage.replace(/['"`]/g, ''); //makes it so that the prompt doesnt break the router

  prompt = {
  Temperature: weatherStore.weatherInfo.temperature,
  TemperatureUnit: weatherStore.weatherInfo.tempUnit,
  RainChance: weatherStore.weatherInfo.rainChance,
  DewPoint: weatherStore.weatherInfo.dewPoint,
  RelativeHumidity: weatherStore.weatherInfo.relativeHumidity,
  WindSpeed: weatherStore.weatherInfo.windSpeed,
  WindDirection: weatherStore.weatherInfo.windDirection,
  ShortForecast: weatherStore.weatherInfo.shortForecast,
  Date: weatherStore.weatherInfo.date,
  Hour: weatherStore.weatherInfo.hour,
  Location: document.getElementById("weather-header").textContent,
  UserMessage: chatMessage
  }

  const jsonPrompt = JSON.stringify(prompt);

  try{    
    const res = await fetch(`http://localhost:3000/chatBot/${jsonPrompt}`);

    if(!res.ok){
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const chatBotResponse = await res.text();
    return chatBotResponse;
}
  catch(error){
    console.error();
  }
}

