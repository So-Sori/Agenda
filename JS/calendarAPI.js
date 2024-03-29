import { cardsEvents,createEvent,formEvents,createBtn,editEvent,submitContainer} from "./functions.js"
import { cleantForm} from "./cleanform-alertas.js"

export const CALENDAR_ID = 'primary';
const API_KEY = 'AIzaSyCSnNDQ8GMjmwRit7DWOQVAbvVTvnITaUY';
const CLIENT_ID = '273520073899-hk28up4luntj9v55qhq4lo8eni2efm78.apps.googleusercontent.com';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

let closeBtn = document.querySelector("#form-events .bxs-x-circle");
let emptyEventsList = document.getElementById("empty-event");
let addEventBtn = document.getElementById("events-add-btn");

let authorize_button  = document.getElementById("authorize_button");
let signout_button  = document.getElementById("signout_button");

//CODIGO FROM GOOGLE
let tokenClient;
let gapiInited = false;
let gisInited = false;

authorize_button.style.visibility= 'hidden';
signout_button.style.display= 'none';


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
      prompt: 'consent',
      callback: '',
    });
    gisInited = true;
    maybeEnableButtons();
}

document.addEventListener('DOMContentLoaded', () =>{
  gapiLoaded();
  gisLoaded();
})
authorize_button.addEventListener('click',(e) => {
  e.stopPropagation();
  handleAuthClick();
})
signout_button.addEventListener('click',(e) =>{
  e.stopPropagation();
  handleSignoutClick();
})

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
      authorize_button.style.visibility= 'visible';
    }
}

function handleAuthClick() {
    tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
    throw (resp);
    }
    signout_button.style.display= 'block';
    
    authorize_button.innerText = 'Refresh';
    emptyEventsList.style.display = "none";
    await listUpcomingEvents();
    addEventBtn.style.display = "block";

    signout_button.style.fontFamily = "Wix Madefor Display";
    authorize_button.style.fontFamily = "Wix Madefor Display";
    signout_button.style.backgroundColor = "var(--purple-white)";
    authorize_button.style.backgroundColor = "var(--purple-white)";
  };
  
  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
    events.innerHTML = "";
    addEventBtn.style.display = "none";
  }
}
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      events.innerHTML = " ";
      document.getElementById('content').innerText = '';
      document.getElementById('authorize_button').innerHTML = `<img src="IMG/google.png" alt="google logo">
      <p>Login with Google</p>`;
      document.getElementById('signout_button').style.display= 'none';
      addEventBtn.style.display = "none";
      emptyEventsList.style.display = "block";
    }
}

async function listUpcomingEvents() {
    let response;
    try {
      const request = {
        'calendarId':CALENDAR_ID,
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
      emptyEventsList.style.display = "block";
      return;
    }
    cardsEvents(events)
  }

  closeBtn.addEventListener("click",()=>{
    formEvents.classList.remove("visible");
    cleantForm();
  });
  
  addEventBtn.addEventListener("click",()=> {
    formEvents.classList.add("visible");
    createBtn.type = "submit";
    createBtn.value = "Create";
    formEvents.appendChild(createBtn);
    submitContainer.appendChild(createBtn);
    editEvent.style.display = "none";
    createBtn.style.display = "block";
    createEvent();
  })
