function displayEvents(artist) {
  // Now pull event info from API
  var eventURL =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=codingbootcamp";

  $.ajax({
    url: eventURL,
    method: "GET",
  })
    .then(function (response) {
      console.log(response);

      for (let i = 0; i < 5; i++) {
        // Makes Event Date user friendly
        var eventDate =
          response[i].datetime[5] +
          response[i].datetime[6] +
          "/" +
          response[i].datetime[8] +
          response[i].datetime[9] +
          "/" +
          response[i].datetime[2] +
          response[i].datetime[3];

        var venueLocation = "";

        // If the event is not in the US, it will display the Country...
        // Else, it will display the State
        if (response[i].venue.region === "") {
          venueLocation += response[i].venue.country;
        } else {
          venueLocation += response[i].venue.region;
        }

        // console.log("Latitude: " + venueLat);
        // console.log("Longitude: " + venueLon);

        $("#artist-events").append(`
            
            <ul>
              <li data-name="${response[i].lineup[0]}"> ${eventDate} ${response[i].venue.city}, ${venueLocation}</li>
            </ul>
             
            `);
      }

      // Displaying upcoming event

      // Sets Date to user friendly format
      var eventDate =
        response[0].datetime[5] +
        response[0].datetime[6] +
        "/" +
        response[0].datetime[8] +
        response[0].datetime[9] +
        "/" +
        response[0].datetime[2] +
        response[0].datetime[3];

      // Sets event hour to non-military format to be user friendly
      var eventTime =
        response[0].datetime[11] +
        response[0].datetime[12] -
        12 +
        ":" +
        response[0].datetime[14] +
        response[0].datetime[15] +
        " PM";

      // Stores lat and lon of concert location ---------------------------------------------------------
      var venueLat = response[0].venue.latitude;
      var venueLon = response[0].venue.longitude;

      var venueState = response[0].venue.region;
      var venueCountry = response[0].venue.country;

      var venueLocation = "";

      // If the event is not in the US, it will display the Country...
      // Else, it will display the State
      if (venueState === "") {
        venueLocation += venueCountry;
      } else {
        venueLocation += venueState;
      }

      $("#main-event").append(`
            
            <div>
            <h1>Upcoming Event</h1>
              <p> ${eventDate} ${eventTime} </p>

              <p> ${response[0].venue.name} - ${response[0].venue.city}, ${venueLocation}</p>

              <a href="${response[0].offers[0].url}">Tickets</a>
            </div>      
              
            `);
    })
    .catch();
}

$("#search-btn").on("click", function (event) {
  event.preventDefault();
  $("#artist-events, #main-event").empty();
  displayEvents($("#search-by-artist").val());
});
