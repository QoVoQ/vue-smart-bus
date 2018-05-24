import base, { banner } from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    file: 'dist/vue-smart-bus.esm.js',
    format: 'es',
    banner
  }
})

export default config
