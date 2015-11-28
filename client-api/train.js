/*
* train.js
*/
module.exports = {
  setSpeed: function(speed) {
    updateSpeed(speed);
  },
  stop: function() {
    updateSpeed(0);
  }
};

// GPIO 18 (pin 12 on A+) is PWM, wired to L298n ENA
// GPIO 23 (pin 16 on A+) is forward direction, wired to L298n IN1
// GPIO 24 (pin 18 on A+) is backward direction, wired to L298n IN2

var piblaster = require('pi-blaster.js');

if(!/^darwin/.test(process.platform))
  var Gpio = require('onoff').Gpio,
    fwd = new Gpio(23, 'out'),
    back = new Gpio(24, 'out');

var  go_fwd = 0,
  go_back = 0,
  speed = 0;

function updateSpeed(arg) {
  this.speed = arg;

  if(!/^darwin/.test(process.platform))
  {
    // assumes a speed from -1 to 1
    // -1 = full throttle backward
    //  0 = standstill (no brakes)
    //  1 = full throttle forward
    go_fwd = ((arg < 0) ? 1 : 0);
    go_back = ((arg > 0) ? 1 : 0);
    console.log("fwd:  " + go_fwd);
    console.log("back: " + go_back);
    fwd.writeSync(go_fwd);
    back.writeSync(go_back);
    piblaster.setPwm(18, Math.abs(arg));
  }
}
