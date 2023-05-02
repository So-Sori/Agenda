import { weatherLocal } from "./weather.js";

let ul = document.querySelector('.task-list');
let title = document.getElementById("title");
let content = document.getElementById("content");
let guests = document.getElementById("guests");
let gretting = document.querySelector(".gretting");

// Saludo de bienvenida
let time = new Date();
let now = time.toLocaleTimeString();
if (now < '12:00:00 p.m.') {
  gretting.textContent = `Good Morning 👋🏽`;
}
else if(now <= '6:00:00 p.m.'){
  gretting.textContent = `Good Afternoon👋🏽`;
}
else if(now >= '6:00:00 p.m.'){
  gretting.textContent = `Good Evening 👋🏽`;
}
else {
  gretting.textContent = `Hi, welcome 👋🏽`;
}

function creatorTasks(event) {
  event.preventDefault();

  if(title.value !== ''){

    let li = document.createElement('li');
    li.classList.add("task");
    let h2Title = document.createElement('h2');
    let pContent = document.createElement('p');
    let pGuests = document.createElement('div');

    h2Title.textContent = title.value;
    pContent.textContent = content.value;
    pGuests.textContent = guests.value;

    let iconEdit = document.createElement('i');
    iconEdit.classList.add("bxs-edit-alt");
    
    let iconCheck = document.createElement('i');
    iconCheck.classList.add("bxs-check-circle");

    li.appendChild(h2Title);
    li.appendChild(pContent);
    li.appendChild(pGuests);
    li.appendChild(DeleteBtn());
    ul.appendChild(li);

    title.value = '';
    content.value= '';
    guests.value= '';
  }
}
function DeleteBtn(){
    let iconTrash = document.createElement('i');
    iconTrash.classList.add("bx");
    iconTrash.classList.add("bxs-trash-alt");

    iconTrash.addEventListener('click',(e) => {
        const item = e.target.parentElement;
        ul.removeChild(item)       
    })

    return iconTrash;
    
}
// TASK INTERACTIVIDAD
let addBtn = document.querySelector(".bxs-plus-circle");
let sendBtn = document.getElementById("send-btn");
let closeBtn = document.querySelector(".bxs-x-circle");

addBtn.addEventListener("click",()=>{
  let formTasks = document.getElementById("form-tasks");
  formTasks.style.display = "block";
});

closeBtn.addEventListener("click",()=>{
  let formTasks = document.getElementById("form-tasks");
  formTasks.style.display = "none";
});
// MENU PAGINACION
let home = document.querySelector(".bxs-star");
let calendar = document.querySelector(".bxs-calendar");
let weather = document.querySelector(".bxs-sun");
let bell = document.querySelector(".bxs-bell");

let sectionTask = document.getElementById("task");
let sectionSchedule = document.getElementById("scheduler");
let sectionWeather = document.getElementById("weather");

home.addEventListener("click",()=>{
  sectionTask.style.display = "block";
  sectionSchedule.style.display = "none";
  sectionWeather.style.display = "none";
})
calendar.addEventListener("click",()=>{
    sectionSchedule.style.display = "block";
    sectionTask.style.display = "none";
    sectionWeather.style.display = "none";
})
weather.addEventListener("click",()=>{
  sectionSchedule.style.display = "none";
  sectionTask.style.display = "none";
  sectionWeather.style.display = "block";

  weatherLocal()
})
bell.addEventListener("click",()=>{
})