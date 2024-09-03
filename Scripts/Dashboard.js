document.addEventListener('DOMContentLoaded', () => {
    const tempElement = document.getElementById('temp');
    const conditionElement = document.getElementById('condition');

    // Example weather API
    setTimeout(() => {
        tempElement.textContent = '72°F';
        conditionElement.textContent = 'Sunny';
    }, 1000);
});
