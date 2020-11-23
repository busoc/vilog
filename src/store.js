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

const allFields = [
  {label: "time", field: "when", selected: true, position: 0},
  {label: "level", field: "", selected: true, position: 0},
  {label: "process", field: "", selected: true, position: 0},
  {label: "pid", field: "", selected: false, position: 0},
  {label: "user", field: "", selected: false, position: 0},
  {label: "group", field: "", selected: false, position: 0},
  {label: "host", field: "", selected: false, position: 0},
  {label: "message", field: "", selected: true, position: 0},
]

function initializeFields() {
  let fields = localStorage["selectedFields"]
  if (!fields) {
    fields = allFields
  } else {
    fields = JSON.parse(fields)
  }
  return fields
}

function initializeHosts() {
  let hosts = localStorage["registeredHosts"]
  if (!hosts) {
    hosts = []
  } else{
    hosts = JSON.parse(hosts)
  }
  return hosts
}

export default createStore({
  state: {
    entries: [],
    sources: [],
    info: {},
    fields: initializeFields(),
    hosts: initializeHosts(),
  },
  getters: {
    registeredHosts(state) {
      return state.hosts
    },
    allFields(state) {
      return state.fields
    },
    selectedFields(state) {
      return state.fields.filter(f => f.selected).map(f => {
        f.field = f.field == "" ? f.label : f.field
        return {label: f.label, field: f.field}
      })
    },
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
    'update.hosts'(state, host) {
      state.hosts.push(host)
      localStorage.setItem("registeredHosts", JSON.stringify(state.hosts))
    },
    'update.fields'(state, fields) {
      state.fields = fields
      localStorage.setItem('selectedFields', JSON.stringify(fields))
    },
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
