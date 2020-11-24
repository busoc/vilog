<template>
  <div class="col-md-12 col-lg-12 d-md-block bg-light px-3 py-2 border-top border-right bg-light">
    <dl class="row" v-if="filename">
      <dt class="col-4">file</dt>
      <dd class="col-8 text-right">{{filename}}</dd>
      <dt class="col-4">size</dt>
      <dd class="col-8 text-right">{{size}}</dd>
      <dt class="col-4">modtime</dt>
      <dd class="col-8 text-right">{{modtime}}</dd>
    </dl>
    <p v-else class="text-center text-muted my-4">no log selected</p>
  </div>
</template>

<script>
import { DateTime } from 'luxon'

const kilo = 1024
const mega = kilo*kilo
const giga = mega*kilo
const tera = giga*kilo

export default {
  name: 'Info',
  computed: {
    size() {
      let z = this.$store.state.info.size
      let unit = ""
      let factor = 1
      if (z < kilo) {
        // do nothing
      } else if (z < mega) {
        unit = "KB"
        factor = kilo
      } else if (z < giga) {
        unit = "MB"
        factor = mega
      } else if (z < tera) {
        unit = "GB"
        factor = giga
      } else {
        unit = "TB"
        factor = tera
      }
      z = z/factor
      return `${z.toFixed(2)}${unit}`
    },
    filename() {
      return this.$store.state.info.file
    },
    modtime() {
      let when = DateTime.fromISO(this.$store.state.info.modtime)
      return when.toLocaleString(DateTime.DATETIME_SHORT)
    }
  },
}
</script>

<style scoped>
div {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 120px;
}

dl>dt {
  font-size: 13px;
}
dl>dd {
  font-size: 14px;
}
</style>
