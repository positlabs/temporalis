import { r as registerInstance, d as createEvent, h, H as Host } from './core-d80dcbf2.js';

const CaptureButton = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.isRecording = false;
        this.captureStart = 0;
        this.isDown = false;
        this.snapshot = createEvent(this, "snapshot", 7);
        this.recordStart = createEvent(this, "recordStart", 7);
        this.recordEnd = createEvent(this, "recordEnd", 7);
    }
    onRecordingChanged() {
        this.isRecording ? this.recordStart.emit() : this.recordEnd.emit();
    }
    render() {
        return (h(Host, { onMouseUp: this.onMouseUp.bind(this), onMouseDown: this.onMouseDown.bind(this), onTouchStart: this.onMouseDown.bind(this), onTouchEnd: this.onMouseUp.bind(this), recording: this.isRecording }, h("button", null), h("div", { class: "pulse" })));
    }
    onMouseDown(e) {
        e.preventDefault();
        console.log('onMouseDown');
        const now = Date.now();
        this.captureStart = now;
        this.isDown = true;
        setTimeout(() => {
            // check if we should start recording based on if pointer is still down
            if (this.isDown) {
                this.isRecording = true;
            }
        }, 250);
    }
    onMouseUp(e) {
        e.preventDefault();
        if (!this.isDown)
            return;
        console.log('onMouseUp');
        this.isDown = false;
        if (this.isRecording) {
            this.isRecording = false;
        }
        else {
            this.snapshot.emit();
        }
    }
    static get watchers() { return {
        "isRecording": ["onRecordingChanged"]
    }; }
    static get style() { return "capture-button {\n  width: 80px;\n  height: 80px;\n  -webkit-transition: 0.3s -webkit-transform ease-out;\n  transition: 0.3s -webkit-transform ease-out;\n  transition: 0.3s transform ease-out;\n  transition: 0.3s transform ease-out, 0.3s -webkit-transform ease-out;\n  z-index: 1;\n}\ncapture-button button {\n  background: none;\n  cursor: pointer;\n  border: none;\n  outline: none;\n  width: 100%;\n  height: 100%;\n}\ncapture-button button:after, capture-button button:before {\n  content: \"\";\n  border-radius: 50%;\n  position: absolute;\n}\ncapture-button button:before {\n  background: #333;\n  width: 80%;\n  height: 80%;\n  top: 10%;\n  left: 10%;\n  -webkit-transition: 0.3s background-color ease-out;\n  transition: 0.3s background-color ease-out;\n}\ncapture-button button:after {\n  border: 2px solid white;\n  width: calc(100% - 4px);\n  height: calc(100% - 4px);\n  top: 0;\n  left: 0;\n}\ncapture-button .pulse {\n  opacity: 0;\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  left: 0;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n  z-index: -1;\n  border: 3px solid red;\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n}\ncapture-button[recording] {\n  -webkit-transform: scale(0.95);\n  transform: scale(0.95);\n}\ncapture-button[recording] .pulse {\n  -webkit-animation: 1s pulseAnim cubic-bezier(0.165, 0.84, 0.44, 1) both;\n  animation: 1s pulseAnim cubic-bezier(0.165, 0.84, 0.44, 1) both;\n}\ncapture-button[recording] button:before {\n  background: red;\n}\n\n\@-webkit-keyframes pulseAnim {\n  0% {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    opacity: 0;\n  }\n  50% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n    -webkit-transform: scale(2);\n    transform: scale(2);\n  }\n}\n\n\@keyframes pulseAnim {\n  0% {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    opacity: 0;\n  }\n  50% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n    -webkit-transform: scale(2);\n    transform: scale(2);\n  }\n}"; }
};

export { CaptureButton as capture_button };
