function searchByArtist(artist) {
  var artistURL =
    "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";

  $.ajax({
    url: artistURL,
    method: "GET",
  })
    .then(function (response) {
      // Pulls artist info from API
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
            $("#artist-events").append(`
            
            <p> ${response[i].datetime} ${response[i].venue.name} ${response[i].venue.city}, ${response[i].venue.region} </p>
                       
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
  searchByArtist($("#search-by-artist").val());
});
