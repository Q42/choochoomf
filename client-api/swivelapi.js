var piblaster = require('pi-blaster.js');

var PAN = 'PAN';
var TILT = 'TILT';

var lock;

module.exports = {

	pan: function(value){
		if(lock && lock != PAN){
			return;
		}

		var newVal = previousX + (value * 0.1);
		if(newVal > 1 || newVal < -1){
			return;
		}

		setX(newVal);
		previousX = newVal;
		lock = PAN;
		renewLock();
	},
	tilt: function(value){
		if(lock && lock != TILT){
			return;
		}
		
		var newVal = previousY + (value * 0.1);

		if(newVal > 1 || newVal < -1){
			return;
		}

		setY(newVal);
		previousY = newVal;
		lock = TILT;
		renewLock();
	},
	center: function(){
		setX(0);
		setTimeout(function(){
			setY(0);
		}, 2000);
	}
}

var previousX = 0;
var previousY = 0;

var interval;

function renewLock(){
	if(interval)
		clearInterval(interval);

	interval = setInterval(releaseLock, 500);
}

function releaseLock(){
	lock = undefined;
	console.log('Releasing lock', lock);
}

function setX(val){
	var x = computeX(val);

	console.log('Position', x);
	piblaster.setPwm(18, x);
}

function setY(val){
	var y = computeY(val);

	console.log('Position', y);
	piblaster.setPwm(27, y);
}

function computeX(value){
	var coefficient = ((value + 1) * 0.05) + 0.1;
	return (coefficient % 1)/10 + 0.1
}

function computeY(value){
	var coefficient = ((value + 1) * 0.05) + 0.1;
	return ((coefficient*1.3) % 1)/10 + 0.1
}
