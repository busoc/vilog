<template>
  <div class="sidebar-sticky">
    <h5 class="vilog-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted border-bottom">
      <span>YAMCS-PDC</span>
    </h5>
    <ul class="nav flex-column">
      <li v-for="s in sources" class="nav-item" :key="s.label">
        <a class="nav-link" href="#" @click.prevent="onClick(s)">{{s.label}}</a>
      </li>
    </ul>
    <NoHost :hosts="hosts"/>
    <div v-for="(h, i) in hosts" :key="i">
      <h5 class="vilog-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-2 text-muted border-bottom">
        <span v-if="h.label">{{ h.label }}</span>
        <span v-else>{{ h.addr }}:{{ h.port }}</span>
      </h5>
      <ul class="nav flex-column">

      </ul>
    </div>
  </div>
</template>

<script>
import NoHost from './NoHost.vue'

export default {
  name: "Sidebar",
  props: ["sources"],
  computed: {
    hosts() {
      return this.$store.getters.registeredHosts
    }
  },
  methods: {
    onClick(source) {
      this.$emit("source-changed", source)
    },
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
