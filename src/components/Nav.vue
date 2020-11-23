<template>
  <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    <a class="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href="#">VILOG</a>
    <ul class="navbar-nav">
      <li class="nav-item px-3" title="register host">
        <router-link to='/register' class="nav-link">
          <strong>&#43;</strong>
        </router-link>
      </li>
      <li class="nav-item px-3" title="select columns to show">
        <router-link to='/settings' class="nav-link">
          <strong>&#9776;</strong>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Nav",
}
</script>

<style scoped>
.navbar-brand {
  padding-top: .75rem;
  padding-bottom: .75rem;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, .25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
}

.navbar-nav {
    flex-direction: row;
}

.navbar-nav .nav-item .nav-link {
  font-weight: bold;
}
</style>
