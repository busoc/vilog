import _ from 'lodash'
import { DateTime } from 'luxon'
import {createStore} from 'vuex'

function fetchLogs(api, source, commit) {
  return fetch(api)
    .then(rs => {
      if (!rs.ok) {
        return Promise.reject(rs.statusText)
      }
      return rs.json()
    })
    .then(rs => {
      commit(`update.entries`, _.reverse(rs))
      commit(`update.latest`, source)
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

const allCriteria = {
  process: "",
  level: "",
  message: "",
  dtstart: "",
  dtend: "",
}

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

const latest = {url: "", label: ""}

function initializeLatest() {
  let curr = localStorage["latest"]
  if (!curr) {
    curr = Object.assign({}, latest)
  } else {
    curr = JSON.parse(curr)
  }
  return curr
}

const info = {size: 0, modtime: 0, file: ""}

export default createStore({
  state: {
    entries: [],
    sources: [],
    info: info,
    fields: initializeFields(),
    hosts: initializeHosts(),
    latest: initializeLatest(),
    criteria: allCriteria,
  },
  getters: {
    entries(state) {
      if (_.isEmpty(state.criteria)) {
        return state.entries
      }
      let msg = state.criteria.message
      let lvl = state.criteria.level
      let proc = state.criteria.process
      let dtstart = 0
      if (state.criteria.dtstart != "") {
        dtstart = DateTime.fromISO(state.criteria.dtstart).toUTC()
      }
      let dtend = 0
      if (state.criteria.dtend != "") {
        dtend = DateTime.fromISO(state.criteria.dtend).toUTC()
      }
      return state.entries.filter(e => {
        let p = proc == "" || e.process == proc
        let v = lvl == "" || e.level == lvl
        let m = msg == "" || e.message.indexOf(msg) >= 0

        let when = DateTime.fromISO(e.when).toUTC()
        let time = (dtstart == 0 || when >= dtstart ) && (dtend == 0 || when <= dtend)
        return p && v && m && time
      })
    },
    log(state) {
      return state.latest
    },
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
    'apply.filter'(state, criteria) {
      state.criteria = criteria
    },
    'update.latest'(state, source) {
      state.hosts = state.hosts.map(h => {
        h.sources = h.sources.map(s => {
          s.active = s.url == source.url && s.base == source.base
          return s
        })
        return h
      })
      state.latest = source
      localStorage.setItem("latest", JSON.stringify(source))
    },
    'update.hosts'(state, host) {
      state.hosts.push(host)
      localStorage.setItem("registeredHosts", JSON.stringify(state.hosts))
    },
    'update.fields'(state, fields) {
      state.fields = fields
      localStorage.setItem('selectedFields', JSON.stringify(fields))
    },
    'update.entries'(state, entries) {
      state.entries = entries
    },
    'update.host'(state, {host, sources}) {
      sources = sources.map(s => {
        s.base = `http://${host.addr}:${host.port}`
        s.active = false
        return s
      })
      let i = state.hosts.findIndex(h => h.addr == host.addr && h.port == host.port)
      if (i < 0) {
        state.hosts.push(Object.assign(host, {sources}))
      } else {
        state.hosts.splice(i, 1, Object.assign(host, {sources}))
      }
      if (!state.hosts.length) {
        state.entries = []
      }
      localStorage.setItem("registeredHosts", JSON.stringify(state.hosts))
    },
    'remove.host'(state, host) {
      let i = state.hosts.findIndex(h => h.addr == host.addr && h.port == host.port)
      if (i < 0) {
        return
      }
      if (!_.isEmpty(state.latest) && state.latest.base) {
        let base = `http://${host.addr}:${host.port}`
        if (base == state.latest.base) {
          state.latest = Object.assign({}, latest)
          state.info = Object.assign({}, info)
          delete localStorage["latest"]
        }
      }
      state.hosts.splice(i, 1)
      localStorage.setItem("registeredHosts", JSON.stringify(state.hosts))
    },
    'update.info'(state, info) {
      state.info = Object.assign({}, info)
    }
  },
  actions: {
    'view.entries'({commit}, {source, limit}) {
      commit('apply.filter', allCriteria)
      commit('update.entries', [])
      return fetchLogs(`${source.base}${source.url}?limit=${limit}`, source, commit)
    },
    'fetch.latest'({commit, state}) {
      commit('apply.filter', allCriteria)
      if (!state.latest.base) {
        return
      }
      return fetchLogs(`${state.latest.base}${state.latest.url}`, state.latest, commit)
    },
    'fetch.detail'({state, commit}, source) {
      if (!source) {
        source = state.latest
      }
      commit('update.info', source)
      return fetch(`${source.base}${source.url}/detail`).then(rs => {
        if (!rs.ok) {
          return Promise.reject(rs.statusText)
        }
        return rs.json()
      }).then(rs => {
        commit('update.info', rs)
      })
    },
    'fetch.sources'({commit}, {host}) {
      return fetch(`http://${host.addr}:${host.port}${host.source}`).then(rs => {
        if (!rs.ok) {
          return Promise.reject(rs.statusText)
        }
        return rs.json()
      }).then(rs => {
        commit('update.host', {host: host, sources: rs})
      })
    },
  },
})
