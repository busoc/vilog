<template>
  <div style="margin-top:18px;">
    <h5 class="border-bottom vilog-heading text-muted px-3">
      <span>{{log.label}}</span>
      <span class="mx-2 my-1 badge badge-secondary">{{len}}</span>
    </h5>
    <Filter />
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
import Filter from './Filter.vue'

export default {
  name: "Log",
  computed: {
    log() {
      return this.$store.getters.log
    },
    selectedFields() {
      return this.$store.getters.selectedFields
    },
    entries() {
      return this.$store.getters.entries
    },
    len() {
      return this.entries.length
    }
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
      case "process":
        entry = entry == "" ? "-" : entry
        break
      }
      return entry;
    },
  },
  components: {
    TableHeader,
    Filter,
  },
}
</script>
