document.addEventListener('DOMContentLoaded', () => {
    const tempElement = document.getElementById('temp');
    const conditionElement = document.getElementById('condition');

    // Example weather API
    setTimeout(() => {
        // tempElement.textContent = '84°F';
        // conditionElement.textContent = 'Sunny';
        getWeatherForUser();
    }, 1000);

    async function getWeatherForUser() {
        try {
            // Get the users current location [latitude, longitude]
            const userPosition = await getCurrentLocation();

            const pointResponse = await fetch(`https://api.weather.gov/points/${userPosition[0]},${userPosition[1]}`);
            const pointData = await pointResponse.json();

            //Using the gridId, gridX, gridY to get the forecast URL
            const forecastUrl = pointData.properties.forecast;

            //Getting the forecast data from the URL
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();

            // Getting the current forecast period
            const currentPeriod = forecastData.properties.periods[0];
            // Changing visual elements to current conditions
            tempElement.textContent = `${currentPeriod.temperature}` + '° F';
            conditionElement.textContent = `${currentPeriod.shortForecast}`;

        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    /**
     *  Gets the users current location using the geolocation API
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
}
);
