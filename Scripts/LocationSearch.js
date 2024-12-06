// SECURITY: 
// - Prevent injection attacks or unexpected behavior by only allowing 
// the user to select from a predefined list of locations.
// - Geolocation API is only used with user consent and is not stored or shared.


// RELIABILITY: By using try/catch blocks inside the getWeatherForLocation function, we can
// catch any errors that occur when fetching weather data and return a default value or error message.

import { updateWeatherDisplay } from './Dashboard.js';
import { getHourWeather } from './WeatherLogic.js';

// List of locations to suggest to the user
const locations = [
    { name: "Current Location", latitude: 0, longitude: 0 },
    { name: 'New York, NY', latitude: 40.7128, longitude: -74.0060 },
    { name: 'Los Angeles, CA', latitude: 34.0522, longitude: -118.2437 },
    { name: 'Chicago, IL', latitude: 41.8781, longitude: -87.6298 },
    { name: 'Houston, TX', latitude: 29.7604, longitude: -95.3698 },
    { name: 'Phoenix, AZ', latitude: 33.4484, longitude: -112.0740 },
    { name: 'Philadelphia, PA', latitude: 39.9526, longitude: -75.1652 },
    { name: 'San Antonio, TX', latitude: 29.4241, longitude: -98.4936 },
    { name: 'Dallas, TX', latitude: 32.7767, longitude: -96.7970 },
    { name: 'San Diego, CA', latitude: 32.7157, longitude: -117.1611 },
    { name: 'San Jose, CA', latitude: 37.3382, longitude: -121.8863 },
    { name: 'Austin, TX', latitude: 30.2672, longitude: -97.7431 },
    { name: 'Norman, OK', latitude: 35.2226, longitude: -97.4395 },
    { name: 'Miami, FL', latitude: 25.7617, longitude: -80.1918 },
    { name: 'Atlanta, GA', latitude: 33.4484, longitude: -84.3880 },
    { name: 'Seattle, WA', latitude: 47.6062, longitude: -122.3321 },
    { name: 'Washington, D.C.', latitude: 38.9072, longitude: -77.0369 },
    { name: 'Boston, MA', latitude: 42.3601, longitude: -71.0589 },
    { name: 'Denver, CO', latitude: 39.7392, longitude: -104.9903 },
    { name: 'Nashville, TN', latitude: 36.1627, longitude: -86.7816 },
    { name: 'Orlando, FL', latitude: 28.5383, longitude: -81.3792 },
    { name: 'Portland, OR', latitude: 45.5155, longitude: -122.6793 },
    { name: 'Las Vegas, NV', latitude: 36.1699, longitude: -115.1398 },
    { name: 'Salt Lake City, UT', latitude: 40.7608, longitude: -111.8910 },
    { name: 'Tucson, AZ', latitude: 32.2226, longitude: -110.9747 },
    { name: 'Cincinnati, OH', latitude: 39.1031, longitude: -84.5120 },
    { name: 'Kansas City, MO', latitude: 39.0997, longitude: -94.5786 },
    { name: 'Indianapolis, IN', latitude: 39.7684, longitude: -86.1581 },
    { name: 'Milwaukee, WI', latitude: 43.0389, longitude: -87.9065 },
    { name: 'Baltimore, MD', latitude: 39.2904, longitude: -76.6122 },
    { name: 'Raleigh, NC', latitude: 35.7796, longitude: -78.6382 },
    { name: 'Virginia Beach, VA', latitude: 36.8529, longitude: -75.9780 },
];

const suggestionsContainer = document.getElementById('location-suggestions');
const locationInput = document.getElementById('location-input');

// Update location display in main weather overview
const updateLocationDisplay = (locationName) => {
    document.getElementById('location-display').textContent = locationName;
};

// Display suggestions based on user input
const displaySuggestions = (suggestions) => {
    // Clear the suggestions container
    suggestionsContainer.innerHTML = '';

    // Display the suggestions
    suggestions.forEach((suggestion) => {
        const suggestionElement = document.createElement('div');
        suggestionElement.id = "location-suggestion";
        suggestionElement.textContent = suggestion.name;

        // When a suggestion is clicked, update the input field and fetch weather data
        suggestionElement.addEventListener('click', async () => {
            locationInput.value = suggestion.name;
            suggestionsContainer.innerHTML = '';
            // Updates main weather overview location
            updateLocationDisplay(suggestion.name);
            // If the user selects 'Current Location', get current lat/lon values and fetch weather
            if (suggestion.name === 'Current Location') {
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(async (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        await getHourWeather(latitude, longitude);
                        updateWeatherDisplay();
                    });
                }
            }
            else {
                // Fetch weather for selected location
                await getHourWeather(suggestion.latitude, suggestion.longitude);
                updateWeatherDisplay();
            }
        });

        suggestionsContainer.appendChild(suggestionElement);
    });

    // Remove hidden class to display the suggestions container
    suggestionsContainer.classList.remove('hidden');
};

// Listen for input on the location input field
locationInput.addEventListener('input', (e) => {
    e.preventDefault();
    const locationInputValue = e.target.value;
    let suggestions = [];

    // If the input is empty, display the first 5 locations
    if (!locationInputValue) {
        suggestions = locations.slice(0, 5);
    }
    else {
        suggestions = locations.filter(location =>
            location.name.toLowerCase().startsWith(locationInputValue.toLowerCase())
        ).slice(0, 5);
    }

    // Display the suggestions
    displaySuggestions(suggestions);
});

// Close suggestions when clicking outside of the suggestions container
document.addEventListener('click', (e) => {
    if (e.target.id !== 'location-input') {
        // Clear suggestions when clicking outside of the input field (add hidden class to suggestions container)
        suggestionsContainer.classList.add('hidden');
    }
});

// When input is focused, display suggestions
locationInput.addEventListener('focus', () => {
    displaySuggestions(locations.slice(0, 5));
});
