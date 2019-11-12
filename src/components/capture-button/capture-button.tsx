import { Component, Host, h, Event, State, Watch } from '@stencil/core'

@Component({
  tag: 'capture-button',
  styleUrl: 'capture-button.scss',
})
export class CaptureButton {
  @Event() snapshot
  @Event() recordStart
  @Event() recordEnd

  @State() isRecording: boolean = false
  @Watch('isRecording') onRecordingChanged() {
    this.isRecording ? this.recordStart.emit() : this.recordEnd.emit()
  }

  captureStart: number = 0
  isDown: boolean = false

  render() {
    return (
      <Host
        onMouseUp={this.onMouseUp.bind(this)}
        onMouseDown={this.onMouseDown.bind(this)}
        onTouchStart={this.onMouseDown.bind(this)}
        onTouchEnd={this.onMouseUp.bind(this)}
        recording={this.isRecording}
      >
        <button></button>
      </Host>
    )
  }
  onMouseDown() {
    const now = Date.now()
    // throttling clicks
    if (this.captureStart && now - this.captureStart < 200) return
    console.log('onMouseDown')
    this.captureStart = now
    this.isDown = true
    setTimeout(() => {
      // check if we should start recording based on if pointer is still down
      if (this.isDown) {
        this.isRecording = true
      }
    }, 300)
  }
  onMouseUp() {
    if (!this.isDown) return
    console.log('onMouseUp')

    this.isDown = false
    if (this.isRecording) {
      this.isRecording = false
    } else {
      this.snapshot.emit()
    }
  }
}
