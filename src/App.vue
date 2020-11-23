<template>
  <div style="position:relative">
    <Nav />
    <div class="container-fluid">
      <div class="row">
        <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse px-0">
          <Sidebar :sources="sources" @source-changed="onSourceChanged"/>
        </nav>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-0" style="margin-top:8px">
          <div v-if="current.url">
            <Log :log="current" :limit="number"/>
          </div>
          <div v-else class="alert alert-warning border-0">
            <h1 class="h4 text-center">No Log files selected</h1>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Log from './components/Log.vue'
import Sidebar from './components/Sidebar.vue'
import Nav from './components/Nav.vue'

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
  methods: {
    onSourceChanged(src) {
      this.current = src
    },
  },
  components: {
    Log,
    Sidebar,
    Nav,
  },
  mounted() {
    this.$store.dispatch("view.sources");
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100; /* Behind the navbar */
  padding: 48px 0 0; /* Height of navbar */
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}
</style>
