let day = document.getElementById("week-day");
let ubication = document.getElementById("ubication");
let weatherImg = document.getElementById("weather-img");
let weatherTime = document.getElementById("weather-time");
let weatherTimeDescription = document.getElementById("weather-time-description");
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
let weekDayShort = {
    0:'Sun',
    1:'Mon',
    2:'Tue',
    3:'Wed',
    4:'Thu',
    5:'Fri',
    6:'Sat'
}

const API_KEY = '0c0aa0cf08565fbbc8a4718514cd7b0d';
let currentWeatherInfo = document.querySelector(".current-weather-info");
let fiveDaysWeather = document.querySelector(".five-days-weather");
let emptyWeather = document.getElementById("empty-weather");

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
function createCardCurrentTime(weather) {
    let currentDay = new Date();
    let weekday = currentDay.getDay();
    let completeDate = `${weekDay[weekday]} ${currentDay.getDate()} • ${currentDay.getMonth()+1} • ${currentDay.getFullYear()}`;
    day.textContent = completeDate;

    ubication.textContent = weather.name
    
    weatherImg.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;

    weatherTime.textContent = weather.weather[0].main;
    weatherTimeDescription.textContent = weather.weather[0].description;

    temp.innerHTML = `<h4>Temp</h4><p>${Math.round(weather.main.temp)}°C</p>`;
    humd.innerHTML = `<h4>Humd</h4><p>${weather.main.humidity}%</p>`;
    wind.innerHTML = `<h4>Pre</h4><p>${weather.main.pressure}hPa</p>`;
}
function createFiveDaysWeather(weather) {
    let lis = document.querySelectorAll(".card-far-weather");
    let count = 0;

    for (let i = 0; i <= weather.list.length; i+=8) {
        let date = new Date(weather.list[i].dt_txt);
        let weekday = date.getDay();
        
        lis[count].innerHTML = `
            <h2>${weekDayShort[weekday]}</h2>
            <p>${Math.round(weather.list[i].main.temp)}°C</p>
            <img src="https://openweathermap.org/img/wn/${weather.list[i].weather[0].icon}@4x.png" alt="weather ${weather.list[i].weather[0].main}">
            <p class="weather-time">${weather.list[i].weather[0].main}</p>
            `;
        count++;
    }
}
export function funcionInit() {
	if (!"geolocation" in navigator) {
		return emptyWeather.innerHTML = "Your browser does not support location access. try another";
	}

	const onUbicacionConcedida = () => {
        weatherLocal();
        currentWeatherInfo.style.display =  "block";
        fiveDaysWeather.style.display =  "block";
        emptyWeather.style.display =  "none";
	}
  
	const onErrorDeUbicacion = err => {
        emptyWeather.innerHTML = err.message;
        currentWeatherInfo.style.display =  "none";
        fiveDaysWeather.style.display =  "none";
	}

	const opcionesDeSolicitud = {
		enableHighAccuracy: true, // Alta precisión
        maximumAge: 0 // No queremos caché
	};
	// Solicitar
	navigator.geolocation.getCurrentPosition(onUbicacionConcedida, onErrorDeUbicacion, opcionesDeSolicitud);

};
function weatherLocal() {
    navigator.geolocation.getCurrentPosition(fetchData);
    navigator.geolocation.getCurrentPosition(fetchDataFiveDays);
}
