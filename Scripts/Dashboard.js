import './LocationSearch.js';
import { getWeatherForLocation } from './LocationSearch.js';

document.addEventListener('DOMContentLoaded', () => {
    getWeatherForUser();
    setupSlides();
    getWeather();
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

async function setupSlides() {
    const slideWrapper = document.getElementById('wrapper');
    slides.forEach((slideText, index) => {
        const swiperSlide = document.createElement("div");
        swiperSlide.setAttribute("class", "swiper-slide");

        const slide = document.createElement("div");
        slide.setAttribute("class", "m-slide");
        slide.innerHTML = slideText;

        swiperSlide.appendChild(slide);
        slideWrapper.appendChild(swiperSlide);
    });

    const mySwiper = new Swiper('.swiper-container', {
        loop: true,
        effect: 'coverflow',
        grabCursor:true,
        centeredSlides: true,
        slidesPerView: 'auto',
        initaialSlide: sliderId,
        coverflowEffect: {
            rotate: -30,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: false,
        },

        pagination: {
            el: '.swiper-pagination',
            dynamicBullets:true,
        }
    });
}

async function updateSlidesWithWeatehr(currentPeriod) { 
    slides.push('Current weather: ${currentPeriod.shortForecast} at ${currentPeriod.temperature}° F');
    setupSlides();
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