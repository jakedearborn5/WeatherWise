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
    const tempElement = document.getElementById('temp');
    const conditionElement = document.getElementById('condition');
    const weatherIconElement = document.getElementById('weather-icon');
    const windElement = document.getElementById('wind-speed');
    const chanceOfRainElement = document.getElementById('chance-rain');

    conditionElement.textContent = weatherStore.weatherInfo.shortForecast;
    windElement.textContent = weatherStore.weatherInfo.windSpeed;
    chanceOfRainElement.textContent = weatherStore.weatherInfo.rainChance;
    if(!weatherStore.weatherInfo.rainChance)
    {
        chanceOfRainElement.textContent = 0;
    }
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
    } else {
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

    // Show/Hide the weather alert section based on the presence of an alert
    const weatherAlertSection = document.getElementById('weather-alert');
    const alertContainer = document.getElementById('alert-container'); // Container for multiple alerts
    let alertTitle = document.getElementById('alert-title'); // Check if the title already exists in the DOM

    const numberOfAlerts = weatherStore.weatherInfo.alerts.length;

    if (!alertTitle) {
        // Create and insert the title if it doesn't exist
        alertTitle = document.createElement('h2');
        alertTitle.id = 'alert-title'; // Assign an ID to identify it later
        alertTitle.style.textAlign = 'center'; // Center the title
        alertTitle.style.marginBottom = '10px'; // Add some space below the title
        weatherAlertSection.insertBefore(alertTitle, alertContainer);
    }

    // Clear any previous alerts
    alertTitle.innerHTML = '';
    alertContainer.innerHTML = '';

    // Update the title with the number of alerts
    alertTitle.textContent = `Total Alerts: ${numberOfAlerts}`;

    if (numberOfAlerts > 0) {
        // If there are alerts, show the alert section
        weatherAlertSection.style.display = 'block';
            
        // Have the alerts be minimized by default
        alertContainer.style.display = 'none';

        // Loop through the alerts and display each one
        weatherStore.weatherInfo.alerts.forEach((alert) => {
            const alertElement = document.createElement('div');
            alertElement.classList.add('alert'); // Add a class for styling

            const alertHeader = document.createElement('h3');
            alertHeader.textContent = alert.title; // Title of the alert
            alertElement.appendChild(alertHeader);

            const alertBody = document.createElement('p');
            alertBody.textContent = alert.description; // Description of the alert
            alertElement.appendChild(alertBody);

            // Add toggle functionality to minimize/show alerts
            let isMinimized = true;
            weatherAlertSection.addEventListener('click', () => {
                if (isMinimized) {
                    alertContainer.style.display = 'block'; // Show alerts
                    isMinimized = false;
                } else {
                    alertContainer.style.display = 'none'; // Hide alerts
                    isMinimized = true;
                }
            });

            alertContainer.appendChild(alertElement); // Append the alert element to the container
        });
    } else {
        // If no alert, hide the alert section
        weatherAlertSection.style.display = 'none';
    }

    // Update the src attribute of the weather icon
    weatherIconElement.src = iconPath;

    changeBackgroundGradient();
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

function changeBackgroundGradient() {
    const isDaytime = weatherStore.weatherInfo.isDaytime;
    const forecast = weatherStore.weatherInfo.shortForecast.toLowerCase();
    let conditionsColor, timeOfDayColor;

    // Determine color based on time of day
    if (!isDaytime) {
        timeOfDayColor = 'hsl(210, 100%, 20%)'; // Darker blue for night
    } else {
        timeOfDayColor = 'hsl(210, 100%, 50%)'; // Lighter blue for day
    }

    // Determine color based on weather conditions
    if (forecast.includes('rain') || forecast.includes('storm')) {
        conditionsColor = 'hsl(0, 0%, 50%)'; // Gray for rain/storm
    } else if (forecast.includes('cloud')) {
        conditionsColor = 'hsl(0, 0%, 70%)'; // Lighter gray for cloudy
    } else {
        conditionsColor = 'hsl(210, 100%, 30%)'; // Blue for clear
    }

    // Apply gradient background
    document.body.style.background = `linear-gradient(${timeOfDayColor}, ${conditionsColor})`;
}

export { updateWeatherDisplay };