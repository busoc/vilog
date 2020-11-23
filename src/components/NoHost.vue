<template>
  <div v-if="hosts.length == 0" class="px-3 text-center">
    <p class="text-muted">no hosts currently registered! click on the link below to register one</p>
    <router-link to="/register">
      <span>register host</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NoHost',
  props: ["hosts"]
}
</script>

<style scoped>
div {
  margin-top: 120px;
}
</style>
