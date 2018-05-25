# vue-smart-bus

A event bus plugin for Vue.js(2.0) that make bus events management much more easier.

## How this plugin works

By injecting a global mixins to the Vue constructor, this plugin will register
handlers of bus events in components'
`created` hook and remove them in components' `beforeDestroy`
hook automatically.(If you forget to remove, you are probably
going to have a memory leak)

Besides,you can also have access to the bus object by `this.$bus` in a Vue component and bind(`$on/$once`)/ trigger(`$emit`) /unbind(`$off`) bus events as normal.
**See the [Vue API Doc](https://vuejs.org/v2/api/#Instance-Methods-Events) for more detail.**

When in `SSR` environment, this plugin will just do nothing. Only in browser environment handlers will be taken care of.

## How to use it

i. Install the plugin

```
$ npm install vue-smart-bus --save
```

ii. Add the plugin into you app

```js
import Vue from 'Vue'
import VueSmartBus from 'VueSmartBus'

Vue.use(VueSmartBus)
```

iii. add `$_busEvents` attribute to Vue component

$_busEvents should be a function (just like `data`) that
returns a object containing bunch of handlers of bus events
you want to listen in the component. All the handlers registered in this way will be remove automatically in lifecycle hook `beforeDestroy`

```js
export default {
 ...,
 $_busEvents() {
   return {
     // listeners registered in attribute `$_busEvents` will be cleaned up automatically
     GLOBAL_EVENT_A: this.doSomething,
     GLOBAL_EVENT_B: {
       handler: this.doSomethingElse,
       once: true
     },
     GLOBAL_EVENT_C: [
       {
         handler: this.doSomethingElse,
         once: true
       },
       this.doSomethingBigger
     ]
   }
 },
 methods: {
   addOtherBusEventListeners() {
     // PS: listeners registered in this way need to be cleaned up manually
     this.$bus.$on(GLOBAL_EVENT_OTHER, () => { ... })
   }
 },
 beforeDestroy() {
   // clean up listeners
   this.$bus.$off(GLOBAL_EVENT_OTHER)
 }
}
```

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2018-present, Zhongxian Liang
