const sidebar = document.getElementById("sidebar");
let touchStartX = 0;
let touchEndX = 0;
let lastScrollY = window.scrollY;
const weatherApiKey = "55e089ff3707c1a7d257809d2f463710";
let citySearchInput;
const units = "imperial";
const citySearch = document.getElementById("city-search");
const searchBtn = document.getElementById("search-btn");

// Get OpenWeather data
function getFiveDayWeatherData(lat, lon) {
  const fiveDayWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=${units}`;

  fetch(fiveDayWeatherURL)
    .then((response) => {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then((data) => {
      const forecasts = data.list;
      const dailyForecasts = [];

      forecasts.forEach((forecast) => {
        const dateText = forecast.dt_txt;
        const temp = forecast.main.temp;
        const wind = forecast.wind.speed;
        const humidity = forecast.main.humidity;

        // parse the date to reformat it
        const dateTime = new Date(dateText);
        const formattedDate = `${(dateTime.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${dateTime
          .getDate()
          .toString()
          .padStart(2, "0")}-${dateTime.getFullYear()}`;

        // create an object with the forecast data
        const forecastObj = {
          dateTime: dateTime,
          formattedDate: formattedDate,
          temp: temp,
          wind: wind,
          humidity: humidity,
        };

        // add this forecast object to the array
        dailyForecasts.push(forecastObj);
      });

      console.log(dailyForecasts);
    });
}

function getCurrentWeatherData(lat, lon) {
  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=${units}`;

  fetch(currentWeatherURL)
    .then((response) => {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        temp = data["main"].temp;
        wind = data["wind"].speed;
        humidity = data["main"].humidity;
        city = data.name;
        // render to UI
        renderCurrentWeather();
      }
    });
}

// convert city name to lat and lon
function getCoordinatesFromCitySearchInput() {
  citySearchInput = citySearch.value;

  if (citySearchInput) {
    const geocodingURL = `http://api.openweathermap.org/geo/1.0/direct?q=${citySearchInput}&appid=${weatherApiKey}`;

    // pass city name to geocoordinates api
    fetch(geocodingURL)
      .then((response) => {
        if (!response.ok) {
          throw response.json();
        }
        return response.json();
      })
      .then((data) => {
        if (data && data[0].lat && data[0].lon) {
          lat = data[0].lat;
          lon = data[0].lon;
          // getCurrentWeatherData(lat, lon);
          getFiveDayWeatherData(lat, lon);
        } else {
          console.log("No city name found in the response");
        }
      });
  } else {
    console.log("Search field is empty");
  }
}

// render weather data to UI
function renderCurrentWeather() {
  let currentCityEl = document.getElementById("current-city");
  let currentTempEl = document.getElementById("current-temp");
  let currentWindEl = document.getElementById("current-wind");
  let currentHumidityEl = document.getElementById("current-humidity");

  currentCityEl.innerHTML = `${city}`;
  currentTempEl.innerHTML = `Temperature: ${temp}°F`;
  currentWindEl.innerHTML = `Wind Speed: ${wind} MPH`;
  currentHumidityEl.innerHTML = `Humidity: ${humidity}%`;
}

function renderFiveDayWeather() {
  let day1El = document.getElementById("day-1");
  let tempDay1El = document.getElementById("temp-day-1");
  let windDay1El = document.getElementById("wind-day-1");
  let humidityDay1El = document.getElementById("humidity-day-1");
}

// event listeners
searchBtn.addEventListener("click", getCoordinatesFromCitySearchInput);
citySearch.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    getCoordinatesFromCitySearchInput();
  }
});

// navbar scrolling
// window.addEventListener("scroll", () => {
//   const navbar = document.getElementById("navbar");

//   if (lastScrollY < window.scrollY) {
//     // scrolling down
//     navbar.style.top = "-60px";
//   } else {
//     // scrolling up
//     navbar.style.top = "0";
//   }

//   lastScrollY = window.scrollY;
// });

// sidebar swiping
function checkSwipeDirection() {
  // determine the swipe direction
  if (touchEndX < touchStartX && Math.abs(touchStartX - touchEndX) > 50) {
    // swipe left - close the sidebar
    closeSidebar();
  }
  if (
    touchEndX > touchStartX &&
    touchStartX < 50 &&
    Math.abs(touchStartX - touchEndX > 50)
  ) {
    // swipe right - open the sidebar
    openSidebar();
  }
}

function openSidebar() {
  document.getElementById("sidebar").style.width = "50vw";
}

function closeSidebar() {
  document.getElementById("sidebar").style.width = "0";
}

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  checkSwipeDirection();
});

function toggleSidebar() {
  if (sidebar.style.width === "50vw") {
    closeSidebar();
  } else {
    openSidebar();
  }
}
