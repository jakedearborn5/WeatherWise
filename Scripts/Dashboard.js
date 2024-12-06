import './LocationSearch.js';
import weatherStore, { getHourWeather } from './WeatherLogic.js';
import { addAllRecs } from './recommendations.js';

// Initialize slides array to hold the data for Swiper
const slides = []; 

document.addEventListener('DOMContentLoaded', async () => {

    // Getting location of the user
    const userPosition = await getCurrentLocation();

    // Getting and updating weatherStore
    await getHourWeather(userPosition[0], userPosition[1]);

    // Updating UI using data in weatherStore.weatherInfo
    updateWeatherDisplay()

    addAllRecs();

    //updateSlidesWithWeather(); // Jacob you won't need to pass an argument through this anymore
});

// Toggling between fahrenheit and celcius
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

function updateWeatherDisplay() {
    const weatherHeaderElement = document.getElementById('weather-header');
    const tempElement = document.getElementById('temp');
    const conditionElement = document.getElementById('condition');
    const weatherIconElement = document.getElementById('weather-icon');
    const windElement = document.getElementById('wind-speed');
    const chanceOfRainElement = document.getElementById('chance-rain');

    weatherHeaderElement.textContent = 'Current Weather'; // We were defaulting to this in getWeather so I kept it that way, feel free to change -R
    conditionElement.textContent = weatherStore.weatherInfo.shortForecast;
    windElement.textContent = weatherStore.weatherInfo.windSpeed;
    chanceOfRainElement.textContent = weatherStore.weatherInfo.rainChance;
    if(!weatherStore.weatherInfo.rainChance)
    {
        chanceOfRainElement.textContent = 0;
    }
    console.log('chance rain', weatherStore.weatherInfo.rainChance);
    tempElement.setAttribute('data-tempFahrenheit', weatherStore.weatherInfo.temperature);
    tempElement.setAttribute('data-tempCelsius', Math.round((weatherStore.weatherInfo.temperature - 32) * 5 / 9));
    tempElement.textContent = `${weatherStore.weatherInfo.temperature}° F`;
    
    
     // Choose icon based on weather conditions
    let iconPath = "../icons/default.png"; // Default icon path
    const forecast = weatherStore.weatherInfo.shortForecast.toLowerCase();

    if(weatherStore.weatherInfo.isDaytime) {
        console.log('Daytime logic running...');
        // Define a prioritized mapping of keywords to icon paths
        const weatherIcons = [
            { keyword: "fog",  path: "../images/fog_or_mist.png" },
            { keyword: "haze",  path: "../images/haze.png" },
            { keyword: "sleet", path: "../images/sleet.png" },
            { keyword: "freezing rain", path: "../images/sleet.png" },
            { keyword: "rain", path: "../images/rain.png" },
            { keyword: "scattered showers", path: "../images/scattered_showers.png"},
            { keyword: "drizzle", path: "../images/drizzle.png"},
            { keyword: "snow", path: "../images/snow.png" },
            { keyword: "hail", path: "../images/hail.png" },
            { keyword: "blizzard", path: "../images/blizzard.png" },
            { keyword: "thunderstorms", path: "../images/thunderstorms.png" },
            { keyword: "thunder",  path: "../images/thunderstorms.png" },
            { keyword: "storms",  path: "../images/thunderstorms.png" },
            { keyword: "partly cloudy",  path: "../images/partly_cloudy.png" },
            { keyword: "mostly cloudy", path: "../images/mostly_cloudy.png" },
            { keyword: "mostly sunny", path: "../images/mostly_sunny.png" },
            { keyword: "partly sunny", path: "../images/mostly_cloudy.png"},
            { keyword: "sunny", path: "../images/sunny.png" },
            { keyword: "cloudy", path: "../images/cloudy.png" }
        ];
        // Match forecast with prioritized keywords
        for (const { keyword, path } of weatherIcons) {
            if (forecast.includes(keyword)) {
                iconPath = path;
                break; // Stop once the first match is found
            }
        }
    }
    else {
        console.log('isDaytime is either false or undefined.');
        const weatherIcons = [
            { keyword: "fog",  path: "../images/fog_or_mist.png" },
            { keyword: "haze",  path: "../images/haze.png" },
            { keyword: "sleet", path: "../images/sleet.png" },
            { keyword: "freezing rain", path: "../images/sleet.png" },
            { keyword: "rain", path: "../images/rain.png" },
            { keyword: "snow", path: "../images/snow.png" },
            { keyword: "hail", path: "../images/hail.png" },
            { keyword: "blizzard", path: "../images/blizzard.png" },
            { keyword: "thunderstorms", path: "../images/thunderstorms.png" },
            { keyword: "thunder",  path: "../images/thunderstorms.png" },
            { keyword: "storms",  path: "../images/thunderstorms.png" },
            { keyword: "isolated clouds", path: "../images/isolated_clouds_night.png"},
            { keyword: "mostly clear", path: "../images/partly_cloudy_night.png" },
            { keyword: "partly cloudy",  path: "../images/partly_cloudy_night.png" },
            { keyword: "mostly cloudy",  path: "../images/mostly_cloudy_night.png"},
            { keyword: "partly clear", path: "../images/mostly_cloudy_night.png"},
            { keyword: "clear", path: "../images/clear.png" },
            { keyword: "cloudy", path: "../images/cloudy.png" }
        ];
        // Match forecast with prioritized keywords
        for (const { keyword, path } of weatherIcons) {
            if (forecast.includes(keyword)) {
                iconPath = path;
                break; // Stop once the first match is found
        }
    }
    }
    // Update the src attribute of the weather icon
    weatherIconElement.src = iconPath;
    console.log(iconPath);

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