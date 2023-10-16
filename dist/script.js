"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Variables
const inputLocation = document.getElementById("location");
const locateButton = document.getElementById("locate");
let currentLocation = document.querySelector(".app__weather__widget__location");
const currentWeatherDetails = document.querySelector(".app__weather__details");
const appWeek = document.querySelector(".app__weather__week");
const celsius = "&#8451";
let locationPoint = "";
document.addEventListener("DOMContentLoaded", function () {
    let bgImage = new Image();
    bgImage.src = "./images/default.jpeg";
    bgImage.onload = function () {
        document.body.style.backgroundImage = "url(" + bgImage.src + ")";
    };
});
//Getting city name from input
function handleLocationInput() {
    locationPoint = inputLocation.value.toLocaleString();
    getLocation(locationPoint);
}
// Add event listener for clicking the locateButton
locateButton === null || locateButton === void 0 ? void 0 : locateButton.addEventListener("click", handleLocationInput);
// Add event listener for pressing the "Enter" key in the inputLocation field
inputLocation === null || inputLocation === void 0 ? void 0 : inputLocation.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleLocationInput();
    }
});
// Fetching coordinates
const geoapifyApiKey = "2e680da3a08c43bc875800cd7c1bc017";
function getLocation(location) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://api.geoapify.com/v1/geocode/search?text=${location}&apiKey=${geoapifyApiKey}`);
            const data = yield response.json();
            const resulstArr = [data.features[0].properties];
            let city = data.query.parsed.city;
            resulstArr.map((item) => {
                let locationLatitulde = item.lat;
                let locationLongitude = item.lon;
                console.log(city);
                getWeatherData(locationLatitulde, locationLongitude, city);
            });
        }
        catch (error) {
            console.error("Error", error);
        }
    });
}
//Get geolocation and rest data
function getCity(latitude, longitude) {
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${geoapifyApiKey}`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
        var _a, _b;
        const result = data;
        const city = (_b = (_a = result.features[0]) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.city;
        if (city !== undefined && city !== null) {
            const locationElement = currentLocation;
            locationElement.textContent = city;
            console.log(city + "<-!!!");
            return city;
        }
        else {
            return;
        }
    })
        .catch((error) => {
        console.log("error", error);
    });
}
// Input allow only English characters
function validateEnglishInput(inputElement) {
    const inputValue = inputElement.value;
    const englishLetters = /^[A-Za-z\s\-]*$/;
    if (!englishLetters.test(inputValue)) {
        inputElement.value = inputValue.replace(/[^A-Za-z\s\-]/g, "");
        console.log(inputValue + "!!!!!!!!!!");
    }
}
// Using API to fetch weather data
function getWeatherData(latitude, longitude, city) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude}%2C%20${longitude}?unitGroup=metric&include=current%2Cdays&key=EDHKHG9ZLTHQH4GDGL22UFT76&contentType=json`;
        yield fetch(url)
            .then((response) => response.json())
            .then((data) => {
            // console.log(`From the fetch: ${data} <--!!!`);
            changeBackground(data.days[0].icon);
            setUpInterface(data, city);
        })
            .catch((error) => console.error(error))
            .finally(() => {
            switchVisibility();
        });
    });
}
// Checking if geolocation is allowed
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(getCoordinates, errorCallback);
}
else {
    console.log("Geolocation is not supported by this browser.");
}
// Closing overlay if geolocation is not allowed
function errorCallback(error) {
    console.log("Error getting location: " + error.message);
    switchVisibility();
}
// Getting coordinates if geolocation is allowed
function getCoordinates(position) {
    getWeatherData(position.coords.latitude, position.coords.longitude);
    getCity(position.coords.latitude, position.coords.longitude);
}
// Creating overlay and spinner elements
const appOverlay = document.createElement("div");
appOverlay.classList.add("app__overlay");
document.body.appendChild(appOverlay);
const appSpinner = document.createElement("div");
appSpinner.classList.add("app__spinner");
appOverlay.appendChild(appSpinner);
// Creating app interface
function setUpInterface(weatherData, city) {
    removePreviousContent();
    setCurrentDayData(weatherData, city);
    setWeeksData(weatherData, city);
    convertDate(weatherData.currentConditions);
}
// Removing previous data on week days
function removePreviousContent() {
    const nodeList = document.querySelectorAll(".app__weather__week-day");
    nodeList.forEach((node) => {
        var _a;
        (_a = node.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(node);
    });
}
// Close visibility func
function switchVisibility() {
    appOverlay.remove();
    currentWeatherDetails.style.visibility = "visible";
    appWeek.style.visibility = "visible";
}
// Creating week days cards and passing data
function setWeeksData(weatherData, city) {
    weatherData.days.forEach((day) => {
        const weekDay = document.createElement("div");
        weekDay.classList.add("app__weather__week-day");
        let week = document.querySelector(".app__weather__week-days");
        week === null || week === void 0 ? void 0 : week.appendChild(weekDay);
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
        feelsLike.innerHTML = `Feels like: ${roundToClosestInt(day.feelslike)}${celsius}`;
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
function setCurrentDayData(weatherData, city) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const currentDateElement = document.querySelector(".app__weather__details-head__date");
    if (currentDateElement) {
        currentDateElement.innerHTML = ` ${dateFormatCurrentDay((_b = (_a = weatherData.days[0]) === null || _a === void 0 ? void 0 : _a.datetimeEpoch) !== null && _b !== void 0 ? _b : 0)}`;
    }
    const currentDayName = document.querySelector(".app__weather__details-head__title");
    if (currentDayName) {
        currentDayName.innerHTML = `${convertDate((_d = (_c = weatherData.days[0]) === null || _c === void 0 ? void 0 : _c.datetimeEpoch) !== null && _d !== void 0 ? _d : 0)},`;
    }
    const currentTemperature = document.querySelector(".app__weather__details-properties__value--temp");
    if (currentTemperature) {
        currentTemperature.innerHTML = `${roundToClosestInt((_e = weatherData.days[0]) === null || _e === void 0 ? void 0 : _e.temp)}${celsius}`;
    }
    const maxTemperature = document.querySelector(".app__weather__details-properties__value--tempmax");
    if (maxTemperature) {
        maxTemperature.innerHTML = `${roundToClosestInt((_f = weatherData.days[0]) === null || _f === void 0 ? void 0 : _f.tempmax)}${celsius}`;
    }
    const minTemperature = document.querySelector(".app__weather__details-properties__value--tempmin");
    if (minTemperature) {
        minTemperature.innerHTML = `${roundToClosestInt((_g = weatherData.days[0]) === null || _g === void 0 ? void 0 : _g.tempmin)}${celsius}`;
    }
    const currentFeelslike = document.querySelector(".app__weather__details-properties__value--feelslike");
    if (currentFeelslike) {
        currentFeelslike.innerHTML = `${roundToClosestInt((_h = weatherData.days[0]) === null || _h === void 0 ? void 0 : _h.feelslike)}${celsius}`;
    }
    let currentHumidity = document.querySelector(".app__weather__details-properties__value--humidity");
    if (currentHumidity) {
        currentHumidity.innerHTML = `${roundToClosestInt((_j = weatherData.days[0]) === null || _j === void 0 ? void 0 : _j.humidity)} %`;
    }
    const currentPressure = document.querySelector(".app__weather__details-properties__value--pressure");
    if (currentPressure) {
        currentPressure.innerHTML = `${(_k = weatherData.days[0]) === null || _k === void 0 ? void 0 : _k.pressure}`;
    }
    const currentSunrise = document.querySelector(".app__weather__details-properties__value--sunrise");
    if (currentSunrise) {
        currentSunrise.innerHTML = `${(_l = weatherData.days[0]) === null || _l === void 0 ? void 0 : _l.sunrise}`;
    }
    const currentSunset = document.querySelector(".app__weather__details-properties__value--sunset");
    if (currentSunset) {
        currentSunset.innerHTML = `${(_m = weatherData.days[0]) === null || _m === void 0 ? void 0 : _m.sunset}`;
    }
    let currentDayIcon = document.querySelector(".app__weather__widget__icon");
    currentDayIcon === null || currentDayIcon === void 0 ? void 0 : currentDayIcon.setAttribute("src", `./images/${weatherData.days[0].icon}.svg`);
    const currentDayConditions = document.querySelector(".app__weather__widget__conditions");
    if (currentDayConditions) {
        currentDayConditions.innerHTML = `${(_o = weatherData.days[0]) === null || _o === void 0 ? void 0 : _o.description}`;
    }
    currentLocation = document.querySelector(".app__weather__widget__location");
    if (currentLocation === null || currentLocation === void 0 ? void 0 : currentLocation.textContent) {
        currentLocation.textContent = city;
    }
}
// Changing background according to the weather
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
            document.body.style.backgroundImage = 'url("./images/default.jpeg")';
            break;
    }
}
// To convert epochSeconds to the day of the week name
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
// Formatting date for the current day section
function dateFormatCurrentDay(currentDayEpochSeconds) {
    const date = new Date(currentDayEpochSeconds * 1000);
    const formattedDate = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
    });
    return formattedDate;
}
// Rounding function, for rounding value to the closest integer
function roundToClosestInt(value) {
    return Math.round(value);
}
// Creating digital clock
(function () {
    let currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let timeString = hours + ":" + minutes;
    document.getElementById("clock").innerHTML = timeString;
})();
//# sourceMappingURL=script.js.map