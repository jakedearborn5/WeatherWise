import './LocationSearch.js';
import { getWeatherForLocation } from './LocationSearch.js';

// Initialize slides array to hold the data for Swiper
const slides = []; 

document.addEventListener('DOMContentLoaded', () => {
    getWeatherForUser();
    getWeather();
    setupSlides();
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

        // Changing visual elements to current conditions
        updateWeatherDisplay(currentPeriod);

        // Update slides with weather information
        updateSlidesWithWeather(currentPeriod);

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateWeatherDisplay(weather) {
    const weatherHeaderElement = document.getElementById('weather-header');
    const tempElement = document.getElementById('temp');
    const conditionElement = document.getElementById('condition');

    if (!weather) {
        console.error('Error fetching weather data');
        return;
    }

    weatherHeaderElement.textContent = weather.locationName;
    conditionElement.textContent = weather.shortForecast;
    tempElement.setAttribute('data-tempFahrenheit', weather.temperature);
    tempElement.setAttribute('data-tempCelsius', Math.round((weather.temperature - 32) * 5 / 9));
    tempElement.textContent = `${weather.temperature}° F`;
}

/**
 * Gets the user's current location using the geolocation API
 * @returns string[latitude, longitude] - The user's current latitude and longitude coordinates
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

function setupSlides() {
    const slideWrapper = document.getElementById('wrapper');
    
    // Clear any existing slides before adding new ones
    slideWrapper.innerHTML = '';

    slides.forEach((slideContent) => {
        const swiperSlide = document.createElement("div");
        swiperSlide.setAttribute("class", "swiper-slide");

        const slide = document.createElement("div");
        slide.setAttribute("class", "m-slide");

        // Check if content is an image URL or text
        if (typeof slideContent === 'string' && slideContent.includes('http')) {
            const img = document.createElement('img');
            img.src = slideContent;
            img.alt = 'Slide Image';
            img.style.width = '100%'; // Adjust image size if necessary
            slide.appendChild(img);
        } else {
            slide.textContent = slideContent;
        }

        swiperSlide.appendChild(slide);
        slideWrapper.appendChild(swiperSlide);
    });

    // Initialize the Swiper after adding slides
    const mySwiper = new Swiper('.swiper-container', {
        loop: true,
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
            rotate: -30,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: false,
        },
        pagination: {
            el: '.swiper-pagination',
            dynamicBullets: true,
        }
    });
}

function updateSlidesWithWeather(currentPeriod) {
    // Adding weather information to the slides array
    slides.push(`Current weather: ${currentPeriod.shortForecast} at ${currentPeriod.temperature}°`);
    
    // Re-setup the slides with the updated data
    setupSlides();
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