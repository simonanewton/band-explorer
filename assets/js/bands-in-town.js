function searchByArtist(artist) {
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
        // console.log(eventHour);
        var eventMinute = response[i].datetime[14] + response[i].datetime[15];
        var eventTime = eventHour + ":" + eventMinute + "PM";

        // Stores lat and lon of concert location
        var venueLat = response[i].venue.latitude;
        var venueLon = response[i].venue.longitude;

        var venueState = response[i].venue.region;
        var venueCountry = response[i].venue.country;

        var venueLocation = "";

        // If the event is not in the US, it will display the Country...
        // Else, it will display the State
        if (venueState === "") {
          venueLocation += venueCountry;
        } else {
          venueLocation += venueState;
        }

        // console.log("Latitude: " + venueLat);
        // console.log("Longitude: " + venueLon);

        $("#artist-events").append(`
            
              <p> ${eventDate} ${eventTime} </p>

              <p> ${response[i].venue.name} - ${response[i].venue.city}, ${venueLocation}</p>

              <a href="${response[i].offers[0].url}">Tickets</a>
                       
            `);
      }
    })
    .catch();
}

$("#search-btn").on("click", function (event) {
  event.preventDefault();
  $("#artist-info, #artist-events").empty();
  searchByArtist($("#search-by-artist").val());
});
