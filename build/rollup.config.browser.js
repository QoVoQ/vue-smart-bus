import base, { banner } from './rollup.config.base'
import { uglify } from 'rollup-plugin-uglify'

const config = Object.assign({}, base, {
  output: {
    file: 'dist/vue-smart-bus.min.js',
    format: 'iife',
    banner
  },
  name: 'VueSmartBus'
})

config.plugins.push(uglify())

export default config
