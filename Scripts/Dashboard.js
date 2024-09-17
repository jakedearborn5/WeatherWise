document.addEventListener('DOMContentLoaded', () => {
    const tempElement = document.getElementById('temp');
    const conditionElement = document.getElementById('condition');

    // Example weather API
    setTimeout(() => {
        // tempElement.textContent = '84°F';
        // conditionElement.textContent = 'Sunny';
        getWeatherForNorman();
    }, 1000);

    async function getWeatherForNorman() {
        try {
          // Getting grid points for Norman, OK
          const pointResponse = await fetch('https://api.weather.gov/points/35.2226,-97.4395');
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
});
