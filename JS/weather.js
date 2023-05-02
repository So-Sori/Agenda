let weatherBtn = document.querySelector(".bxs-sun");
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
        console.log(data);
        createCardCurrentTime(data);
    })
}

function fetchDataFiveDays(position){
    let {latitude,longitude} = position.coords
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
        for (let i = 0; i <= data.list.length; i+=8) {
            let date = new Date(data.list[i].dt_txt);
            let weekday = date.getDay();
            // console.log(weekDay[weekday]);
        }
    })
    .catch(error => console.log(error))
}

function weatherLocal() {
    navigator.geolocation.getCurrentPosition(fetchData);
    navigator.geolocation.getCurrentPosition(fetchDataFiveDays);
}

function createCardCurrentTime(weather) {
    let currentDay = new Date();
    let weekday = currentDay.getDay();
    let completeDate = `${weekDay[weekday]} ${currentDay.getDate()}• ${currentDay.getMonth()} •${currentDay.getFullYear()}`;
    day.textContent = completeDate;

    ubication.textContent = weather.name
    
    weatherImg.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Weather-overcast.svg/1024px-Weather-overcast.svg.png" //Imagen de prueba

    weatherTime.textContent = weather.weather[0].main;

    temp.innerHTML = `Temperature <br>${Math.floor(weather.main.temp)}`;
    humd.innerHTML = `Humidity <br>${weather.main.humidity}`;
    wind.innerHTML = `Wind <br>${Math.floor(weather.wind.speed)}`;
}

export {weatherLocal}