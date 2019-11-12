import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'

// https://stenciljs.com/docs/config
export const config: Config = {
  outputTargets: [
    {
      type: 'www',
      // serviceWorker: null,
      // baseUrl: 'https://positlabs.github.io/temporalis/',
    },
  ],
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.scss',
  plugins: [sass()],
}
