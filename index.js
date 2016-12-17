var $ = function(selector){return document.querySelector(selector)}

var ss = new SlitScan(), 
	gifStatus = $('#gif-status'),
	gifInterval,
	signedIn

var gui = new dat.GUI()
gui.add(ss, 'slices', 0, 400).step(1)
gui.add(ss, 'mode', ['vertical', 'horizontal'])
gui.add(ss, 'throttle', false)

navigator.mediaDevices.enumerateDevices().then(function(info) {
	var videoInputs = []
	info.forEach(function(device){
		if(device.kind === 'videoinput') videoInputs.push(device)
	})
	if(videoInputs.length < 2) return
	var labels = videoInputs.map(function(device){ return device.label })
	gui.add(ss, 'camera', labels)
	ss.camera = labels[0]
})

gui.add({
	fullscreen: function(){
		var el = document.documentElement
		var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen
		rfs.call(el)
	}
}, "fullscreen")

gui.add({
	"save image": function(){
		window.open($('#slit-scan').toDataURL(), '_blank')
	}
}, "save image")

if(!Recorder.supported){

	var isRecordingGif = false
	var gif
	gui.add({
		"record gif": function(){
			if(isRecordingGif){
				
				isRecordingGif = false
				clearInterval(gifInterval)
				gif.render()
				console.log('done getting gif frames')
				gifStatus.innerHTML = 'processing...'
				return

			}else{
				isRecordingGif = true
			}

			console.log('starting gif recording')

			gifStatus.style.opacity = 1
			gifStatus.innerHTML = 'recording...'

			var downsizeBy = 3
			var tempCanvas = document.createElement('canvas')
			tempCanvas.width = Math.round(ss.canvas.width / downsizeBy)
			tempCanvas.height = Math.round(ss.canvas.height / downsizeBy)
			var tempCtx = tempCanvas.getContext('2d')

			gif = new GIF({
				workers: 8,
				quality: 10, // lower is better, 10 is default
				workerScript: 'libs/gif.worker.js',
				width: tempCanvas.widht,
				height: tempCanvas.height
			})
			gifInterval = setInterval(function(canvas){
				tempCtx.drawImage(ss.canvas, 0, 0, tempCanvas.width, tempCanvas.height)
				gif.addFrame(tempCanvas, {copy: true, delay: 100})
			}, 200)

			gif.on('finished', function(blob) {
				console.log('finished gif')
				// window.open(URL.createObjectURL(blob))
				var a = document.createElement('a')
				a.href = URL.createObjectURL(blob)
				a.download = "temporalis_" + Date.now() + ".gif"
				a.click()
				gifStatus.innerHTML = ''
				gifStatus.style.opacity = 0
			})
		}
	}, "record gif")
}

if(Recorder.supported){
	var recorder = new Recorder(ss.canvas)

	gui.add({'record video': function(){
		console.log('record video', recorder.state)
		
		if(recorder.status() === 'recording'){
			gifStatus.innerHTML = 'processing...'
			recorder.stop().then(function(blob){
				recorder.downloadVideo()
				if(signedIn){
					$('google-youtube-upload').uploadFile(blob)
				}
				gifStatus.innerHTML = ''
				gifStatus.style.opacity = 0	
			})
		}else{
			recorder.start()
			gifStatus.innerHTML = 'recording...'
			gifStatus.style.opacity = 1
		}
	}}, 'record video')
}

/*
	TODO: events for youtube uploads

	youtube-upload-start
	youtube-upload-progress
	youtube-upload-fail
	youtube-upload-complete
	youtube-processing-poll
	youtube-processing-fail
	youtube-processing-complete
*/ 

$('.media-input input').addEventListener('change', function(e){
	// console.log(e.target.files)
	//TODO: make a method for this in ss
	ss.canvas.classList.remove('mirror')
	ss.video.src = URL.createObjectURL(e.target.files[0])
	ss.video.play()
})

$('google-youtube-upload').addEventListener('signed-in', function(){ signedIn = true })
$('google-youtube-upload').addEventListener('signed-out', function(){ signedIn = false })