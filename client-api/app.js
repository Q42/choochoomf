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

var locations = require('./locations.json');
var lastKnownLocation = {};
var objective = {};

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

app.route('/location')
  // Get the last known location
  .get(function(req, res) {
    console.log('sending last known location: ' + lastKnownLocation);
    res.json({
      "success": true,
      "location": lastKnownLocation
    });
  })
  // Set the location (used by NFC scanner)
  .post(function(req, res) {
    // TODO: this is only for internal use, perhaps secure it in some way?
    console.log(req.body.location);
    if (!locations[req.body.location]) {
      res.status(500).json({
        "success": false,
        "message": "unknown location"
      });
      return;
    }

    lastKnownLocation = locations[req.body.location];

    // If the location is either start or end of the track, stop
    if (locations[req.body.location] === "Start" || locations[req.body.location] === "End")
      train.stop();

    // If the location has been set as an objective, also stop.
    if (locations[req.body.location] === objective) {
      train.stop();
      objective = {};
    }

    res.json({
      "success": true
    });
  });

app.route('/objective')
  // Get the current objective
  .get(function(req, res) {
    res.json({
      "success": true,
      "objective": objective
    });
  })
  // Set the current objective (e.g. go to location)
  .post(function(req, res) {
    var target = locations[req.body.location];
    if (!target) {
      res.status(500).json({
        "success": false,
        "message": "Unknown location."
      });
      return;
    }
    console.log('Train moving to ' + target["name"]);
    objective = target;
    var current = lastKnownLocation["position"];
    train.setSpeed(Math.ceil(target["position"] - current / Math.abs(target["position"] - current)));
  });

// Get all the current locations
app.get('/locations', function(req, res) {
  console.log('Sending list of locations');
  res.json({
    "success": true,
    "locations": locations
  });
});

// Set the train speed
app.post('/speed', function(req, res) {
  var speed = parseFloat(req.body.speed);
  if(!speed) {
    res.status(500).json({
      "success": false,
      "message": "No speed specified."
    });
    return;
  }
  if (Math.abs(speed) > 1) {
    res.status(500).json({
      "success": false,
      "message": "Invalid speed! Values should be between -1 and 1."
    });
    return;
  }
  console.log('Set speed: ' + speed);
  train.setSpeed(speed);
  objective = {}; // TODO: maybe not do this?

  res.json({
    "success": true,
    "speed": speed
  });
});

// Stop the train
app.get('/stop', function(req, res) {
  console.log('Stopping train');
  train.stop();
  res.json({
    "success": true,
  })
});

// Pan the camera
app.post('/pan', function(req, res) {
  var x = parseFloat(req.body.direction);

  swivelapi.panDelta(x);

  res.json({
    "success": true,
  })
});

// Tilt the camera
app.post('/tilt', function(req, res) {
  var y = parseFloat(req.body.direction);

  swivelapi.tiltDelta(y);

  res.json({
    "success": true,
  })
});

app.post('/center', function(req, res) {
  swivelapi.center();

  res.json({
    "success": true,
  });
});

server.listen(PORT, function() {
  console.log('Server listening on port ' + PORT);

  swivelapi.center();
});
