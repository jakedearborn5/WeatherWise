import { getCurrentLocation } from './Dashboard.js';

// Exported object so that information can be accessed anywhere

const weatherStore = {

    // Recommendations based off of the generateRecommendations() function
    // FEEL FREE TO EDIT THIS TO DO WHATEVER YOU NEED TO DO
    recommendations: {
        upperBody: [],
        lowerBody: [],
        footwear: [],
        accessories: []
    },

    // This will include everything the API has to offer for the specific location
    weatherInfo: {
        temperature: -1,
        tempUnit: "E",
        rainChance: -1,
        dewPoint: -1,
        relativeHumidity: -1,
        windSpeed: -1,
        windDirection: "E",
        shortForecast: "E",
        isDaytime: "True",
        date: "Err",
        hour: "Err",
        alert: "",
    }
};


// This function populates the weatherInfo object based on latitude and longitude and also generates recommendations based off the data gotten
export async function getHourWeather(latitude, longitude) {
    try {
        // Getting points from the latitude and longitude
        const pointUrl = `https://api.weather.gov/points/${latitude},${longitude}`;
        const pointResponse = await fetch(pointUrl);
        if (!pointResponse.ok) throw new Error("Failed to fetch point data");
        const pointData = await pointResponse.json();

        // Getting hourly data from pointData
        const forecastUrl = pointData.properties.forecastHourly;
        const alertsUrl = `https://api.weather.gov/alerts/active?point=${latitude},${longitude}`; // Will probably get removed

        // Fetching that data
        const [forecastResponse, alertsResponse] = await Promise.all([
            fetch(forecastUrl),
            fetch(alertsUrl),
        ]);

        if (!forecastResponse.ok || !alertsResponse.ok) {
            throw new Error("Failed to fetch weather data");
        }

        // Extracting
        const forecastData = await forecastResponse.json();
        const alertsData = await alertsResponse.json();
        const currentHour = forecastData.properties.periods[0];

        // Putting all data in it's proper place
        weatherStore.weatherInfo.temperature = currentHour.temperature;
        weatherStore.weatherInfo.tempUnit = currentHour.temperatureUnit;
        weatherStore.weatherInfo.rainChance = currentHour.probabilityOfPrecipitation.value;
        weatherStore.weatherInfo.dewPoint = currentHour.dewpoint.value;
        weatherStore.weatherInfo.relativeHumidity = currentHour.relativeHumidity.value;
        weatherStore.weatherInfo.windSpeed = currentHour.windSpeed;
        weatherStore.weatherInfo.windDirection = currentHour.windDirection;
        weatherStore.weatherInfo.shortForecast = currentHour.shortForecast;
        weatherStore.weatherInfo.isDaytime = currentHour.isDaytime;
        
        // Add any alerts to an array
        if (alertsData && alertsData.features) {
            weatherStore.weatherInfo.alerts = alertsData.features.map(alert => ({
                title: alert.properties.headline,
                description: alert.properties.description,
                severity: alert.properties.severity,
            }));
        } else {
            weatherStore.weatherInfo.alerts = [];
        }

        const currentDateAndTime = splitDate(currentHour.startTime);
        weatherStore.weatherInfo.date = currentDateAndTime[0];
        weatherStore.weatherInfo.hour = currentDateAndTime[1];

        //console.log(weatherStore.weatherInfo); // Temp for testing purposes
        generateRecommendations();

        // Clear search input
        document.getElementById('location-input').value = '';

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Splitting the date from the API into something that's actually useful and readable
function splitDate(currentDate) {
    const [divorcedDate, timeWithOffset] = currentDate.split("T");

    // Fixing time
    const time = timeWithOffset.split(":").slice(0, 1).join(":");

    return [divorcedDate, time];
}

// PLEASE CHANGE THIS FUNCTION IF YOU NEED TO FOR THE RECOMMENDATIONS
// This was just my inital thought on how it should work but do whatever is needed
function generateRecommendations() {
    // Clearing previous recommendations so we don't get duplicates
    weatherStore.recommendations.upperBody = [];
    weatherStore.recommendations.lowerBody = [];
    weatherStore.recommendations.footwear = [];
    weatherStore.recommendations.accessories = [];

    // Getting clothing recommendations

    if (weatherStore.weatherInfo.temperature <= 32) {
        // Extreme cold
        weatherStore.recommendations.upperBody.push("Heavy Coat", "Sweater");
        weatherStore.recommendations.accessories.push("Gloves", "Hat");
        weatherStore.recommendations.lowerBody.push("Thick Pants");
        weatherStore.recommendations.footwear.push("Boots");
    }
    else if (weatherStore.weatherInfo.temperature <= 60) {
        // Moderate Cold
        weatherStore.recommendations.upperBody.push("Jacket", "Sweater");
        weatherStore.recommendations.lowerBody.push("Jeans", "Sweatpants");
    }
    else if (weatherStore.weatherInfo.temperature <= 75) {
        // Moderate
        weatherStore.recommendations.upperBody.push("TShirt", "Light Sweater");
        weatherStore.recommendations.lowerBody.push("Jeans", "Sweatpants");
    }
    else {
        // Moderate to High Heat
        weatherStore.recommendations.upperBody.push("TShirt");
        weatherStore.recommendations.lowerBody.push("Shorts");
    }

    // Rain based recommendations (CAN BE EXPANDED UPON IF NEEDED)
    if (weatherStore.weatherInfo.rainChance >= 60) {
        weatherStore.recommendations.accessories.push("Umbrella");
    }

    // Wind based recommendations
    if (weatherStore.weatherInfo.windSpeed >= 20) {
        weatherStore.recommendations.accessories.push("Windbreaker");
    }

    // Short forecast based recommendations
    if (weatherStore.weatherInfo.shortForecast.toLowerCase().includes("sunny")) {
        weatherStore.recommendations.accessories.push("Sunglasses");
    }
    else if (weatherStore.weatherInfo.shortForecast.toLowerCase().includes("rain") &
        !(weatherStore.recommendations.accessories.includes("Umbrella"))) {
        weatherStore.recommendations.accessories.push("Umbrella");
    }

    //console.log(weatherStore.recommendations); // Testing purposes
}

// Beginning run based on current location
async function initialization() {
    try {
        const userPosition = await getCurrentLocation();
        await getHourWeather(userPosition[0], userPosition[1]);
    }
    catch (error) {
        console.error("Error getting location and weather data", error);
    }
}

initialization();

export default weatherStore;