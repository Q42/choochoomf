# What be this

No-hassle videostreaming that just works.

* Has a local raspberry pi push to the cloud, so no opening up local firewalls, no overloading pi's with too many viewers, no security risks etc.
* Has a lightweight cloud component that scales easily to many viewers
* Relatively low video bandwidth (~ 800kbit/s = 100Kb/s). No audio.
* Video viewer in javascript, low CPU, runs on anything including mobile web browsers

# Step 1

1. `npm install`
2. Deploy this app on heroku, then run it with `heroku ps:scale web=1`. Give it a URL. Remember it. eg. http://q42-live-fun.herokuapp.com/
*Use at least a hobby level dyno. Free dynos get shut down 6 out of 24 hours in a day.*

# Step 2

Set up the stream-client on your raspberry pi.

# Step 3

Test by going to /test on your new Heroku URL.
To actually use, put stream-example.html and jsmpg.js somewhere, edit the client websocket URL to the same Heroku URL, and integrate them into your web app.

# Step 4

You're done.

# Who?

ALL of this is the work of Phoboslab and their cool jsmpeg.js. https://github.com/phoboslab/jsmpeg
What we added was stable streaming, a basic set of endpoints incuding a test, and workable restarting, notably the wrapper around avconv.
