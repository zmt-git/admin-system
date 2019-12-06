import Vue from 'vue'
export default () => {
  Vue.directive('hasBtn', {
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
  Vue.directive('isADmin', {
    inserted (el, binding, vnode) {
      let _value = binding.value
      if (_value instanceof String) {
        _value = _value.toLowerCase()
      }
      if (_value === 'administrator') {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  })
}
