<template>
  <div style="margin-top:18px;">
    <h5 class="border-bottom vilog-heading text-muted px-3">
      <span>{{log.label}}</span>
      <span class="mx-2 my-1 badge badge-secondary">{{len}}</span>
    </h5>
    <form class="form-inline my-4 px-3" @submit.prevent>
          <label for="process">process</label>
          <select v-model="process" id="process" class="mx-2 form-control form-control-sm">
            <option value=""></option>
            <option v-for="p in processes" :key="p" :value="p">{{p}}</option>
          </select>
          <label for="level">level</label>
          <select v-model="level" id="level" class="mx-2 form-control form-control-sm">
            <option value=""></option>
            <option v-for="v in levels" :key="v" :value="v">{{v}}</option>
          </select>
          <label for="dtstart">start</label>
          <input v-model="dtstart" type="datetime-local" id="dtstart" class="mx-2 form-control form-control-sm"/>
          <label for="dtend">end</label>
          <input v-model="dtend" type="datetime-local" id="dtend" class="mx-2 form-control form-control-sm"/>
          <label for="message">message</label>
          <input v-model="message" type="text" id="message" class="mx-2 form-control form-control-sm"/>
    </form>
    <table class="table table-hover">
      <thead class="thead-dark">
        <TableHeader :fields="selectedFields"/>
      </thead>
      <tbody>
        <tr v-for="(e, j) in entries" :key="j">
          <td v-for="f in selectedFields" :key="f.label">{{ valueof(f.field, e[f.field]) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import TableHeader from './TableHeader.vue'

import { DateTime } from 'luxon'

export default {
  name: "Log",
  props: {
    log: Object,
    limit: {
      type: Number,
      default: 1000,
    },
  },
  computed: {
    selectedFields() {
      return this.$store.getters.selectedFields
    },
    entries() {
      return this.filter()
    },
    processes() {
      return this.$store.getters.processes
    },
    levels() {
      return this.$store.getters.levels
    },
    len() {
      return this.entries.length
    }
  },
  data() {
    return {
      process: "",
      level: "",
      message: "",
      dtstart: "",
      dtend: "",
      loading: false,
    }
  },
  watch: {
    log() {
      this.update()
    },
    limit() {
      this.update()
    },
  },
  methods: {
    valueof(field, entry) {
      switch (field) {
      case "pid":
        entry = entry == 0 ? "-" : entry
        break
      case "level":
        entry = entry == "" ? "-" : entry
        break
      case "user":
        entry = entry == "" ? "-" : entry
        break
      case "group":
        entry = entry == "" ? "-" : entry
        break
      case "host":
        entry = entry == "" ? "-" : entry
        break
      }
      return entry;
    },
    update() {
      if (this.log.url == "") {
        return
      }
      this.reset()
      let rs = this.$store.dispatch("view.entries", {url: this.log.url, limit: this.limit})
      rs.then(() => {
        let start = DateTime.fromISO(this.$store.getters.dtstart).toUTC().startOf('day')
        let end = DateTime.fromISO(this.$store.getters.dtend).toUTC().endOf('day')
        this.dtstart = start.toISO().slice(0, -1)
        this.dtend = end.toISO().slice(0, -1)
      })
    },
    reset() {
      this.process = ""
      this.level = ""
      this.message = ""
      this.dtstart = ""
      this.dtend = ""
    },
    filter() {
      let msg = this.message
      let lvl = this.level
      let proc = this.process
      let dtstart = 0
      if (this.dtstart != "") {
        dtend = DateTime.fromISO(this.dtstart).toUTC()
      }
      let dtend = 0
      if (this.dtend != "") {
        dtend = DateTime.fromISO(this.dtend).toUTC()
      }
      return this.$store.state.entries.filter(e => {
        let p = proc == "" || e.process == proc
        let v = lvl == "" || e.level == lvl
        let m = msg == "" || e.message.indexOf(msg) >= 0

        let when = DateTime.fromISO(e.when).toUTC()
        let time = (dtstart == 0 || when >= dtstart ) && (dtend == 0 || when <= dtend)
        return p && v && m && time
      })
    },
  },
  mounted() {
    this.update();
  },
  components: {
    TableHeader,
  },
}
</script>
