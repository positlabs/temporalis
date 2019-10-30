import { Component, Host, h, Element, Prop, Watch } from '@stencil/core'

const navi = navigator as any
navigator.getUserMedia = navi.getUserMedia || navi.webkitGetUserMedia || navi.mozGetUserMedia || navi.msGetUserMedia

@Component({
  tag: 'slit-scan',
  styleUrl: 'slit-scan.css',
  shadow: true
})
export class SlitScan {
  @Prop() mode: string = ''
  @Prop() camera: string = undefined
  @Prop() slices: number = 70

  @Watch('mode')
  onChangeMode() {
    this.drawMethod = this.mode === 'horizontal' ? this.drawHorz : this.drawVert
  }

  @Watch('camera')
  async onChangeCamera() {
    console.log('onChangeCamera', this.camera)
    const info = await navigator.mediaDevices.enumerateDevices()
    info.filter(device => device.kind === 'videoinput').map((device) => {
      // console.log(device)
      if (device.label === this.camera) {
        if(device.label.indexOf('back') !== -1){
          this.canvas.classList.remove('mirror')
        }else{
          this.canvas.classList.add('mirror')
        }
        this.initCamera(device.deviceId)
      }
    })
  }

  @Element() el: HTMLElement

  video: HTMLVideoElement
  canvas: HTMLCanvasElement
  bufferCanvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  buffCtx: CanvasRenderingContext2D
  videoPreviousTime: number = -1
  frames: Array<ImageData> = []
  stream: MediaStream
  drawMethod: Function

  constructor() {

  }

  componentDidLoad() {
    console.log('componentDidLoad')

    this.video = this.el.shadowRoot.querySelector('video')
    this.canvas = this.el.shadowRoot.querySelector('canvas#slit-scan')
    this.ctx = this.canvas.getContext('2d')
    this.bufferCanvas = this.el.shadowRoot.querySelector('canvas#buffer')
    this.buffCtx = this.bufferCanvas.getContext('2d')

    this.ctx.imageSmoothingEnabled = false

    this.video.addEventListener('loadedmetadata', this.onResize.bind(this))
    window.addEventListener('resize', this.onResize.bind(this))

    // fallback to video file
    if (!navigator.getUserMedia) {
      this.video.src = './assets/dance.mp4'
      this.video.play()
    }

    // this.video.addEventListener('play', () => {
    // update()
    // })

    // TODO don't do this here. It should happen when props are set from the app
    this.mode = 'vertical'
    this.camera = 'FaceTime HD Camera'

    this.update()
  }

  render() {
    return (
      <Host>
        <video playsinline muted autoplay></video>
        <canvas id='slit-scan'></canvas>
        <canvas id='buffer'></canvas>
      </Host>
    )
  }

  onResize(){
    this.video.style.display = 'block'

    // scale this down to max dimension of 1280
    var scale = 1280 / Math.max(this.video.videoWidth, this.video.videoHeight)
    var w = this.video.videoWidth * scale
    var h = this.video.videoHeight * scale

    // canvas is same size as incoming video
    this.canvas.width = w
    this.canvas.height = h
    this.bufferCanvas.width = w
    this.bufferCanvas.height = h
    this.video.style.display = 'none'
  }

  initCamera(cameraID){
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

    if(this.stream) {
      console.log('stopping old stream')
      this.video.pause()
      this.stream.getVideoTracks()[0].stop()
    }

    navigator.getUserMedia(constraints, (localMediaStream) => {
      this.stream = localMediaStream
      console.log('localMediaStream', this.stream)
      console.log(this.stream.getVideoTracks()[0])
      this.video.srcObject = this.stream
      setTimeout(() => {
        this.video.play()
      }, 500)
    }, (e) => {
      console.error(e)
      // if (e.code === 1) {
      // 	console.error('User declined permissions.', e)
      // }
    })
  }

  update(){
    // don't draw the same frame more than once
    if(this.video.currentTime !== this.videoPreviousTime){
      this.draw()
    }
    this.videoPreviousTime = this.video.currentTime
    requestAnimationFrame(this.update.bind(this))
  }

  drawVert() {

    // ceil prevents gaps in slices
    var sliceHeight = Math.ceil(this.canvas.height / this.slices)

    // save current frame to array
    this.buffCtx.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight, 0, 0, this.bufferCanvas.width, this.bufferCanvas.height)
    this.frames.push(this.buffCtx.getImageData(0, 0, this.bufferCanvas.width, this.bufferCanvas.height))

    // draw slices to canvas
    var i = this.slices
    while (i--) {
      try {
        this.ctx.putImageData(this.frames[i], 0, 0, 0, sliceHeight * i, this.bufferCanvas.width, sliceHeight)
      } catch (e) {
      }
    }
  }

  drawHorz() {

    // ceil prevents gaps in slices
    var sliceWidth = Math.ceil(this.canvas.width / this.slices)

    // save current frame to array
    this.buffCtx.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight, 0, 0, this.bufferCanvas.width, this.bufferCanvas.height)
    this.frames.push(this.buffCtx.getImageData(0, 0, this.bufferCanvas.width, this.bufferCanvas.height))

    // draw slices to canvas
    var i = this.slices
    while (i--) {
      try {
        this.ctx.putImageData(this.frames[i], 0, 0, sliceWidth * i, 0, sliceWidth, this.bufferCanvas.height)
      } catch (e) {
      }
    }
  }

  draw () {
    if (this.video.paused) return
    this.drawMethod()
    while (this.frames.length > this.slices){
      this.frames.shift()
    }
  }
}

