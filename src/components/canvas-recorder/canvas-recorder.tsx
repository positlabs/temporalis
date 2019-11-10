import { Component, Host, h, Element, Prop, Method } from '@stencil/core'

const {MediaRecorder} = window as any

@Component({
  tag: 'canvas-recorder',
  styleUrl: 'canvas-recorder.scss',
  // shadow: true
})
export class CanvasRecorder {

  @Element() el: HTMLElement
  @Prop() canvas: HTMLCanvasElement

  mediaRecorder: any
  stream: any
  options: any

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    )
  }

  componentDidLoad() {
    this.canvas = this.el.querySelector('canvas')

    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      this.options = {mimeType: 'video/webm; codecs=vp9'}
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
      this.options = {mimeType: 'video/webm; codecs=vp8'}
    } else {
      // hopefully something is supported...
    }
  }

  @Method()
  async isSupported() {
    const canvas = document.createElement('canvas') as any
    return canvas.captureStream !== undefined
  }

  @Method()
  async start(){
    this.stream = (this.canvas as any).captureStream(24)
    // https://cs.chromium.org/#chromium/src/third_party/WebKit/LayoutTests/fast/mediarecorder/MediaRecorder-isTypeSupported.html

    this.mediaRecorder = new MediaRecorder(this.stream, this.options)
    this.mediaRecorder.start()

    console.log(this.mediaRecorder)
  }

  @Method()
  async status(){
    return this.mediaRecorder ? this.mediaRecorder.state : 'ready'
  }

  @Method()
  async stop(){
    return new Promise((resolve, reject) => {
      this.mediaRecorder.stop()
      this.mediaRecorder.ondataavailable = (event) => {
        resolve(event.data)
        this.saveVideo(event.data)
      }
      this.mediaRecorder.onerror = reject
    })
  }

  downloadURL(url, filename) {
    const a = document.createElement('a') as HTMLAnchorElement
    document.body.appendChild(a)
    a.setAttribute('style', 'display: none')
    a.href = url
    a.download = filename
    a.click()
  }

  saveVideo(blob){
    // console.log('Recorder.downloadVideo', blob)
    const url = URL.createObjectURL(blob)
    this.downloadURL(url, 'temporalis.webm')
    setTimeout(() => { // setTimeout() here is needed for Firefox.
      window.URL.revokeObjectURL(url)
    }, 100)
  }

  @Method()
  async saveImage() {
    var image = this.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    this.downloadURL(image, 'temporalis.png')
  }
}
