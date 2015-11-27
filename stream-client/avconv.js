var avconv = require('avconv');
var fs = require('fs');
var http = require('http');
var params = [
    '-s', '640x480',
    '-r', '30',
    '-f', 'video4linux2',
    '-i', '/dev/video0',
    '-f', 'mpeg1video',
    '-b', '800k',
    '-r', '30',
    'pipe:1'
];

// Get the duplex stream
var stream = avconv(params);

// An object of options to indicate where to post to
var post_options = {
      //host: 'q42videoserver.mod.bz',
      host: 'thomasthetrain.herokuapp.com',
      port: '80',
      path: '/video070/640/480',
      method: 'POST'
};

// Set up the request
var post_req = http.request(post_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('Response: ' + chunk);
        console.log('RESPONSE MID-STREAM is taken as a server cycle. Exiting script, try restarting soon-ish');
        stream.kill();
	process.exit(1);
    });
});

post_req.on('close', function () {
  console.log("CLOSED! Exiting");
  stream.kill();
  process.exit(1);
});

stream.on('message', function(data) {
    process.stdout.write("MESSAGE: " + data);
});
stream.on('error', function(data) {
    process.stderr.write("ERR: " + data);
});
stream.on('data', function(data) {
    post_req.write(data);
});

//note that there's no end. this script is endless until it errors out.
