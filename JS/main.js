
let ul = document.querySelector('.task-list');
let title = document.getElementById("title");
let content = document.getElementById("content");
let guests = document.getElementById("guests");


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

let addBtn = document.querySelector(".bxs-plus-circle");
let sendBtn = document.getElementById("send-btn");
let closeBtn = document.querySelector(".bxs-x-circle");
let checkBtn = document.querySelector(".bxs-check-circle");

addBtn.addEventListener("click",()=>{
  let formTasks = document.getElementById("form-tasks");
  formTasks.style.display = "block";
});

closeBtn.addEventListener("click",()=>{
  let formTasks = document.getElementById("form-tasks");
  formTasks.style.display = "none";
});
