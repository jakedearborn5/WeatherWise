document.addEventListener('DOMContentLoaded', () => {
    const tempElement = document.getElementById('temp');
    const conditionElement = document.getElementById('condition');

    // Example weather API
    setTimeout(() => {
        tempElement.textContent = '75°F';
        conditionElement.textContent = 'Cloudy';
    }, 1000);
});
