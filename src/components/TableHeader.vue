<template>
  <tr>
    <th v-for="(f, i) in fields" :key="i"
      scope="col"
      class="text-capitalize">{{f.label}}</th>
  </tr>
</template>

<script>
export default {
  name: 'TableHeader',
  props: ['fields'],
}
</script>
