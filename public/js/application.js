$(function() {

var socket = io.connect(
	'http://' + document.domain + ':' + location.port
);

socket.on('debug', function(data) {
  console.log("monsterX: " + data);
});

socket.on('messages', function(msg) {
  console.log('monsterX: ' + msg);
  $("#chat-text").append("<div class='panel panel-default'><div class='panel-heading'>" + $('<span/>').text(msg.handle).html() + "</div><div class='panel-body'>" + $('<span/>').text(msg.text).html() + "</div></div>");
  $("#chat-text").stop().animate({
    scrollTop: $('#chat-text')[0].scrollHeight
  }, 400);	
});

$("#input-form").on("click", function(event) {
  event.preventDefault();
  var handle = $("#input-handle").val();
  var text   = $("#input-text").val();
  socket.emit('message', { handle: handle, text: text });
  $("#input-handle").val("").focus();
  $("#input-text").val("");

  return false;
});


});