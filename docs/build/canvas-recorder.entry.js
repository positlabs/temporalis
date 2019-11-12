import { r as registerInstance, h, H as Host, c as getElement } from './core-6c493d3a.js';

// https://caniuse.com/#search=mediarecorder
const { MediaRecorder } = window;
const CanvasRecorder = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, null, h("slot", null)));
    }
    componentDidLoad() {
        this.canvas = this.el.querySelector('canvas');
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
            this.options = { mimeType: 'video/webm; codecs=vp9' };
        }
        else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
            this.options = { mimeType: 'video/webm; codecs=vp8' };
        }
        else {
            // hopefully something is supported...
        }
    }
    async isSupported() {
        const canvas = document.createElement('canvas');
        return canvas.captureStream !== undefined;
    }
    async start() {
        this.stream = this.canvas.captureStream(24);
        // https://cs.chromium.org/#chromium/src/third_party/WebKit/LayoutTests/fast/mediarecorder/MediaRecorder-isTypeSupported.html
        this.mediaRecorder = new MediaRecorder(this.stream, this.options);
        this.mediaRecorder.start();
        console.log(this.mediaRecorder);
    }
    async status() {
        return this.mediaRecorder ? this.mediaRecorder.state : 'ready';
    }
    async stop() {
        return new Promise((resolve, reject) => {
            this.mediaRecorder.stop();
            this.mediaRecorder.ondataavailable = (event) => {
                resolve(event.data);
                this.saveVideo(event.data);
            };
            this.mediaRecorder.onerror = reject;
        });
    }
    downloadURL(url, filename) {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = filename;
        a.click();
    }
    saveVideo(blob) {
        // console.log('Recorder.downloadVideo', blob)
        const url = URL.createObjectURL(blob);
        this.downloadURL(url, 'temporalis.webm');
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 100);
    }
    async saveImage() {
        var image = this.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        this.downloadURL(image, 'temporalis.png');
    }
    get el() { return getElement(this); }
    static get style() { return ":host {\n  display: block;\n}"; }
};

export { CanvasRecorder as canvas_recorder };
