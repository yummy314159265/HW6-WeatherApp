const featuredEl = $('.featured');
const searchButtonEl = $('#search-button');
const searchInputEl = $('#search-input');
const searchFormEl = $('#search-form');
const cityEl = $('#city');
const todayEl = $('#today');
const currentWeatherIconEl = $('#current-weather-icon');
const currentListEl = $('#current-list');

const owmAPIkey = 'dbe24698f6616dc80eac2c93d188b265';
const exclude = 'minutely,hourly';
const units = 'imperial';
const cards = [];

for (let i=0; i < 5; i++){
    let card = {
        icon: `icon-${i}`,
        card: `card-${i}`,
        day: `day-${i}`,
        list: `list-${i}`,
        temp: `temp-${i}`,
        wind: `wind-${i}`,
        humidity: `humidity-${i}`,
    }

    cards.push(card);
}

//On page load

const displayCityName = (name) => {
    cityEl.text(name);
}

const displayCurrentDate = () => {
    const today = moment().format('MMMM Do, YYYY');
    todayEl.text(today);
}

const displayCurrentWeatherIcon = (weather) => {
    const currentWeather = `wi-owm-${weather}`
    currentWeatherIconEl.addClass(currentWeather);
    console.log(currentWeatherIconEl.html())
}

const createCurrentTempLiEl = (temp) => $(`<li id=current-temp>Temp: ${temp}&deg F</li>`);

const createCurrentWindLiEl = (wind_speed) => $(`<li id=current-wind>Wind: ${wind_speed} mph</li>`)

const createCurrentHumidityLiEl = (humidity) => $(`<li id=current-humidity>Humidity: ${humidity}%</li>`)

const createCurrentUviLiEl = (uvi) => $(`<li id=current-uvi>UVI: ${uvi}</li>`)

const displayCurrentWeather = (weather) => {
    currentListEl.empty();
    currentListEl.append(createCurrentTempLiEl(weather.temp));
    currentListEl.append(createCurrentWindLiEl(weather.wind_speed));
    currentListEl.append(createCurrentHumidityLiEl(weather.humidity));
    currentListEl.append(createCurrentUviLiEl(weather.uvi));
}

const getDailyWeatherIcons = (dailies) => {
    const weatherArray = [];

    for (let i = 0; i < 5; i++) {
        let weather = dailies[i].weather[0].id;
        weatherArray.push(weather);
    }

    return weatherArray;
}

const displayDailyWeatherIcons = (dailies) => {
    const fiveDayForecast = getDailyWeatherIcons(dailies);

    for (let i = 0; i < cards.length; i++) {
        let cardWeatherEl = $(`#${cards[i].icon}`);
        cardWeatherEl.addClass(`wi-owm-${fiveDayForecast[i]}`)
    }
}

const getDailyDates = () => {
    const dayArray = [];

    for (let i = 1; i < 6; i++) {
        let day = moment().add(i, 'days').format('L');
        dayArray.push(day);
    }

    return dayArray;
}

const displayDailyDate = () => {
    const dailies = getDailyDates();
    for (let i = 0; i < cards.length; i++) {
        let cardDateEl = $(`#${cards[i].day}`);
        cardDateEl.text(dailies[i]);
    }
}

const getDailyTemp = (dailies) => {
    const tempArray = [];

    for (let i = 0; i < 5; i++) {
        let temp = dailies[i].temp.max;
        tempArray.push(temp);
    }

    return tempArray;
}

const displayDailyTemp = (dailies) => {
    const dailyTemps = getDailyTemp(dailies);

    for (let i = 0; i < cards.length; i++) {
        let cardTempEl = $(`#${cards[i].temp}`);
        cardTempEl.html(`Temp: ${dailyTemps[i]}&deg F`);
    }
}

const getDailyWinds = (dailies) => {
    const windArray = [];

    for (let i = 0; i < 5; i++) {
        let wind = dailies[i].wind_speed;
        windArray.push(wind);
    }

    return windArray;
}

const displayDailyWind = (dailies) => {
    const dailyWinds = getDailyWinds(dailies);

    for (let i = 0; i < cards.length; i++) {
        let cardWindEl = $(`#${cards[i].wind}`);
        cardWindEl.text(`Wind: ${dailyWinds[i]} mph`);
    }
}

const getDailyHumidity = (dailies) => {
    const humidityArray = [];

    for (let i = 0; i < 5; i++) {
        let humidity = dailies[i].humidity;
        humidityArray.push(humidity);
    }

    return humidityArray;
}

const displayDailyHumidity = (dailies) => {
    const dailyHumidities = getDailyHumidity(dailies);

    for (let i = 0; i < cards.length; i++) {
        let cardHumidityEl = $(`#${cards[i].humidity}`);
        cardHumidityEl.text(`Humidity: ${dailyHumidities[i]}%`);
    }
}

const getCityName = (loc) => {
    const weatherQueryURL = `https://api.openweathermap.org/data/2.5/weather?${loc}&appid=${owmAPIkey}`;
    
    fetch(weatherQueryURL)
        .then((response) => {
            if (response.ok) {
                response.json().
                    then((data) => {
                        displayCityName(data.name);
                    });
            } else {
                alert("Couldn't find location - " + response.statusText);
            }
        })
        .catch((error) => {
            alert('Unable to connect to OpenWeatherMaps - ' + error.statusText);
        });
}

const getApiData = (location) => {


    const queryURL = `https://api.openweathermap.org/data/2.5/onecall?${location}&units=${units}&exclude=${exclude}&appid=${owmAPIkey}`;
        
    fetch(queryURL)
        .then((response) => {
            if (response.ok) {
                response.json().
                    then((data) => {
                        getCityName(location);
                        displayCurrentWeatherIcon(data.current.weather[0].id);
                        displayCurrentWeather(data.current);
                        displayDailyWeatherIcons(data.daily);
                        displayDailyTemp(data.daily);
                        displayDailyWind(data.daily);
                        displayDailyHumidity(data.daily);
                    });
            } else {
                alert("Couldn't find location - " + response.statusText);
            }
        })
        .catch((error) => {
            alert('Unable to connect to OpenWeatherMaps - ' + error.statusText);
        });
}


const getLocSuccess = (pos) => {
    let locationURL = `lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`;
    getApiData(locationURL);
}

const getLocError = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

const getLocationByPos = () => {
    return new Promise(() => {
        navigator.geolocation.getCurrentPosition(getLocSuccess,getLocError);
    });
}

const init = () => {
    displayCurrentDate();
    displayDailyDate();
    getLocationByPos();
}
// On search

const getLocationByFeatured = (event) => {
    event.preventDefault();
    //TODO: state codes, country codes
    target = $(event.target);
    const city = target.text();
    const weatherQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${owmAPIkey}`;

    fetch(weatherQueryURL)
        .then((response) => {
            if(response.ok) {
                response.json()
                    .then((data) => {
                        let locationURL = `lat=${data.coord.lat}&lon=${data.coord.lon}`
                        getApiData(locationURL);
                    })
            } else {
                alert("Couldn't find location - " + response.statusText);
            }
        })
        .catch((error) => {
            alert('Unable to connect to OpenWeatherMaps - ' + error.statusText);
        });
}

const getLocationByCity = (event) => {
    event.preventDefault();
    //TODO: state codes, country codes
    const city = searchInputEl.val()
    const weatherQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${owmAPIkey}`;

    fetch(weatherQueryURL)
        .then((response) => {
            if(response.ok) {
                response.json()
                    .then((data) => {
                        let locationURL = `lat=${data.coord.lat}&lon=${data.coord.lon}`
                        getApiData(locationURL);
                    })
            } else {
                alert("Couldn't find location - " + response.statusText);
            }
        })
        .catch((error) => {
            alert('Unable to connect to OpenWeatherMaps - ' + error.statusText);
        });
}

searchButtonEl.on('click', getLocationByCity);
searchInputEl.on('submit', getLocationByCity);
featuredEl.on('click', getLocationByFeatured);

init();