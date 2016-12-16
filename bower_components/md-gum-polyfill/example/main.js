window.addEventListener('load', function() {
	// Since we have loaded the polyfill before this file (main.js), we can
	// use the non-deprecated version of getUserMedia now!
	
	navigator.mediaDevices.getUserMedia({
		audio: true,
		video: true
	}).then(function(stream) {
		var videoElement = document.querySelector('video');
		videoElement.src = URL.createObjectURL(stream);
		videoElement.hidden = false;
		videoElement.play();
	}, function(error) {
		alert(error.message);
	});
});
