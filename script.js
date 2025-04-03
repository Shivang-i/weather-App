const API_key = "9471608161d14e5ebc6212640250304";
const weatherInfo = document.getElementById("weather-Info");
const error = document.getElementById("error");
const loading = document.getElementById("loading");


// Fetch weather data by city
async function getWeatherByCity(cityName) {
    showLoading();
    try {
        const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_key}&q=${cityName}&days=7&aqi=no&alerts=no`;

        const response = await fetch(weatherUrl);
        const data = await response.json();

        console.log("API Response:", data); // Debugging

        if (!response.ok || data.error) {
            throw new Error(data.error?.message || "City Not Found");
        }
        displayWeather(data);
    } catch (err) {
        showError(err.message);
    }
}

// Get weather based on input
function getWeather() {
    const cityInput = document.getElementById("city_Input").value.trim();
    if (!cityInput) return;
    getWeatherByCity(cityInput);
}

// Display weather data
function displayWeather(data) {
    weatherInfo.style.display = "block";
    error.style.display = "none";
    loading.style.display = "none";

    document.getElementById("city_Name").textContent = data.location.name;
    document.getElementById("date").textContent = data.location.localtime;
    document.getElementById("temperature").textContent = `${data.current.temp_c}ºC`;
    document.getElementById("weather_Description").textContent = data.current.condition.text;
    document.getElementById("weather_Icon").src = `https:${data.current.condition.icon}`;
    document.getElementById("feel_Like").textContent = `${data.current.feelslike_c}ºC`;
    document.getElementById("humidity").textContent = `${data.current.humidity}%`;
    document.getElementById("wind_Speed").textContent = `${data.current.wind_kph} km/hr`;
    document.getElementById("uv_Index").textContent = `${data.current.uv}`;

    // Forecast data
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    data.forecast.forecastday.forEach(day => {
        const forecastDay = document.createElement("div");
        forecastDay.className = "forecast_Day";
        forecastDay.innerHTML = `
            <h3>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</h3>   
            <img class="forecast-Icon" src="https:${day.day.condition.icon}" alt="Weather Icon">
            <p>${Math.round(day.day.maxtemp_c)}ºC / ${Math.round(day.day.mintemp_c)}ºC</p>
            <p>${day.day.condition.text}</p>`;
        forecastContainer.appendChild(forecastDay);
    });
}

// Show error message
function showError(message) {
    error.style.display = "block";
    error.textContent = message;
    weatherInfo.style.display = "none";
    loading.style.display = "none";
}

// Show loading animation
function showLoading() {
    loading.style.display = "block";
    error.style.display = "none";
    weatherInfo.style.display = "none";
}

// Event listener for Enter key
document.getElementById("city_Input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        getWeather();
    }
});

// Load default weather (India)
window.addEventListener("load", () => {
    document.getElementById("city_Input").value = "India";
    getWeatherByCity("India");
});
