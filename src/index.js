export default function install(Vue) {
  const bus = new Vue()
  Object.defineProperty(Vue.prototype, '$bus', {
    value: bus,
    configurable: false,
    writable: false
  })

  Vue.mixin({
    created() {
      const busEvents = this.$options.$_busEvents &&
        this.$options.$_busEvents.bind(this)()
      if (!busEvents) {
        return
      }
      const map = Object.create(null)
      this.$options.$_busEventsMap = map

      Object.entries(busEvents).forEach(
        ([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(item => {
              subscribeFn(key, item, map, this.$bus)
            })
          } else {
            subscribeFn(key, value, map, this.$bus)
          }

          function subscribeFn(_key, _val, _map, _bus) {
            const wayToListen = _val.once ? '$once' : '$on'
            const fn = _val.handler ? _val.handler.bind(this) : _val.bind(this)
            _map[_key] ? _map[_key].push(fn) : _map[_key] = [fn]
            _bus[wayToListen](_key, fn)
          }
        }
      )
    },
    beforeDestroy() {
      const map = this.$options.$_busEventsMap
      if (!map) {
        return
      }
      Object.entries(map).forEach(
        ([key, value]) => {
          if (!Array.isArray(value)) {
            return
          }
          value.forEach(item => {
            this.$bus.$off(key, item)
          })
        }
      )
    }
  })
}
