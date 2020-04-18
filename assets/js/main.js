$(document).ready(function () {

	// Global Variables
	var searchBar = $("#search-bar");
	var searchBtn = $("#search-button");

	var result = $("#result");

	var artistName = $("#artist-name");
	var popularSong = $("#popular-song");
	var topSongs = $("#top-songs");
	var popularAlbum = $("#popular-album");
	var similarArtists = $("#similar-artists");
	var artistImage = $("#artist-image");

	var allEventsDates = $("#all-events-dates");

	var upcomingDate = $("#upcoming-date");
	var upcomingVenue = $("#upcoming-venue");
	var upcomingLocation = $("#upcoming-location");
	var upcomingTicket = $("#upcoming-ticket");
	var upcomingMap = $("#upcoming-map");

	var recentlySearched = $("#recently-searched");
	var mostPopular = $("#most-popular");

	var recentArtists;

	// API Keys
	var LastFmAPIkey = "b69d917e3739d4f7f4894f4b185cd0db";
	var BitAPIKey = "codingbootcamp";
	var googleAPIkey = "AIzaSyDfIFu3PbrI9vo2erKF8HsMTOvCV3lNB4M";

	//--------------------------------------------------------------

	// API Call to get Artist's Top Album
	function getArtistAlbum(artist) {
		var queryURL = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist}&api_key=${LastFmAPIkey}&format=json`

		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {
			popularAlbum.attr("href", response.topalbums.album[0].url);
			popularAlbum.attr("target", "_blank");
			popularAlbum.text(response.topalbums.album[0].name);

		});
	}

	// API Call to get artists similar to searched Artist 
	function getSimilarArtists(artist) {
		var queryURL = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${artist}&api_key=${LastFmAPIkey}&format=json`

		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {
			similarArtists.empty();

			// Loops through response and displays first 3 similar artists
			for (let i = 0; i < 3; i++) {
				var similar = $("<a>");
				similar.attr("href", response.similarartists.artist[i].url);
				similar.attr("target", "_blank");
				similar.text(response.similarartists.artist[i].name);

				similarArtists.append(similar);
			}
		});
	}

	// API Call to get Artist image
	function getArtistArtwork(artist) {
		var queryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=${BitAPIKey}`;

		$.ajax({
			url: queryURL,
			method: "GET",
		}).then(function (response) {
			artistImage.empty();

			// If call returns empty array display...
			if (!response.length) {
				var emptyArtist = $("<h3>");
				emptyArtist.addClass("p-4 m-0");
				emptyArtist.text("Artist Image Unavailable");

				artistImage.append(emptyArtist);

			} else {
				// Else display...
				var artistArtwork = $("<img>");
				artistArtwork.attr("src", response[0].artist.thumb_url);
				artistArtwork.attr("width", "100%");
				artistArtwork.attr("alt", "Image of " + response[0].artist.name);

				artistImage.append(artistArtwork);
			}
		});
	}

	// API Call to get and display Artist information
	function addArtistInfo(artist) {
		var queryURL = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artist}&api_key=${LastFmAPIkey}&format=json`

		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {
			artistName.text(response.toptracks.track[0].artist.name);

			popularSong.attr("href", response.toptracks.track[0].url);
			popularSong.attr("target", "_blank");
			popularSong.text(response.toptracks.track[0].name);

			topSongs.empty();

			// Looping through response to display 3 additional top songs
			for (let i = 1; i < 4; i++) {
				var song = $("<a>");
				song.attr("href", response.toptracks.track[i].url);
				song.attr("target", "_blank");
				song.addClass("d-inline-block");
				song.text(response.toptracks.track[i].name);

				topSongs.append(song);
			}

			// Call the following functions to display all desired Artist info
			getArtistAlbum(artist);

			getSimilarArtists(artist);

			getArtistArtwork(artist);
		});
	}

	// API Call to display map of event location using longitude and latitude
	function addEventMap(latitude, longitude) {
		var queryURL = `https://www.google.com/maps/embed/v1/search?q=${latitude},${longitude}&key=${googleAPIkey}`;

		var eventMap = $("<iframe>");
		eventMap.attr({
			src: queryURL,
			width: "100%",
			height: "100%",
			frameborder: "0",
			style: "border: 0"
		});

		upcomingMap.removeClass("p-4 text-center").addClass("p-0");
		upcomingMap.append(eventMap);
	}

	// Displays information for Current Event
	function displayEvent(event) {
		upcomingMap.empty();

		// If there isn't an event list for the Artist display...
		if (!event) {
			upcomingDate.text("N/A");
			upcomingVenue.text("N/A");
			upcomingLocation.text("N/A");
			upcomingTicket.removeAttr("href");
			upcomingTicket.text("N/A");

			var noEvent = $("<p>").text("No Event").addClass("py-2")
			var frownyFace = $("<i>").addClass("far fa-frown fa-5x py-2");

			upcomingMap.removeClass("p-0").addClass("p-4 text-center");
			upcomingMap.append(noEvent, frownyFace);
		}

		// Else display all event information
		else {
			upcomingDate.text(moment(event.datetime, 'YYYY-MM-DDTHH:mm:ss').format('L LT'));
			upcomingVenue.text(event.venue.name);

			// Event the event is a "Live Stream" change the location of the event
			if (!event.venue.location && !event.venue.city) upcomingLocation.text("Online");
			else if (!event.venue.location) upcomingLocation.text(event.venue.city + ", " + event.venue.country);
			else upcomingLocation.text(event.venue.location);

			// If there is not a ticket link for the event
			if (!event.offers.length) {
				upcomingTicket.removeAttr("href");
				upcomingTicket.text("N/A");
			}

			else {
				upcomingTicket.attr("href", event.offers[0].url);
				upcomingTicket.attr("target", "_blank");
				upcomingTicket.text("Ticket");
			}

			// If the event is a "Live Stream" event change the Map image
			if (!event.venue.location) {
				var noEvent = $("<p>").text("Live Stream Event").addClass("py-2")
				var globe = $("<i>").addClass("fas fa-globe fa-5x py-2");

				upcomingMap.removeClass("p-0").addClass("p-4 text-center");
				upcomingMap.append(noEvent, globe);
			}

			else addEventMap(event.venue.latitude, event.venue.longitude);
		}
	}

	// API call to display All Events
	function addAllEvents(artist) {
		var queryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=${BitAPIKey}&date=upcoming`

		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {
			allEventsDates.empty();

			// If the Artist has no upcoming events
			if (!response.length) {
				allEventsDates.removeClass();
				allEventsDates.addClass("px-0 pt-4 m-0 text-center");
				allEventsDates.text("No Events Coming Up...");

				var frownyFace = $("<i>");
				frownyFace.addClass("far fa-frown fa-5x py-4");
				allEventsDates.append(frownyFace);

				displayEvent(null);
			}

			else {

				// Looping through response to display all Artist Events
				for (let i = 0; i < response.length; i++) {
					var eventDate = $("<li>");
					eventDate.addClass("py-2");

					var eventCity = (response[i].venue.city) ? response[i].venue.city : "Online";
					eventDate.text(`${moment(response[i].datetime, 'YYYY-MM-DDTHH:mm:ss').format('L')} (${eventCity})`);
					eventDate.attr("index", i);

					// Enables events to update Upcoming Event to display event that was clicked on
					eventDate.click(function () {
						displayEvent(response[$(this).attr("index")]);
					});

					allEventsDates.append(eventDate);
					allEventsDates.removeClass();
					allEventsDates.addClass("px-3 py-2 m-0");
				}

				// Displays first event in Upcoming Event section
				displayEvent(response[0]);
			}
		});
	}

	function displayArtist(artist) {
		addArtistInfo(artist);
		addAllEvents(artist);
	}

	// Populates and updates Recent Searched Artists
	function addRecentlySearched() {
		// Getting recently searched from local storage
		recentArtists = JSON.parse(localStorage.getItem("recentArtists"));

		// If there are not any stored artists, populate recent artists with this array
		if (!recentArtists) recentArtists = ["The Weeknd", "Dua Lipa", "Billie Eilish", "Kendrick Lamar", "Taylor Swift",
			"The Strokes", "Tame Impala", "Doja Cat", "Khruangbin", "Post Malone", "Ariana Grande", "Lana Del Rey",
			"Lady Gaga", "Mac DeMarco", "Frank Ocean"];

		recentlySearched.empty();

		// Looping through Recent Artists array and creating list
		for (let i = 0; i < recentArtists.length; i++) {
			var artistName = $("<li>").text(recentArtists[i]);

			// Enables list to display Artist on page when clicked on
			artistName.click(function () {
				displayArtist($(this).text());
			});

			recentlySearched.append(artistName);
		}
	}

	// Updates Reacently Searched artists...
	function updateRecentlySearched(artist) {

		// Adds most recent search to front of array
		recentArtists.unshift(artist);

		// Creates array of unique Artists, ensuring that an artist can only appear once on list
		var uniqueArtists = [...new Set(recentArtists)];
		recentArtists = uniqueArtists;

		// Ensures the array is always 15 Artists long. Removes last Artist in array if greater than 15.
		if (recentArtists.length > 15) recentArtists.pop();

		// Saves recently searched artists to local storage
		localStorage.setItem("recentArtists", JSON.stringify(recentArtists));

		addRecentlySearched();
	}

	// Search Bar click function that takes in value of search input 
	function enableSearchBar() {
		searchBar.click(function () {
			searchBar.val('');
		});

		searchBtn.click(function (event) {
			event.preventDefault();
			displayArtist(searchBar.val());

			setTimeout(function () {
				updateRecentlySearched(artistName.text());
			}, 500);

			result.slideDown("slow");
		});
	}

	// API call that gets Top Artists
	function addMostPopular() {
		var queryURL = `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${LastFmAPIkey}&format=json`;

		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {
			// Array of Most Popular artits from response
			var mostPopularArray = response.artists.artist;

			// Initializing Valid Artists array, that will hold artists with upcoming events
			var mostPopularValid = [];

			// Looping through Most Popular artists response...
			mostPopularArray.forEach(artist => {

				// Nested API call to check which artists have upcoming events
				var artistURL = `https://rest.bandsintown.com/artists/${artist.name}/events?app_id=${BitAPIKey}&date=upcoming`

				$.ajax({
					url: artistURL,
					method: "GET"
				}).then(function (response) {

					// If Artist has upcoming events, and the Valid Artists array is less than 15, add artist to array
					if (response.length != 0 && mostPopularValid.length < 15) mostPopularValid.push(artist);
				});
			});

			// Allows API to get information before running block
			setTimeout(function () {
				for (let i = 0; i < mostPopularValid.length; i++) {
					var artistLi = $("<li>").text(mostPopularValid[i].name);

					artistLi.click(function () {
						displayArtist($(this).text());
					});

					mostPopular.append(artistLi);
				}
			}, 1000);
		});
	}

	//--------------------------------------------------------------

	function main() {
		console.clear();

		enableSearchBar();

		addRecentlySearched();

		addMostPopular();

		setTimeout(function () {
			displayArtist(recentArtists[0]);
		}, 500);
	}

	main();
});