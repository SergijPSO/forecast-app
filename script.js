"use strict";
// Variables
let inputLocation = document.getElementById("location");
const locateButton = document.getElementById("locate");
let currentLocation = document.querySelector(".app__weather__widget__location");
const currentWeatherDetails = document.querySelector(".app__weather__details");
const appWeek = document.querySelector(".app__weather__week");
const celsius = "&#8451";

document.addEventListener("DOMContentLoaded", function () {
  let bgImage = new Image();
  bgImage.src = "./images/default.jpeg";
  bgImage.onload = function () {
    document.body.style.backgroundImage = "url(" + bgImage.src + ")";
  };
});

//Getting city name from input
let locationPoint = "";
locateButton.addEventListener("click", () => {
  locationPoint = inputLocation.value.toLocaleString("en");
  getLocation(locationPoint);
});

//Fetching coordinates
const geoapifyApiKey = "2e680da3a08c43bc875800cd7c1bc017";
async function getLocation(location) {
  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${location}&apiKey=${geoapifyApiKey}`
    );
    const data = await response.json();
    const resulstArr = [data.features[0].properties];
    let city = data.query.parsed.city;
    resulstArr.map((item) => {
      let locationLatitulde = item.lat;
      let locationLongitude = item.lon;

      getWeatherData(locationLatitulde, locationLongitude, city);
    });
  } catch (error) {
    console.error("Error", error);
  }
}

//Using api to get city name
function getCity(latitude, longitude) {
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${geoapifyApiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const result = data;
      if (
        result.features[0].properties.city !== undefined ||
        result.features[0].properties.city !== null
      ) {
        console.log(result.features[0].properties.city);
        currentLocation.textContent = `${result.features[0].properties.city}`;
      } else {
        return;
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
}

//Using API to fetch weather data
async function getWeatherData(latitude, longitude, city) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude}%2C%20${longitude}?unitGroup=metric&include=current%2Cdays&key=EDHKHG9ZLTHQH4GDGL22UFT76&contentType=json`;
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      changeBackground(data.days[0].icon);
      setUpInterface(data, city);
    })
    .catch((error) => console.error(error))
    .finally(() => {
      switchVisibility();
    });
}

//Checking if geolocation is allowed
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(getCoordinates, errorCallback);
} else {
  console.log("Geolocation is not supported by this browser.");
  setUpInterface()
}

//Closing overlay if geolocation is not allowed
function errorCallback(error) {
  console.log("Error getting location: " + error.message);
  switchVisibility();
}

//Getting coordinates if geolocation is allowed
function getCoordinates(position) {
  getWeatherData(position.coords.latitude, position.coords.longitude);
  getCity(position.coords.latitude, position.coords.longitude);
}

//Creating overlay and spinner elements
const appOverlay = document.createElement("div");
appOverlay.classList.add("app__overlay");
document.body.appendChild(appOverlay);

const appSpinner = document.createElement("div");
appSpinner.classList.add("app__spinner");
appOverlay.appendChild(appSpinner);

//Creating app interface
function setUpInterface(weatherData, city) {
  removePreviousContent();
  setCurrentDayData(weatherData, city);
  setWeeksData(weatherData, city);
  convertDate(weatherData.currentConditions);
}

//Removing previous data on week days
function removePreviousContent() {
  if (document.getElementsByClassName("app__weather__week-day")) {
    const nodeList = document.querySelectorAll(".app__weather__week-day");
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].parentNode.removeChild(nodeList[i]);
    }
  }
}

// Close visibilty func
function switchVisibility() {
  appOverlay.remove();
  currentWeatherDetails.style.visibility = "visible";
  appWeek.style.visibility = "visible";
}

//Creating wee days cards and passing data
function setWeeksData(weatherData) {
  weatherData.days.forEach((day) => {
    const weekDay = document.createElement("div");
    weekDay.classList.add("app__weather__week-day");
    let week = document.querySelector(".app__weather__week-days");
    week.appendChild(weekDay);

    const weekDayHead = document.createElement("div");
    weekDayHead.classList.add("app__weather__week-day__head");
    weekDay.appendChild(weekDayHead);

    const weekDayContent = document.createElement("div");
    weekDayContent.classList.add("app__weather__week-day__content");
    weekDay.appendChild(weekDayContent);

    const dayIcon = document.createElement("img");
    dayIcon.classList.add("app__weather__week-day__icon");
    weekDayContent.appendChild(dayIcon);
    dayIcon.src = `./images/${day.icon}.svg`;

    const dayName = document.createElement("span");
    dayName.classList.add("app__weather__week-day__name");
    weekDayHead.appendChild(dayName);
    dayName.innerHTML = `${convertDate(day.datetimeEpoch)}`;

    const dayDate = document.createElement("span");
    dayDate.classList.add("app__weather__week-day__date");
    weekDayHead.appendChild(dayDate);
    dayDate.innerHTML = `${day.datetime}`;

    const tempCurrent = document.createElement("span");
    tempCurrent.classList.add("app__weather__week-day__temp");
    weekDayContent.appendChild(tempCurrent);
    tempCurrent.innerHTML = `Temperature: ${roundToClosestInt(
      day.temp
    )}${celsius}`;

    const feelsLike = document.createElement("span");
    feelsLike.classList.add("app__weather__week-day__feelslike");
    weekDayContent.appendChild(feelsLike);
    feelsLike.innerHTML = `Feels like: ${roundToClosestInt(
      day.feelslike
    )}${celsius}`;

    const weekDayTempLimits = document.createElement("div");
    weekDayTempLimits.classList.add("app__weather__week-day__temp-limits");
    weekDayContent.appendChild(weekDayTempLimits);

    const tempMax = document.createElement("span");
    tempMax.classList.add("app__weather__week-day__max");
    weekDayTempLimits.appendChild(tempMax);
    tempMax.innerHTML = `Max: ${roundToClosestInt(day.tempmax)}${celsius}`;

    const tempMin = document.createElement("span");
    tempMin.classList.add("app__weather__week-day__min");
    weekDayTempLimits.appendChild(tempMin);
    tempMin.innerHTML = `Min: ${roundToClosestInt(day.tempmin)}${celsius}`;

    const summary = document.createElement("span");
    summary.classList.add("app__weather__week-day__description");
    weekDayContent.appendChild(summary);
    summary.innerHTML = `${day.description}`;
  });
}

//Passing data to current day fields
function setCurrentDayData(weatherData, city) {
  let currentDate = document.querySelector(".app__weather__details-head__date");
  currentDate.innerHTML = ` ${dateFormatCurrentDay(
    weatherData.days[0].datetimeEpoch
  )}`;

  let currentDayName = document.querySelector(
    ".app__weather__details-head__title"
  );
  currentDayName.innerHTML = `${convertDate(
    weatherData.days[0].datetimeEpoch
  )},`;

  let currentTemperature = document.querySelector(
    ".app__weather__details-properties__value--temp"
  );
  currentTemperature.innerHTML = `${roundToClosestInt(
    weatherData.days[0].temp
  )}${celsius}`;

  let maxTemperature = document.querySelector(
    ".app__weather__details-properties__value--tempmax"
  );
  maxTemperature.innerHTML = `${roundToClosestInt(
    weatherData.days[0].tempmax
  )}${celsius}`;

  let minTemperature = document.querySelector(
    ".app__weather__details-properties__value--tempmin"
  );
  minTemperature.innerHTML = `${roundToClosestInt(
    weatherData.days[0].tempmin
  )}${celsius}`;

  let currentFeelslike = document.querySelector(
    ".app__weather__details-properties__value--feelslike"
  );
  currentFeelslike.innerHTML = `${roundToClosestInt(
    weatherData.days[0].feelslike
  )}${celsius}`;

  let currentHumidity = document.querySelector(
    ".app__weather__details-properties__value--humidity"
  );
  currentHumidity.innerHTML = `${roundToClosestInt(
    weatherData.days[0].humidity
  )} %`;

  let currentPressure = document.querySelector(
    ".app__weather__details-properties__value--pressure"
  );
  currentPressure.innerHTML = `${weatherData.days[0].pressure}`;

  let currentSunrise = document.querySelector(
    ".app__weather__details-properties__value--sunrise"
  );
  currentSunrise.innerHTML = `${weatherData.days[0].sunrise}`;

  let currentSunset = document.querySelector(
    ".app__weather__details-properties__value--sunset"
  );
  currentSunset.innerHTML = `${weatherData.days[0].sunset}`;

  let currentDayIcon = document.querySelector(".app__weather__widget__icon");
  currentDayIcon.src = `./images/${weatherData.days[0].icon}.svg`;

  const currentDayConditions = document.querySelector(
    ".app__weather__widget__conditions"
  );
  currentDayConditions.innerHTML = `${weatherData.days[0].description}`;

  currentLocation = document.querySelector(".app__weather__widget__location");
  currentLocation.textContent = city;
}

//Changing background according to tht weather
function changeBackground(icon) {
  switch (icon) {
    case "rain":
    case "showers-day":
    case "showers-night":
    case "thunder-rain":
    case "thunder-showers-day":
    case "thunder-showers-night":
      document.body.style.backgroundImage = 'url("./images/rainy.jpg")';
      break;
    case "clear-day":
    case "clear-night":
      document.body.style.backgroundImage = 'url("./images/clear.jpg")';
      break;
    case "fog":
      document.body.style.backgroundImage = 'url("./images/foggy.jpeg")';
      break;
    case "snow-showers-day":
    case "snow-showers-night":
    case "snow":
      document.body.style.backgroundImage = 'url("./images/snowy.jpeg")';
      break;
    default:
      // default value if no other cases match
      document.body.style.backgroundImage = 'url("./images/default.jpeg")';
      break;
  }
}

//To convert epochSeconds to day of week name
function convertDate(epochSeconds) {
  const date = new Date(epochSeconds * 1000);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];
  return dayOfWeek;
}

//Formatting date for current day section
function dateFormatCurrentDay(currentDayEpochSeconds) {
  const date = new Date(currentDayEpochSeconds * 1000);
  const options = { month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
}

//Roundig fuction, for rounding value to closest integer
function roundToClosestInt(value) {
  return Math.round(value);
}

//Creating digital clock
(function () {
  let currentTime = new Date();
  let hours = currentTime.getHours();
  let minutes = currentTime.getMinutes();

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  let timeString = hours + ":" + minutes;
  document.getElementById("clock").innerHTML = timeString;
})();
