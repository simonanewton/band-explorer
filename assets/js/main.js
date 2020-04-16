$(document).ready(function () {

	var searchBar = $("#search-bar");
	var searchBtn = $("#search-button");

	var artistName = $("#artist-name");
	var popularSong = $("#popular-song");
	var topSongs = $("#top-songs");
	var popularAlbum = $("#popular-album");
	var similarArtists = $("#similar-artists");

	var allEventsDates = $("#all-events-dates");

	var upcomingDate = $("#upcoming-date");
	var upcomingVenue = $("#upcoming-venue");
	var upcomingLocation = $("#upcoming-location");
	var upcomingTicket = $("#upcoming-ticket");
	var upcomingMap = $("#upcoming-map");

	var recentlySearched = $("#recently-searched");
	var mostPopular = $("#most-popular");

	var LastFmAPIkey = "b69d917e3739d4f7f4894f4b185cd0db";
	var BitAPIKey = "codingbootcamp";
	var googleAPIkey = "AIzaSyDfIFu3PbrI9vo2erKF8HsMTOvCV3lNB4M";

	//--------------------------------------------------------------

	function getArtistAlbum(artist) {
		var queryURL = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist}&api_key=${LastFmAPIkey}&format=json`

		$.ajax({
			url: queryURL,
			method: "GET"
		})
			.then(function (response) {
				popularAlbum.empty();
				popularAlbum.text("Most Popular Album: ");

				var album = $("<a>");
				album.attr("href", response.topalbums.album[0].url);
				album.attr("target", "_blank");
				album.text(response.topalbums.album[0].name);

				popularAlbum.append(album);

			});
	}

	function getSimilarArtists(artist) {
		var queryURL = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${artist}&api_key=${LastFmAPIkey}&format=json`

		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {
			similarArtists.empty();
			similarArtists.text("Similar Artists: ");

			var maxNum = 3;
			for (let i = 0; i < maxNum; i++) {

				var similar = $("<a>");
				similar.attr("href", response.similarartists.artist[i].url);
				similar.attr("target", "_blank");
				similar.text(response.similarartists.artist[i].name);

				if (i != maxNum - 1) similar.append(", ");

				similarArtists.append(similar);
			}
		});
	}

	function addArtistInfo(artist) {
		var queryURL = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artist}&api_key=${LastFmAPIkey}&format=json`

		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {
			artistName.text(response.toptracks.track[0].artist.name);

			popularSong.empty();
			popularSong.text("Most Popular Song: ");

			var songTitle = $("<a>");
			songTitle.attr("href", response.toptracks.track[0].url);
			songTitle.attr("target", "_blank");
			songTitle.text(response.toptracks.track[0].name);
			popularSong.append(songTitle);

			topSongs.empty();
			topSongs.text("More Top Songs: ");

			var maxNum = 4;
			for (let i = 1; i < 4; i++) {
				var song = $("<a>");
				song.attr("href", response.toptracks.track[i].url);
				song.attr("target", "_blank");
				song.text(response.toptracks.track[i].name);

				if (i != maxNum - 1) song.append(", ");

				topSongs.append(song);
			}

			getArtistAlbum(artist);

			getSimilarArtists(artist);
		});
	}

	function addEventMap(eventVenue) {
		var venueName = eventVenue.replace(/\s/g, '+');
		var queryURL = `https://www.google.com/maps/embed/v1/search?q=${venueName}&key=${googleAPIkey}`;

		var eventMap = $("<iframe>");
		eventMap.attr({
			src: queryURL,
			width: "100%",
			height: "100%",
			frameborder: "0",
			style: "border: 0"
		});

		upcomingMap.removeClass("p-4 text-center");
		upcomingMap.addClass("p-0");
		upcomingMap.append(eventMap);
	}

	function displayEvent(event) {
		upcomingMap.empty();

		if (!event) {
			upcomingDate.text("Event Date: N/A");
			upcomingVenue.text("Event Venue: N/A");
			upcomingLocation.text("Event Location: N/A");
			upcomingTicket.text("Ticket Link: N/A");

			var noEvent = $("<p>").text("No Event").addClass("py-2")
			var frownyFace = $("<i>").addClass("far fa-frown fa-5x py-2");

			upcomingMap.removeClass("p-0");
			upcomingMap.addClass("p-4 text-center");
			upcomingMap.append(noEvent, frownyFace);
		}

		else {
			upcomingDate.text("Event Date: " + moment(event.datetime, 'YYYY-MM-DDTHH:mm:ss').format('L LT'));
			upcomingVenue.text("Event Venue: " + event.venue.name);

			if (!event.venue.location) upcomingLocation.text("Event Location: " + event.venue.city + ", " + event.venue.country);
			else upcomingLocation.text("Event Location: " + event.venue.location);

			if (event.offers[0].status === "available") {
				console.log("There are tickets available!!!");
				console.log("Ticket URL:");
				console.log(event);

				var ticketLink = $("<a>");
				ticketLink.addClass("btn btn-primary py-1");
				ticketLink.attr("href", event.offers[0].url);
				ticketLink.attr("target", "_blank");
				ticketLink.text("Ticket");

				upcomingTicket.text("Ticket Link: ");
				upcomingTicket.append(ticketLink);
			}

			else {
				console.log("There are no tickets available! :(");
			}

			addEventMap(event.venue.name);
		}
	}

	function addAllEvents(artist) {
		var queryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=${BitAPIKey}&date=upcoming`

		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {
			allEventsDates.empty();

			if (response.length === 0) {
				console.log("There are no events.");
				allEventsDates.removeClass();
				allEventsDates.addClass("px-0 pt-4 m-0 text-center");
				allEventsDates.text("No Events Coming Up...");

				var frownyFace = $("<i>");
				frownyFace.addClass("far fa-frown fa-5x py-4");
				allEventsDates.append(frownyFace);

				displayEvent(null);
			}

			else {
				console.log("There are events.");

				if (response.length > 5) response.length = 5;

				for (let i = 0; i < response.length; i++) {
					var eventDate = $("<li>");
					eventDate.addClass("py-2");
					eventDate.text(moment(response[i].datetime, 'YYYY-MM-DDTHH:mm:ss').format('L') + ` (${response[i].venue.city})`);

					// eventDate.click(function() {
					// 	displayEvent(response[i]);
					// });

					allEventsDates.append(eventDate);
					allEventsDates.removeClass();
					allEventsDates.addClass("px-3 py-2 m-0");
				}

				displayEvent(response[0]);
			}
		});
	}

	function displayArtist(artist) {
		addArtistInfo(artist);

		addAllEvents(artist);
	}

	function enableSearchBar() {
		searchBtn.click(function (event) {
			event.preventDefault();
			displayArtist(searchBar.val());
		});
	}

	function addRecentlySearched() {
		// add a list of recently searched artists
	}

	function addMostPopular() {
		var queryURL = "";

		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {
			// set variable equal to an array of most popular artists
			var mostPopularArray;

			// set array length to 15
			mostPopularArray.length = 15;
		});

		for (let i = 0; i < mostPopularArray.length; i++) {
			var artistLi = $("<li>");
			artistLi.text(mostPopularArray[i]);

			artistLi.click(function () {
				displayArtist(artistLi.text());
			});

			mostPopular.append(artistLi);
		}
	}

	//--------------------------------------------------------------

	function main() {
		console.clear();

		enableSearchBar();

		// addRecentlySearched();

		// addMostPopular();
	}

	main();
});