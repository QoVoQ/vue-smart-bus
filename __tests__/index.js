/**
 ** ********************************************************
 ** @file index.js
 ** @author zhongxian_liang <zhongxian_liang@kingdee.com>
 ** @date 2018-05-25 10:52:27
 ** @last_modified_by zhongxian_liang <zhongxian_liang@kingdee.com>
 ** @last_modified_date 2018-05-29 14:41:45
 ** @copyright (c) 2018 @yfe/vue-smart-bus
 ** ********************************************************
 */
const Vue = require('vue')
const VueSmartBus = require('../dist/vue-smart-bus.umd')

Vue.use(VueSmartBus)

describe('Basic function: $on,$once,$emit,$off', () => {
  const ADD_ONCE = 'ADD_ONCE'
  const ADD_CONTINUOUSLY = 'ADD_CONTINUOUSLY'
  const vmFactory = () => new Vue({
    data() {
      return {
        counter: {
          once: 0,
          continuously: 0
        }
      }
    },
    created() {
      this.$bus.$on(ADD_CONTINUOUSLY, () => this.counter.continuously++)
      this.$bus.$once(ADD_ONCE, () => this.counter.once++)
    },
    methods: {
      triggerAddOnce() {
        this.$bus.$emit(ADD_ONCE)
      },
      triggerAddContinuously() {
        this.$bus.$emit(ADD_CONTINUOUSLY)
      },
      removeAddContinuously() {
        this.$bus.$off(ADD_CONTINUOUSLY)
      }
    }
  })

  test('Basic function: $on, $emit', () => {
    const vm = vmFactory()

    expect(vm.counter.continuously).toBe(0)

    vm.triggerAddContinuously()
    expect(vm.counter.continuously).toBe(1)

    vm.triggerAddContinuously()
    expect(vm.counter.continuously).toBe(2)

    vm.$destroy()
  })

  test('Basic function: $once', () => {
    const vm = vmFactory()

    expect(vm.counter.once).toBe(0)

    vm.triggerAddOnce()
    expect(vm.counter.once).toBe(1)

    vm.triggerAddOnce()
    expect(vm.counter.once).toBe(1)
  })

  test('Basic function: $off', () => {
    const vm = vmFactory()

    expect(vm.counter.continuously).toBe(0)

    vm.triggerAddContinuously()
    expect(vm.counter.continuously).toBe(1)

    vm.removeAddContinuously()
    vm.triggerAddContinuously()
    expect(vm.counter.continuously).toBe(1)
  })
})

describe('Features:', () => {
  const BIND_BY = {
    FUNCTION: 'BIND_BY_FUNCTION',
    OBJECT: 'BIND_BY_OBJECT',
    ARRAY: 'BIND_BY_ARRAY'
  }

  const getEventNum = (_vm, _event) =>
    _vm.$bus._events[_event]
      ? _vm.$bus._events[_event].length
      : 0

  const vmFactory = () => new Vue({
    data() {
      return {
        counter: {
          fn: 0,
          obj: 0,
          array: 0
        }
      }
    },
    $_busEvents() {
      return {
        [BIND_BY.FUNCTION]: this.onBindByFn,
        [BIND_BY.OBJECT]: {
          once: true,
          handler: this.onBindByObj
        },
        [BIND_BY.ARRAY]: [
          this.onBindByArray,
          {
            once: true,
            handler: this.onBindByFn
          }
        ]
      }
    },
    methods: {
      onBindByFn() {
        this.counter.fn++
      },
      onBindByObj() {
        this.counter.obj++
      },
      onBindByArray() {
        this.counter.array++
      },
      triggerBindByFn() {
        this.$bus.$emit(BIND_BY.FUNCTION)
      },
      triggerBindByObj() {
        this.$bus.$emit(BIND_BY.OBJECT)
      },
      triggerBindByArray() {
        this.$bus.$emit(BIND_BY.ARRAY)
      }
    }
  })

  describe('Feature: Auto bind & unbind', () => {
    test('Bind by function', () => {
      // listeners should be bond automatically in hook `created`
      const vm = vmFactory()

      expect(vm.counter.fn).toBe(0)

      vm.triggerBindByFn()
      expect(vm.counter.fn).toBe(1)

      // listeners should be cleaned up automatically in hook `beforeDestroy`
      vm.$destroy()
      vm.triggerBindByFn()
      expect(vm.counter.fn).toBe(1)
    })

    describe('Bind by object', () => {
      test('Trigger event bond by $once', () => {
        // listeners should be bond in hook `created`
        const vm = vmFactory()
        const getBindByObjEventNum = () => getEventNum(vm, BIND_BY.OBJECT)
        const initialEventNum = getBindByObjEventNum()

        expect(vm.counter.obj).toBe(0)

        vm.triggerBindByObj()
        expect(vm.counter.obj).toBe(1)

        // For being bond by $once, listeners should be cleaned up after execution
        expect(initialEventNum - 1).toBe(getBindByObjEventNum())

        // listeners bond by $once should not be triggered twice
        vm.triggerBindByObj()
        expect(vm.counter.obj).toBe(1)

        vm.$destroy()
        vm.triggerBindByObj()
        expect(vm.counter.obj).toBe(1)
      })

      test('Clean up event bond by $once', () => {
        // listeners should be bond in hook `created`
        const vm = vmFactory()
        const getBindByObjEventNum = () => getEventNum(vm, BIND_BY.OBJECT)
        const initialEventNum = getBindByObjEventNum()

        expect(vm.counter.obj).toBe(0)

        // listeners should be cleaned up automatically in hook `beforeDestroy`
        vm.$destroy()
        expect(initialEventNum - 1).toBe(getBindByObjEventNum())

        vm.triggerBindByObj()
        expect(vm.counter.obj).toBe(0)
      })
    })

    test('Bind by array', () => {
      // listeners should be bond in hook `created`
      const vm = vmFactory()

      expect(vm.counter.fn).toBe(0)
      expect(vm.counter.array).toBe(0)

      vm.triggerBindByArray()
      expect(vm.counter.fn).toBe(1)
      expect(vm.counter.array).toBe(1)

      vm.triggerBindByArray()
      expect(vm.counter.fn).toBe(1)
      expect(vm.counter.array).toBe(2)

      // listeners should be cleaned up automatically in hook `beforeDestroy`
      vm.$destroy()

      vm.triggerBindByArray()
      expect(vm.counter.fn).toBe(1)
      expect(vm.counter.array).toBe(2)
    })
  })

  test('Feature: Separation between Components', () => {
    const vm1 = vmFactory()
    const vm2 = vmFactory()

    expect(vm1.counter.fn).toBe(0)
    expect(vm2.counter.fn).toBe(0)

    vm1.triggerBindByFn()
    expect(vm1.counter.fn).toBe(1)
    expect(vm2.counter.fn).toBe(1)

    // Even though vm2 is destroyed, vm1 should still listen to bus event
    vm2.$destroy()
    vm1.triggerBindByFn()
    expect(vm1.counter.fn).toBe(2)
    expect(vm2.counter.fn).toBe(1)
  })

  // @TODO Add test suit for SSR mode
})
