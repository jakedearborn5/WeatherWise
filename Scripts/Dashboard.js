import './LocationSearch.js';
import { getWeatherForLocation } from './LocationSearch.js';

document.addEventListener('DOMContentLoaded', () => {
    getWeather();
    updateSlidesWithWeather();
});

document.getElementById('toggles').addEventListener('change', () => {
    const toggleUnits = document.getElementById('toggles');
    const tempElement = document.getElementById('temp');
    if (toggleUnits.checked) { //true when the units are in fahrenheit
        toggleUnits.checked = true; //toggle state of the checkbox
        tempElement.textContent = tempElement.getAttribute('data-tempCelsius') + '° C';
    }
    else {
        toggleUnits.checked = false; //toggle state of the checkbox
        tempElement.textContent = tempElement.getAttribute('data-tempFahrenheit') + '° F';
    }
});

async function getWeather() {
    try {
        // Get the users current location [latitude, longitude]
        const userPosition = await getCurrentLocation();

        // Getting the current forecast period
        let currentPeriod = await getWeatherForLocation(userPosition[0], userPosition[1]);
        currentPeriod.locationName = 'Current Weather';

        // Changing visual elements to current conditions
        updateWeatherDisplay(currentPeriod);

        // Update slides with weather information
        updateSlidesWithWeather(currentPeriod);

        // Schedule periodic updates
        setTimeout(getWeather, 3600000); // Update every hour
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateWeatherDisplay(weather) {
    const weatherHeaderElement = document.getElementById('weather-header');
    const tempElement = document.getElementById('temp');
    const conditionElement = document.getElementById('condition');
    const weatherIconElement = document.getElementById('weather-icon');

    if (!weather) {
        console.error('Error fetching weather data');
        return;
    }

    weatherHeaderElement.textContent = weather.locationName;
    conditionElement.textContent = weather.shortForecast;
    tempElement.setAttribute('data-tempFahrenheit', weather.temperature);
    tempElement.setAttribute('data-tempCelsius', Math.round((weather.temperature - 32) * 5 / 9));
    tempElement.textContent = `${weather.temperature}° F`;

     // Choose icon based on weather conditions
    let iconPath = "../icons/default.png"; // Default icon path
    const forecast = weather.shortForecast.toLowerCase();

    // Define a prioritized mapping of keywords to icon paths
    const weatherIcons = [
        { keyword: "partly cloudy", path: "../images/partly_cloudy.png" },
        { keyword: "mostly cloudy", path: "../images/mostly_cloudy.png" },
        { keyword: "partly sunny", path: "../images/mostly_cloudy.png" },
        { keyword: "mostly sunny", path: "../images/mostly_sunny.png" },
        { keyword: "sunny", path: "../images/sunny.png" },
        { keyword: "cloudy", path: "../images/cloudy.png" },
        { keyword: "clear", path: "../images/clear.png" },
        { keyword: "rain", path: "../images/rain.png" },
        { keyword: "snow", path: "../images/Snow.png" },
        { keyword: "storm", path: "../images/storm.png" },
        { keyword: "fog", path: "../images/fog_or_mist.png" },
        { keyword: "mist", path: "../images/fog_or_mist.png" },
        { keyword: "hail", path: "../images/hail.png" },
        { keyword: "blizzard", path: "../images/fog.png" },
        { keyword: "sleet", path: "../images/sleet.png" },
        { keyword: "storms", path: "../images/thunderstorms.png" },
        { keyword: "thunder", path: "../images/thunderstorms.png" }
    ];

    // Match forecast with prioritized keywords
    for (const { keyword, path } of weatherIcons) {
        if (forecast.includes(keyword)) {
            iconPath = path;
            break; // Stop once the first match is found
        }
    }

    // Update the src attribute of the weather icon
    weatherIconElement.src = iconPath;

    // Call changeBackgroundGradient with the necessary parameters
    const currentTime = new Date().getHours();
    changeBackgroundGradient(tempElement, conditionElement, currentTime);
}


/**
* Gets the users current location using the geolocation API
* @returns string[latitude, longitude] - The users current latitude and longitude coordinates
*/
async function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    resolve([latitude, longitude]);
                },
                (error) => {
                    reject('Error getting location: ' + error.message);
                }
            );
        } else {
            reject('Geolocation is not supported by this browser.');
        }
    });
}


//TODO- changes the background gradient based on the parameters
async function changeBackgroundGradient(temp, cond, time) {
    let conditionsColor, temperatureColor = {
        hue,
        saturation,
        lightness
    }
}



export { updateWeatherDisplay };