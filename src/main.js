import Vue from 'vue'

import ElementUI from 'element-ui'
import hasBtn from '@/directive/authorityButton' // 全局样式

import '../theme/index.css' // 全局样式

import '@/styles/index.scss' // 全局样式

import '@/styles/resetElement.scss' // 全局样式

import '@/assets/iconfont/iconfont.css' // iconfont样式

import '@/assets/iconfont/iconfont.js' // iconfont样式

import '@/utils/global'// 全局变量

import App from './App.vue'

import './registerServiceWorker'

import router from './router'

import store from './store'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(hasBtn)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
