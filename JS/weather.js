let day= document.getElementById("week-day");
let ubication= document.getElementById("ubication");
let weatherImg= document.getElementById("weather-img");
let weatherTime= document.getElementById("weather-time");
let temp= document.getElementById("temp");
let humd= document.getElementById("humd");
let wind= document.getElementById("wind");

let weekDay = {
    0:'Sunday',
    1:'Monday',
    2:'Tuesday',
    3:'Wednesday',
    4:'Thursday',
    5:'Friday',
    6:'Saturday'
}

const API_KEY = '0c0aa0cf08565fbbc8a4718514cd7b0d';
function fetchData(position){
    let {latitude,longitude} = position.coords
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
        createCardCurrentTime(data);
    })
}

function fetchDataFiveDays(position){
    let {latitude,longitude} = position.coords
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
        createFiveDaysWeather(data);
    })
    .catch(error => error);
}

function weatherLocal() {
    navigator.geolocation.getCurrentPosition(fetchData);
    navigator.geolocation.getCurrentPosition(fetchDataFiveDays);
}

function createCardCurrentTime(weather) {
    let currentDay = new Date();
    let weekday = currentDay.getDay();
    let completeDate = `${weekDay[weekday]} ${currentDay.getDate()} • ${currentDay.getMonth()} • ${currentDay.getFullYear()}`;
    day.textContent = completeDate;

    ubication.textContent = weather.name
    
    weatherImg.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;

    weatherTime.textContent = weather.weather[0].main;

    temp.innerHTML = `Temperature <br>${Math.round(weather.main.temp)}<span>°C</span>`;
    humd.innerHTML = `Humidity <br>${weather.main.humidity}%`;
    wind.innerHTML = `Wind <br>${Math.round(weather.wind.speed)}M/S`;
}
function createFiveDaysWeather(weather) {
    let lis = document.querySelectorAll(".card-far-weather");
    let count = 0;

    for (let i = 0; i <= weather.list.length; i+=8) {
        let date = new Date(weather.list[i].dt_txt);
        let weekday = date.getDay();
        
        lis[count].innerHTML = `
            <h2>${weekDay[weekday]}</h2>
            <p>${Math.round(weather.list[i].main.temp)}°C</p>
            <img src="https://openweathermap.org/img/wn/${weather.list[i].weather[0].icon}@4x.png" alt="weather ${weather.list[i].weather[0].main}">
            <p>${weather.list[i].weather[0].main}</p>
            `;
        count++;
    }
}

export {weatherLocal}