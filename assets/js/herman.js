$(document).ready(function () {

	var searchBar = $("#search-bar");
	var searchBtn = $("#search-button");

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

	var LastFmAPIkey = "b69d917e3739d4f7f4894f4b185cd0db";
	var BitAPIKey = "codingbootcamp";
	var googleAPIkey = "AIzaSyDfIFu3PbrI9vo2erKF8HsMTOvCV3lNB4M";

	//--------------------------------------------------------------

	function getArtistAlbum(artist) {
		var queryURL = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist}&api_key=${LastFmAPIkey}&format=json`

		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {
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

	function getArtistArtwork(artist) {
		var queryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=${BitAPIKey}`;

		$.ajax({
			url: queryURL,
			method: "GET",
		}).then(function (response) {
			artistImage.empty();

			var artistArtwork = $("<img>");
			artistArtwork.attr("src", response[0].artist.thumb_url);
			artistArtwork.attr("width", "100%");

			artistImage.append(artistArtwork);
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

			var maxNumDisplay = 4;
			for (let i = 1; i < maxNumDisplay; i++) {
				var song = $("<a>");
				song.attr("href", response.toptracks.track[i].url);
				song.attr("target", "_blank");
				song.text(response.toptracks.track[i].name);

				if (i < maxNumDisplay - 1) song.append(", ");

				topSongs.append(song);
			}

			getArtistAlbum(artist);

			getSimilarArtists(artist);

			getArtistArtwork(artist);
		});
	}

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

	function displayEvent(event) {
		upcomingMap.empty();

		if (!event) {
			upcomingDate.text("Event Date: N/A");
			upcomingVenue.text("Event Venue: N/A");
			upcomingLocation.text("Event Location: N/A");
			upcomingTicket.text("Ticket Link: N/A");

			var noEvent = $("<p>").text("No Event").addClass("py-2")
			var frownyFace = $("<i>").addClass("far fa-frown fa-5x py-2");

			upcomingMap.removeClass("p-0").addClass("p-4 text-center");
			upcomingMap.append(noEvent, frownyFace);
		}

		else {
			upcomingDate.text("Event Date: " + moment(event.datetime, 'YYYY-MM-DDTHH:mm:ss').format('L LT'));
			upcomingVenue.text("Event Venue: " + event.venue.name);

			if (!event.venue.location) upcomingLocation.text("Event Location: " + event.venue.city + ", " + event.venue.country);
			else upcomingLocation.text("Event Location: " + event.venue.location);

			if (event.offers[0].status === "available") {
				var ticketLink = $("<a>");
				ticketLink.addClass("btn btn-primary py-1 ml-1");
				ticketLink.attr("href", event.offers[0].url);
				ticketLink.attr("target", "_blank");
				ticketLink.text("Ticket");

				upcomingTicket.text("Ticket Link: ");
				upcomingTicket.append(ticketLink);
			}

			else upcomingTicket.text("Ticket Link: N/A");

			addEventMap(event.venue.latitude, event.venue.longitude);
		}
	}

	function addAllEvents(artist) {
		var queryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=${BitAPIKey}&date=upcoming`

		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {
			allEventsDates.empty();

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
				for (let i = 0; i < response.length; i++) {
					var eventDate = $("<li>");
					eventDate.addClass("py-2");
					eventDate.text(`${moment(response[i].datetime, 'YYYY-MM-DDTHH:mm:ss').format('L')} (${response[i].venue.city})`);
					eventDate.attr("index", i);

					eventDate.click(function () {
						displayEvent(response[$(this).attr("index")]);
					});

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

	function addRecentlySearched() {
		recentArtists = JSON.parse(localStorage.getItem("recentArtists"));

		if (!recentArtists) recentArtists = ["The Weeknd", "Dua Lipa", "Billie Eilish", "Kanye West", "Drake", "Childish Gambino",
			"Tame Impala", "Doja Cat", "The Beatles", "Post Malone", "Ariana Grande", "Lana Del Rey", "Lady Gaga", "Radiohead", "Frank Ocean"];

		recentlySearched.empty();

		for (let i = 0; i < recentArtists.length; i++) {
			var artistName = $("<li>").text(recentArtists[i]);

			artistName.click(function () {
				displayArtist($(this).text());
			});

			recentlySearched.append(artistName);
		}
	}

	function updateRecentlySearched(artist) {
		recentArtists.unshift(artist);
        
        var uniqueArtists = [...new Set(recentArtists)];
        recentArtists = uniqueArtists;

        console.log("Before: " + recentArtists.length);

        if (recentArtists.length > 15) recentArtists.pop();

        console.log("After: " + recentArtists.length);


        

		localStorage.setItem("recentArtists", JSON.stringify(recentArtists));

		addRecentlySearched();
	}

	function enableSearchBar() {
		searchBar.click(function () {
			searchBar.val('');
		});

		searchBtn.click(function (event) {
			event.preventDefault();
			displayArtist(searchBar.val());
			updateRecentlySearched(searchBar.val());
		});
	}

	function addMostPopular() {
		var queryURL = `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${LastFmAPIkey}&format=json`;

		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {
			var mostPopularArray = response.artists.artist;

			var mostPopularValid = [];

			mostPopularArray.forEach(artist => {
				var artistURL = `https://rest.bandsintown.com/artists/${artist.name}/events?app_id=${BitAPIKey}&date=upcoming`

				$.ajax({
					url: artistURL,
					method: "GET"
				}).then(function (response) {
					if (response.length != 0 && mostPopularValid.length < 15) mostPopularValid.push(artist);
				});
			});

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
		// localStorage.clear();
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