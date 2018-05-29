/**
 ** ********************************************************
 ** @file index.js
 ** @author zhongxian_liang <zhongxian_liang@kingdee.com>
 ** @date 2018-05-25 10:52:27
 ** @last_modified_by zhongxian_liang <zhongxian_liang@kingdee.com>
 ** @last_modified_date 2018-05-28 15:23:07
 ** @copyright (c) 2018 @yfe/vue-smart-bus
 ** ********************************************************
 */
const Vue = require('vue');
const VueSmartBus = require('../dist/vue-smart-bus.umd')

Vue.use(VueSmartBus)

test('demo 1 + 1', () => {
  expect(1 + 1).toBe(2)
})

test('basic function:$on,$once,$emit,$off', () => {
  const vm = new Vue({
    data() {
      return {
        name: 'Tom',
        counter: 0
      }
    },
    created() {
      this.$bus.$on('add', () => this.counter++)
      this.$bus.$once('addOnce', () => this.counter++)
      this.$bus.$emit('add')
      this.$bus.$emit('add')
      this.$bus.$emit('addOnce')
      this.$bus.$emit('addOnce')
    }
  })

  expect(vm.name).toBe('Tom')
  expect(vm.counter).toBe(3)
  vm.$destroy()
})


test('auto bind and unbind', () => {
  const ADD_EVENT = 'addEvent';

  const vm = new Vue({
    data() {
      return {
        counterObj: {
          val: 0
        }
      }
    },
    $_busEvents() {
      return {
        ADD_EVENT: this.add
      };
    },
    created() {
      setInterval(this.triggerAdd, 1000);
    },
    methods: {
      triggerAdd() {
        this.$bus.$emit(ADD_EVENT)
      },
      add() {
        this.counterObj.val++
      }
    }
  })
})
