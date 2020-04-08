var artist = "Gorillaz";

var queryURL =
  "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";

$.ajax({
  url: queryURL,
  method: "GET",
})
  .then(function (response) {
    console.log(response);
  })
  .catch(function (err) {
    console.log(err);
  });
