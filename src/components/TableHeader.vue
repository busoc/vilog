<template>
  <tr>
    <th v-for="(f, i) in fields" :key="i" scope="col">{{f.label}}</th>
  </tr>
</template>

<script>
export default {
  name: 'TableHeader',
  props: ['fields'],
}
</script>
