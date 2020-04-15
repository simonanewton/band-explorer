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
	var upcomingLocation = $("#upcoming-location");
	var upcomingAddress = $("#upcoming-address");
	var upcomingTicket = $("#upcoming-ticket");

	var LastFmAPIkey = "&api_key=b69d917e3739d4f7f4894f4b185cd0db&format=json";
	var BitAPIKey = "/events?app_id=codingbootcamp";

	//--------------------------------------------------------------

	function getArtistAlbum(artist) {
		
		var queryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" + artist + LastFmAPIkey;
	
		$.ajax({
			url: queryURL,
			method: "GET"
		})
		.then(function (response) {
			popularAlbum.empty();
			popularAlbum.text("Most Popular Album: ");

			var album = $("<a>");
			album.attr("href", response.topalbums.album[0].url);
			album.text(response.topalbums.album[0].name);

			popularAlbum.append(album);

		});
	}

	function getSimilarArtists(artist) {
		
		var queryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" + artist + LastFmAPIkey;
	
		$.ajax({
			url: queryURL,
			method: "GET"
		})
		.then(function (response) {
			similarArtists.empty();
			similarArtists.text("Similar Artists: ");

			var maxNum = 3;
			for (let i = 0; i < maxNum; i++) {

				var similar = $("<a>");
				similar.attr("href", response.similarartists.artist[i].url);
				similar.text(response.similarartists.artist[i].name);

				if (i != maxNum - 1) similar.append(", ");

				similarArtists.append(similar);
			}
		});
	}

	function addArtistInfo(artist) {
		var queryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + artist + LastFmAPIkey;

		$.ajax({
			url: queryURL,
			method: "GET"
		})
		.then(function (response) {
			artistName.text(response.toptracks.track[0].artist.name);

			popularSong.empty();
			popularSong.text("Most Popular Song: ");

			var songTitle = $("<a>");
			songTitle.attr("href", response.toptracks.track[0].url);
			songTitle.text(response.toptracks.track[0].name);
			popularSong.append(songTitle);
			
			topSongs.empty();
			topSongs.text("More Top Songs: ");

			var maxNum = 4;
			for (let i = 1; i < 4; i++) {
				var song = $("<a>");
				song.attr("href", response.toptracks.track[i].url);
				song.text(response.toptracks.track[i].name);

				if (i != maxNum - 1) song.append(", ");

				topSongs.append(song);
			}

			getArtistAlbum(artist);

			getSimilarArtists(artist);
		});
	}

	function displayEvent(event) {
		upcomingDate.text("Event Date: " + moment(event.datetime, 'YYYY-MM-DDTHH:mm:ss').format('L LT'));
		upcomingLocation.text("Event Venue: " + event.venue.name);

		if (event.venue.location) upcomingAddress.text("Event Location: " + event.venue.location);
		else upcomingAddress.text("Event Location: " + event.venue.city + ", " + event.venue.country);

		if (event.offers[0].status === "available") {
			console.log("There are tickets available!!!");

			var ticketLink = $("<a>");
			ticketLink.attr("href", event.offers[0].url);
			ticketLink.text("Ticket");

			upcomingTicket.text("Ticket Link: ");
			upcomingTicket.append(ticketLink);
		}

		else {
			console.log("There are no tickets available! :(");
		}
	}

	function addAllEvents(artist) {

		var queryURL = "https://rest.bandsintown.com/artists/" + artist + BitAPIKey;

		$.ajax({
			url: queryURL,
			method: "GET"
		})
		.then(function (response) {
			if (response.length === 0) {
				console.log("There are no events.");
				allEventsDates.text("No Events Coming Up...");
			}

			for (let i = 0; i < 5; i++) {
				var eventDate = $("<li>");
				eventDate.addClass("py-2")
				eventDate.text(moment(response[i].datetime, 'YYYY-MM-DDTHH:mm:ss').format('L'));
				allEventsDates.append(eventDate);
			}

			displayEvent(response[0]);
		});
	}

	function displayArtist(artist) {
		addArtistInfo(artist);

		addAllEvents(artist);
	}

	function enableSearchBar() {
		searchBtn.click(function (event) {
			event.preventDefault();

			var artistName = searchBar.val();

			displayArtist(artistName);

			// updateRecentlySearched(artistName);
		});
	}

	//--------------------------------------------------------------

	function main() {
		console.clear();

		enableSearchBar();

		// enableEventDisplay();
	}

	main();
});