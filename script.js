const sidebar = document.getElementById("sidebar");
let touchStartX = 0;
let touchEndX = 0;
let lastScrollY = window.scrollY;
const weatherApiKey = "55e089ff3707c1a7d257809d2f463710";
let lat;
let lon;
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
      if (data) {
        // render to UI
        console.log("5 day weather:", data);
      }
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
        // render to UI
        console.log("current weather:", data);
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
          getCurrentWeatherData(lat, lon);
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

searchBtn.addEventListener("click", getCoordinatesFromCitySearchInput);

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
