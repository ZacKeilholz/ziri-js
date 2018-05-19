//Required Files
require('dotenv').config();
var keys = require("../ziri-js/keys");

//Required Modules
var inquirer = require("inquirer");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');


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



spotify.search({ type: 'track', query: 'All the Small Things' }, function (err, data) {
    if (err) {
        return console.log('Error occurred: ' + err);
    }
    console.log((data.tracks.items[0].uri));
});

//var params = {screen_name: 'nodejs', count: '2'};
client.post('statuses/update', {status: 'Node.js tweet(!)'}, function(error, tweet, response) {
    if (!error) {
      console.log(tweet);
    }
  });