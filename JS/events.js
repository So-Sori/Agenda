function createEvent(){
    let event = {

        'summary': '',
      
        'location': '',
      
        'description': "",
      
        'start': {
      
          'dateTime': '',
      
          'timeZone': '',
      
        },
      
        'end': {
      
          'dateTime': '',
      
          'timeZone': '',
      
        },
      
        'recurrence': [
      
          'RULE:FREQ=DAILY;COUNT=2'
      
        ],
      
        'attendees': [
      
          {'email': ''},
      
        ],
      
        'reminders': {
      
          'useDefault': false,
      
          'overrides': [
      
            {'method': 'email', 'minutes': 24 * 60},
      
            {'method': 'popup', 'minutes': 10},
      
          ],
      
        },
      
      };
      return gapi.client.calendar.events.update({
        "resource": {
          "end": {},
          "start": {}
        }
      })
    .then(function(response) {
            // Handle the results here (response.result has the parsed body).
            console.log("Response", response);
        },
        function(err) { console.error("Execute error", err); });
}