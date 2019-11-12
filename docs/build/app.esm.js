import { p as patchBrowser, g as globals, b as bootstrapLazy } from './core-6c493d3a.js';

patchBrowser().then(options => {
  globals();
  return bootstrapLazy([["canvas-recorder",[[4,"canvas-recorder",{"canvas":[16],"isSupported":[64],"start":[64],"status":[64],"stop":[64],"saveImage":[64]}]]],["capture-button",[[0,"capture-button",{"isRecording":[32]}]]],["slit-scan",[[0,"slit-scan",{"mode":[1],"cameraId":[1,"camera-id"],"slices":[2],"mirror":[516]}]]],["temporalis-app",[[0,"temporalis-app",{"mode":[32],"cameraId":[32],"slices":[32],"recording":[32],"mirror":[32],"facingMode":[32]}]]]], options);
});
