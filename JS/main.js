import { weatherLocal } from "./weather.js";

let ul = document.querySelector('.task-list');
let title = document.getElementById("title");
let content = document.getElementById("content");
let gretting = document.querySelector(".gretting");
let sendBtn = document.getElementById("send-btn");
let empty = document.getElementById("empty");
let formTasks = document.getElementById("form-tasks");
let tasks = JSON.parse(localStorage.getItem("listTask"));
let listTask = [];

if (tasks !== null) {
    getStorageTask();
    empty.style.display = "none";
}

// Saludo de bienvenida
let time = new Date();
let now = time.getHours();
if (now < 12) {
  gretting.textContent = `Good Morning!`;
} else if (now < 18) {
  gretting.textContent = `Good Afternoon!`;
} else {
  gretting.textContent = `Good Evening!`;
}

sendBtn.addEventListener("click",event => {
  event.preventDefault();
  let task = document.createElement
  ("li");
  task.classList.add("task");

  if(title.value !== ''){
    task.innerHTML = `
    <div class="text-task">
      <h2>${title.value}</h2>
      <p>${content.value}</p>
  </div>
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
          let taskTitle = item.children[0].childNodes[1].innerHTML
          if (taskTitle === tasks[i].title) {
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
      <div class="text-task">
        <h2>${taskValue.title}</h2>
        <p>${taskValue.content}</p>
      </div>
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
  formTasks.classList.add("visible")
});
closeBtn.addEventListener("click",()=>{
  formTasks.classList.remove("visible");
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