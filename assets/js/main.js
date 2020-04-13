$(document).ready(function () {

    var searchBar = $("#search-bar");
    var searchBtn = $("#search-button");

    var allEventsDates = $("#all-events-dates");

    var recentlySearched = $("#recently-searched");
    var mostPopular = $("#most-popular");

    //--------------------------------------------------------------

    function addArtistInfo(artist) {
        var queryURL = "";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // fill in artist info div with response data

        }).catch(function (error) {
            // display error

        });
    }

    function displayEventInfo(event) {
        // display the info for the given event

    }

    function addAllEvents(artist) {
        var queryURL = "";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // display 5 upcoming events in the div

            // display the event info for the first event
            displayEventInfo(firstEvent);

        }).catch(function (error) {
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
        searchBtn.click(function () {
            // get the artist's name from the user input
            var artistName = searchBar.val();

            // display information and events for the searched artist
            displayArtist(artistName);

            // update the list of recently searched artists
            updateRecentlySearched(artistName);
        });
    }

    function enableEventDisplay() {
        // for each of the events in All Events
        allEventsDates.each(function (event) {

            // enable them to be clicked to show the information for that specific date
            event.click(function () {
                displayEventInfo(this);
            });
        });
    }

    function addRecentlySearched() {
        // if there is a recently searched list in localStorage, display that

        // else display a default recently searched list
    }

    function enableRecentlySearched() {
        // for each of the artists in the Recently Searched
        recentlySearched.each(function (artist) {

            // enable them to be clicked to show the information and events for that specific artist
            artist.click(function () {
                displayArtist(this);
            });
        });
    }

    function addMostPopular() {
        // create a list of most popular artists
    }

    function enableMostPopular() {
        // for each of the artists in the Most Popular
        mostPopular.each(function (artist) {

            // enable them to be clicked to show the information and events for that specific artist
            artist.click(function () {
                displayArtist(this);
            });
        });
    }

    //--------------------------------------------------------------

    function main() {
        // enable search bar functionality
        enableSearchBar();

        // enable event dates to be clicked
        enableEventDisplay();

        // add the recently searched artists to the display
        addRecentlySearched();

        // enable the list of recently searched artists to be clicked
        enableRecentlySearched();

        // add the most popular artists to the display
        addMostPopular();

        // enable the list of most popular artist to be clicked
        enableMostPopular();
    }

    main();
});