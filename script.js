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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Variables
var inputLocation = document.getElementById("location");
var locateButton = document.getElementById("locate");
var currentLocation = document.querySelector(".app__weather__widget__location");
var currentWeatherDetails = document.querySelector(".app__weather__details");
var appWeek = document.querySelector(".app__weather__week");
var celsius = "&#8451";
var locationPoint = "";
document.addEventListener("DOMContentLoaded", function () {
    var bgImage = new Image();
    bgImage.src = "./images/default.jpeg";
    // getCoordinates();
    bgImage.onload = function () {
        document.body.style.backgroundImage = "url(" + bgImage.src + ")";
    };
});
//Getting city name from input
function handleLocationInput() {
    locationPoint = inputLocation.value.toLocaleString("en");
    getLocation(locationPoint);
}
// Add event listener for clicking the locateButton
locateButton === null || locateButton === void 0 ? void 0 : locateButton.addEventListener("click", handleLocationInput);
// Add event listener for pressing the "Enter" key in the inputLocation field
inputLocation === null || inputLocation === void 0 ? void 0 : inputLocation.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        handleLocationInput();
    }
});
// Fetching coordinates
var geoapifyApiKey = "2e680da3a08c43bc875800cd7c1bc017";
function getLocation(location) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, resulstArr, city_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://api.geoapify.com/v1/geocode/search?text=".concat(location, "&apiKey=").concat(geoapifyApiKey))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    resulstArr = [data.features[0].properties];
                    city_1 = data.query.parsed.city;
                    resulstArr.map(function (item) {
                        var locationLatitulde = item.lat;
                        var locationLongitude = item.lon;
                        getWeatherData(locationLatitulde, locationLongitude, city_1);
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//Using api to get city name
function getCity(latitude, longitude) {
    var url = "https://api.geoapify.com/v1/geocode/reverse?lat=".concat(latitude, "&lon=").concat(longitude, "&apiKey=").concat(geoapifyApiKey);
    fetch(url)
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var _a, _b;
        var result = data;
        var city = (_b = (_a = result.features[0]) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.city;
        if (city !== undefined && city !== null) {
            var locationElement = currentLocation;
            locationElement.textContent = city;
        }
        else {
            return;
        }
    })
        .catch(function (error) {
        console.log("error", error);
    });
}
// Input allow only English characters
function validateEnglishInput(inputElement) {
    var inputValue = inputElement.value;
    var englishLetters = /^[A-Za-z\s\-]*$/;
    if (!englishLetters.test(inputValue)) {
        inputElement.value = inputValue.replace(/[^A-Za-z\s\-]/g, "");
    }
}
// Using API to fetch weather data'
function getWeatherData(latitude, longitude, city) {
    return __awaiter(this, void 0, void 0, function () {
        var url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/".concat(latitude, "%2C%20").concat(longitude, "?unitGroup=metric&include=current%2Cdays&key=EDHKHG9ZLTHQH4GDGL22UFT76&contentType=json");
                    return [4 /*yield*/, fetch(url)
                            .then(function (response) { return response.json(); })
                            .then(function (data) {
                            changeBackground(data.days[0].icon);
                            setUpInterface(data, city);
                        })
                            .catch(function (error) { return console.error(error); })
                            .finally(function () {
                            switchVisibility();
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
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
    getWeatherData(position.coords.latitude, position.coords.longitude); //Uncaught TypeError: Cannot read properties of undefined (reading 'coords') at getCoordinates
    getCity(position.coords.latitude, position.coords.longitude);
    console.log(position);
    // return position;
}
// Creating overlay and spinner elements
var appOverlay = document.createElement("div");
appOverlay.classList.add("app__overlay");
document.body.appendChild(appOverlay);
var appSpinner = document.createElement("div");
appSpinner.classList.add("app__spinner");
appOverlay.appendChild(appSpinner);
// Creating app interface
function setUpInterface(weatherData, city) {
    removePreviousContent();
    setCurrentDayData(weatherData, city || "city is undefined");
    setWeeksData(weatherData, city);
    convertDate(weatherData.currentConditions);
}
// Removing previous data on week days
function removePreviousContent() {
    var nodeList = document.querySelectorAll(".app__weather__week-day");
    nodeList.forEach(function (node) {
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
    weatherData.days.forEach(function (day) {
        var weekDay = document.createElement("div");
        weekDay.classList.add("app__weather__week-day");
        var week = document.querySelector(".app__weather__week-days");
        week === null || week === void 0 ? void 0 : week.appendChild(weekDay);
        var weekDayHead = document.createElement("div");
        weekDayHead.classList.add("app__weather__week-day__head");
        weekDay.appendChild(weekDayHead);
        var weekDayContent = document.createElement("div");
        weekDayContent.classList.add("app__weather__week-day__content");
        weekDay.appendChild(weekDayContent);
        var dayIcon = document.createElement("img");
        dayIcon.classList.add("app__weather__week-day__icon");
        weekDayContent.appendChild(dayIcon);
        dayIcon.src = "./images/".concat(day.icon, ".svg");
        var dayName = document.createElement("span");
        dayName.classList.add("app__weather__week-day__name");
        weekDayHead.appendChild(dayName);
        dayName.innerHTML = "".concat(convertDate(day.datetimeEpoch));
        var dayDate = document.createElement("span");
        dayDate.classList.add("app__weather__week-day__date");
        weekDayHead.appendChild(dayDate);
        dayDate.innerHTML = "".concat(day.datetime);
        var tempCurrent = document.createElement("span");
        tempCurrent.classList.add("app__weather__week-day__temp");
        weekDayContent.appendChild(tempCurrent);
        tempCurrent.innerHTML = "Temperature: ".concat(roundToClosestInt(day.temp)).concat(celsius);
        var feelsLike = document.createElement("span");
        feelsLike.classList.add("app__weather__week-day__feelslike");
        weekDayContent.appendChild(feelsLike);
        feelsLike.innerHTML = "Feels like: ".concat(roundToClosestInt(day.feelslike)).concat(celsius);
        var weekDayTempLimits = document.createElement("div");
        weekDayTempLimits.classList.add("app__weather__week-day__temp-limits");
        weekDayContent.appendChild(weekDayTempLimits);
        var tempMax = document.createElement("span");
        tempMax.classList.add("app__weather__week-day__max");
        weekDayTempLimits.appendChild(tempMax);
        tempMax.innerHTML = "Max: ".concat(roundToClosestInt(day.tempmax)).concat(celsius);
        var tempMin = document.createElement("span");
        tempMin.classList.add("app__weather__week-day__min");
        weekDayTempLimits.appendChild(tempMin);
        tempMin.innerHTML = "Min: ".concat(roundToClosestInt(day.tempmin)).concat(celsius);
        var summary = document.createElement("span");
        summary.classList.add("app__weather__week-day__description");
        weekDayContent.appendChild(summary);
        summary.innerHTML = "".concat(day.description);
        // console.log(city);
    });
}
// Passing data to the current day fields
function setCurrentDayData(weatherData, city) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var currentDateElement = document.querySelector(".app__weather__details-head__date");
    if (currentDateElement) {
        currentDateElement.innerHTML = " ".concat(dateFormatCurrentDay((_b = (_a = weatherData.days[0]) === null || _a === void 0 ? void 0 : _a.datetimeEpoch) !== null && _b !== void 0 ? _b : 0));
    }
    var currentDayName = document.querySelector(".app__weather__details-head__title");
    if (currentDayName) {
        currentDayName.innerHTML = "".concat(convertDate((_d = (_c = weatherData.days[0]) === null || _c === void 0 ? void 0 : _c.datetimeEpoch) !== null && _d !== void 0 ? _d : 0), ",");
    }
    var currentTemperature = document.querySelector(".app__weather__details-properties__value--temp");
    if (currentTemperature) {
        currentTemperature.innerHTML = "".concat(roundToClosestInt((_e = weatherData.days[0]) === null || _e === void 0 ? void 0 : _e.temp)).concat(celsius);
    }
    var maxTemperature = document.querySelector(".app__weather__details-properties__value--tempmax");
    if (maxTemperature) {
        maxTemperature.innerHTML = "".concat(roundToClosestInt((_f = weatherData.days[0]) === null || _f === void 0 ? void 0 : _f.tempmax)).concat(celsius);
    }
    var minTemperature = document.querySelector(".app__weather__details-properties__value--tempmin");
    if (minTemperature) {
        minTemperature.innerHTML = "".concat(roundToClosestInt((_g = weatherData.days[0]) === null || _g === void 0 ? void 0 : _g.tempmin)).concat(celsius);
    }
    var currentFeelslike = document.querySelector(".app__weather__details-properties__value--feelslike");
    if (currentFeelslike) {
        currentFeelslike.innerHTML = "".concat(roundToClosestInt((_h = weatherData.days[0]) === null || _h === void 0 ? void 0 : _h.feelslike)).concat(celsius);
    }
    var currentHumidity = document.querySelector(".app__weather__details-properties__value--humidity");
    if (currentHumidity) {
        currentHumidity.innerHTML = "".concat(roundToClosestInt((_j = weatherData.days[0]) === null || _j === void 0 ? void 0 : _j.humidity), " %");
    }
    var currentPressure = document.querySelector(".app__weather__details-properties__value--pressure");
    if (currentPressure) {
        currentPressure.innerHTML = "".concat((_k = weatherData.days[0]) === null || _k === void 0 ? void 0 : _k.pressure);
    }
    var currentSunrise = document.querySelector(".app__weather__details-properties__value--sunrise");
    if (currentSunrise) {
        currentSunrise.innerHTML = "".concat((_l = weatherData.days[0]) === null || _l === void 0 ? void 0 : _l.sunrise);
    }
    var currentSunset = document.querySelector(".app__weather__details-properties__value--sunset");
    if (currentSunset) {
        currentSunset.innerHTML = "".concat((_m = weatherData.days[0]) === null || _m === void 0 ? void 0 : _m.sunset);
    }
    var currentDayIcon = document.querySelector(".app__weather__widget__icon");
    currentDayIcon === null || currentDayIcon === void 0 ? void 0 : currentDayIcon.setAttribute("src", "./images/".concat(weatherData.days[0].icon, ".svg"));
    var currentDayConditions = document.querySelector(".app__weather__widget__conditions");
    if (currentDayConditions) {
        currentDayConditions.innerHTML = "".concat((_o = weatherData.days[0]) === null || _o === void 0 ? void 0 : _o.description);
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
    var date = new Date(epochSeconds * 1000);
    var daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    var dayOfWeek = daysOfWeek[date.getDay()];
    return dayOfWeek;
}
// Formatting date for the current day section
function dateFormatCurrentDay(currentDayEpochSeconds) {
    var date = new Date(currentDayEpochSeconds * 1000);
    var options = { month: "long", day: "numeric" };
    var formattedDate = date.toLocaleDateString("en-US", {
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
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var timeString = hours + ":" + minutes;
    document.getElementById("clock").innerHTML = timeString;
})();
