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
		this._stream = this.canvas.captureStream(24)
		// https://cs.chromium.org/#chromium/src/third_party/WebKit/LayoutTests/fast/mediarecorder/MediaRecorder-isTypeSupported.html

		this._mediaRecorder = new MediaRecorder(this._stream, this._options)
		this._chunks = []
		var doneTimeout
		function handleDataAvailable(event) {
			// console.log(event.data.size)
			if (event.data.size > 0) {
				this._chunks.push(event.data)
			} else {
			}
			//FIXME: videos are getting clipped...
		}
		this._mediaRecorder.ondataavailable = handleDataAvailable.bind(this)
		this._mediaRecorder.start()

		console.log(this._mediaRecorder)
	},
	status: function(){
		return this._mediaRecorder ? this._mediaRecorder.state : 'ready'
	},
	stop: function(){ 
		var _this = this
		return new Promise(function(resolve, reject){
			_this._mediaRecorder.stop()
			// _this._mediaRecorder.onstop = function(){
			resolve(_this._getBlob())
			// }.bind(this)
		})
	},
	_getBlob: function(){
		return new Blob(this._chunks, {
			type: 'video/webm'
		})
	},
	downloadVideo: function(){
		var url = URL.createObjectURL(this._getBlob())
		var a = document.createElement('a')
		document.body.appendChild(a)
		a.style = 'display: none'
		a.href = url
		a.download = 'temporalis.webm'
		a.click()
  		setTimeout(function () { // setTimeout() here is needed for Firefox.
			window.URL.revokeObjectURL(url)	
		}, 100)
	}
}