var mongo = require('mongodb');
var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;

var server = new Server('127.0.0.1', 27017, { auto_reconnect: true });
db = new Db('monsterx', server);

db.open(function(err, db) {
    if (!err) {
        console.log("Connected to 'monsterx' database");
        db.collection('tweets', { strict:true }, function(err, collection) {
            if (err) {
                console.log("The 'tweets' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.addTweet = function(tweet) {
    db.collection('tweets', function(err, collection) {
        collection.insert(tweet, { safe:true }, function(err, result) {
            if (err) {
                console.log(err);
                return err;
            } else {
                return result[0];
            }
        });
    });
}

exports.getTweets = function(callback) {
	db.collection('tweets', function(err, collection) {
	    collection.find({}, { limit: 6, sort: [['created_at', 'desc']] }).toArray(function(err, items) {
	    	if (err) callback(err)
	        else callback(null, items)
	    });
	});
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var tweets = [];

    db.collection('tweets', function(err, collection) {
        collection.insert(tweets, { safe:true }, function(err, result) {});
    });

};
