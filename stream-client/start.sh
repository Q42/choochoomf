#!/bin/bash
sudo modprobe bcm2835-v4l2
killall avconv
node /home/pi/choochoomf/stream-client/avconv.js
