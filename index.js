const express = require("express");
const axios = require("axios");
const hbs = require("hbs");

require("dotenv").config();

const app = express();
app.set("view engine", "hbs");
app.use(express.static("public"));
hbs.registerPartials(__dirname + "/views/partials");

const getWeatherOPW = async (city) => {
  const apiKey = process.env.API_KEY_OPW;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const response = await axios.get(url);
  return response.data;
};

const getWeatherByLatLon = async (lat, lon) => {
  const apiKey = process.env.API_KEY_OPW;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const response = await axios.get(url);
  return response.data;
};

const renderWeather = async (res, weather) => {
  console.log(weather);
  const location = weather.name;
  const description = weather.weather[0].description;
  const iconUrl = `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
  const temp = Math.round(weather.main.temp - 273.15);
  const humidity = weather.main.humidity;
  const country = weather.sys.country;

  res.render("weather.hbs", {
    location,
    description,
    iconUrl,
    temp,
    humidity,
    country,
  });
};

app.get("/", (req, res) => {
  res.send("Health check");
});

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const lat = req.query.lat;
  const lon = req.query.lon;
  try {
    if (lat && lon) {
      const weather = await getWeatherByLatLon(lat, lon);
      renderWeather(res, weather);
      return;
    }
    const weather = await getWeatherOPW(city);
    renderWeather(res, weather);
  } catch (error) {
    res.render("error.hbs");
  }
});

app.get("/weather/:city", async (req, res) => {
  const city = req.params.city;
  try {
    const weather = await getWeatherOPW(city);
    renderWeather(res, weather);
  } catch (error) {
    res.render("error.hbs");
  }
});

app.get("/search", (req, res) => {
  res.render("search.hbs");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
