// https://jeffy.info/google-youtube-upload/components/google-youtube-upload/
// https://developers.google.com/web/updates/2016/01/mediarecorder
window.Recorder = function(canvas){
	this.canvas = canvas

	if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
		this._options = {mimeType: 'video/webm; codecs=vp9'}
	} else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
		this._options = {mimeType: 'video/webm; codecs=vp8'}
	} else {
		// ...
	}
}

window.Recorder.supported = function(){
	return document.createElement('canvas').captureStream !== undefined
}

Recorder.prototype = {
	start: function(){
		this._stream = this.canvas.captureStream()
		// https://cs.chromium.org/#chromium/src/third_party/WebKit/LayoutTests/fast/mediarecorder/MediaRecorder-isTypeSupported.html

		this._mediaRecorder = new MediaRecorder(this._stream, this._options)
		this._chunks = []
		function handleDataAvailable(event) {
			if (event.data.size > 0) {
				this._chunks.push(event.data)
			} else {
			}
		}
		this._mediaRecorder.ondataavailable = handleDataAvailable.bind(this)
		this._mediaRecorder.start()

		console.log(this._mediaRecorder)
	},
	status: function(){
		return this._mediaRecorder ? this._mediaRecorder.state : 'ready'
	},
	stop: function(){
		this._mediaRecorder.stop()
	},
	getBlob: function(){
		return new Blob(this._chunks, {
			type: 'video/webm'
		})
	},
	downloadVideo: function(){
		var url = URL.createObjectURL(this.getBlob())
		var a = document.createElement('a')
		document.body.appendChild(a)
		a.style = 'display: none'
		a.href = url
		a.download = 'temporalis.webm'
		a.click()
		window.URL.revokeObjectURL(url)
	}
}