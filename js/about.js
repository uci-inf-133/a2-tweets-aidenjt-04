function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	// Gets times of every tweet, then finds the earliest and latest tweet
	const times = tweet_array.map(tweet => tweet.time);
	const earliest = new Date(Math.min(...times));
	const latest = new Date(Math.max(...times));

	// Labels options used in date formatting, then formats the earliest and latest date
	const options = { year: 'numeric', month: 'long', day: 'numeric' };
	const earliestFormatted = earliest.toLocaleDateString('en-US', options);
	const latestFormatted = latest.toLocaleDateString('en-US', options);

	// Updates DOM for total number of tweets, the date of first tweet, and the date of last tweet
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	document.getElementById('firstDate').innerText = earliestFormatted;
	document.getElementById('lastDate').innerText = latestFormatted;

	// Counts for every tweet type
	const completedCount = tweet_array.filter(t => t.source === "completed_event").length;
	const liveCount = tweet_array.filter(t => t.source === "live_event").length;
	const achievementCount = tweet_array.filter(t => t.source === "achievement").length;
	const miscCount = tweet_array.filter(t => t.source === "miscellaneous").length;
	const writtenCount = tweet_array.filter(t => t.written).length

	// Formatted percentages for every tweet type
	const total = tweet_array.length;
	const completedPct = math.format((completedCount / total) * 100, { notation: 'fixed', precision: 2 }) + '%';
	const livePct = math.format((liveCount / total) * 100, { notation: 'fixed', precision: 2 }) + '%';
	const achievementPct = math.format((achievementCount / total) * 100, { notation: 'fixed', precision: 2 }) + '%';
	const miscPct = math.format((miscCount / total) * 100, { notation: 'fixed', precision: 2 }) + '%';
	const writtenPct = math.format((writtenCount / completedCount) * 100, { notation: 'fixed', precision: 2 }) + '%';

	// Updates DOM to display details of tweets of type "completed"
	document.getElementsByClassName('completedEvents')[0].innerText = completedCount;
	document.getElementsByClassName('completedEvents')[1].innerText = completedCount;
	document.getElementsByClassName('completedEventsPct')[0].innerText = completedPct;

	// Updates DOM to display details of tweets of type "live"
	document.getElementsByClassName('liveEvents')[0].innerText = liveCount;
	document.getElementsByClassName('liveEventsPct')[0].innerText = livePct;

	// Updates DOM to display details of tweets of type "achievement"
	document.getElementsByClassName('achievements')[0].innerText = achievementCount;
	document.getElementsByClassName('achievementsPct')[0].innerText = achievementPct;

	// Updates DOM to display details of tweets of type "miscellaneous"
	document.getElementsByClassName('miscellaneous')[0].innerText = miscCount;
	document.getElementsByClassName('miscellaneousPct')[0].innerText = miscPct;

	// Updates DOM to display details of tweets written by a user
	document.getElementsByClassName('written')[0].innerText = writtenCount;
	document.getElementsByClassName('writtenPct')[0].innerText = writtenPct;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});