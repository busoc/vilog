<template>
  <div style="position:relative">
    <router-view></router-view>
    <Nav />
    <div class="container-fluid">
      <div class="row">
        <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse px-0">
          <Sidebar />
          <Info />
        </nav>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-0 border-left" style="margin-top:24px">
          <div v-if="current.url && hasSelectedFields">
            <Log />
          </div>
          <div v-else class="alert alert-warning border-0">
            <p class="text-center lead text-muted mb-0">No Log files selected</p>
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
import Info from './components/Info.vue'

export default {
  name: 'App',
  data() {
    return {
      limit: 1000,
    }
  },
  computed: {
    current() {
      return this.$store.getters.log
    },
    hasSelectedFields() {
      return this.$store.getters.selectedFields.length > 0
    },
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
    Info,
  },
  mounted() {
    this.$store.dispatch('fetch.latest')
    this.$store.dispatch('fetch.detail')
  },
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
