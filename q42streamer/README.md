# What be this

No-hassle videostreaming that just works.

* Has a local raspberry pi push to the cloud, so no opening up local firewalls, no overloading pi's with too many viewers, no security risks etc.
* Has a lightweight cloud component that scales easily to many viewers
* Relatively low video bandwidth (~ 800kbit/s = 100Kb/s). No audio.
* Video viewer in javascript, low CPU, runs on anything including mobile web browsers

# Step 1

Deploy this app on heroku, then run it with `heroku ps:scale web=1`. Give it a URL. Remember it. eg. http://q42-live-fun.herokuapp.com/
*Use at least a hobby level dyno. Free dynos get shut down 6 out of 24 hours in a day.*

# Step 2

On a raspberry pi,

* `cd ~`
* `mkdir stream`
* `npm install avconv`
* put avconv.js from this repo in ~/stream
* edit the *params* to fit your cam (default is an usb webcam)
* edit *host* in post_options to the hostname of your heroku app URL above
* `sudo crontab -e`
* add

```
* * * * * ps -A | grep avconv || node /home/pi/stream/avconv.js
0 4 * * * sudo reboot
```
and save. cron should update, reboot to be sure. This crontab checks if the streaming runs every minute and relaunches it if not. It also reboots the Pi at 4am daily to mop up memory leaks from avconv, node.js modules etc. In effect, your streaming should never be 'down' more than one minute every day (random time) plus one or two minutes every 4am.

# Step 3

Test by going to /test on your new Heroku URL.
To actually use, put stream-example.html and jsmpg.js somewhere, edit the client websocket URL to the same Heroku URL, and integrate them into your web app.

# Step 4

You're done.

# Who?

ALL of this is the work of Phoboslab and their cool jsmpeg.js. https://github.com/phoboslab/jsmpeg
What we added was stable streaming, a basic set of endpoints incuding a test, and workable restarting, notably the wrapper around avconv.
