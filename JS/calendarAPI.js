// DevExtreme Code Calendar
$(function() {
    $("#calendar").dxCalendar({ 
        showTodayButton: true,
        showWeekNumbers: true,
        weekNumberRule: "firstDay"
    });
});

const CALENDAR_ID = 'primary';
const API_KEY = 'AIzaSyCSnNDQ8GMjmwRit7DWOQVAbvVTvnITaUY';
const CLIENT_ID = '273520073899-hk28up4luntj9v55qhq4lo8eni2efm78.apps.googleusercontent.com';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar';

let formEvents = document.getElementById("form-events");
let sendBtn = document.getElementById("update-btn");
let closeBtn = document.querySelector("#form-events .bxs-x-circle");
let eventsContainer = document.getElementById("events");

let currentEvent = '';
let summary = document.getElementById("summary");
let start = document.getElementById("start");
let end = document.getElementById("end");
let description = document.getElementById("description");



//CODIGO FROM GOOGLE
let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
      document.getElementById('authorize_button').style.visibility = 'visible';
    }
}
// Sign in the user upon button click.
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
    throw (resp);
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    await listUpcomingEvents(); //Funcion para listar y crear eventos
    };

    if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
    events.innerHTML = "";
    }
}
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      events.innerHTML = " ";
      document.getElementById('content').innerText = '';
      document.getElementById('authorize_button').innerText = 'Authorize';
      document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

async function listUpcomingEvents() {
    let response;
    try {
      const request = {
        'calendarId':'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'orderBy': 'startTime',
      };
      response = await gapi.client.calendar.events.list(request);

    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }
    const events = response.result.items;
    if (!events || events.length == 0) {
      document.getElementById('content').innerText = 'No events found.';
      return;
    }
    cardsEvents(events)
  }

// CREACION DE EVENTOS
let events = document.getElementById("events");

function cardsEvents(event) {
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
        invited = `<p>${event[i].attendees[e].email}</p>`;
        invited += invited;
      }
    }

    div.innerHTML = `
        <h3>Title</h3>
        <p>${event[i].summary}</p>
        <h3>Date</h3>
        <p class="start">Start date: </p>
        <p class="start">${startDate}</p>
        <p class="end">End date: </p>
        <p class="end">${endDate}</p>
        <h3>Description</h3>
        <p>${event[i].description ? event[i].description : ""}</p>
        <h3>Invited</h3>
        ${invited ? invited : "<p>Alone</p>"}
    `
    div.appendChild(editBtn());
    events.appendChild(div);
  }
  currentEvent = event;
}
// EDIT BTN
function editBtn(){
  let editBtn = document.createElement('i');
  editBtn.classList.add("bx");
  editBtn.classList.add("bx-calendar-edit");

  editBtn.addEventListener('click',(e) => {
    let currentId = e.target.parentElement.id;
    getDatasForm(currentId);
    formEvents.classList.add("visible");
  })
  return editBtn;
}
closeBtn.addEventListener("click",()=>{
  formEvents.classList.remove("visible");
});

// OBTENER DATOS PARA EL FORM
function getDatasForm(currentId) {
  let summaryValue,descriptionValue,startValue,endValue;

  for (let i = 0; i < currentEvent.length; i++) {
    if (currentEvent[i].id === currentId) {
      summaryValue = currentEvent[i].summary;
      descriptionValue = currentEvent[i].description;
      startValue = currentEvent[i].start.dateTime;
      endValue = currentEvent[i].end.dateTime;
    }
  }
  summary.value = summaryValue; 
  description.value = descriptionValue;
  updateEvent(currentId,startValue,endValue);
}

// UPDATE DATA DESDE EL FORM
function updateEvent(currentId,startValue,endValue) {
  sendBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    return gapi.client.calendar.events.update({
      "calendarId": "primary",
      "eventId": `${currentId}`,
      "alwaysIncludeEmail": true,
      "sendNotifications": true,
      "resource": {
        "end": {
          "dateTime": `${end.value ? new Date(end.value).toISOString() : endValue}`
        },
        "start": {
          "dateTime": `${start.value ? new Date(start.value).toISOString() : startValue}`
        },
        "summary": `${summary.value}`,
        "description": `${description.value}`,
        "attendees": [
          {
            "email": "soribelsantos0514@gmail.com"
          },
          {
            "email": "soribelsantosbritos05@gmail.com"
          }
        ]
      }
    })
  .then(function(response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
          summary.value = "";
          description.value = "";
          end.value = "";
          start.value = "";
      },
      function(err) { console.error("Execute error", err); });
  })
}
