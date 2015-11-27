
var STREAM_SECRET = process.argv[2] || "video070",
	STREAM_PORT = process.env.PORT || 8080,
	STREAM_MAGIC_BYTES = 'jsmp'; // Must be 4 bytes

var PINGURL = ""; //"http://q42-live-1.herokuapp.com/test"

var width = 640,
	height = 480;

// HTTP Server to accept incomming MPEG Stream
var streamServer = require('http').createServer( function(request, response) {
	var params = request.url.substr(1).split('/');

	if( params[0] == 'favicon.ico') {
		console.log("fav icon ignore");
		response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not found");
    response.end();
		return;
	}

	if( params[0] == 'test') {
		console.log("test");
		response.writeHead(200, "text/html");
		var fileStream = require('fs').createReadStream("stream-example.html");
		fileStream.pipe(response);
		return;
	}
	if( params[0] == 'jsmpg.js') {
		console.log("jsmpeg");
		response.writeHead(200, "text/html");
		var fileStream = require('fs').createReadStream("jsmpg.js");
		fileStream.pipe(response);
		return;
	}

	if( params[0] == STREAM_SECRET ) {
		width = (params[1] || 640)|0;
		height = (params[2] || 480)|0;

		console.log(
			'Stream Connected: ' + request.socket.remoteAddress +
			':' + request.socket.remotePort + ' size: ' + width + 'x' + height
		);
		request.on('data', function(data){
			socketServer.broadcast(data, {binary:true});
		});
	}
	else {
		console.log(
			'Failed Stream Connection: '+ request.socket.remoteAddress +
			request.socket.remotePort + ' - wrong secret.'
		);
		response.end();
	}
}).listen(STREAM_PORT);

// Websocket Server
var socketServer = new (require('ws').Server)({server: streamServer});

socketServer.on('connection', function(socket) {
	// Send magic bytes and video size to the newly connected socket
	// struct { char magic[4]; unsigned short width, height;}
	var streamHeader = new Buffer(8);
	streamHeader.write(STREAM_MAGIC_BYTES);
	streamHeader.writeUInt16BE(width, 4);
	streamHeader.writeUInt16BE(height, 6);
	socket.send(streamHeader, {binary:true});
	console.log( 'New WebSocket Connection ('+socketServer.clients.length+' total)' );
	socket.on('close', function(code, message){
		console.log( 'Disconnected WebSocket ('+socketServer.clients.length+' total)' );
	});
});

socketServer.broadcast = function(data, opts) {
	for( var i in this.clients ) {
		if (this.clients[i].readyState == 1) {
			this.clients[i].send(data, opts);
		}
		else {
			console.log( 'Error: Client ('+i+') not connected.' );
		}
	}
};

if(PINGURL) {
	setInterval(function() {
		console.log('pinging: ' + PINGURL);
		try {
			require("http").get(PINGURL);
		}
		catch(ex) {
			console.log('cannot ping: ' + ex);
		}
	}, 1 * 120 * 1000); // every 2 minutes
	console.log('Keepalive running on ' + PINGURL);
}

console.log('Listening for MPEG Stream on http://127.0.0.1:'+STREAM_PORT+'/<secret>/<width>/<height>');
console.log('Awaiting WebSocket connections on ws://127.0.0.1:'+STREAM_PORT+'/');
