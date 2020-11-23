<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">VILOG</a>
        <form class="form-inline" @submit.prevent>
          <input type="number" min="100" max="1000" id="limit" class="form-control mx-2" v-model="limit"/>
          <select id="logs" class="form-control mx-2" v-model="current">
            <option v-for="s in sources" :value="s" :key="s.url">{{s.label}}</option>
          </select>
        </form>
      </div>
    </nav>
    <main class="container-fluid my-5">
      <div v-if="current.url">
        <Log :log="current" :limit="number"/>
      </div>
      <div v-else class="alert alert-warning">
        <h1 class="h3 text-center">No Log files selected</h1>
      </div>
    </main>
  </div>
</template>

<script>
import Log from './components/Log.vue'

export default {
  name: 'App',
  data() {
    return {
      current: {label: "", url: ""},
      limit: 1000,
    }
  },
  computed: {
    sources() {
      return this.$store.state.sources
    },
    number() {
      return parseInt(this.limit)
    }
  },
  components: {
    Log
  },
  mounted() {
    this.$store.dispatch("view.sources");
  }
}
</script>
