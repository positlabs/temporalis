SlitScan = function () {

	var me = this;
	this.slices = 50;
	this.mode = "vertical";

	var video = dom.add("video"),
		canvas = dom.add("canvas"),
		ctx = canvas.getContext("2d"),
		bufferCanvas = dom.add("canvas"),
		buffCtx = bufferCanvas.getContext("2d"),
		frames = [];

	canvas.id = "slit-scan";
	bufferCanvas.id = "buffer";
	buffCtx.width = 100 * .8;
	buffCtx.height = 66 * .8;

	video.on("play", function () {
		setTimeout(onResize, 1000);
	});

	window.addEventListener("resize", onResize);
	function onResize(){
		video.style.display = "block";
		var scale = Math.min(window.innerWidth / video.offsetWidth, window.innerHeight / video.offsetHeight);
		canvas.style.width = video.offsetWidth * scale + "px";
		canvas.style.height = video.offsetHeight * scale + "px";
		canvas.style.left = window.innerWidth * .5 - video.offsetWidth * scale * .5 + "px";
		canvas.style.top = window.innerHeight * .5 - video.offsetHeight * scale * .5 + "px";
		video.style.display = "none";
		video.autoplay = true;
	}

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	navigator.getUserMedia({
		video: true,
		audio: false
	}, function (localMediaStream) {
		video.src = window.URL.createObjectURL(localMediaStream);
	}, function (e) {
		if (e.code === 1) {
			console.log('User declined permissions.', e);
		}
	});

	this.draw = function () {
		if (video.paused) return;
		me.mode == "vertical" ? drawVert() : drawHorz();

		while (frames.length > me.slices)
			frames.shift();

	};

	function drawVert() {

		var sliceHeight = canvas.height / me.slices;

		// save current frame to array
		buffCtx.drawImage(video, 0, 0, canvas.width, canvas.height);

		// frames array needs to have arrays of slices
		var frameSlices = [];

		for (var i = 0, maxi = me.slices; i < maxi; i++) {
			frameSlices.push(buffCtx.getImageData(0, sliceHeight * i, bufferCanvas.width, sliceHeight));

			try {
				ctx.putImageData(frames[i][i], 0, sliceHeight * i);
			} catch (e) {
			}
		}
		frames.push(frameSlices);

	}

	function drawHorz() {
		var sliceWidth = canvas.width / me.slices;
		buffCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
		var frameSlices = [];
		for (var i = 0, maxi = me.slices; i < maxi; i++) {
			frameSlices.push(buffCtx.getImageData(sliceWidth * i, 0, sliceWidth, bufferCanvas.height));
			try {
				ctx.putImageData(frames[i][i], sliceWidth * i, 0);
			} catch (e) {
			}
		}
		frames.push(frameSlices);
	}

};