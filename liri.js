/*
Project Requirements:

1. TWITTER

node liri.js my-tweets
This will show your last 20 tweets and when they were created at in your terminal/bash window.

2.SPOTIFY 

node liri.js spotify-this-song '<song name here>'
This will show the following information about the song in your terminal/bash window

Artist(s)
-The song's name
A preview link of the song from Spotify
-The album that the song is from
-If no song is provided then your program will default to "The Sign" by Ace of Base.

3. OMDB

node liri.js movie-this '<movie name here>'

This will output the following information to your terminal/bash window:

   * Title of the movie.
   * Year the movie came out.
   * IMDB Rating of the movie.
   * Rotten Tomatoes Rating of the movie.
   * Country where the movie was produced.
   * Language of the movie.
   * Plot of the movie.
   * Actors in the movie.
   * 
   * If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/

It's on Netflix!

4. FS 

Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
Feel free to change the text in that document to test out the feature for other commands.

5. DATA LOG

In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.
Make sure you append each command you run to the log.txt file. 
Do not overwrite your file each time you run a command.




*/



//Required Modules-

//Private User Key Storage
require('dotenv').config();
var keys = require("../ziri-js/keys");

//User Input Library
var inquirer = require("inquirer");

//File System Access
var fs = require("fs");

//Spotify API Access
var Spotify = require('node-spotify-api');

//Twitter API Access
var Twitter = require('twitter');

//API Request
var request = require("request");


//Initial Module ID Setup
//============================

//Twitter Setup

var client = new Twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret
});


// Spotify Setup

var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});


//1.  Get User Input- 
//Parameter A is the users choice of application we want to run in the liri program and Parameter 'B' is the user input we want to use WITHIN that specific liri program.

//Reach Goal- use inquirer library instead of process.argv


//Initialize Main Application
getUserInput();

//Main application
function getUserInput(randomApplication, randomUniqueParameter) {

    //Set User Input in Node to variables- liri application initializes preset applications and the unique parameter runs unique user queries into those applications that may require input
    var liriApplication = process.argv[2];
    var liriUniqueParameter = process.argv[3];

    if (randomApplication) {
        liriApplication = randomApplication;
    };

    if (randomUniqueParameter) {
        liriUniqueParameter = randomUniqueParameter;
        console.log(liriUniqueParameter);
    };


    switch (liriApplication) {

        //Display Last 20 Tweets 
        case "my-tweets":

            //Run My-Tweets Liri Application
            myTweets(liriUniqueParameter);

            break;

        //Run Spotify Function
        case "spotify-this-song":

            //May need to add if statement for when unique parameter doesn't exist
            spotifyThisSong(liriUniqueParameter);

            break;

        //Run OMDB Function
        case "movie-this":

            omdbSearch(liriUniqueParameter);
            break;

        case "random":

            random();
            break;

        default:
            break;
    }

}

//2.  Run Specific liri program - Twitter/Spotify/OMDB/ or FS with a specific data input.  

//TWITTER LIRI APPLICATION
//====================================


function myTweets(userInput) {

    //POST TO TWITTER CODE FOR LATER USE
    // client.post('statuses/update', { status: 'Node.js tweet(!)' }, function (error, tweet, response) {
    //     if (!error) {
    //         console.log(tweet);
    //     }
    // });


    //Create a DEFAULT parameter object 
    //for the GET request to Twitter- Use my Screenname and count of 20
    var params = {
        screen_name: 'zacharydoes',
        count: 20
    };

    //Check for a userInput Screen Name
    //If user has supplied a second parameter in their initial node input, exchange this for the screen_name property.  
    if (userInput) {
        params.screen_name = userInput;
    } else {
        console.log(`
        \nHey You! Try adding a specific Twitter screen name for your second input parameter next time... 
        \nNow outputting Zac's Boring Ass Twitter Feed: `);
    }

    //Get Request to Twitter- takes params object as the unique input.  
    client.get('statuses/user_timeline', params, function (error, tweets) {

        //Handle Error First if there is one.
        if (!error) {

            //Parse the retrieved Twitter Array and console log each tweet text
            tweets.forEach(function (tweet, index) {
                console.log(`Tweet ${index + 1}: ${tweet.text}. Created At: ${tweet.created_at}`);
            });
        } else {
            console.log(error);
        }
    });
}


//SPOTIFY LIRI APPLICATION 
//===================================

function spotifyThisSong(userInput) {

    //Requirements:
    // -The song's name
    // A preview link of the song from Spotify
    // -The album that the song is from
    // -If no song is provided then your program will default to "The Sign" by Ace of Base.

    //Create a Query String that will be filled by the userInput (or defaults to All the Small things)
    var query = "";

    if (userInput) {
        query = userInput;
    } else {
        query = 'All the Small Things';
        console.log(`Now Searching for '${query}' because you didn't enter a song!`);
    };

    //Search Spotify for the specific Query
    spotify.search({ type: 'track', query: query }, function (err, data) {

        //Error handling First
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //Simplify the returned data object
        var songEntry = data.tracks.items[0];

        //Grab specific items from the object and output them to the terminal in a visually pleasing way
        console.log(`
        \nHuzzah!  A song was found! (But is it the RIGHT one...)
        \nSong Title: ${songEntry.name} By ${songEntry.artists[0].name}
        \nLink: ${songEntry.external_urls.spotify}
        `);
    });

}

//OMDB SEARCH FUNCTION-
//=========================
//Takes User Input, Creates a Query URL, Submits a GET request to OMDB, outputs cleaned up results to user in terminal

function omdbSearch(userInput) {

    //User Input
    var query = "";

    if (userInput) {
        query = userInput;
    } else {
        query = "Mad Max";
        console.log(`Now Searching OMDB for '${query}' because you didn't enter a Movie Title!`);
    };

    //Construct Query URL from user input string
    var queryUrl = "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy";


    //Send Request to OMDB
    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            //Parse movie object
            var movieInfo = JSON.parse(body);

            //Construct String to Display in Terminal

            //Rotten Tomatoes Functions
            var rtRating = "";

            //Take Ratings Array from Movie object, find out if Rotten Tomatoes is part of this array, and return the value of the RT rating
            function getRottenTomatoes(ratingInput) {
                ratingInput.forEach(function (element) {
                    if (element.Source == 'Rotten Tomatoes') {
                        rtRating = element.Value;
                    }
                });
            }

            //Call the RT rating function 
            getRottenTomatoes(movieInfo.Ratings);

            //Construct the Movie Info String with the Specific Data we want and log it to the console.  
            console.log(`
            \nOMDB Search Result for: '${query}'
            \nTitle: ${movieInfo.Title}
            \nYear: ${movieInfo.Year}
            \nIMDB Rating: ${movieInfo.imdbRating}
            \nRotten Tomatoes Rating: ${rtRating}
            \nCountry: ${movieInfo.Country}
            \nLanguage: ${movieInfo.Language}
            \nPlot: ${movieInfo.Plot}
            \nActors: ${movieInfo.Actors}
            `);
        } else {
            console.log(error);
        }
    });

};

//RANDOM Function-
//=========================
// When user inputs 'random', this function pulls a random selection from random.txt and recursively runs this selection into the main code function

function random() {

    fs.readFile("./random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data
        console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        getUserInput(dataArr[0], dataArr[1]);

    });

}



//3. Run random client action from random.txt- for example, run the spotify action for "I want it that Way" using FS and running the random.txt into our previously created liri program.

//4. Log user search data to a log.txt file.

//5. Modularize this application





