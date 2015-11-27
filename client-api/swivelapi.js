var piblaster = require('pi-blaster.js');

module.exports = {

	setSwivelX: function(value){
		//piblaster.setPwm(18, computeSwivelX(value));
		console.log(computeSwivelX(value));
	},
	setSwivelY: function(value){
		//piblaster.setPwm(27, computeSwivelY(value));
		console.log(computeSwivelY(value));
	}
}

function computeSwivelX(value){
	var coefficient = ((value + 1) * 0.05) + 0.1;
	return (coefficient % 1)/10 + 0.1
}

function computeSwivelY(value){
	var coefficient = ((value + 1) * 0.05) + 0.1;
	return ((coefficient*1.3) % 1)/10 + 0.1
}
