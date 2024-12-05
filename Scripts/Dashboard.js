import './LocationSearch.js';
import { getWeatherForLocation } from './LocationSearch.js';

// Initialize slides array to hold the data for Swiper
const slides = []; 

document.addEventListener('DOMContentLoaded', () => {
    getWeather();
    updateSlidesWithWeather();
});

document.getElementById('toggles').addEventListener('change', () => {
    const toggleUnits = document.getElementById('toggles');
    const tempElement = document.getElementById('temp');
    if (toggleUnits.checked) { // true when the units are in Fahrenheit
        toggleUnits.checked = true; // toggle state of the checkbox
        tempElement.textContent = tempElement.getAttribute('data-tempCelsius') + '° C';
    } else {
        toggleUnits.checked = false; // toggle state of the checkbox
        tempElement.textContent = tempElement.getAttribute('data-tempFahrenheit') + '° F';
    }
});

async function getWeather() {
    try {
        // Get the user's current location [latitude, longitude]
        const userPosition = await getCurrentLocation();

        // Getting the current forecast period
        let currentPeriod = await getWeatherForLocation(userPosition[0], userPosition[1]);
        currentPeriod.locationName = 'Current Weather';

        if (!currentPeriod) {
            console.error("No weather data found.");
            return;
        }

        // Changing visual elements to current conditions
        updateWeatherDisplay(currentPeriod);

        // Update slides with weather information
        updateSlidesWithWeather(currentPeriod);

        // Schedule periodic updates
        setTimeout(getWeather, 3600000); // Update every hour
    } catch (error) {
        console.error('Error fetching weather data:', error);
        setTimeout(getWeather, 60000); // Retry in 1 minute
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
        { keyword: "fog", path: "../images/fog_or_mist.png" },
        { keyword: "mist", path: "../images/fog_or_mist.png" },
        { keyword: "hail", path: "../images/hail.png" },
        { keyword: "blizzard", path: "../images/fog.png" },
        { keyword: "sleet", path: "../images/sleet.png" },
        { keyword: "storms", path: "../images/thunderstorms.png" },
        { keyword: ["thunder", "storms", "thunderstorms"], path: "../images/thunderstorms.png" }
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
export async function getCurrentLocation() {
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

function setupSlides() {
    const slideWrapper = document.getElementById('wrapper');
    
    // Clear any existing slides before adding new ones
    slideWrapper.innerHTML = '';

    // Loop through each dynamically generated slide content
    slides.forEach(slideContent => {
        const swiperSlide = document.createElement('div');
        swiperSlide.setAttribute('class', 'swiper-slide');

        const img = document.createElement('img');
        img.src = slideContent.iconPath; // Icon path for each slide
        img.alt = slideContent.shortForecast; // Alt text for weather description
        img.classList.add('icon-slide');

        const text = document.createElement('p');
        text.textContent = slideContent.description;

        // Append image and text to the swiperSlide
        swiperSlide.appendChild(img);
        swiperSlide.appendChild(text);

        // Append the swiperSlide to the slideWrapper (swiper-wrapper)
        slideWrapper.appendChild(swiperSlide);
    });

    // Reinitialize or initialize the Swiper instance after slides are added
    const mySwiper = new Swiper('.swiper-container', {
        loop: true,
        centeredSlides: true,  // Ensures active slide is always centered
        slidesPerView: 1,      // Show 1 slide at a time
        spaceBetween: 10,      // Space between slides
        effect: 'coverflow',   // Optional effect
        grabCursor: true,      // Enable drag cursor
        coverflowEffect: {
            rotate: -30,       // Adjust the angle of the 3D effect
            stretch: 0,        // Adjust stretch
            depth: 200,        // Adjust depth for 3D effect
            modifier: 1,       // Adjust the depth modifier
            slideShadows: false, // No shadows on the slides
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true, // Allows clicking on pagination bullets
        },
    });
}

function updateSlidesWithWeather(weatherData) {
    // Clear existing slides
    slides.length = 0; // Empty the slides array

    // Process the weather data and filter important events
    const importantEvents = extractImportantWeatherEvents(weatherData);

    // Populate the slides array with dynamic content
    importantEvents.forEach(event => {
        slides.push({
            description: `${event.locationName || 'Weather'}: ${event.shortForecast} at ${event.temperature}°`,
            iconPath: getIconPath(event.shortForecast), // Fetch the icon for the weather condition
            shortForecast: event.shortForecast,
        });
    });

    // Call setupSlides to update the Swiper container with new slides
    setupSlides();
}

function extractImportantWeatherEvents(weatherData) {
    return weatherData.filter(event => {
        const forecast = event.shortForecast.toLowerCase();
        const temp = event.temperature;
        const windSpeed = event.windSpeed || 0;

        // Define conditions for "important" weather
        return (
            forecast.includes('storm') ||
            forecast.includes('rain') ||
            forecast.includes('snow') ||
            temp < 0 || // Very cold
            temp > 35 || // Very hot
            windSpeed > 15 // High winds
        );
    });
}

function getIconPath(forecast) {
    const lowerForecast = forecast.toLowerCase();
    const iconMap = {
        "partly cloudy": "../images/partly_cloudy.png",
        "mostly cloudy": "../images/mostly_cloudy.png",
        "sunny": "../images/sunny.png",
        "rain": "../images/rain.png",
        "storm": "../images/storm.png",
        "snow": "../images/snow.png",
        "fog": "../images/fog_or_mist.png",
        "clear": "../images/clear.png",
        // Add other mappings as needed
    };

    for (const [keyword, iconPath] of Object.entries(iconMap)) {
        if (lowerForecast.includes(keyword)) {
            return iconPath;
        }
    }
    return "../images/default.png"; // Default icon if no match
}


// TODO: changes the background gradient based on the parameters
async function changeBackgroundGradient(temp, cond, time) {
    let conditionsColor, temperatureColor = {
        hue,
        saturation,
        lightness
    }
}



export { updateWeatherDisplay };