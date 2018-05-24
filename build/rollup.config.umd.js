import base, { banner } from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    file: 'dist/vue-smart-bus.umd.js',
    format: 'umd',
    banner
  },
  name: 'VueSmartBus'
})

export default config
