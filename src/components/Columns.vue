<template>
  <div class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Select columns</h5>
          <router-link to="/" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </router-link>
        </div>
        <div class="modal-body">
          <form @submit.prevent>
              <div class="form-group" v-for="(c, i) in columns" :key="c.label">
                <div class="d-flex justify-content-between">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox"
                    v-model="c.selected"
                    @change="apply"
                    :id="c.label">
                  <label class="form-check-label" :for="c.label">
                    <span>{{c.label}}</span>
                  </label>
                </div>
                <div class="">
                  <button v-if="i > 0" type="button" class="mx-1 btn btn-light" @click="moveUp(i)">
                    <i data-feather="arrow-up"></i>
                  </button>
                  <button v-if="i < columns.length-1" type="button" class="mx-1 btn btn-light" @click="moveDown(i)">
                    <i data-feather="arrow-down"></i>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <router-link to="/" class="btn btn-secondary" data-dismiss="modal" aria-label="Close">
            <span>Close</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import 'bootstrap'
import feather from 'feather-icons'

export default {
  name: "Columns",
  beforeRouteEnter(to, from, next) {
    next(v => v.toggle());
  },
  beforeRouteLeave(to, from, next) {
    this.toggle()
    return next()
  },
  mounted() {
    feather.replace()
    $(this.$el).modal({show: false, keyboard: false, backdrop: 'static'})
  },
  data() {
    return {
      columns: this.$store.getters.allFields,
    }
  },
  methods: {
    apply() {
      this.$store.commit('update.fields', this.columns)
    },
    toggle() {
      $(this.$el).modal('toggle')
    },
    moveUp(ix) {
      let curr = this.columns[ix]
      this.columns[ix] = this.columns[ix-1]
      this.columns[ix-1] = curr
      this.$store.commit('update.fields', this.columns)
    },
    moveDown(ix) {
      let curr = this.columns[ix]
      this.columns[ix] = this.columns[ix+1]
      this.columns[ix+1] = curr
      this.$store.commit('update.fields', this.columns)
    },
  },
}
</script>

<style scoped>
.feather{
  width: 16px;
  height: 16px;
}
</style>
