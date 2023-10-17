"use strict";

// Variables
const inputLocation = document.getElementById("location") as HTMLInputElement;
const locateButton = document.getElementById("locate");
let currentLocation: HTMLElement | null = document.querySelector(
  ".app__weather__widget__location"
);
const currentWeatherDetails = document.querySelector(".app__weather__details");
const appWeek: HTMLElement | null = document.querySelector(
  ".app__weather__week"
);
const celsius: string = "&#8451";
let locationPoint: string = "";
const geoapifyApiKey: string = "2e680da3a08c43bc875800cd7c1bc017";

document.addEventListener("DOMContentLoaded", function () {
  let bgImage = new Image();
  bgImage.src = "./images/default.jpeg";
  bgImage.onload = function (): void {
    document.body.style.backgroundImage = "url(" + bgImage.src + ")";
  };
});

//Getting city name from input
function handleLocationInput(): void {
  locationPoint = inputLocation.value.toLocaleString();
  getLocation(locationPoint);
}

// Add event listener for clicking the locateButton
locateButton?.addEventListener("click", handleLocationInput);
// Add event listener for pressing the "Enter" key in the inputLocation field
inputLocation?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleLocationInput();
  }
});

// Fetching coordinates
async function getLocation(location: string): Promise<void> {
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
      console.log(city) + "???!!!!";
      getWeatherData(locationLatitulde, locationLongitude, city);
    });
  } catch (error) {
    console.error("Error", error);
  }
}

//Get geolocation and rest data
function getCity(latitude: number, longitude: number): any {
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${geoapifyApiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const result = data;
      // const city = result.features[0].properties.city;
      currentLocation.textContent = result.features[0].properties.city;
      // if (city !== undefined && city !== null) {
      // currentLocation.innerHTML = city;
      //   console.log(city + "____!!!!!______");
      //   console.log(currentLocation.textContent + "<--!!!textContent!!!");
      // } else {
      //   return;
      // }
    })
    .catch((error) => {
      console.log("error", error);
    });
}

// Input allow only English characters
function validateEnglishInput(inputElement: HTMLInputElement): any {
  const inputValue = inputElement.value;
  const englishLetters = /^[A-Za-z\s\-]*$/;
  if (!englishLetters.test(inputValue)) {
    inputElement.value = inputValue.replace(/[^A-Za-z\s\-]/g, "");
  }
}

// Using API to fetch weather data
async function getWeatherData(
  latitude: number,
  longitude: number,
  city?: string
): Promise<void> {
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

// Checking if geolocation is allowed
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(getCoordinates, errorCallback);
} else {
  console.log("Geolocation is not supported by this browser.");
}

// Closing overlay if geolocation is not allowed
function errorCallback(error: GeolocationPositionError): void {
  console.log("Error getting location: " + error.message);
  switchVisibility();
}

function getCoordinates(position: GeolocationPosition | undefined): any {
  if (position && position.coords) {
    getWeatherData(position.coords.latitude, position.coords.longitude);
    getCity(position.coords.latitude, position.coords.longitude);
  } else {
    console.log("Unable to get coordinates.");
    switchVisibility();
  }
}

// Creating overlay and spinner elements
const appOverlay: HTMLDivElement = document.createElement("div");
appOverlay.classList.add("app__overlay");
document.body.appendChild(appOverlay);

const appSpinner: HTMLDivElement = document.createElement("div");
appSpinner.classList.add("app__spinner");
appOverlay.appendChild(appSpinner);

// Creating app interface
function setUpInterface(weatherData: any, city: string): void {
  removePreviousContent();
  setCurrentDayData(weatherData, city);
  setWeeksData(weatherData, city);
  convertDate(weatherData.currentConditions);
}

// Removing previous data on week days
function removePreviousContent(): void {
  const nodeList = document.querySelectorAll(".app__weather__week-day");
  nodeList.forEach((node) => {
    node.parentNode?.removeChild(node);
  });
}

// Close visibility func
function switchVisibility(): void {
  appOverlay.remove();
  (currentWeatherDetails as HTMLElement).style.visibility = "visible";
  (appWeek as HTMLElement).style.visibility = "visible";
}

// Creating week days cards and passing data
function setWeeksData(weatherData: any, city: string): void {
  weatherData.days.forEach((day: any) => {
    const weekDay = document.createElement("div");
    weekDay.classList.add("app__weather__week-day");
    let week = document.querySelector(".app__weather__week-days");
    week?.appendChild(weekDay);

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
    tempCurrent.innerHTML = `

Temperature: ${roundToClosestInt(day.temp)}${celsius}`;

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
    console.log(`${city} from setUpInterface`);
  });
}

// Passing data to the current day fields
function setCurrentDayData(weatherData: any, city: string): void {
  const currentDateElement = document.querySelector(
    ".app__weather__details-head__date"
  );

  if (currentDateElement) {
    currentDateElement.innerHTML = ` ${dateFormatCurrentDay(
      weatherData.days[0]?.datetimeEpoch ?? 0
    )}`;
  }

  const currentDayName = document.querySelector(
    ".app__weather__details-head__title"
  );

  if (currentDayName) {
    currentDayName.innerHTML = `${convertDate(
      weatherData.days[0]?.datetimeEpoch ?? 0
    )},`;
  }

  const currentTemperature = document.querySelector(
    ".app__weather__details-properties__value--temp"
  );

  if (currentTemperature) {
    currentTemperature.innerHTML = `${roundToClosestInt(
      weatherData.days[0]?.temp
    )}${celsius}`;
  }

  const maxTemperature = document.querySelector(
    ".app__weather__details-properties__value--tempmax"
  );

  if (maxTemperature) {
    maxTemperature.innerHTML = `${roundToClosestInt(
      weatherData.days[0]?.tempmax
    )}${celsius}`;
  }

  const minTemperature = document.querySelector(
    ".app__weather__details-properties__value--tempmin"
  );

  if (minTemperature) {
    minTemperature.innerHTML = `${roundToClosestInt(
      weatherData.days[0]?.tempmin
    )}${celsius}`;
  }

  const currentFeelslike = document.querySelector(
    ".app__weather__details-properties__value--feelslike"
  );

  if (currentFeelslike) {
    currentFeelslike.innerHTML = `${roundToClosestInt(
      weatherData.days[0]?.feelslike
    )}${celsius}`;
  }

  let currentHumidity = document.querySelector(
    ".app__weather__details-properties__value--humidity"
  );

  if (currentHumidity) {
    currentHumidity.innerHTML = `${roundToClosestInt(
      weatherData.days[0]?.humidity
    )} %`;
  }

  const currentPressure = document.querySelector(
    ".app__weather__details-properties__value--pressure"
  );

  if (currentPressure) {
    currentPressure.innerHTML = `${weatherData.days[0]?.pressure}`;
  }

  const currentSunrise = document.querySelector(
    ".app__weather__details-properties__value--sunrise"
  );

  if (currentSunrise) {
    currentSunrise.innerHTML = `${weatherData.days[0]?.sunrise}`;
  }

  const currentSunset = document.querySelector(
    ".app__weather__details-properties__value--sunset"
  );

  if (currentSunset) {
    currentSunset.innerHTML = `${weatherData.days[0]?.sunset}`;
  }

  let currentDayIcon = document.querySelector(".app__weather__widget__icon");
  currentDayIcon?.setAttribute(
    "src",
    `./images/${weatherData.days[0].icon}.svg`
  );

  const currentDayConditions = document.querySelector(
    ".app__weather__widget__conditions"
  );
  if (currentDayConditions) {
    currentDayConditions.innerHTML = `${weatherData.days[0]?.description}`;
  }

  currentLocation = document.querySelector(".app__weather__widget__location");
  if (currentLocation?.textContent) {
    currentLocation.textContent = city;
  }
}

// Changing background according to the weather
function changeBackground(icon: string): void {
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
      document.body.style.backgroundImage = 'url("./images/default.jpeg")';
      break;
  }
}

// To convert epochSeconds to the day of the week name
function convertDate(epochSeconds: number): string {
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

// Formatting date for the current day section
function dateFormatCurrentDay(currentDayEpochSeconds: number): string {
  const date = new Date(currentDayEpochSeconds * 1000);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return formattedDate;
}

// Rounding function, for rounding value to the closest integer
function roundToClosestInt(value: number): number {
  return Math.round(value);
}

// Creating digital clock
(function () {
  let currentTime = new Date();
  let hours: number | string = currentTime.getHours();
  let minutes: number | string = currentTime.getMinutes();

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  let timeString = hours + ":" + minutes;
  document.getElementById("clock")!.innerHTML = timeString;
})();
