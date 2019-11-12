import { r as registerInstance, h, H as Host, c as getElement } from './core-6c493d3a.js';

const isMobile = typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1;
const doc = window.document;
const docEl = doc.documentElement;
const requestFullScreen = docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
const cancelFullScreen = doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;
const TemporalisApp = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.recording = false;
        this.mirror = true;
        this.facingMode = 'user';
        // load settings from localstorage
        this.mode = localStorage.getItem('mode');
        this.slices = parseInt(localStorage.getItem('slices')) || 80;
        this.facingMode = localStorage.getItem('facingMode');
    }
    // store settings in localstorage
    onMode(val) {
        localStorage.setItem('mode', val);
    }
    onCameraId(val) {
        localStorage.setItem('cameraId', val);
    }
    onSlices(val) {
        localStorage.setItem('slices', val);
    }
    onFacingMode(val) {
        localStorage.setItem('facingMode', val);
    }
    render() {
        return (h(Host, null, h("canvas-recorder", null, h("slit-scan", { mode: this.mode, cameraFacingMode: this.facingMode, slices: this.slices, cameraId: this.cameraId, mirror: this.mirror })), h("input", { id: "slices", type: "range", min: "20", max: "400", onInput: this.onChangeSlices.bind(this) }), h("button", { id: "switch-cam", title: "switch camera", onClick: this.onClickSwitchCam.bind(this) }), h("button", { id: "fullscreen", title: "fullscreen", onClick: this.onClickFullscreen.bind(this) }), h("button", { id: "mode", title: "change mode", onClick: this.onClickToggleMode.bind(this), "data-mode": this.mode }), h("capture-button", { title: "capture", onSnapshot: this.onClickSnapshot.bind(this), onRecordStart: this.onRecordStart.bind(this), onRecordEnd: this.onRecordEnd.bind(this) })));
    }
    async componentDidLoad() {
        this.recorder = this.el.querySelector('canvas-recorder');
        this.cameraId = localStorage.getItem('cameraId');
        if (!this.cameraId) {
            const cameras = await this.getCameras();
            this.cameraId = cameras[0].deviceId;
        }
        const slicesSlider = this.el.querySelector('#slices');
        slicesSlider.value = this.slices.toString();
        console.log(this.cameraId);
    }
    async getCameras() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(d => d.kind === 'videoinput');
    }
    onClickSnapshot() {
        this.recorder.saveImage();
    }
    onClickRecord() {
        this.recording ? this.recorder.stop() : this.recorder.start();
        this.recording = !this.recording;
    }
    onRecordStart() {
        this.recording = true;
        this.recorder.start();
    }
    onRecordEnd() {
        this.recording = false;
        this.recorder.stop();
    }
    onChangeSlices(e) {
        this.slices = e.target.value;
    }
    async onClickSwitchCam() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(d => d.kind === 'videoinput');
        // cam switcher logic
        if (isMobile) {
            // toggle facingmode on mobile
            this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
            this.mirror = this.facingMode === 'user';
        }
        else {
            // next index behavior only on desktop
            // find current cam object then get index
            const camera = cameras.filter(camera => camera.deviceId === this.cameraId)[0];
            const currentIndex = camera ? cameras.indexOf(camera) : 0;
            const nextIndex = (currentIndex + 1) % cameras.length;
            this.cameraId = cameras[nextIndex].deviceId;
            console.log('onClickCamSwitch', currentIndex, nextIndex);
            this.mirror = true;
        }
    }
    onClickToggleMode() {
        this.mode === 'vertical'
            ? (this.mode = 'horizontal')
            : (this.mode = 'vertical');
    }
    onClickFullscreen() {
        if (!doc.fullscreenElement &&
            !doc.mozFullScreenElement &&
            !doc.webkitFullscreenElement &&
            !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
        }
        else {
            cancelFullScreen.call(doc);
        }
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "mode": ["onMode"],
        "cameraId": ["onCameraId"],
        "slices": ["onSlices"],
        "facingMode": ["onFacingMode"]
    }; }
    static get style() { return "temporalis-app > button {\n  outline: none;\n  border: none;\n  background: none;\n  width: 40px;\n  height: 40px;\n  background: white;\n  border-radius: 50%;\n  background-repeat: no-repeat;\n  background-position: center;\n  position: absolute;\n  right: 35px;\n  cursor: pointer;\n}\ntemporalis-app capture-button {\n  position: absolute;\n  bottom: 15px;\n  right: 15px;\n}\ntemporalis-app #mode {\n  bottom: 105px;\n  background-image: url(\"./assets/menu-24px.svg\");\n  -webkit-transition: 0.5s -webkit-transform cubic-bezier(0.19, 1, 0.22, 1);\n  transition: 0.5s -webkit-transform cubic-bezier(0.19, 1, 0.22, 1);\n  transition: 0.5s transform cubic-bezier(0.19, 1, 0.22, 1);\n  transition: 0.5s transform cubic-bezier(0.19, 1, 0.22, 1), 0.5s -webkit-transform cubic-bezier(0.19, 1, 0.22, 1);\n}\ntemporalis-app #mode[data-mode=horizontal] {\n  -webkit-transform: rotate(90deg);\n  transform: rotate(90deg);\n}\ntemporalis-app #switch-cam {\n  bottom: 155px;\n  background-image: url(\"./assets/flip_camera_ios-24px.svg\");\n}\ntemporalis-app #fullscreen {\n  top: 15px;\n  background-image: url(\"./assets/fullscreen-24px.svg\");\n}\ntemporalis-app #slices {\n  position: absolute;\n  bottom: 25px;\n  right: 105px;\n  width: calc(100% - 105px - 30px);\n  max-width: 300px;\n}\ntemporalis-app input[type=range] {\n  -webkit-appearance: none;\n  /* Hides the slider so that custom slider can be made */\n  width: 100%;\n  height: 20px;\n  /* Specific width is required for Firefox. */\n  background: transparent;\n  /* Otherwise white in Chrome */\n}\ntemporalis-app input[type=range]::-webkit-slider-thumb {\n  -webkit-appearance: none;\n}\ntemporalis-app input[type=range]:focus {\n  outline: none;\n  /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */\n}\ntemporalis-app input[type=range]::-ms-track {\n  width: 100%;\n  cursor: pointer;\n  /* Hides the slider so custom styles can be added */\n  background: transparent;\n  border-color: transparent;\n  color: transparent;\n}\ntemporalis-app input[type=range]::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  border: 1px solid white;\n  height: 20px;\n  width: 20px;\n  border-radius: 50%;\n  background: #333;\n  cursor: pointer;\n  margin-top: -9px;\n  /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */\n}\ntemporalis-app input[type=range]::-moz-range-thumb {\n  -webkit-appearance: none;\n  border: 1px solid white;\n  height: 20px;\n  width: 20px;\n  border-radius: 50%;\n  background: #333;\n  cursor: pointer;\n}\ntemporalis-app input[type=range]::-ms-thumb {\n  -webkit-appearance: none;\n  border: 1px solid white;\n  height: 20px;\n  width: 20px;\n  border-radius: 50%;\n  background: #333;\n  cursor: pointer;\n}\ntemporalis-app input[type=range]::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 1px;\n  cursor: pointer;\n  background: white;\n  border-radius: 50%;\n}\ntemporalis-app input[type=range]:focus::-webkit-slider-runnable-track {\n  background: white;\n}\ntemporalis-app input[type=range]::-moz-range-track {\n  width: 100%;\n  height: 1px;\n  cursor: pointer;\n  background: white;\n  border-radius: 50%;\n}"; }
};

export { TemporalisApp as temporalis_app };
