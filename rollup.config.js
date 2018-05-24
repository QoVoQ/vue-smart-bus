import { version } from './package.json'
import buble from 'rollup-plugin-buble'
import { uglify } from 'rollup-plugin-uglify'

const banner = `/**
 * vue-smart-bus v${version}
 * https://github.com/QoVoQ/vue-smart-bus
 * @license MIT
 */`

export default {
  input: 'src/index.js',
  output: [{
    file: 'dist/vue-smart-bus.esm.js',
    format: 'es',
    banner
  }, {
    file: 'dist/vue-smart-bus.common.js',
    format: 'iife',
    name: 'VueSmartBus',
    banner
  }, {
    file: 'dist/vue-smart-bus.umd.js',
    format: 'umd',
    name: 'VueSmartBus',
    banner
  }],
  plugins: [
    // uglify(),
    buble()
  ]
}
