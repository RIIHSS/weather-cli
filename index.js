const axios = require("axios");

// Get city from CLI
const city = process.argv[2];

if (!city) {
  console.log("❌ Please provide a city name.");
  console.log('Usage: node index.js "London"');
  process.exit(1);
}

// Step 1: Get coordinates from city name
async function getCoordinates(city) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;

  const response = await axios.get(geoUrl);

  if (!response.data.results || response.data.results.length === 0) {
    throw new Error("City not found");
  }

  const { latitude, longitude, name } = response.data.results[0];

  return { latitude, longitude, name };
}

// Step 2: Get weather data
async function getWeather(lat, lon) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  const response = await axios.get(weatherUrl);

  return response.data.current_weather;
}

// Main function
async function main() {
  try {
    const { latitude, longitude, name } = await getCoordinates(city);
    const weather = await getWeather(latitude, longitude);

    console.log(
      `🌤️ Weather in ${name}: ${weather.temperature}°C, Wind ${weather.windspeed} km/h`
    );
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

main();