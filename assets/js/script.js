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
            return 'https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid={API key}';
        }
    }

    function buildURLFromID(id) {
        return 'https://api.openweathermap.org/data/2.5/forecast?id=${id}&appid={API key}';
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
})

