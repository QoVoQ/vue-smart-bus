<template>
  <div id="app">
    <div>
      <div>
        <button @click="toggleBusBasic1">destroy/create BusBasic</button>
      </div>
      <BusBasic
        v-if="control.busBasic1"/>
    </div>
    <hr>
    <div>
      <div>
        <button @click="toggleBusBasic2">destroy/create BusBasic</button>
      </div>
      <BusBasic
        v-if="control.busBasic2"/>
    </div>
  </div>
</template>

<script>
import * as EVENTS from './utils/bus-event.js'
import BusBasic from './components/BusBasic.vue'
import { setInterval } from 'timers';

export default {
  name: 'app',
  components: {
    BusBasic
  },
  data() {
    return {
      control: {
        busBasic1: true,
        busBasic2: true
      },
      timer: null
    }
  },
  created() {
    this.timer = setInterval(this.triggerBusEvent, 1000)
    // add bus event listener manually
    this.$bus.$on(EVENTS.ADD_EVENT, this.onAddEvent)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    // remove bus event listener manually
    this.$bus.$off(EVENTS.ADD_EVENT, this.onAddEvent)
  },
  methods: {
    onAddEvent() {
      console.log(`${EVENTS.ADD_EVENT} received in App.vue`)
    },
    toggleBusBasic1() {
      this.control.busBasic1 = !this.control.busBasic1
    },
    toggleBusBasic2() {
      this.control.busBasic2 = !this.control.busBasic2
    },
    triggerBusEvent() {
      // console.log('Triggering bus events')
      // trigger bus events manually
      this.$bus.$emit(EVENTS.ADD_EVENT)
      this.$bus.$emit(EVENTS.MINUS_ONCE_EVENT)
      this.$bus.$emit(EVENTS.MINUS_CONTINUOUSLY_EVENT)
      this.$bus.$emit(
        EVENTS.WITH_ARGS_EVENT,
        +new Date().getSeconds(),
        { event: EVENTS.WITH_ARGS_EVENT }
      )
    }
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
