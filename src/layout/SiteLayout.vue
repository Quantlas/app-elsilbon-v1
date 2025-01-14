<script setup>
import { ref, onMounted, computed } from 'vue';
import NavBar from '../components/Site/home/NavBar.vue';
import Footer from '../components/Site/home/Footer.vue';
</script>
<template>
    <NavBar class="mb-12" style="display: block" />
    <div>
        <router-view style="display: block" />
    </div>
    <Footer />
</template>
<style></style>
