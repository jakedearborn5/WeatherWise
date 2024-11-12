document.addEventListener('DOMContentLoaded', () => {
    getWeatherForUser();
    setupSlides();
});

document.getElementById('toggles').addEventListener('change', () => {
    const toggleUnits = document.getElementById('toggles');
    const tempElement = document.getElementById('temp');
    if(toggleUnits.checked){ //true when the units are in fahrenheit
        toggleUnits.checked = true; //toggle state of the checkbox
        tempElement.textContent = tempElement.getAttribute('data-tempCelsius') + '° C';
    }
    else{
        toggleUnits.checked = false; //toggle state of the checkbox
        tempElement.textContent = tempElement.getAttribute('data-tempFahrenheit') + '° F';
    }
});

async function getWeatherForUser() {
    const tempElement = document.getElementById('temp');
    const conditionElement = document.getElementById('condition');
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

        console.log(forecastData);
        // Getting the current forecast period
        const currentPeriod = forecastData.properties.periods[0];
        // Changing visual elements to current conditions
        tempElement.setAttribute('data-tempFahrenheit', currentPeriod.temperature);
        tempElement.setAttribute('data-tempCelsius',Math.round((currentPeriod.temperature - 32) * 5/9));
        tempElement.textContent = `${currentPeriod.temperature}` + '° F';
        conditionElement.textContent = `${currentPeriod.shortForecast}`;

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
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
async function changeBackgroundGradient(temp, cond, time){
  let conditionsColor, temperatureColor = {
    hue,
    saturation,
    lightness
  }
}


