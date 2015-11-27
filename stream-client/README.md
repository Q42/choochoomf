# Stream client
Put this app on a Raspberry Pi.

## Setup
1. `npm install`
2. Enable the Raspberry Pi Camera if you haven't already (`sudo raspi-config`)
3. Use `start.sh` to run app.
4. Add this to your root crontab:
```
* * * * * ps -A | grep start.sh || node /home/pi/stream-client/start.sh
0 4 * * * sudo reboot
```
