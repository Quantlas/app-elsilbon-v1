<script setup>
import { ref } from 'vue';
import router from './router';

const token = ref(localStorage);
if (token.value.length == 0) {
    router.push('/');
}
</script>

<template>
    <router-view />
</template>

<style scoped></style>
