<template>
  <div class="bus-basic-ctn">
    <p>counter.increaseOnlyOnce: {{ counter.increaseOnlyOnce }}</p>
    <p>counter.increaseContinously: {{ counter.increaseContinously }}</p>
    <p>counter.minusContinously: {{ counter.minusContinously }}</p>
    <p>counter.minusOnlyOnce: {{ counter.minusOnlyOnce }}</p>
    <p>bus event args: {{ busEventArgs }}</p>
  </div>
</template>

<script>
import * as EVENTS from '../utils/bus-event.js'

export default {
  name: 'BusBasic',
  $_busEvents() {
    return {
    // i. You 3 ways to register: Function | Object | Array<Function | Object>
    // ii. Even though multiple components register the same bus event, the process
    //     of binding or unbinding listeners works independently on component level.
    //     (Let's say both `compA` and `compB` have registered a bus event
    //      `EventC` on the same page. At some point `compA` is going to be
    //      destroyed. In that case, only listeners(on `EventC`) bond in `compA` will
    //      be cleared, while listeners(on `EventC`) in `compB` will still exist,
    //      listening `EventC`)
    [EVENTS.MINUS_CONTINUOUSLY_EVENT]: this.minusContinously,
    [EVENTS.MINUS_ONCE_EVENT]: {
      once: true,
      handler: this.minusOnlyOnce
    },
    [EVENTS.ADD_EVENT]:[
      {
        once: true,
        handler: this.addOnlyOnce
      },
      this.addContinously
    ],
    [EVENTS.WITH_ARGS_EVENT]: this.showArgs
    }
  },
  data() {
    return {
      counter: {
        increaseOnlyOnce: 0,
        increaseContinously: 0,
        minusOnlyOnce: 0,
        minusContinously: 0
      },
      busEventArgs: []
    }
  },
  created() {
    console.log(`<From Comp BusBasic(${this._uid}):Hook created> Bus event should have been` +
    `already registered automatically.`)
    this.log$bus()
  },
  beforeDestroy() {
    console.log(`<From Comp BusBasic(${this._uid}):Hook BeforeDestroy> Bus event registered` +
    `in comp BusBasic should have been already cleared automatically.`)
    this.log$bus()
  },
  methods: {
    log$bus() {
      // PS:JSON.stringify will ignore Function, thus you will see `null` in console
      console.log(`this.$bus._events----${JSON.stringify(this.$bus._events)}`)
    },
    addOnlyOnce() {
      this.counter.increaseOnlyOnce++
    },
    addContinously() {
      this.counter.increaseContinously++
    },
    minusContinously() {
      this.counter.minusContinously--
    },
    minusOnlyOnce() {
      this.counter.minusOnlyOnce--
    },
    showArgs(...args) {
      this.busEventArgs = args
    }
  }
}
</script>


<style scoped>
</style>
