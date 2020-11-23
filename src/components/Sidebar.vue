<template>
  <div class="sidebar-sticky">
    <NoHost :hosts="hosts"/>
    <div v-for="(h, i) in hosts" :key="i">
      <h5 class="vilog-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted border-bottom">
        <span v-if="h.label">{{ h.label }}</span>
        <span v-else>{{ h.addr }}:{{ h.port }}</span>
      </h5>
      <ul class="nav flex-column">
        <li v-for="(s, i) in h.sources" class="nav-item" :key="i">
          <a :class="['nav-link', {'active': isActive(s)}]" href="#" @click.prevent="onClick(s, h)">{{s.label}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import NoHost from './NoHost.vue'

export default {
  name: "Sidebar",
  computed: {
    hosts() {
      return this.$store.getters.registeredHosts
    }
  },
  methods: {
    onClick(source, host) {
      this.$store.commit('update.latest', source)
      this.$store.dispatch('view.entries', {source, limit: host.limit})
    },
    isActive(source) {
      return source.active
    },
  },
  mounted() {
    this.hosts.forEach(h => {
      this.$store.dispatch('fetch.sources', {host: h})
    })
  },
  components: {
    NoHost,
  },
}
</script>

<style scoped>
.sidebar-sticky {
  position: relative;
  top: 0;
  height: calc(100vh - 48px);
  padding-top: .5rem;
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}

.sidebar-sticky .nav-link {
  font-weight: 500;
  color: #333;
}

.sidebar-sticky .nav-link.active {
  color: #007bff;
}

.sidebar-sticky .nav-link:hover .feather {
  color: inherit;
}
</style>
