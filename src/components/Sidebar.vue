<template>
  <div class="sidebar-sticky">
    <NoHost :hosts="hosts"/>
    <div v-for="(h, i) in hosts" :key="i" class="mb-3">
      <h5 class="vilog-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted border-bottom">
        <span v-if="h.label">{{ h.label }}</span>
        <span v-else>{{ h.addr }}:{{ h.port }}</span>
        <a type="button" class="btn btn-light" href="#" title="remove host" @click.prevent="onRemove(h)">
          <i data-feather="minus"></i>
        </a>
      </h5>
      <ul class="nav flex-column">
        <li v-for="(s, i) in h.sources" class="nav-item" :key="i">
          <a :class="['nav-link', {'active': isActive(s)}]" href="#" @click.prevent="onSelect(s, h)">{{s.label}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import NoHost from './NoHost.vue'
import feather from 'feather-icons'

export default {
  name: "Sidebar",
  computed: {
    hosts() {
      return this.$store.getters.registeredHosts
    }
  },
  methods: {
    onSelect(source, host) {
      this.$store.commit('update.latest', source)
      this.$store.dispatch('view.entries', {source, limit: host.limit})
      this.$store.dispatch('fetch.detail', source)
    },
    onRemove(host) {
      this.$store.commit('remove.host', host)
    },
    isActive(source) {
      return source.active
    },
  },
  mounted() {
    this.hosts.forEach(h => {
      this.$store.dispatch('fetch.sources', {host: h})
    })
    feather.replace()
  },
  updated() {
    feather.replace()
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
  height: calc(100vh - 48px - 120px);
  margin-bottom: 120px;
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

.feather {
  width: 16px;
  height: 16px;
}
</style>
