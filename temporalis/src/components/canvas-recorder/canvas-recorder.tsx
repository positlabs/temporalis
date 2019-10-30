import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'canvas-recorder',
  styleUrl: 'canvas-recorder.css',
  shadow: true
})
export class CanvasRecorder {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
