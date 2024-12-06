import weatherStore, { getHourWeather } from './WeatherLogic.js';

// Swiper variable
let recSwiper;

document.addEventListener('DOMContentLoaded', () => {
    // Initializing swiper variable
    recSwiper = new Swiper('.swiper-container');

});

// Adds slide given an image path and alt text
// Note that the alt text appears at the bottom of the slide
function addSlide(imageSrc, altText)
{
    const newSlide = `
    <div class="swiper-slide">
        <img src="${imageSrc}" alt="${altText}">
        <p class="slide-caption">${altText}</p>
    </div>`;
    recSwiper.appendSlide(newSlide);
}

// Creates slides for all recommendations in recommendations object
export function addAllRecs()
{
    // Removing current slides so we don't get duplicates
    recSwiper.removeAllSlides();

    // Iterating over the two categories in recommendations
    for(const [category, items] of Object.entries(weatherStore.recommendations))
    {
        // Adding a slide for each recommended item
        items.forEach(item => {
            addSlide(item.imagePath, item.description);
        });
    }
}