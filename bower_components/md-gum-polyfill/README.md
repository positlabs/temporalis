# mediaDevices-getUserMedia-polyfill

> A polyfill to use the Promise-flavoured, `mediaDevices` based version of getUserMedia, in browsers that support *some sort* of getUserMedia.

With this polyfill you can access getUserMedia like this:

```javascript
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(function(stream) {

}, function(error) {

});
```

versus the old version:

```javascript
navigator.getUserMedia({ video: true, audio: true }, function(stream) {

}, function(error) {

});
```

Look at [index.html](example/index.html) and [main.js](./example/main.js) in the [example](./example) folder to see how to use the result of the stream to display a video on screen when successful, or how to detect errors and showing a message to the user.

Here is a list of [browser support for WebRTC / getUserMedia](http://iswebrtcreadyyet.com/).

## Using the polyfill

Always make sure it's included before anything else that uses `getUserMedia` in your code.

### Option A: include the script

Download and save [the polyfill code](https://raw.githubusercontent.com/mozdevs/mediaDevices-getUserMedia-polyfill/master/mediaDevices-getUserMedia-polyfill.js) and include it in your own code:

```html
<head>
	// ... more stuff
	<script src="mediaDevices-getUserMedia-polyfill.js" defer></script>
	<script src="other-code-using-getUserMedia.js" defer></script>
	// ... maybe more stuff
</head>
```

### Option B: use npm

If you prefer to use npm to manage your dependencies:

Install the polyfill:

```bash
npm install --save md-gum-polyfill
```

And load it with `require` before using code that uses `getUserMedia`:

```javascript
require('md-gum-polyfill');

// ... code using getUserMedia...
```
