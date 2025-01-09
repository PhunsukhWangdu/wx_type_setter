import { createStore } from 'vuex'

export default createStore({
  state: {
    content: '',
    template: '',
    previewContent: ''
  },
  mutations: {
    setContent(state, content) {
      state.content = content
    },
    setTemplate(state, template) {
      state.template = template
    },
    setPreviewContent(state, content) {
      state.previewContent = content
    }
  },
  actions: {
    updateContent({ commit }, content) {
      commit('setContent', content)
    },
    updateTemplate({ commit }, template) {
      commit('setTemplate', template)
    },
    updatePreview({ commit }, content) {
      commit('setPreviewContent', content)
    }
  }
}) 