class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if(this.text.includes("completed")) {return "completed_event";}
        else if(this.text.startsWith("Watch")) {return "live_event";}
        else if(this.text.startsWith("Achieved")) {return "achievement";}
        else {return "miscellaneous";}
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        let tweet = this.text;
        tweet = tweet.replace(/#RunKeeper/g, "")
        tweet = tweet.replace(/https:\/\/\S+/g, "")

        if (!tweet.includes("@Runkeeper")) {
            return true;
        }
        else {
            return false;
        }
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }

        let tweet = this.text;
        tweet = tweet.replace(/#RunKeeper/g, "")
        tweet = tweet.replace(/https:\/\/\S+/g, "")

        return tweet;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}