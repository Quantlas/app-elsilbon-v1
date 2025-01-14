<script setup>
import { ref, onMounted } from 'vue';

import NavBar from '@/components/Site/home/NavBar.vue';
import Hero from '@/components/Site/home/Hero.vue';
import Principal from '@/components/sponsors/Principal.vue';
import LastedNews from '@/components/Site/home/LastedNews.vue';
import Categories from '@/components/Site/home/Categories.vue';
import SubscribeSection from '@/components/Site/home/SubscribeSection.vue';
import Footer from '@/components/Site/home/Footer.vue';

onMounted(() => {});
</script>
<template>
    <Hero />
    <Principal />
    <LastedNews />
    <SubscribeSection />
    <!-- <Categories /> -->
</template>
