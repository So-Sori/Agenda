import { weatherLocal } from "./weather.js";

let ul = document.querySelector('.task-list');
let title = document.getElementById("title");
let content = document.getElementById("content");
let gretting = document.querySelector(".gretting");
let sendBtn = document.getElementById("send-btn");
let empty = document.getElementById("empty");
let listTask = [];

getStorageTask();

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

sendBtn.addEventListener("click",event => {
  event.preventDefault();
  let task = document.createElement
  ("li");
  task.classList.add("task");

  if(title.value !== ''){
    task.innerHTML = `
      <h2>${title.value}</h2>
      <p>${content.value}</p>
    `;    
    task.appendChild(deleteBtn())
    ul.appendChild(task);

    let taskObj = {
      title : title.value,
      content : content.value
    }
    listTask.push(taskObj);
    localStorage.setItem("listTask",JSON.stringify(listTask));

    title.value = '';
    content.value= '';
    empty.style.display = 'none';
  }
})
function deleteBtn(){
    let iconTrash = document.createElement('i');
    iconTrash.classList.add("bx");
    iconTrash.classList.add("bxs-trash-alt");

    iconTrash.addEventListener('click',(e) => {
        const item = e.target.parentElement;
        ul.removeChild(item);

        let tasks = JSON.parse(localStorage.getItem("listTask"));
        // Eliminar elementos del storage
        for (let i = 0; i < tasks.length; i++) {
          let taskValue = item.children[0].innerHTML
          if (taskValue === tasks[i].title) {
              tasks.splice(i,1);
              localStorage.setItem("listTask",JSON.stringify(tasks));
          }
        }

        const items = ul.childElementCount;
        if(items === 0){
          empty.style.display = 'block';
          localStorage.clear();
      }
    })
    return iconTrash;
}
function getStorageTask(){
  let tasks = JSON.parse(localStorage.getItem("listTask"));

  if (tasks !== null) {
    tasks.forEach(taskValue => {
      localStorage.getItem(taskValue);

      let task = document.createElement
      ("li");
      task.classList.add("task");
      task.innerHTML = `
        <h2>${taskValue.title}</h2>
        <p>${taskValue.content}</p>
      `;    
      task.appendChild(deleteBtn())
      ul.appendChild(task)
    });
  }
}
// TASK INTERACTIVIDAD
let addBtn = document.querySelector(".bxs-plus-circle");
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