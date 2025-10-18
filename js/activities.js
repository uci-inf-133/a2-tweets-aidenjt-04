function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// Creates a filtered tweet array by "completed events"
	const activities = tweet_array.filter(t => t.source === "completed_event");

	// Creates an activity counts array that is using the activities array as input
	// If the activity type is not in the new array, add it in and set count to 1
	// If the activity type is in the new array, increase count by 1
	// This is used to get all of the counts for every unique activity
	const activityCounts = {};
	activities.forEach(t => {
		const type = t.activityType;
		if (activityCounts[type]) {
        activityCounts[type] += 1;
    } else 
	{
        activityCounts[type] = 1;
    }
	});

	// Sorts the activity counts by decreasing order, highest count at the front
	const sortedActivityCounts = Object.entries(activityCounts).sort((a, b) => b[1] - a[1]);

	// Manipulates DOM to display total number of unique activities
	document.getElementById('numberActivities').innerText = Object.keys(activityCounts).length;

	// Manipulates DOM to display top three activities by count
	// sortedActivityCounts[x][y]  (x = Activities index in array, y = the name of the activity in that array)
	document.getElementById('firstMost').innerText = sortedActivityCounts[0][0];
	document.getElementById('secondMost').innerText = sortedActivityCounts[1][0];
	document.getElementById('thirdMost').innerText = sortedActivityCounts[2][0];

	// Creates an array that stores the top three activities, makes it easier to access distances
	const topActivities = sortedActivityCounts.slice(0, 3).map(([type]) => type);

	// Creates an array that will store distances by the type of activity
	const distanceByType = {};

	// Filters activities by type
	topActivities.forEach(type => {const typeActivities = activities.filter(a => a.activityType === type);

		// Extracts the distances from the activities
		const distances = typeActivities.map(a => a.distance);

		// Computes the average distance for the activities
		const avg = distances.reduce((sum, d) => sum + d, 0) / distances.length;

		// Adds into the array the activities along with their associated averages
		distanceByType[type] = avg;
	});

	// Sorts the activity averages by descending order, highest average at front
	const sortedByAvgDistance = Object.entries(distanceByType).sort((a, b) => b[1] - a[1]);

	// Manipulates the DOM to display the activity with the highest average distance and shortest average distance
	document.getElementById('longestActivityType').innerText = sortedByAvgDistance[0][0];
	document.getElementById('shortestActivityType').innerText = sortedByAvgDistance[2][0];

	// Creates a filtered array that has all of the activities of the longest distance activity type
	const longestActivityType = activities.filter(a => a.activityType === sortedByAvgDistance[0][0]);

	// Creates two lists that will be uses to store distances for respective days
	const weekdayDistances = [];
	const weekendDistances = [];

	// Gets the day of each activity - if day is on a weekend, push to weekend list; otherwise, push to weekday list
	longestActivityType.forEach(a => {
		const day = new Date(a.time).getDay();
		if (day === 0 || day === 6) {
			weekendDistances.push(a.distance);
		} else {
			weekdayDistances.push(a.distance);
		}
	});

	// Gets the averages for the weekdays and the weekends
	const avgWeekday = weekdayDistances.reduce((y, x) => y + x, 0) / (weekdayDistances.length);
	const avgWeekend = weekendDistances.reduce((y, x) => y + x, 0) / (weekendDistances.length);

	// Manipulates the DOM to display when the longest activity is performed dependent upon the averages
	if (avgWeekday > avgWeekend) {
		document.getElementById('weekdayOrWeekendLonger').innerText = "weekdays";
	} else {
		document.getElementById('weekdayOrWeekendLonger').innerText = "weekends";
	}

	// Puts the data of the tweets and associated counts in a format that is available for the graph
	const countsData = Object.entries(activityCounts).map(([activity, count]) => ({activity, count}));

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {"values": countsData},
	  "mark": "bar",
	  "encoding": {
		"x": {
		"field": "activity",
		"type": "nominal",
		},
		"y": {
		"field": "count",
		"type": "quantitative",
		},
		"color": {"field": "activity", "type": "nominal"},
	  }
	};
	// Displays the graph
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	// Puts the data of the tweets (day, distance, and activity) in a format that is available for the graph
	const rawDistanceData = [];
	topActivities.forEach(type => {
		const typeActivities = activities.filter(a => a.activityType === type);
		typeActivities.forEach(a => {
			const day = new Date(a.time).getDay();
			rawDistanceData.push({
				day: day,             
				distance: a.distance,
				activity: a.activityType
			});
		});
	});

	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the distances by day of the week for all of the three most tweeted-about activities.",
	  "data": {"values": rawDistanceData},
	  "mark": "point",
	  "encoding": {
		"x": {
		"field": "day",
		"type": "quantitative",
		"axis": { "labelExpr": "['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][datum.value]" },
		},
		"y": {
		"field": "distance",
		"type": "quantitative",
		},
		"color": {"field": "activity", "type": "nominal"},
	  }
	};

	distance_vis_agg_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the distances by day of the week for all of the three most tweeted-about activities.",
	  "data": {"values": rawDistanceData},
	  "mark": "point",
	  "encoding": {
		"x": {
		"field": "day",
		"type": "quantitative",
		"axis": { "labelExpr": "['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][datum.value]" },
		},
		"y": {
		"field": "distance",
		"type": "quantitative",
		"aggregate": "mean"
		},
		"color": {"field": "activity", "type": "nominal"},
	  }
	};
	
	// Displays the graph
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	// Hides the graph by default
	vegaEmbed('#distanceVisAggregated', distance_vis_agg_spec, { actions: false }).then(result => {
    	document.getElementById('distanceVisAggregated').style.display = 'none';});

	// If button is clicked, change what the graph shows
	// Depending on what the graph is showing, change the text of the button
	document.getElementById('aggregate').addEventListener('click', () => {
		const rawDiv = document.getElementById('distanceVis');
		const aggDiv = document.getElementById('distanceVisAggregated');

		if (rawDiv.style.display === 'none') {
			rawDiv.style.display = 'block';
			aggDiv.style.display = 'none';
			document.getElementById('aggregate').innerText = "Show means";
		} else {
			rawDiv.style.display = 'none';
			aggDiv.style.display = 'block';
			document.getElementById('aggregate').innerText = "Show all activities";
		}
	});
}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});