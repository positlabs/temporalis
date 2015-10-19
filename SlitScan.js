SlitScan = function () {

	var me = this;
	this.slices = 70;
	this.quality = 7;
	this.mode = 'vertical';
	var maxQuality = 10.5;

	var video = document.createElement('video'),
		canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		bufferCanvas = document.createElement('canvas'),
		buffCtx = bufferCanvas.getContext('2d'),
		frames = [];

	[video, canvas].forEach(function(el){
		document.body.appendChild(el);
	});

	canvas.id = 'slit-scan';
	bufferCanvas.id = 'buffer';

	video.addEventListener('play', function () {
		onResize();
		setTimeout(onResize, 100);
		setTimeout(onResize, 1000);
		draw();
	});

	function onResize(){
		video.style.display = 'block';
		var scale = Math.min(window.innerWidth / video.offsetWidth, window.innerHeight / video.offsetHeight);
		canvas.style.width = video.offsetWidth * scale + 'px';
		canvas.style.height = video.offsetHeight * scale + 'px';
		canvas.style.left = window.innerWidth * 0.5 - video.offsetWidth * scale * 0.5 + 'px';
		canvas.style.top = window.innerHeight * 0.5 - video.offsetHeight * scale * 0.5 + 'px';
		canvas.width = video.videoWidth/(maxQuality-me.quality) || 1;
		canvas.height = video.videoHeight/(maxQuality-me.quality) || 1;
		bufferCanvas.width = canvas.width;
		bufferCanvas.height = canvas.height;
		video.style.display = 'none';
	}
	this.resize = onResize;
	window.addEventListener('resize', onResize);

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	navigator.getUserMedia({
		video: true,
		audio: false
	}, function (localMediaStream) {
		video.addEventListener('loadedmetadata', function(){
			console.log('loadedmetadata');
			onResize();
		});
		video.src = window.URL.createObjectURL(localMediaStream);
		setTimeout(function(){
			video.play();
		}, 500);
	}, function (e) {
		if (e.code === 1) {
			console.log('User declined permissions.', e);
		}
	});

	var draw = function () {
		if (video.paused) return;
		if(me.mode === 'vertical'){
			drawVert();
		}else{
			drawHorz();
		}

		while (frames.length > me.slices){
			frames.shift();
		}
		requestAnimationFrame(draw);
	};

	function drawVert() {

		var bufferSliceHeight = bufferCanvas.height / me.slices;
		var sliceHeight = canvas.height / me.slices;

		// save current frame to array
		buffCtx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, bufferCanvas.width, bufferCanvas.height);

		// frames array needs to have arrays of slices
		var frameSlices = [];

		for (var i = 0, maxi = me.slices; i < maxi; i++) {
			frameSlices.push(buffCtx.getImageData(0, bufferSliceHeight * i, bufferCanvas.width, bufferSliceHeight));

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

	draw();

};