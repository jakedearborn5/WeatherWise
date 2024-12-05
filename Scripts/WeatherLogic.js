import { getCurrentLocation } from './Dashboard.js';

// Global objects so that they can be accessed anywhere and updated for each new location
const recommendations = {
    upperBody: [],
    lowerBody: [],
    footwear: [],
    accessories: []
};

const weatherInfo = {
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
};


// This function populates the weatherInfo object based on latitude and longitude and also generates recommendations based off the data gotten
async function getHourWeather(latitude, longitude) {
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
        weatherInfo.temperature = currentHour.temperature;
        weatherInfo.tempUnit = currentHour.temperatureUnit;
        weatherInfo.rainChance = currentHour.probabilityOfPrecipitation.value;
        weatherInfo.dewPoint = currentHour.dewpoint.value;
        weatherInfo.relativeHumidity = currentHour.relativeHumidity.value;
        weatherInfo.windSpeed = currentHour.windSpeed;
        weatherInfo.windDirection = currentHour.windDirection;
        weatherInfo.shortForecast = currentHour.shortForecast;
        weatherInfo.isDaytime = currentHour.isDaytime;
        const currentDateAndTime = splitDate(currentHour.startTime);
        weatherInfo.date = currentDateAndTime[0];
        weatherInfo.hour = currentDateAndTime[1];



        // This probably needs to be removed tbh
        // const weatherInfo = {
            
        //     alerts: alertsData.features.map((alert) => ({
        //         title: alert.properties.event,
        //         description: alert.properties.description,
        //         severity: alert.properties.severity,
        //     })),
        // };

        console.log(weatherInfo); // Temp for testing purposes
        generateRecommendations();

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Splitting the date from the API into something that's actually useful and readable
function splitDate(currentDate)
{
    const [divorcedDate, timeWithOffset] = currentDate.split("T");

    // Fixing time
    const time = timeWithOffset.split(":").slice(0,1).join(":");

    return [divorcedDate, time];
}

// PLEASE CHANGE THIS FUNCTION IF YOU NEED TO FOR THE RECOMMENDATIONS
// This was just my inital thought on how it should work but do whatever is needed
function generateRecommendations()
{
    // Clearing previous recommendations so we don't get duplicates
    recommendations.upperBody = [];
    recommendations.lowerBody = [];
    recommendations.footwear = [];
    recommendations.accessories = [];

    // Getting clothing recommendations

    if(weatherInfo.temperature <= 32)
    {
        // Extreme cold
        recommendations.upperBody.push("Heavy Coat", "Sweater");
        recommendations.accessories.push("Gloves", "Hat");
        recommendations.lowerBody.push("Thick Pants");
        recommendations.footwear.push("Boots");
    }
    else if(weatherInfo.temperature <= 60)
    {
        // Moderate Cold
        recommendations.upperBody.push("Jacket", "Sweater");
        recommendations.lowerBody.push("Jeans", "Sweatpants");
    }
    else if(weatherInfo.temperature <= 75)
    {
        // Moderate
        recommendations.upperBody.push("TShirt", "Light Sweater");
        recommendations.lowerBody.push("Jeans", "Sweatpants");
    }
    else
    {
        // Moderate to High Heat
        recommendations.upperBody.push("TShirt");
        recommendations.lowerBody.push("Shorts");
    }

    // Rain based recommendations (CAN BE EXPANDED UPON IF NEEDED)
    if(weatherInfo.rainChance >= 60)
    {
        recommendations.accessories.push("Umbrella");
    }

    // Wind based recommendations
    if(weatherInfo.windSpeed >= 20)
    {
        recommendations.accessories.push("Windbreaker");
    }

    // Short forecast based recommendations
    if(weatherInfo.shortForecast.toLowerCase().includes("sunny"))
    {
        recommendations.accessories.push("Sunglasses");
    }
    else if(weatherInfo.shortForecast.toLowerCase().includes("rain") & !(recommendations.accessories.includes("Umbrella")))
    {
        recommendations.accessories.push("Umbrella");
    }

    console.log(recommendations); // Testing purposes
}

// Beginning run based on current location
async function initialization()
{
    try 
    {
        const userPosition = await getCurrentLocation();
        getHourWeather(userPosition[0], userPosition[1]);
    }
    catch(error)
    {
        console.error("Error getting location and weather data", error);
    }
}

initialization();