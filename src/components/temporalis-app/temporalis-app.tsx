import { Component, Host, h, Element, State, Watch } from '@stencil/core'

const isMobile =
  typeof window.orientation !== 'undefined' ||
  navigator.userAgent.indexOf('IEMobile') !== -1

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
  @Watch('mode') onMode(val) { localStorage.setItem('mode', val) }
  @Watch('cameraId') onCameraId(val) { localStorage.setItem('cameraId', val) }
  @Watch('slices') onSlices(val) { localStorage.setItem('slices', val) }
  @Watch('facingMode') onFacingMode(val) { localStorage.setItem('facingMode', val) }

  constructor() {
    // load settings from localstorage
    this.mode = localStorage.getItem('mode')
    this.slices = parseInt(localStorage.getItem('slices')) || 80
    this.facingMode = localStorage.getItem('facingMode')
  }

  render() {
    const recordBtnLabel = this.recording ? 'stop recording' : 'start recording'
    return (
      <Host>
        <canvas-recorder>
          <slit-scan mode={this.mode} slices={this.slices} cameraId={this.cameraId} mirror={this.mirror}></slit-scan>
        </canvas-recorder>
        <div class="controls">
          <button onClick={this.onClickSnapshot.bind(this)}>snapshot</button>
          <button onClick={this.onClickRecord.bind(this)}>{recordBtnLabel}</button>
          <input type="range" min="20" value={this.slices} max="500" onInput={this.onChangeSlices.bind(this)}/>
          <button id="switch-cam" title="switch camera" onClick={this.onClickSwitchCam.bind(this)}>switch cam</button>
          <button id="mode" title="change mode" onClick={this.onClickToggleMode.bind(this)}>change mode</button>
          <capture-button id="capture" title="capture"
            onSnapshot={this.onClickSnapshot.bind(this)}
            onRecordStart={this.onRecordStart.bind(this)}
            onRecordEnd={this.onRecordEnd.bind(this)}
          >capture</capture-button>
        </div>
      </Host>
    )
  }
  async componentDidLoad() {
    this.recorder = this.el.querySelector('canvas-recorder') as HTMLCanvasRecorderElement
    this.cameraId = localStorage.getItem('cameraId')
    if (!this.cameraId) {
      const cameras = await this.getCameras()
      this.cameraId = cameras[0].deviceId
    }
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
      const camera = cameras.filter(camera => camera.deviceId === this.cameraId)[0]
      const currentIndex = camera ? cameras.indexOf(camera) : 0
      const nextIndex = (currentIndex + 1) % cameras.length
      this.cameraId = cameras[nextIndex].deviceId
      console.log('onClickCamSwitch', currentIndex, nextIndex)
      this.mirror = true
    }
  }

  onClickToggleMode() {
    this.mode === 'vertical' ? this.mode = 'horizontal' : this.mode = 'vertical'
  }
}
