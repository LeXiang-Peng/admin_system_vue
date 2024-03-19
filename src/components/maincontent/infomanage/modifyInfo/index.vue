<template>
  <div style="background: rgba(202, 210, 207, 0.267);box-shadow: 5px 5px 50px 50px rgba(202, 210, 207, 0.267);border-radius: 12px;">
    <adminForm v-if="id == 1"></adminForm>
    <div v-if="id === 2">
      student
    </div>
    <div v-if="id === 3">
      teacher
    </div>
  </div>
</template>

<style>
</style>

<script>
import { getId } from "@/utils/role";
import adminForm from "./adminForm.vue";
export default {
  name: "modifyInfo",
  data() {
    return {
      id: 0,
    };
  },
  created() {
    this.id = getId();
  },
  components: {
    adminForm,
  },
};
</script>
