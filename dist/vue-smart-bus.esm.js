/**
 * vue-smart-bus v0.0.7
 * https://github.com/QoVoQ/vue-smart-bus
 * @license MIT
 */
function install(Vue) {
  var bus = new Vue();
  Object.defineProperty(Vue.prototype, '$bus', {
    value: bus,
    configurable: false,
    writable: false
  });

  Vue.mixin({
    created: function created() {
      var this$1 = this;

      if (this.$isServer) {
        return
      }
      var busEvents = this.$options.$_busEvents &&
        this.$options.$_busEvents.bind(this)();
      if (!busEvents) {
        return
      }
      var map = Object.create(null);
      this.$options.$_busEventsMap = map;

      Object.entries(busEvents).forEach(
        function (ref) {
          var event = ref[0];
          var listenerConfig = ref[1];

          if (Array.isArray(listenerConfig)) {
            listenerConfig.forEach(function (conf) {
              subscribeFn(event, conf, map, this$1.$bus);
            });
          } else {
            subscribeFn(event, listenerConfig, map, this$1.$bus);
          }

          function subscribeFn(_event, _conf, _map, _bus) {
            var wayToListen = _conf.once ? '$once' : '$on';
            var fn = _conf.handler ? _conf.handler.bind(this) : _conf.bind(this);

            _map[_event]
              ? _map[_event].push(fn)
              : _map[_event] = [fn];
            _bus[wayToListen](_event, fn);
          }
        }
      );
    },
    beforeDestroy: function beforeDestroy() {
      var this$1 = this;

      if (this.$isServer) {
        return
      }
      var map = this.$options.$_busEventsMap;
      if (!map) {
        return
      }
      Object.entries(map).forEach(
        function (ref) {
          var event = ref[0];
          var listeners = ref[1];

          listeners.forEach(function (item) {
            this$1.$bus.$off(event, item);
          });
        }
      );
    }
  });
}

export default install;
