<template>
  <form class="form-inline my-4 px-3" @submit.prevent>
        <label for="process">process</label>
        <select v-model="process" id="process" class="mx-2 form-control form-control-sm">
          <option value=""></option>
          <option v-for="p in processes" :key="p" :value="p">{{p}}</option>
        </select>
        <label for="level">level</label>
        <select v-model="level" id="level" class="mx-2 form-control form-control-sm">
          <option value=""></option>
          <option v-for="v in levels" :key="v" :value="v">{{v}}</option>
        </select>
        <label for="dtstart">start</label>
        <input v-model="dtstart" type="datetime-local" id="dtstart" class="mx-2 form-control form-control-sm"/>
        <label for="dtend">end</label>
        <input v-model="dtend" type="datetime-local" id="dtend" class="mx-2 form-control form-control-sm"/>
        <label for="message">message</label>
        <input v-model="message" type="text" id="message" class="mx-2 form-control form-control-sm"/>
  </form>
</template>
<script>
export default {
  name: 'Filter',
  data() {
    return {
      process: "",
      level: "",
      message: "",
      dtstart: "",
      dtend: "",
    }
  },
}
</script>
