// Create global list to add all of the user-written tweets into
let user_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	// Create a list of tweets that are mapped to their text and time they are created at
	// Filter that list by the ones that were written by users
	const tweets = runkeeper_tweets.map(tweet => new Tweet(tweet.text, tweet.created_at));
	user_tweets = tweets.filter(t => t.written);
}

function addEventHandlerForSearch() {
	// Continuously listen to the search bar
	document.getElementById('textFilter').addEventListener('input', () => {
		// Save the query, lowercased to get more results
		// Also clear the old results off the table whenever the query changes
		const query = document.getElementById('textFilter').value.toLowerCase();
		document.getElementById('tweetTable').innerHTML = '';

		// If the query is empty, set the text to this
		if (query === '') {
			document.getElementById('searchCount').innerText = '0';
			document.getElementById('searchText').innerText = '';
			return;
		}

		// Filter the user-written tweets to match the query
		const filtered = user_tweets.filter(t => t.writtenText.toLowerCase().includes(query));

		// Update the text to match query results
		document.getElementById('searchCount').innerText = filtered.length;
		document.getElementById('searchText').innerText = query;

		// Display the results
		filtered.forEach((t, i) => {
			const rowHTML = t.getHTMLTableRow(i + 1);
			document.getElementById('tweetTable').insertAdjacentHTML('beforeend', rowHTML);
		});
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});