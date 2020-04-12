function searchByArtist(artist) {
  var artistURL =
    "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";

  $.ajax({
    url: artistURL,
    method: "GET",
  })
    .then(function (response) {
      // Pulls artist info from API
      console.log(response);
      var artistName = response.name;
      var artistImg = response.thumb_url;

      $("#artist-info").append(`
            
      <h1>${artistName}</h1>
      <img src="${artistImg}" />
      
      `);

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
            
            <p> ${eventDate} ${eventTime} ${response[i].venue.name} ${response[i].venue.city}, ${response[i].venue.region} </p>
                       
            `);
          }
        })
        .catch();
    })
    .catch(function (err) {
      console.log(err);
    });
}

$("#search-btn").on("click", function (event) {
  event.preventDefault();
  $("#artist-info, #artist-events").empty();
  searchByArtist($("#search-by-artist").val());
});
