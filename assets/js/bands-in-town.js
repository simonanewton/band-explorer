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
            
      <h1>${artistName}</h1>
      <img src="${artistImg}" />
      
      `);
      console.log()

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
            var eventMonth = response[i].datetime[5] + response[i].datetime[6];
            var eventDay = response[i].datetime[8] + response[i].datetime[9];
            var eventYear = response[i].datetime[2] + response[i].datetime[3];
            var eventDate = eventMonth + "/" + eventDay + "/" + eventYear;
            // Sets event hour to non-military format to be user friendly
            var eventHour =
              response[i].datetime[11] + response[i].datetime[12] - 12;
            console.log(eventHour);
            var eventMinute =
              response[i].datetime[14] + response[i].datetime[15];
            var eventTime = eventHour + ":" + eventMinute + "PM";

            $("#artist-events").append(`
            
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
