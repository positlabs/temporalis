import { Component, Host, h, Element, State } from '@stencil/core'

@Component({
  tag: 'temporalis-app',
  styleUrl: 'temporalis-app.scss',
  // shadow: true
})
export class TemporalisApp {
  @Element() el: HTMLElement

  slitscan: HTMLSlitScanElement
  recorder: HTMLCanvasRecorderElement

  @State() recording: boolean = false

  render() {
    const recordBtnLabel = this.recording ? 'stop recording' : 'start recording'
    return (
      <Host>
        <canvas-recorder>
          <slit-scan></slit-scan>
        </canvas-recorder>
        <div class="controls">
          <button onClick={this.onClickSnapshot.bind(this)}>snapshot</button>
          <button onClick={this.onClickRecord.bind(this)}>{recordBtnLabel}</button>
          <input type="range" min="20" max="500" onInput={this.onChangeSlices.bind(this)}/>
        </div>
      </Host>
    )
  }
  componentDidLoad() {
    this.slitscan = this.el.querySelector('slit-scan') as HTMLSlitScanElement
    this.recorder = this.el.querySelector('canvas-recorder') as HTMLCanvasRecorderElement

    // load settings from localstorage
    const mode = localStorage.getItem('mode')
    const camera = localStorage.getItem('camera')
    const slices = parseInt(localStorage.getItem('slices')) || 80
    this.slitscan.mode = mode || 'vertical'
    this.slitscan.camera = camera
    this.slitscan.slices = slices
  }

  // TODO store settings in localstorage

  onClickSnapshot() {
    this.recorder.saveImage()
  }

  onClickRecord() {
    this.recording ? this.recorder.stop() : this.recorder.start()
    this.recording = !this.recording
  }
  onChangeSlices(e) {
    this.slitscan.slices = e.target.value
  }
}
