var piblaster = require('pi-blaster.js');

var PAN = 'PAN';
var TILT = 'TILT';
var NONE = 'NONE';
var LOOPRATE = 1000/20;
var MOTOR_COOLDOWN = 500;
var STEP_SIZE = 0.1;

var initializing = false;

module.exports = {

	panTo: function (panValue) {
		if(initializing) return;

		if(panValue < -1) panValue = -1;
		if(panValue > 1) panValue = 1;
		targetPan = panValue;
		activateGameLoop();
	},
	tiltTo: function (tiltValue) {
		if(initializing) return;

		if(tiltValue < -1) tiltValue = -1;
		if(tiltValue > 1) tiltValue = 1;
		targetTilt = tiltValue;
		activateGameLoop();
	},
	panTiltTo: function(panValue, tiltValue) {
		this.panTo(panValue);
		this.tiltTo(tiltValue);
	},
	panDelta: function(value){
		this.panTo(currentPan + value * 0.1);
	},
	tiltDelta: function(value){
		this.tiltTo(currentTilt + value * 0.1);
	},
	center: function() {
		this.panTiltTo(0,0);
	},
	init: function() {
		initializing = true;
		setX(0);
		setTimeout(function() {
			setY(0);
			setTimeout(function () {
				initializing = false;
			}, 2000);
		}, 2000);
	}
}

var currentPan = 0;
var currentTilt = 0;
var targetPan = 0;
var targetTilt = 0;

var backoffTimer = 0;
var lastAction = NONE;
var gameLoopActive = false;

function continueGameLoop() {
	gameLoopActive = true;
	setTimeout(gameLoop, LOOPRATE);
}

function activateGameLoop() {
	if(!gameLoopActive) {
		gameLoopActive = true;
		gameLoop();
	}
}

function gameLoop() {
	if(backoffTimer > 0)
	{
		backoffTimer -= LOOPRATE;
		if (backoffTimer < 0) backoffTimer = 0;
		continueGameLoop();
	}
	else if(targetPan != currentPan)
	{
		if(lastAction != PAN) {
			backoffTimer += MOTOR_COOLDOWN;
		}
		else {
			currentPan = stepValueTowards(currentPan, targetPan, STEP_SIZE);
			setX(currentPan);
		}
		lastAction = PAN;
		continueGameLoop();
	}
	else if(targetTilt != currentTilt)
	{
		if(lastAction != TILT) {
			backoffTimer += MOTOR_COOLDOWN;
		}
		else {
			currentTilt = stepValueTowards(currentTilt, targetTilt, STEP_SIZE);
			setY(currentTilt);
		}
		lastAction = TILT;
		continueGameLoop();
	}
	gameLoopActive = false;
}

function stepValueTowards(cur, tgt, step) {
	if(tgt > cur) {
		cur += step;
		if(cur > tgt) cur = tgt;
	}
	if(tgt < cur) {
		cur -= step;
		if(cur < tgt) cur = tgt;
	}
	return cur;
}

function setX(val){
	var x = computeX(val);

	console.log('Position', x);
	piblaster.setPwm(21, x);
}

function setY(val){
	var y = computeY(val);

	console.log('Position', y);
	piblaster.setPwm(4, y);
}

function computeX(value){
	return (0.15+value/10);
}

function computeY(value){
	return (0.15+value/10);
}
