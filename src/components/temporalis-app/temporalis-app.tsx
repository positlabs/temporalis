import { Component, Host, h, Element, State, Watch } from '@stencil/core'

const isMobile =
  typeof window.orientation !== 'undefined' ||
  navigator.userAgent.indexOf('IEMobile') !== -1

const doc = window.document as any
const docEl = doc.documentElement as any

const requestFullScreen =
  docEl.requestFullscreen ||
  docEl.mozRequestFullScreen ||
  docEl.webkitRequestFullScreen ||
  docEl.msRequestFullscreen
const cancelFullScreen =
  doc.exitFullscreen ||
  doc.mozCancelFullScreen ||
  doc.webkitExitFullscreen ||
  doc.msExitFullscreen

@Component({
  tag: 'temporalis-app',
  styleUrl: 'temporalis-app.scss',
})
export class TemporalisApp {
  @Element() el: HTMLElement

  recorder: HTMLCanvasRecorderElement
  tapDuration: number

  @State() mode: string
  @State() cameraId: string
  @State() slices: number
  @State() recording: boolean = false
  @State() mirror: boolean = true
  @State() facingMode: string = 'user'

  // store settings in localstorage
  @Watch('mode') onMode(val) {
    localStorage.setItem('mode', val)
  }
  @Watch('cameraId') onCameraId(val) {
    localStorage.setItem('cameraId', val)
  }
  @Watch('slices') onSlices(val) {
    localStorage.setItem('slices', val)
  }
  @Watch('facingMode') onFacingMode(val) {
    localStorage.setItem('facingMode', val)
  }

  constructor() {
    // load settings from localstorage
    this.mode = localStorage.getItem('mode')
    this.slices = parseInt(localStorage.getItem('slices')) || 80
    this.facingMode = localStorage.getItem('facingMode')
  }

  render() {
    return (
      <Host>
        <canvas-recorder>
          <slit-scan
            mode={this.mode}
            cameraFacingMode={this.facingMode}
            slices={this.slices}
            cameraId={this.cameraId}
            mirror={this.mirror}
          ></slit-scan>
        </canvas-recorder>
        <input
          id="slices"
          type="range"
          min="20"
          max="500"
          onInput={this.onChangeSlices.bind(this)}
        />
        <button
          id="switch-cam"
          title="switch camera"
          onClick={this.onClickSwitchCam.bind(this)}
        ></button>
        <button
          id="fullscreen"
          title="fullscreen"
          onClick={this.onClickFullscreen.bind(this)}
        ></button>
        <button
          id="mode"
          title="change mode"
          onClick={this.onClickToggleMode.bind(this)}
          data-mode={this.mode}
        ></button>
        <capture-button
          title="capture"
          onSnapshot={this.onClickSnapshot.bind(this)}
          onRecordStart={this.onRecordStart.bind(this)}
          onRecordEnd={this.onRecordEnd.bind(this)}
        ></capture-button>
      </Host>
    )
  }
  async componentDidLoad() {
    this.recorder = this.el.querySelector(
      'canvas-recorder'
    ) as HTMLCanvasRecorderElement
    this.cameraId = localStorage.getItem('cameraId')
    if (!this.cameraId) {
      const cameras = await this.getCameras()
      this.cameraId = cameras[0].deviceId
    }
    const slicesSlider = this.el.querySelector('#slices') as HTMLInputElement
    slicesSlider.value = this.slices.toString()
    console.log(this.cameraId)
  }

  async getCameras() {
    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices.filter(d => d.kind === 'videoinput')
  }

  onClickSnapshot() {
    this.recorder.saveImage()
  }

  onClickRecord() {
    this.recording ? this.recorder.stop() : this.recorder.start()
    this.recording = !this.recording
  }
  onRecordStart() {
    this.recording = true
    this.recorder.start()
  }
  onRecordEnd() {
    this.recording = false
    this.recorder.stop()
  }
  onChangeSlices(e) {
    this.slices = e.target.value
  }

  async onClickSwitchCam() {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const cameras = devices.filter(d => d.kind === 'videoinput')

    // cam switcher logic
    if (isMobile) {
      // toggle facingmode on mobile
      this.facingMode = this.facingMode === 'user' ? 'environment' : 'user'
      this.mirror = this.facingMode === 'user'
    } else {
      // next index behavior only on desktop
      // find current cam object then get index
      const camera = cameras.filter(
        camera => camera.deviceId === this.cameraId
      )[0]
      const currentIndex = camera ? cameras.indexOf(camera) : 0
      const nextIndex = (currentIndex + 1) % cameras.length
      this.cameraId = cameras[nextIndex].deviceId
      console.log('onClickCamSwitch', currentIndex, nextIndex)
      this.mirror = true
    }
  }

  onClickToggleMode() {
    this.mode === 'vertical'
      ? (this.mode = 'horizontal')
      : (this.mode = 'vertical')
  }

  onClickFullscreen() {
    if (
      !doc.fullscreenElement &&
      !doc.mozFullScreenElement &&
      !doc.webkitFullscreenElement &&
      !doc.msFullscreenElement
    ) {
      requestFullScreen.call(docEl)
    } else {
      cancelFullScreen.call(doc)
    }
  }
}
