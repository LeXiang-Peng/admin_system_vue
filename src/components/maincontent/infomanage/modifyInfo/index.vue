<template>
  <div style="background: rgba(202, 210, 207, 0.267);box-shadow: 5px 5px 50px 50px rgba(202, 210, 207, 0.267);border-radius: 12px;">
    <Form :id="id"></Form>
  </div>
</template>

<style>
</style>

<script>
import { getId } from "@/utils/role";
import Form from "./form.vue";
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
    Form,
  },
};
</script>
