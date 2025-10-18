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
        if (this.source !== 'completed_event') {
            return "unknown";
        }

        const tweet = this.text;

        let distanceEnd = tweet.indexOf(" km");
        let unitLength = 3;
        
        if (distanceEnd === -1) {
            distanceEnd = tweet.indexOf(" mi");
        }

        if (distanceEnd === -1) {
            return "unknown";
        }

        const activityStart = distanceEnd + unitLength + 1;

        let activityEnd = tweet.indexOf(" -", activityStart);
        const withIndex = tweet.indexOf(" with", activityStart);

        if (activityEnd === -1 && withIndex !== -1) {
            activityEnd = withIndex;
        } else if (activityEnd !== -1 && withIndex !== -1) {
            activityEnd = Math.min(activityEnd, withIndex);
        } else if (activityEnd === -1 && withIndex === -1) {
            activityEnd = tweet.length;
        }

        const activity = tweet.substring(activityStart, activityEnd).trim();

        return activity;
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        else {
            let tweet=this.text;
            let distanceStart = tweet.indexOf("Just completed a ")  + "Just completed a ".length;
            let distanceEnd = 0;
            let isKM = false;
            if (tweet.includes("km")) 
                {
                    distanceEnd = tweet.indexOf(" km");
                    isKM = true;
                }
            else if (tweet.includes("mi")) 
                {distanceEnd = tweet.indexOf(" mi");}
            
            let distanceStr = tweet.substring(distanceStart, distanceEnd).trim();
            let distanceNum = parseFloat(distanceStr);

            if (isKM) {distanceNum /= 1.609;}

            return distanceNum;
        }
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}