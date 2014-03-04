var fs = require('fs');
//var srvOps = {
//	key: fs.readFileSync('./certs/server.key'),
//	cert: fs.readFileSync('./certs/server.crt')
//}

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var Twit = require('twit');
var model = require('./models');

credentials = fs.readFileSync('./config/credentials', { encoding: 'utf8' });

var T = new Twit({
	consumer_key: credentials.consumer_key,
	consumer_secret: credentials.consumer_secret,
	access_token: credentials.access_token,
	access_token_secret: credentials.access_token_secret,
});

var watchList = ['linux'];

var stream = T.stream('statuses/filter', { track: watchList });
stream.on('tweet', function(tweet) {
	model.addTweet(tweet);
	var msg = {
		text: tweet.text,
		user: {
			screen_name: tweet.user.screen_name,
			profile_image_url: tweet.user.profile_image_url
		},
	};
	io.sockets.emit('tweets', msg);
});

io.sockets.on('connection', function(socket) {
	socket.emit('debug', "Connected to socket server");

	socket.on('message', function(data) {
		console.log('monsterX: ' + data);
		io.sockets.emit('messages', data);
	});
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
	model.getTweets(function(err, tweets) {
		res.render('index', { title: 'monsterX', tweets: tweets });
	});
});

app.get('/tweets', function(req, res) {
	model.getTweets(function(err, tweets) {
		res.json(tweets);
	});
});

app.get('/visual', function(req, res) {
	res.render('visual', { title: 'monsterX' });
});

server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
