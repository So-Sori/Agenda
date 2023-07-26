import { cleantForm,success, error } from "./cleanform-alertas.js";
import { CALENDAR_ID } from "./calendarAPI.js";

export let formEvents = document.getElementById("form-events");
let events = document.getElementById("events");

let currentEvent = '';
let currentEventId = '';
let tartDateUpdate = "";
let endDateUpdate = "";
export let summary = document.getElementById("summary");
export let place = document.getElementById("location");
export let start = document.getElementById("start");
export let end = document.getElementById("end");
export let description = document.getElementById("description");
export let inveted = document.getElementById("inveted");

export let createBtn = document.createElement("input");
export let editEvent = document.createElement("input");
export let submitContainer = document.querySelector("#form-events .submit-container");

export function cardsEvents(event) {
  for (let i = 0; i < event.length; i++) {
        
    let div = document.createElement("div");
    div.classList.add("card-event-calendar");
    div.setAttribute("id",event[i].id);

    let eventStart = new Date(event[i].start.dateTime)
    let startDate = `${eventStart.toLocaleString()}`;

    let eventEnd = new Date(event[i].end.dateTime)
    let endDate = `${eventEnd.toLocaleString()}`;

    let invited = '';
    if (event[i].attendees) {
      for (let e = 0; e < event[i].attendees.length; e++) {
        invited += `<li>${event[i].attendees[e].email}</li>`;
      }
    }

    div.innerHTML = `
        <h3>Title</h3>
        <p>${event[i].summary ? event[i].summary : "<p>---</p>"}</p>
        <h3>Location</h3>
        <p>${event[i].location ? event[i].location : "<p>---</p>"}</p>
        <h3>Date</h3>
        <p>Start date: ${startDate}</p>
        <p>End date: ${endDate}</p>
        <h3>Description</h3>
        <p>${event[i].description ? event[i].description : "<p>---</p>"}</p>
        <h3>Invited</h3>
        ${invited ? invited : "<p>---</p>"}
    `
    div.appendChild(editBtn());
    div.appendChild(deleteBtn());
    events.appendChild(div);
  }
  currentEvent = event;
}

export function getInveted(attendees) {
  let invetedArr = inveted.value.split(",");
  if (invetedArr !== "") {
    invetedArr.forEach(element => {
      let obj = {
        'email': element
      }
      attendees.push(obj);
    });
  }
  return attendees;
}

export function createEvent() {
  let attendees = [];
  createBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    e.stopImmediatePropagation();
    return gapi.client.calendar.events.insert({
      'calendarId': `${CALENDAR_ID}`,
      'summary': summary.value,
      'location': place.value,
      'description': description.value,
      'start': {
        'dateTime': new Date(start.value).toISOString(),
        'timeZone': new Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': new Date(end.value).toISOString(),
        'timeZone': new Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'attendees': inveted.value ? getInveted(attendees) : [],
      'reminders': {
        'useDefault': false,
        'overrides': [
          {'method': 'email', 'minutes': 24 * 60},
          {'method': 'popup', 'minutes': 10}
        ]
      }
    })
    .then(function(response) {
          success("Created");
          cleantForm();
          attendees = [];
          },
          function(err) { error(err) });
  });
}

export function editBtn(){
  let editBtn = document.createElement('i');
  editBtn.classList.add("bx");
  editBtn.classList.add("bx-calendar-edit");
  editBtn.title  = "Edit event";

  editBtn.addEventListener('click',(e) => {
    let currentId = e.target.parentElement.id
    getDatasForm(currentId);
    editEvent.type = "submit";
    editEvent.value = "Update";
    formEvents.appendChild(editEvent);
    submitContainer.appendChild(editEvent);
    formEvents.classList.add("visible");
    createBtn.style.display = "none";
    editEvent.style.display = "block";
  })
  return editBtn;
}


export function getDatasForm(currentId) {
  let summaryValue,locationValue,descriptionValue,startValue,endValue,invetedValue;

  for (let i = 0; i < currentEvent.length; i++) {
    if (currentEvent[i].id === currentId) {
      summaryValue = currentEvent[i].summary;
      locationValue = currentEvent[i].location;
      descriptionValue = currentEvent[i].description;
      startValue = currentEvent[i].start.dateTime;
      endValue = currentEvent[i].end.dateTime;
      if (currentEvent[i].attendees) {
        for (let e = 0; e < currentEvent[i].attendees.length; e++) {
          invetedValue += `${currentEvent[i].attendees[e].email},`;
        }
        invetedValue = (invetedValue.substring(0, invetedValue.length - 1)).substring(9);
      }
    }
  }
  summary.value = summaryValue; 
  description.value = descriptionValue;
  inveted.value = invetedValue;
  place.value = locationValue;
  currentEventId = currentId;
  tartDateUpdate = startValue;
  endDateUpdate = endValue;
  updateEvent();
}

export function updateEvent() {
  let attendees = [];
  editEvent.addEventListener("click",(e)=>{
    e.stopImmediatePropagation();
    e.preventDefault();
    let currentId = currentEventId;
    return gapi.client.calendar.events.update({
      "calendarId": `${CALENDAR_ID}`,
      "eventId": `${currentId}`,
      "alwaysIncludeEmail": true,
      "sendNotifications": true,
      "resource": {
        "end": {
          "dateTime": `${end.value ? new Date(end.value).toISOString() : endDateUpdate}`
        },
        "start": {
          "dateTime": `${start.value ? new Date(start.value).toISOString() : tartDateUpdate}`
        },
        "summary": `${summary.value}`,
        "description": `${description.value}`,
        "attendees": inveted.value ? getInveted(attendees) : [],
        'location':`${place.value}`,
        'reminders': {
          'useDefault': false,
          'overrides': [
            {'method': 'email', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 10}
          ]
        }
      }
    })
  .then(function(response) {
          success("Updated");
          cleantForm();
          formEvents.classList.remove("visible");
          attendees = [];
      },
      function(err) { 
        error(err);
     });
  })
}

export function deleteBtn(){
  let deleteBtn = document.createElement('i');
  deleteBtn.classList.add("bx");
  deleteBtn.classList.add("bx-x");
  deleteBtn.title  = "Delete event";

  deleteBtn.addEventListener('click',(e) => {
    let currentId = e.target.parentElement.id
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
        deleteEvents(currentId);
      }
    })
  })
  return deleteBtn;
}

export function deleteEvents(currentId) {
  return gapi.client.calendar.events.delete({
    "calendarId": `${CALENDAR_ID}`,
    "eventId": `${currentId}`
  })
      .then(function(response) {
        success("Deleted");
        },
        function(err) { error(err) });
}