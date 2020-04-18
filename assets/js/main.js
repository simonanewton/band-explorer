$(document).ready(function () {

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
			popularAlbum.attr("href", response.topalbums.album[0].url);
			popularAlbum.attr("target", "_blank");
			popularAlbum.text(response.topalbums.album[0].name);

		});
	}

	function getSimilarArtists(artist) {
		var queryURL = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${artist}&api_key=${LastFmAPIkey}&format=json`

		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {
			similarArtists.empty();

			for (let i = 0; i < 3; i++) {
				var similar = $("<a>");
				similar.attr("href", response.similarartists.artist[i].url);
				similar.attr("target", "_blank");
				similar.text(response.similarartists.artist[i].name);

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

			if (!response.length) {
				var emptyArtist = $("<h3>");
				emptyArtist.addClass("px-0 pt-4 m-0 text-center");
				emptyArtist.text("Artist Image Unavailable");
				 
				artistImage.append(emptyArtist);

			} else {
			var artistArtwork = $("<img>");
			artistArtwork.attr("src", response[0].artist.thumb_url);
			artistArtwork.attr("width", "100%");
			artistArtwork.attr("alt", "Image of " + response[0].artist.name);

			artistImage.append(artistArtwork);
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

			popularSong.attr("href", response.toptracks.track[0].url);
			popularSong.attr("target", "_blank");
			popularSong.text(response.toptracks.track[0].name);

			topSongs.empty();

			for (let i = 1; i < 4; i++) {
				var song = $("<a>");
				song.attr("href", response.toptracks.track[i].url);
				song.attr("target", "_blank");
				song.addClass("d-inline-block");
				song.text(response.toptracks.track[i].name);

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

		else {
			upcomingDate.text(moment(event.datetime, 'YYYY-MM-DDTHH:mm:ss').format('L LT'));
			upcomingVenue.text(event.venue.name);

			if (!event.venue.location && !event.venue.city) upcomingLocation.text("Online");
			else if (!event.venue.location) upcomingLocation.text(event.venue.city + ", " + event.venue.country);
			else upcomingLocation.text(event.venue.location);

			if (!event.offers.length) {
				upcomingTicket.removeAttr("href");
				upcomingTicket.text("N/A");
			}

			else {
				upcomingTicket.attr("href", event.offers[0].url);
				upcomingTicket.attr("target", "_blank");
				upcomingTicket.text("Ticket");
			}

			if (!event.venue.location) {
				var noEvent = $("<p>").text("Live Stream Event").addClass("py-2")
				var globe = $("<i>").addClass("fas fa-globe fa-5x py-2");
	
				upcomingMap.removeClass("p-0").addClass("p-4 text-center");
				upcomingMap.append(noEvent, globe);
			}

			else addEventMap(event.venue.latitude, event.venue.longitude);
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
					
					var eventCity = (response[i].venue.city) ? response[i].venue.city : "Online";
					eventDate.text(`${moment(response[i].datetime, 'YYYY-MM-DDTHH:mm:ss').format('L')} (${eventCity})`);
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

		if (!recentArtists) recentArtists = ["The Weeknd", "Dua Lipa", "Billie Eilish", "Kendrick Lamar", "Taylor Swift", 
		"The Strokes", "Tame Impala", "Doja Cat", "Khruangbin", "Post Malone", "Ariana Grande", "Lana Del Rey", 
		"Lady Gaga", "Mac DeMarco", "Frank Ocean"];

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

        if (recentArtists.length > 15) recentArtists.pop();

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
			
			setTimeout(function () {
				updateRecentlySearched(artistName.text());
			}, 500);

			result.slideDown("slow");
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