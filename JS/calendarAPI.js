const CALENDAR_ID = 'primary';
const API_KEY = 'AIzaSyCSnNDQ8GMjmwRit7DWOQVAbvVTvnITaUY';
const CLIENT_ID = '273520073899-hk28up4luntj9v55qhq4lo8eni2efm78.apps.googleusercontent.com';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar';

let formEvents = document.getElementById("form-events");
let closeBtn = document.querySelector("#form-events .bxs-x-circle");
let events = document.getElementById("events");

let currentEvent = '';
let summary = document.getElementById("summary");
let start = document.getElementById("start");
let end = document.getElementById("end");
let description = document.getElementById("description");
let inveted = document.getElementById("inveted");
let addEventBtn = document.getElementById("events-add-btn");

let createBtn = document.createElement("input");
let editEvent = document.createElement("input");
let submitContainer = document.querySelector("#form-events .submit-container");

//CODIGO FROM GOOGLE
let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.display= 'hidden';
document.getElementById('signout_button').style.display= 'hidden';

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
      document.getElementById('authorize_button').style.display= 'block';
    }
}
// Sign in the user upon button click.
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
    throw (resp);
    }
    document.getElementById('signout_button').style.display= 'block';
    document.getElementById('authorize_button').innerText = 'Refresh';
    await listUpcomingEvents(); //Funcion para listar y crear eventos
    addEventBtn.style.display = "block";
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
      document.getElementById('signout_button').style.display= 'none';
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
    console.log(events);
  }

// CREACION DE EVENTOS
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
        <h3>Location</h3>
        <p>${event[i].location ? event[i].location : "---"}</p>
        <h3>Date</h3>
        <p>Start date: ${startDate}</p>
        <p>End date: ${endDate}</p>
        <h3>Description</h3>
        <p>${event[i].description ? event[i].description : "---"}</p>
        <h3>Invited</h3>
        ${invited ? invited : "---"}
    `
    div.appendChild(editBtn());
    events.appendChild(div);
  }
  currentEvent = event;
}
addEventBtn.addEventListener("click",()=> {
  formEvents.classList.add("visible");
  createBtn.type = "submit";
  createBtn.value = "Create";
  formEvents.appendChild(createBtn);
  submitContainer.appendChild(createBtn);
  editEvent.style.display = "none";
  createBtn.style.display = "block";
  createEvent()
})
//CREAR NUEVOS EVENTOS
function createEvent() {
  createBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    return gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'summary': summary.value,
      'location': '800 Howard St., San Francisco, CA 94103',
      'description': description.value,
      'start': {
        'dateTime': new Date(start.value).toISOString(),
        'timeZone': new Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': new Date(end.value).toISOString(),
        'timeZone': new Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'attendees': [
        {'email': 'lpage@example.com'},
        {'email': 'sbrin@example.com'}
      ],
      'reminders': {
        'useDefault': false,
        'overrides': [
          {'method': 'email', 'minutes': 24 * 60},
          {'method': 'popup', 'minutes': 10}
        ]
      }
    })
    .then(function(response) {
            // Handle the results here (response.result has the parsed body).
            console.log("Response create", response);
            cleantForm();
          },
          function(err) { console.error("Execute error create", err); });
  });
}
// EDIT BTN
function editBtn(){
  let editBtn = document.createElement('i');
  editBtn.classList.add("bx");
  editBtn.classList.add("bx-calendar-edit");

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
closeBtn.addEventListener("click",()=>{
  formEvents.classList.remove("visible");
  cleantForm();
});
// OBTENER DATOS PARA EL FORM
function getDatasForm(currentId) {
  let summaryValue,descriptionValue,startValue,endValue,invetedValue;

  for (let i = 0; i < currentEvent.length; i++) {
    if (currentEvent[i].id === currentId) {
      summaryValue = currentEvent[i].summary;
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
  updateEvent(currentId,startValue,endValue);
}

// UPDATE DATA DESDE EL FORM
function updateEvent(currentId,startValue,endValue) {
  editEvent.addEventListener("click",(e)=>{
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
          {"email": "soribelsantos0514@gmail.com"},
          {"email": "soribelsantosbritos05@gmail.com"}
        ]
      }
    })
  .then(function(response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response update", response);
          cleantForm();
      },
      function(err) { console.error("Execute error update", err);
     });
  })
}
function cleantForm() {
  start.value = "";
  end.value = "";
  summary.value = "";
  description.value = "";
  inveted.value = "";
}