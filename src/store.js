import _ from 'lodash'
import {createStore} from 'vuex'

function fetchLogs(api, what, commit) {
  return fetch(api)
    .then(rs => {
      if (!rs.ok) {
        return Promise.reject(rs.statusText)
      }
      return rs.json()
    })
    .then(rs => {
      commit(`update.${what}`, _.reverse(rs))
    })
}

export default createStore({
  state: {
    entries: [],
    sources: [],
    info: {},
  },
  getters: {
    processes(state) {
      return _.chain(state.entries).uniqBy('process').map(e => e.process).value()
    },
    levels(state) {
      return _.chain(state.entries).uniqBy('level').map(e => e.level).value()
    },
    dtstart(state) {
      let e = _.last(state.entries)
      return e ? e.when : ""
    },
    dtend(state) {
      let e = _.first(state.entries)
      return e ? e.when : ""
    },
  },
  mutations: {
    'update.sources'(state, sources) {
      state.sources = sources
    },
    'update.entries'(state, entries) {
      state.entries = entries
    },
    'update.info'(state, info) {
      state.info = info
    }
  },
  actions: {
    'view.sources'({commit}) {
      return fetchLogs(`${process.env.VUE_APP_API}/sources`, 'sources', commit)
    },
    'view.entries'({commit}, {url, limit}) {
      limit = limit == 0 ? 100 : limit
      return fetchLogs(`${process.env.VUE_APP_API}${url}?limit=${limit}`, 'entries', commit)
    },
    'view.info'({commit}, url) {
      return fetchLogs(`${process.env.VUE_APP_API}${url}`, "info", commit)
    },
  },
})
