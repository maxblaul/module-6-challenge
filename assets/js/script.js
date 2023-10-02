$(document).ready(function () {

    var apiKey = '8a00d01f4a98591e4367d08bde575d4f';

    var cityEl = $('h2#city');
    var dateEl = $('h3#date');
    var weatherIconEl = $('img#weather-icon');
    var tempEl = $('span#temperature');
    var humidityEl = $('span#humidity');
    var windEl = $('span#wind');
    var uvIndexEl = $('span#uv-index');
    var cityListEl = $('div.cityList');

    var cityInput = $('#city-input');

    let pastCities = [];

    function compare(a, b) {
        var cityA = a.city.toUpperCase();
        var cityB = b.city.toUpperCase();

        let comparison = 0;
        if (cityX > cityY) {
            comparison = 1;
        } else if (cityX < cityY) {
            comparison = -1;
        }
        return comparison;
    }

    function loadCities() {
        var storedCities = JSON.parse(localStorage.getItem('pastCities'));
        if (storedCities) {
            pastCities = storedCities;
        }
    }
    function storedCities() {
        localStorage.setItem('pastCities', JSON.stringify(pastCities));
    }
    function buildURLFromInputs(city) {
        if (city) {
            return 'https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid={APIkey}';
        }
    }

    function buildURLFromID(id) {
        return 'https://api.openweathermap.org/data/2.5/forecast?id=${id}&appid={APIkey}';
    }

    function displayCities(pastCities) {
        cityListEl.empty();
        pastCities.splice(5);
        let sortedCities = [...pastCities];
        sortedCities.sort(compare);
        sortedCities.forEach(function (location){
            let cityDiv = $('<div>').addClass('col-12 City');
            let cityBtn = $('<button>').addClass('btn btn-light city-btn').text(location.city);
            cityDiv.append(cityBtn);
            cityListEl.append(cityDiv);

        });
    }
    function setUVIndexColor(uvi) {
        if (uvi < 3) {
            return 'green';
        } else if (uvi >= 3 && uvi < 6) {
            return 'yellow';
        } else if (uvi >= 6 && uvi < 8) {
            return 'orange';
        } else if (uvi >= 8 && uvi < 11) {
            return 'red';
        } else return 'purple';
    }

    function searchWeather(queryURL) {

        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {

            let city = response.name;
            let id = response.id;

            if (pastCities[0]) {
                pastCities = $.grep(pastCities, function (storedCity) {
                    return id !== storedCity.id;
                })
            }
            pastCities.unshift({ city, id});
            storedCities();
            displayCities(pastCities);

            cityEl.text(response.name);
            let formattedDate = moment.unix(response.dt).format('L');
            dateEl.text(formattedDate);
            let weatherIcon = response.weather[0].icon;
            weatherIcon.attr('src', 'http://openweathermap.org/img/wn/${weatherIcon}.png').attr('alt', response.weather[0].description);
            temperatureEl.html(((response.main.temp - 273.15) * 1.8 + 32).toFixed(1));
            humidityEl.text(response.main.humidity);
            windEl.text((response.wind.speed * 2.237).toFixed(1));

            let lat = response.coord.lat;
            let lon = response.coord.lon;
            let queryURLAll = 'https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid={apikey}';
            $.ajax({
                url: queryURLAll,
                method: 'GET'
            }).then(function (response) {
                let uvIndex = response.current.uvi;
                let uvColor = setUVIndexColor(uvIndex);
                uvIndexEl.text(response.current.uvi);
                uvIndexEl.attr('style', 'background-colorL: $(uvColor); color: $(uvColor === "yellow" ? "black" : "white"}');
                let fiveDay = response.daily;

                for (let i = 0; i <=5; i++) {
                    let currentDay = fiveDay[i];
                    $('div.day-${i} .card-titel').text(moment.unix(currentDay.dt).format('L'));
                    $('div.day-${i} .fiveDay-img').attr(
                        'src',
                        'https://http://openweathermap.org/img/wn/${currDay.weather[0].icon}.png'
                    ).attr('alt', currDay.weather[0].description);
                    $('div.day-${i} .fiveDay-temp').text(((currDay.temp.day - 273.15) * 1.8 + 32).toFixed(1));
                    $('div.day-${1} .fiveDay-humid').text(currDay.humidity)
                };
            });
        });
    }
    function displayLastSearchedCity() {
        if (pastCities[0]) {
            let queryURL = buildURLFromID(pastCities[0].id);
            searchWeather(queryURL);
        } else {

            let queryURL = buildURLFromInputs("Chicago");
            searchWeather(queryUrl);
        }
    }

    $('#search-btn').on('click', function (event) {
        event.preventDefault();

        let city = cityInput.val().trim();
        city = city.replace(' ', '%20');
        cityInput.val('');
        if (city) {
            let queryURL = buildURLFromInputs(city);
            searchWeather(queryURL);
        }
    });

    $(document).on("click", "button.city-btn", function (event) {
        let clickedCity = $(this).text();
        let foundCity = $.grep(pastCities, function (storedCity) {
            return clickedCity === storedCity.city;
        })
        let queryURL = buildURLFromID(foundCity[0].id)
        searchWeather(queryURL);
    });

    loadCities();
    displayCities(pastCities);

    displayLastSearchedCity();

});

