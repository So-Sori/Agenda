import { funcionInit } from "./weather.js";
import { succesTask, errorTask,weatherAlert} from "./cleanform-alertas.js";
import { formEvents } from "./functions.js"

let ul = document.querySelector('.task-list');
let title = document.getElementById("title");
let content = document.getElementById("content");
let sendBtn = document.getElementById("send-btn");
let empty = document.getElementById("empty");
let formTasks = document.getElementById("form-tasks");
let tasks = JSON.parse(localStorage.getItem("listTask"));
let listTask = [];

if (tasks !== null && tasks.length > 0) {
  getStorageTask();
  empty.style.display = "none";
}
sendBtn.addEventListener("click",event => {
  event.preventDefault();
  createTask();
})
function createTask() {
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
    setListTask();
    empty.style.display = 'none';
    succesTask();
  }else{
    errorTask();
  }
}
function deleteBtn(){
    let iconTrash = document.createElement('i');
    iconTrash.classList.add("bx");
    iconTrash.classList.add("bxs-trash-alt");

    iconTrash.addEventListener('click',(e) => {
        const item = e.target.parentElement;
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
              ul.removeChild(item);
      
              let tasks = JSON.parse(localStorage.getItem("listTask"));
              let taskTitle = item.children[0].childNodes[1].innerHTML
              
              // Delete elements from storage
              for (let i = 0; i < tasks.length; i++) {
                if (taskTitle === tasks[i].title) {
                    tasks.splice(i,1);
                    localStorage.setItem("listTask",JSON.stringify(tasks));
                  }
              }
              // Delete elements from principal array
              for (let e = 0; e < listTask.length; e++) {
                if (listTask[e].title === taskTitle) {
                  listTask.splice(e,1);
                } 
              }
      
              const items = ul.childElementCount;
              if(items === 0){
                empty.style.display = 'block';
                localStorage.clear();
                listTask = [];
                tasks = [];
            }
          }
        })
    })
    return iconTrash;
}
function setListTask() {
  let tasks = JSON.parse(localStorage.getItem("listTask"));

  let taskObj = {
    title : title.value,
    content : content.value
  }
  listTask.push(taskObj);
  if (tasks === null) {
    tasks = [];
  }
  let newList;
  newList = removeDuplicates(listTask,tasks,newList);
  localStorage.setItem("listTask",JSON.stringify(newList));

  title.value = '';
  content.value= '';
}
function getStorageTask(){
  let tasks = JSON.parse(localStorage.getItem("listTask"));

  if (tasks !== null && tasks.length > 0) {
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

let addBtn = document.querySelector(".bxs-plus-circle");
let closeBtn = document.querySelector(".bxs-x-circle");

addBtn.addEventListener("click",()=>{
  formTasks.classList.add("visible")
});
closeBtn.addEventListener("click",()=>{
  formTasks.classList.remove("visible");
  formEvents.classList.remove("visible");
});

let home = document.querySelector(".bxs-star");
let calendar = document.querySelector(".bxs-calendar");
let weather = document.querySelector(".bxs-cloud-rain");

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
  weatherAlert();
  funcionInit();
})

function removeDuplicates(arr1,arr2,newList){
  newList = arr1.concat(arr2)
  for(let i= 0; i < newList.length; ++i) {
      for(let j= i+1; j <newList.length; ++j) {
          if(newList[i].title === newList[j].title) {
              newList.splice(j, 1);
          }
      }
  }
  return newList;
}