navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

SlitScan = function () {

	console.log('SlitScan')

	var lastDrawTime = 0

	var video = document.createElement('video'),
		canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		bufferCanvas = document.createElement('canvas'),
		buffCtx = bufferCanvas.getContext('2d'),
		frames = [],
		_camera = '',
		stream = undefined,
		videoPreviousTime = -1

	// needed for ios 11 
	video.attributes.playsinline = true
	video.attributes.muted = true
	video.attributes.autoplay = true

	ctx.imageSmoothingEnabled = false

	var options = {
		video: video,
		canvas: canvas,
		get camera(){ return _camera },
		set camera(value){
			console.log('set camera', value)
			_camera = value
			navigator.mediaDevices.enumerateDevices().then(function(info) {
				info.map(function(device){
					// console.log(device)
					if(device.label === value){
						if(device.label.indexOf('back') !== -1){
							canvas.classList.remove('mirror')
						}else{
							canvas.classList.add('mirror')
						}
						initCamera(device.deviceId)
					}
				})
			})
		},
		slices: 70,
		mode: 'vertical',
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

	// video.addEventListener('play', function () {
		// update()
	// })

	video.addEventListener('loadedmetadata', function(){
		onResize()
	})

	function onResize(){
		video.style.display = 'block'

		// scale this down to max dimension of 1280
		var scale = 1280 / Math.max(video.videoWidth, video.videoHeight)
		var w = video.videoWidth * scale
		var h = video.videoHeight * scale

		//canvas is same size as incoming video
		canvas.width = w
		canvas.height = h
		bufferCanvas.width = w
		bufferCanvas.height = h
		video.style.display = 'none'
	}
	window.addEventListener('resize', onResize)

	if(navigator.getUserMedia){

	}else{
		video.src = './dance.mp4'
		video.play()
	}

	function initCamera(cameraID){
		console.log('initCamera', cameraID)
		var constraints = {
			video: {
				deviceId: cameraID,
				width: {ideal: 1280},
				height: {ideal: 720},
				frameRate: {ideal: 60}
			},
			audio: false
		}
		console.log(constraints)

		if(stream) {
			console.log('stopping old stream')
			video.pause()
			stream.getVideoTracks()[0].stop()
		}
		
		navigator.getUserMedia(constraints, function (localMediaStream) {
			console.log('!!!localMediaStream', localMediaStream)
			stream = localMediaStream
			console.log(localMediaStream.getVideoTracks()[0])
			video.src = window.URL.createObjectURL(localMediaStream)
			setTimeout(function(){
				video.play()
			}, 500)
		}, function (e) {
			console.error(e)
			if (e.code === 1) {
				console.error('User declined permissions.', e)
			}
		})
	}

	var update = function(){
		// console.log(video.currentTime)
		// don't draw the same frame more than once
		if(video.currentTime !== videoPreviousTime){
			draw()
		}
		videoPreviousTime = video.currentTime

		// stats.update()
		requestAnimationFrame(update)
	}

	function drawVert() {

		// ceil prevents gaps in slices
		var sliceHeight = Math.ceil(canvas.height / options.slices)

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

		// ceil prevents gaps in slices
		var sliceWidth = Math.ceil(canvas.width / options.slices)

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

	update()

	return options
}