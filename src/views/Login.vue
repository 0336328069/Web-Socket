<template>
    <Form @on-submit="connectSocket" v-model:email="email" v-model:password="password"></Form>
</template>
<script lang="ts" setup>
import Form from "@/components/Form.vue";
import router from "@/plugins/router";
import Socket from "@/plugins/socket";
import { nextTick } from "vue";
import { ref } from "vue";
const email = ref("");
const password = ref("");
const connectSocket = () => {
  Socket.auth = {
    email: email.value,
    password: password.value
  };
  Socket.connect();
  nextTick(() => {
    document.cookie = `email=${email.value}`;
    document.cookie = `password=${password.value}`;
    router.push({ path : '/' });
  })
}
</script>