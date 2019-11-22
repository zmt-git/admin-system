import Vue from 'vue'

Vue.directive('has', {
  inserted (el, binding, vnode) {
    let _value = el.innerText
    if (_value === '') {
      _value = binding.value
    }
    // 获取按钮权限
    let btnPermissions = vnode.context.$route.meta.btns
    if (btnPermissions && btnPermissions instanceof Array && btnPermissions.length > 0) {
      const exist = btnPermissions.includes(_value)
      if (!exist) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
})
