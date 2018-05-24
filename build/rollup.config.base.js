import { version } from '../package.json'
import buble from 'rollup-plugin-buble'

export const banner = `/**
 * vue-smart-bus v${version}
 * https://github.com/QoVoQ/vue-smart-bus
 * @license MIT
 */`

export default {
  input: 'src/index.js',
  plugins: [
    buble()
  ]
}
