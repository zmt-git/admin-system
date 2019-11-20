const tagsView = {
  state: {
    id: '',
    openedTab: [],
    activeTab: ''
  },
  mutations: {
    addTab (state, componentName, title) {
      state.openedTab.push(componentName)
    },
    changeTab (state, componentName) {
      state.activeTab = componentName
    },
    deductTab (state, componentName) {
      let deductIndex = -1
      state.openedTab.forEach(function (value, index, array) {
        if (value.component === componentName) {
          deductIndex = index
        }
      })
      state.openedTab.splice(deductIndex, 1)
    }
  }
}

export default tagsView
