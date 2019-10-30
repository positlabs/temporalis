import { Component, Host, h } from '@stencil/core'

@Component({
  tag: 'temporalis-app',
  styleUrl: 'temporalis-app.css',
  shadow: true
})
export class TemporalisApp {

  render() {
    return (
      <Host>
        <slit-scan></slit-scan>
      </Host>
    )
  }

}
