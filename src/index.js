export default function install(Vue) {
  const bus = new Vue()
  Object.defineProperty(Vue.prototype, '$bus', {
    value: bus,
    configurable: false,
    writable: false
  })

  Vue.mixin({
    created() {
      if (this.$isServer) {
        return
      }
      const busEvents = this.$options.$_busEvents &&
        this.$options.$_busEvents.bind(this)()
      if (!busEvents) {
        return
      }
      const map = Object.create(null)
      this.$options.$_busEventsMap = map

      Object.entries(busEvents).forEach(
        ([event, listenerConfig]) => {
          if (Array.isArray(listenerConfig)) {
            listenerConfig.forEach(conf => {
              subscribeFn(event, conf, map, this.$bus)
            })
          } else {
            subscribeFn(event, listenerConfig, map, this.$bus)
          }

          function subscribeFn(_event, _conf, _map, _bus) {
            const wayToListen = _conf.once ? '$once' : '$on'
            const fn = _conf.handler ? _conf.handler.bind(this) : _conf.bind(this)
            _map[_event] ? _map[_event].push(fn) : _map[_event] = [fn]
            _bus[wayToListen](_event, fn)
          }
        }
      )
    },
    beforeDestroy() {
      if (this.$isServer) {
        return
      }
      const map = this.$options.$_busEventsMap
      if (!map) {
        return
      }
      Object.entries(map).forEach(
        ([event, listeners]) => {
          if (!Array.isArray(listeners)) {
            return
          }
          listeners.forEach(item => {
            this.$bus.$off(event, item)
          })
        }
      )
    }
  })
}
