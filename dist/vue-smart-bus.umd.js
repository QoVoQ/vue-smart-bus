/**
 * vue-smart-bus v0.0.1
 * https://github.com/QoVoQ/vue-smart-bus
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueSmartBus = factory());
}(this, (function () { 'use strict';

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

        var busEvents = this.$options.$_busEvents &&
          this.$options.$_busEvents.bind(this)();
        if (!busEvents) {
          return
        }
        var map = Object.create(null);
        this.$options.$_busEventsMap = map;

        Object.entries(busEvents).forEach(
          function (ref) {
            var key = ref[0];
            var value = ref[1];

            if (Array.isArray(value)) {
              value.forEach(function (item) {
                subscribeFn(key, item, map, this$1.$bus);
              });
            } else {
              subscribeFn(key, value, map, this$1.$bus);
            }

            function subscribeFn(_key, _val, _map, _bus) {
              var wayToListen = _val.once ? '$once' : '$on';
              var fn = _val.handler ? _val.handler.bind(this) : _val.bind(this);
              _map[_key] ? _map[_key].push(fn) : _map[_key] = [fn];
              _bus[wayToListen](_key, fn);
            }
          }
        );
      },
      beforeDestroy: function beforeDestroy() {
        var this$1 = this;

        var map = this.$options.$_busEventsMap;
        if (!map) {
          return
        }
        Object.entries(map).forEach(
          function (ref) {
            var key = ref[0];
            var value = ref[1];

            if (!Array.isArray(value)) {
              return
            }
            value.forEach(function (item) {
              this$1.$bus.$off(key, item);
            });
          }
        );
      }
    });
  }

  return install;

})));
