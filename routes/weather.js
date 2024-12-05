const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

/**
 * Get the weather for a specific location
 * @param {*} latitude 
 * @param {*} longitude 
 * @returns 
 */
async function getWeatherForLocation(latitude, longitude) {
    try {
        const pointResponse = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`);
        const pointData = await pointResponse.json();
        const forecastUrl = pointData.properties.forecast;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        let weather = forecastData.properties.periods[0];

        weather.locationName = pointData.properties.relativeLocation.properties.city + ', ' + pointData.properties.relativeLocation.properties.state;
        return weather;
    } catch (error) {
        return null;
    }
}

// GET weather for a specific location
router.get('/:latitude/:longitude', async (req, res) => {
    const latitude = req.params.latitude;
    const longitude = req.params.longitude;

    const weather = await getWeatherForLocation(latitude, longitude);
    res.status(200).json(weather);
});

module.exports.router = router;
module.exports.getWeatherForLocation = getWeatherForLocation;
