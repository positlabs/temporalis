
SlitScan = function () {

	var lastDrawTime = 0

	var video = document.createElement('video'),
		canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		bufferCanvas = document.createElement('canvas'),
		buffCtx = bufferCanvas.getContext('2d'),
		frames = []

	var options = {
		video: video,
		canvas: canvas,
		slices: 70,
		mode: 'vertical',
		throttle: false
	}

	document.body.appendChild(video)
	document.body.appendChild(canvas)

	canvas.id = 'slit-scan'
	bufferCanvas.id = 'buffer'

	//add stats
	// stats = new Stats()
	// document.body.appendChild(stats.domElement)
	// stats.domElement.id = "stats"
	// stats.domElement.style.position = 'absolute'
	// stats.domElement.style.top = '0'
	// stats.domElement.style.left = '0'

	video.addEventListener('play', function () {
		update()
	})

	video.addEventListener('loadedmetadata', function(){
		onResize()
	})

	function onResize(){
		video.style.display = 'block'
		var scale = Math.min(window.innerWidth / video.offsetWidth, window.innerHeight / video.offsetHeight)
		canvas.style.width = video.offsetWidth * scale + 'px'
		canvas.style.height = video.offsetHeight * scale + 'px'
		canvas.style.left = window.innerWidth * 0.5 - video.offsetWidth * scale * 0.5 + 'px'
		canvas.style.top = window.innerHeight * 0.5 - video.offsetHeight * scale * 0.5 + 'px'
		//canvas is same size as incoming video
		canvas.width = video.videoWidth || 1
		canvas.height = video.videoHeight || 1
		bufferCanvas.width = canvas.width
		bufferCanvas.height = canvas.height
		video.style.display = 'none'
	}
	window.addEventListener('resize', onResize)

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
	// navigator.getUserMedia = false
	if(navigator.getUserMedia){
		canvas.classList.add('mirror')
		navigator.getUserMedia({
			video: {
				optional: [
					//request hi-rez capture
					{ minWidth: 1280 },
					{ minHeight: 720 },
					{ minFrameRate: 60 }
				]
			},
			audio: false
		}, function (localMediaStream) {
			video.src = window.URL.createObjectURL(localMediaStream)
			setTimeout(function(){
				video.play()
			}, 500)
		}, function (e) {
			if (e.code === 1) {
				console.log('User declined permissions.', e)
			}
		})
	}else{
		video.src = './dance.mp4'
		video.play()
	}

	var update = function(){

		if (options.throttle){
			//throttle to 30 FPS, since on 2014 MacBook Pro, webcam captures at 30fps max.
			if (Date.now() - lastDrawTime >= 1000 / 30) {
				draw()
				lastDrawTime = Date.now()
			}
		}else{
			draw()
		}
		// stats.update()
		requestAnimationFrame(update)

	}

	function drawVert() {

		var sliceHeight = canvas.height / options.slices

		// save current frame to array
		buffCtx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, bufferCanvas.width, bufferCanvas.height)
		frames.push(buffCtx.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height))

		// draw slices to canvas
		var i = options.slices
		while (i--) {
			try {
				ctx.putImageData(frames[i], 0, 0, 0, sliceHeight * i, bufferCanvas.width, sliceHeight)
			} catch (e) {
			}
		}
	}

	function drawHorz() {

		var sliceWidth = canvas.width / options.slices

		// save current frame to array
		buffCtx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, bufferCanvas.width, bufferCanvas.height)
		frames.push(buffCtx.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height))

		// draw slices to canvas
		var i = options.slices
		while (i--) {
			try {
				ctx.putImageData(frames[i], 0, 0, sliceWidth * i, 0, sliceWidth, bufferCanvas.height)
			} catch (e) {
			}
		}
	}

	var drawMethods = {
		vertical: drawVert,
		horizontal: drawHorz
	}
	
	var draw = function () {

		if (video.paused) return
	
		drawMethods[options.mode]()

		while (frames.length > options.slices){
			frames.shift()
		}
	}

	// draw()

	return options
}