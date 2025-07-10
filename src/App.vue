<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
// import { login } from "./api/login";
import { useLoginStore } from "./store/login";

onMounted(() => {
  // login().then((res) => {
  //   console.log(res);
  // });
});
useLoginStore();
</script>

<style scoped></style>
