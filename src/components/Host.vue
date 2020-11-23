<template>
  <div class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Register host</h5>
          <router-link to="/" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </router-link>
        </div>
        <div class="modal-body">
          <form id="register-form" @submit.prevent>
            <p v-if="err" class="alert alert-danger border-0">{{err}}</p>
            <div class="form-group">
              <label for="label">label</label>
              <input type="text" id="label" class="form-control" v-model.trim="host.label" placeholder="foobar"/>
            </div>
            <div class="form-group">
              <label for="addr">address (IP/Hostname)</label>
              <input type="text" id="addr" class="form-control" v-model.trim="host.addr" placeholder="127.0.0.1"/>
            </div>
            <div class="form-group">
              <label for="port">port</label>
              <input type="number" min="0" max="65535" id="port" class="form-control" v-model.number="host.port" placeholder="9090"/>
            </div>
            <hr />
            <div class="form-group">
              <label for="source">source</label>
              <input type="text" id="source" class="form-control" v-model.trim="host.source" placelhoder="/sources"/>
            </div>
            <div class="form-group">
              <label for="limit">lines</label>
              <input type="number" id="limit" class="form-control" v-model.number="host.limit" placeholder="1000"/>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <router-link to="/" class="btn btn-secondary" data-dismiss="modal" aria-label="Close">
            <span>Cancel</span>
          </router-link>
          <button type="button" class="btn btn-primary" @click="save">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import 'bootstrap'

const defaultHost = {
  label: "",
  addr: "127.0.0.1",
  port: 80,
  source: "/sources",
  limit: 1000,
}

export default {
  name: "Host",
  beforeRouteEnter(to, from, next) {
    next(v => v.toggle());
  },
  beforeRouteLeave(to, from, next) {
    this.toggle()
    return next()
  },
  mounted() {
    $(this.$el).modal({show: false, keyboard: false, backdrop: 'static'})
  },
  data() {
    return {
      host: Object.assign({}, defaultHost),
      err:  "",
    }
  },
  methods: {
    toggle() {
      $(this.$el).modal('toggle')
    },
    save() {
      this.$store.dispatch('fetch.sources', {host: this.host}).then(() => {
        this.host = Object.assign({}, defaultHost)
        this.err = undefined
        this.$router.push('/')
      }).catch(() => {
        this.err = "invalid information provided"
      })
    },
  },
}
</script>
