var piblaster = require('pi-blaster.js');

module.exports = {

	pan: function(value){

		var newVal = previousX + (value * 0.1);

		if(newVal > 1 || newVal < -1){
			return;
		}

		setX(newVal);

		previousX = newVal;
	},
	tilt: function(value){
		
		var newVal = previousY + (value * 0.1);

		if(newVal > 1 || newVal < -1){
			return;
		}

		setY(newVal);

		previousY = newVal;
	},
	center: function(){
		setX(0);
		setY(0);
	}
}

var previousX = 0;
var previousY = 0;

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
