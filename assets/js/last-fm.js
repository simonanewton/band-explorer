function searchTopTracks(artist) {
  var apiKey = "b69d917e3739d4f7f4894f4b185cd0db";
  var queryURL =
    "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" +
    artist +
    "&api_key=" +
    apiKey +
    "&format=json";

  $.ajax({
    url: queryURL,
    method: "GET",
  })
    .then(function (response) {
      console.log(response);

      $("#top-track").append(`
        
        <p>Top Track: ${response.toptracks.track[0].name}</p>
        
        `);
    })
    .catch(function (err) {
      console.log(err);
    });
}

function searchTopAlbum(artist) {
  var apiKey = "b69d917e3739d4f7f4894f4b185cd0db";
  var queryURL =
    "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" +
    artist +
    "&api_key=" +
    apiKey +
    "&format=json";

  $.ajax({
    url: queryURL,
    method: "GET",
  })
    .then(function (response) {
      console.log(response);

      $("#top-album").append(`

          <p>Top Album: ${response.topalbums.album[0].name}</p>

          `);
    })
    .catch(function (err) {
      console.log(err);
    });
}

$("#search-btn").on("click", function (event) {
  event.preventDefault();
  $("#top-track, #top-album").empty();

  searchTopTracks($("#search-by-artist").val().trim());
  searchTopAlbum($("#search-by-artist").val().trim());
});
