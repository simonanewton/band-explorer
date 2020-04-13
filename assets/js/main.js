$(document).ready(function () {
  var searchBar = $("#search-bar");
  var searchBtn = $("#search-button");

  var allEventsDates = $("#all-events-dates");

  var recentlySearched = $("#recently-searched");
  var mostPopular = $("#most-popular");

  //--------------------------------------------------------------

  function addArtistInfo(artist) {
    //   1st Call to Last.FM API to obtain Artist Name & Songs
    var queryURL =
      "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" +
      artist +
      "&api_key=b69d917e3739d4f7f4894f4b185cd0db&format=json";

    $.ajax({
      url: queryURL,
      method: "GET",
    })
      .then(function (response) {
        // Fills Artist Name...
        $("#artist-name").text(response.toptracks.track[0].artist.name);

        // Appends Top Song with link...
        $("#popular-song").empty().append(`
        
            <li class="py-2" id="popular-song">Most Popular Song:
                <a class="text-dark" href="${response.toptracks.track[0].url}">${response.toptracks.track[0].name}</a>
            </li>

        `);

        // Appends 3 more Top Songs...
        $("#favorite-songs").empty().append(`
        
            <li class="py-2" id="favorite-songs">More Top Songs:
                <a class="text-dark" href="${response.toptracks.track[1].url}">${response.toptracks.track[1].name}</a>,
                <a class="text-dark" href="${response.toptracks.track[2].url}">${response.toptracks.track[2].name}</a>,
                <a class="text-dark" href="${response.toptracks.track[3].url}">${response.toptracks.track[3].name}</a>
            </li>
        
        `);

        // 2nd Call to Last.FM API to obtain Artist Album info
        var queryURL =
          "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" +
          artist +
          "&api_key=b69d917e3739d4f7f4894f4b185cd0db&format=json";

        $.ajax({
          url: queryURL,
          method: "GET",
        })
          .then(function (response) {
            // Appends Top Album...
            $("#popular-album").empty().append(`

                <li class="py-2" id="popular-album">Most Popular Album:              
                    <a class="text-dark" href="${response.topalbums.album[0].url}" target="_blank">${response.topalbums.album[0].name}</a>
                </li>

            `);

            // 3rd Call to Last.FM API to obtain Similar Artists
            var queryURL =
              "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" +
              artist +
              "&api_key=b69d917e3739d4f7f4894f4b185cd0db&format=json";

            $.ajax({
              url: queryURL,
              method: "POST",
            })
              .then(function (response) {
                // Appends Similar Artists...
                $("#similar-artists").empty().append(`
                
                    <li class="py-2" id="similar-artists">Similar Artists:
                        <a class="text-dark" href="${response.similarartists.artist[0].url}">${response.similarartists.artist[0].name}</a>,
                        <a class="text-dark" href="${response.similarartists.artist[1].url}">${response.similarartists.artist[1].name}</a>,
                        <a class="text-dark" href="${response.similarartists.artist[2].url}">${response.similarartists.artist[2].name}</a>
                    </li>

                `);
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        // display error
        console.log(error);
      });
  }

  function displayEventInfo(event) {
    // display the info for the given event
  }

  function addAllEvents(artist) {
    var queryURL = "";

    $.ajax({
      url: queryURL,
      method: "GET",
    })
      .then(function (response) {
        // display 5 upcoming events in the div

        // display the event info for the first event
        displayEventInfo(firstEvent);
      })
      .catch(function (error) {
        // display error
      });
  }

  function displayArtist(artist) {
    // display the information for that artist
    addArtistInfo(artist);

    // display five upcoming events for that artist
    addAllEvents(artist);
  }

  function updateRecentlySearched() {
    // update the recently searched list and display the new list
    // store the new recently searched list to localStorage
  }

  function enableSearchBar() {
    searchBtn.click(function (e) {
      e.preventDefault();
      // get the artist's name from the user input
      var artistName = searchBar.val();
      //   console.log(artistName);

      // display information and events for the searched artist
      displayArtist(artistName);

      // update the list of recently searched artists
      updateRecentlySearched(artistName);
    });
  }

  //   function enableEventDisplay() {
  //     // for each of the events in All Events
  //     allEventsDates.each(function (event) {
  //       // enable them to be clicked to show the information for that specific date
  //       event.click(function () {
  //         displayEventInfo(this);
  //       });
  //     });
  //   }

  function addRecentlySearched() {
    // if there is a recently searched list in localStorage, display that
    // else display a default recently searched list
  }

  //   function enableRecentlySearched() {
  //     // for each of the artists in the Recently Searched
  //     recentlySearched.each(function (artist) {
  //       // enable them to be clicked to show the information and events for that specific artist
  //       artist.click(function () {
  //         displayArtist(this);
  //       });
  //     });
  //   }

  function addMostPopular() {
    // create a list of most popular artists
  }

  //   function enableMostPopular() {
  //     // for each of the artists in the Most Popular
  //     mostPopular.each(function (artist) {
  //       // enable them to be clicked to show the information and events for that specific artist
  //       artist.click(function () {
  //         displayArtist(this);
  //       });
  //     });
  //   }

  //--------------------------------------------------------------

  function main() {
    // enable search bar functionality
    enableSearchBar();

    // enable event dates to be clicked
    // enableEventDisplay();

    // add the recently searched artists to the display
    addRecentlySearched();

    // enable the list of recently searched artists to be clicked
    // enableRecentlySearched();

    // add the most popular artists to the display
    addMostPopular();

    // enable the list of most popular artist to be clicked
    // enableMostPopular();
  }

  main();
});
