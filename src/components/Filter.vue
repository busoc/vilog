<template>
  <form class="form-inline my-4 px-3" @submit.prevent="apply">
        <label for="process">process</label>
        <select @change="apply" :disabled="processes.length <= 1" v-model="process" id="process" class="mx-2 form-control form-control-sm">
          <option value=""></option>
          <option v-for="p in processes" :key="p" :value="p">{{p}}</option>
        </select>
        <label for="level">level</label>
        <select @change="apply" :disabled="levels.length <= 1" v-model="level" id="level" class="mx-2 form-control form-control-sm">
          <option value=""></option>
          <option v-for="v in levels" :key="v" :value="v">{{v}}</option>
        </select>
        <label for="dtstart">start</label>
        <input @change="apply" v-model="dtstart" type="datetime-local" id="dtstart" class="mx-2 form-control form-control-sm"/>
        <label for="dtend">end</label>
        <input @change="apply" v-model="dtend" type="datetime-local" id="dtend" class="mx-2 form-control form-control-sm"/>
        <label for="message">message</label>
        <input @input="apply" v-model.trim="message" type="text" id="message" class="mx-2 form-control form-control-sm"/>
  </form>
</template>
<script>
export default {
  name: 'Filter',
  data() {
    return {
      process: "",
      level: "",
      message: "",
      dtstart: "",
      dtend: "",
    }
  },
  computed: {
    processes() {
      return this.$store.getters.processes
    },
    levels() {
      return this.$store.getters.levels
    },
  },
  watch: {
    processes() {
      this.reset()
    },
    levels() {
      this.reset()
    },
  },
  methods: {
    reset() {
      this.message = ""
      this.process = ""
      this.level = "",
      this.dtstart = ""
      this.dtend = ""
    },
    apply() {
      this.$store.commit('apply.filter', {
        message: this.message,
        process: this.process,
        level: this.level,
        dtstart: this.dtstart,
        dtend: this.dtend,
      })
    }
  },
}
</script>
