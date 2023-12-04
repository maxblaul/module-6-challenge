// Selecting HTML elements
const searchInputEl = document.querySelector("#city-input");
const submit = document.querySelector("#submit-btn");
const recentSearchesEl = document.querySelector(".recent-searches");
const resultsContainerEl = document.querySelector("#display-result");
const loadingEl = document.querySelector("#loading-icon");
const loading2El = document.querySelector("#loading-icon2");
const fiveDayEl = document.querySelector("#five-day-forecast");
const savedCityEl = localStorage.getItem("savedCity");

// Check if there's a saved city and display it in the list
if (savedCityEl) {
    addCityToList(savedCityEl);
} else {
    recentSearchesEl.innerHTML = "No city saved.";
}

// Function to add a city to the saved results list
function addCityToList(cityName) {
    const listItem = document.createElement("li");
    listItem.textContent = cityName;

    listItem.addEventListener("click", function () {
        searchInputEl.value = cityName;
        getApi();
    });

    recentSearchesEl.appendChild(listItem); // Fix: Use recentSearchesEl
}

// Set initial styles for loading indicators
loadingEl.style.display = 'none';
loading2El.style.display = 'none';

// Function to make API request
function getApi() {
    const searchQuery = searchInputEl.value;
    loadingEl.style.display = "flex";
    loading2El.style.display = "flex";
    if (searchQuery) {
        const url = "https://yahoo-weather5.p.rapidapi.com/weather?location=" +
            searchQuery +
            "&format=json&u=f";
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '88a1b72b19msh8091aab677a57dep1e91dbjsn3289b32a400e',
                'X-RapidAPI-Host': 'yahoo-weather5.p.rapidapi.com'
            }
        };
        fetch(url, options)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    alert("response did not work");
                }
            })
            .then(function (data) {
                // Hide loading indicators and display results
                loadingEl.style.display = "none";
                loading2El.style.display = "none";
                displayResults(data);
                displayForecast(data);
                console.log(data);
            });
    }
}

// Function to display current weather results
const displayResults = function (data) {
    resultsContainerEl.innerHTML = "";

    const cityEl = data.location.city;
    const tempEl = data.current_observation.condition.temperature;
    const humidityEl = data.current_observation.atmosphere.humidity;
    const windEl = data.current_observation.wind.speed;

    // Create elements for displaying weather information
    const displayEl = document.createElement("strong");
    const displayTempEl = document.createElement("h2");
    const displayhumidityEl = document.createElement("h2");
    const displayWindEl = document.createElement("h2");
    const dateEl = document.createElement("h3");

    // Set content for each weather information element
    displayEl.textContent = cityEl;
    displayTempEl.textContent = "Temperature: " + tempEl + "°F";
    displayhumidityEl.textContent = "Humidity: " + humidityEl + "%";
    displayWindEl.textContent = "Wind: " + windEl + " MPH";

    // Get the current date and format it
    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
    }).format(today);

    // Set content and styles for the date element
    dateEl.textContent = formattedDate;
    dateEl.style.fontSize = "20px";
    dateEl.style.fontWeight = "bold";

    // Set styles for other display elements
    displayEl.style.fontSize = "50px";
    displayEl.style.fontWeight = "bold";
    displayEl.style.paddingBottom = "20px";

    displayTempEl.style.fontSize = "25px";
    displayhumidityEl.style.fontSize = "25px";
    displayWindEl.style.fontSize = "25px";

    // Append display elements to the results container
    resultsContainerEl.appendChild(displayEl);
    resultsContainerEl.appendChild(dateEl);
    resultsContainerEl.appendChild(displayTempEl);
    resultsContainerEl.appendChild(displayhumidityEl);
    resultsContainerEl.appendChild(displayWindEl);

    // Save the city to local storage
    localStorage.setItem("savedCity", cityEl);
    console.log(resultsContainerEl);
};

// Function to display 5-day forecast
const displayForecast = function (data) {
    fiveDayEl.innerHTML = "";

    // Iterate over the forecast data and create list items
    for (let i = 0; i < 5 && i < data.forecasts.length; i++) {
        const forecast = data.forecasts[i];

        const listForecastItem = document.createElement("li");
        listForecastItem.innerHTML = `${forecast.day}<br>High: ${forecast.high}°F<br>Low: ${forecast.low}°F<br>${forecast.text}`;

        // Append forecast item to the 5-day forecast container
        fiveDayEl.appendChild(listForecastItem);
    }
    console.log(fiveDayEl);
};
