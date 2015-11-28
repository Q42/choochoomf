var PORT = 4242;

var train = require('./train.js');
var swivelapi = require('./swivelapi.js')

var express = require('express');
var app = express();
var server = require('http').Server(app);
var bp = require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({
  extended: true
}));

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

app.post('/speed', function(req, res) {
  var speed = parseFloat(req.body.speed);
  if(!speed)
    res.status(500).json({
      "success": false,
      "message": "No speed specified."
    });
  else {
    console.log('Set speed: ' + speed);
    if (Math.abs(speed) > 1)
      res.status(500).json({
        "success": false,
        "message": "Invalid speed! Values should be between -1 and 1."
      });
    else {
      train.setSpeed(speed);
      res.json({
        "success": true,
        "speed": speed
      });
    }
  }
});

app.post('/location', function(req, res){
  console.log(req.body.location);

  train.setSpeed(0);

  res.json({
    "success": true
  })
});

app.get('/stop', function(req, res) {
  console.log('Stopping train');
  train.stop();
  res.json({
    "success": true,
  })
});

app.post('/swivelx', function(req, res) {
  var x = parseFloat(req.body.x);

  swivelapi.setSwivelX(x);

  res.json({
    "success": true,
  })
});

app.post('/swively', function(req, res) {
  var y = parseFloat(req.body.y);

  swivelapi.setSwivelY(y);

  res.json({
    "success": true,
  })
});

server.listen(PORT, function() {
  console.log('Server listening on port ' + PORT);
});
