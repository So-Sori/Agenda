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
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events';

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
    await listUpcomingEvents();
    };

    if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
    }
}
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      document.getElementById('content').innerText = '';
      document.getElementById('authorize_button').innerText = 'Authorize';
      document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

async function listUpcomingEvents() {
    let response;
    let responseEvent;
    try {
      const request = {
        'calendarId':'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 20,
        'orderBy': 'startTime',
      };
      response = await gapi.client.calendar.events.list(request);
      
      console.log(gapi.client.calendar.events);

    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }

    const events = response.result.items;
    console.log(events);
    if (!events || events.length == 0) {
      document.getElementById('content').innerText = 'No events found.';
      return;
    }
    cardsEvents(events)
  }

// CREACION DE CARTAS
let eventos = document.getElementById("eventos");

function cardsEvents(event) {
    for (let i = 0; i < event.length; i++) {
        
    let div = document.createElement("div");
    div.classList.add("card-event-calendar");

    let eventStart = new Date(event[i].start.dateTime)
    let startDate = `${eventStart.toLocaleString()}`;

    let eventEnd = new Date(event[i].end.dateTime)
    let endDate = `${eventEnd.toLocaleString()}`;

    div.innerHTML = `
        <h3>Title</h3>
        <p>${event[i].summary}</p>
        <h3>Date</h3>
        <p>Start date: ${startDate}</p>
        <p>End date: ${endDate}</p>
        <h3>Description</h3>
        <p>${event[i].description ? event[i].description : ""}</p>
    `
    eventos.appendChild(div)
        
    }
}