import { Component, Host, h, Element, Prop, Watch } from '@stencil/core'

const navi = navigator as any
navigator.getUserMedia =
  navi.getUserMedia ||
  navi.webkitGetUserMedia ||
  navi.mozGetUserMedia ||
  navi.msGetUserMedia

@Component({
  tag: 'slit-scan',
  styleUrl: 'slit-scan.scss',
  // shadow: true
})
export class SlitScan {
  @Prop() mode: string = 'vertical'
  @Prop() cameraId: string = undefined
  @Prop() cameraFacingMode: string = undefined
  @Prop() slices: number = 70
  @Prop({ reflectToAttr: true }) mirror: boolean = true

  @Watch('mode')
  onChangeMode() {
    this.drawMethod = this.mode === 'horizontal' ? this.drawHorz : this.drawVert
  }

  @Watch('cameraId')
  async onChangeCameraId() {
    console.log('onChangeCameraId', this.cameraId)
    const info = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = info.filter(device => device.kind === 'videoinput')
    // ensure the camera exists and initialize if so
    const intitialized = videoDevices
      .map(device => {
        // console.log(device)
        if (device.deviceId === this.cameraId) {
          this.initCamera(device.deviceId)
          return device
        }
        return false
      })
      .filter(d => d)
    // fallback to first cam
    if (!intitialized.length) {
      this.initCamera(videoDevices[0].deviceId)
    }
  }

  @Watch('cameraFacingMode')
  onChangeCameraFacingMode(mode) {
    this.initCamera(null, mode)
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
    this.onChangeMode()
  }

  componentDidLoad() {
    console.log('componentDidLoad')

    this.video = this.el.querySelector('video')
    this.canvas = this.el.querySelector('canvas#slit-scan')
    this.ctx = this.canvas.getContext('2d')
    this.bufferCanvas = this.el.querySelector('canvas#buffer')
    this.buffCtx = this.bufferCanvas.getContext('2d')

    this.ctx.imageSmoothingEnabled = false

    this.video.addEventListener('loadedmetadata', this.onResize.bind(this))
    window.addEventListener('resize', this.onResize.bind(this))

    // TODO set this externally with a video source prop
    // fallback to video file
    // if (!navigator.getUserMedia) {
    //   this.video.src = './assets/dance.mp4'
    //   this.video.play()
    // }

    // this.video.addEventListener('play', () => {
    // update()
    // })

    this.update()
  }

  render() {
    return (
      <Host>
        <video playsinline muted autoplay></video>
        <canvas id="slit-scan"></canvas>
        <canvas id="buffer"></canvas>
      </Host>
    )
  }

  onResize() {
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

    // determine if canvas should cover or be contained
    const videoAspect = this.video.videoHeight / this.video.videoWidth
    const windowAspect = window.innerHeight / window.innerWidth
    const maxAspect = Math.max(videoAspect, windowAspect)
    // normalized aspect diff
    const aspectDiff = Math.abs((videoAspect - windowAspect) / maxAspect)
    this.canvas.style.objectFit = aspectDiff < 0.15 ? 'cover' : 'contain'
    console.log(
      'fit',
      videoAspect,
      windowAspect,
      aspectDiff,
      this.canvas.style.objectFit
    )
  }

  initCamera(cameraID, facingMode = undefined) {
    console.log('initCamera', cameraID)
    var constraints = {
      video: {
        deviceId: undefined,
        facingMode: undefined,
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 60 },
      },
      audio: false,
    }
    if (cameraID) constraints.video.deviceId = cameraID
    else if (facingMode) constraints.video.facingMode = facingMode
    console.log(constraints)

    if (this.stream) {
      console.log('stopping old stream')
      this.video.pause()
      this.stream.getVideoTracks()[0].stop()
    }

    navigator.getUserMedia(
      constraints,
      localMediaStream => {
        this.stream = localMediaStream
        console.log('localMediaStream', this.stream)
        console.log(this.stream.getVideoTracks()[0])
        this.video.srcObject = this.stream
        setTimeout(() => {
          this.video.play()
        }, 500)
      },
      e => {
        console.error(e)
        // TODO handle denial?
        // if (e.code === 1) {
        // 	console.error('User declined permissions.', e)
        // }
      }
    )
  }

  update() {
    // don't draw the same frame more than once
    if (this.video.currentTime !== this.videoPreviousTime) {
      this.draw()
    }
    this.videoPreviousTime = this.video.currentTime
    requestAnimationFrame(this.update.bind(this))
  }

  drawVert() {
    // ceil prevents gaps in slices
    var sliceHeight = Math.ceil(this.canvas.height / this.slices)

    // save current frame to array
    this.buffCtx.drawImage(
      this.video,
      0,
      0,
      this.video.videoWidth,
      this.video.videoHeight,
      0,
      0,
      this.bufferCanvas.width,
      this.bufferCanvas.height
    )
    this.frames.push(
      this.buffCtx.getImageData(
        0,
        0,
        this.bufferCanvas.width,
        this.bufferCanvas.height
      )
    )

    // draw slices to canvas
    var i = this.slices
    while (i--) {
      try {
        this.ctx.putImageData(
          this.frames[i],
          0,
          0,
          0,
          sliceHeight * i,
          this.bufferCanvas.width,
          sliceHeight
        )
      } catch (e) {}
    }
  }

  drawHorz() {
    // ceil prevents gaps in slices
    var sliceWidth = Math.ceil(this.canvas.width / this.slices)

    // save current frame to array
    this.buffCtx.drawImage(
      this.video,
      0,
      0,
      this.video.videoWidth,
      this.video.videoHeight,
      0,
      0,
      this.bufferCanvas.width,
      this.bufferCanvas.height
    )
    this.frames.push(
      this.buffCtx.getImageData(
        0,
        0,
        this.bufferCanvas.width,
        this.bufferCanvas.height
      )
    )

    // draw slices to canvas
    var i = this.slices
    while (i--) {
      try {
        this.ctx.putImageData(
          this.frames[i],
          0,
          0,
          sliceWidth * i,
          0,
          sliceWidth,
          this.bufferCanvas.height
        )
      } catch (e) {}
    }
  }

  draw() {
    if (this.video.paused) return
    this.drawMethod()
    while (this.frames.length > this.slices) {
      this.frames.shift()
    }
  }
}
