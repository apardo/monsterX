$(function() {

var socket = io.connect(
	'http://' + document.domain + ':' + location.port
);

socket.on('debug', function(data) {
  console.log("monsterX: " + data);
});

socket.on('tweets', function(tweet) {
  $(".panel:eq(0)").removeClass('last-tweet');
  $("#panels").prepend($("<div class='medium-4 columns'><div data-equalizer-watch class='panel last-tweet'><img src='"+tweet.user.profile_image_url+"' /><h3>"+tweet.user.screen_name+"</h3><p>"+tweet.text+"</p></div></div>").fadeIn("slow"));
});

});