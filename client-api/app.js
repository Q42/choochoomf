var PORT = 4242;

var train = require('./train.js');

var app = require('express')();
var server = require('http').Server(app);
var bp = require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {
  console.log('Something should happen here.');
  res.json({
    "success": true,
    "result": "Yay!"
  });
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

app.get('/stop', function(req, res) {
  console.log('Stopping train');
  train.stop();
  res.json({
    "success": true,
  })
});

server.listen(PORT, function() {
  console.log('Server listening on port ' + PORT);
});
