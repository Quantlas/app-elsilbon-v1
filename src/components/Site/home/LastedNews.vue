<script setup>
import Principal from '../../sponsors/Principal.vue';
import { ref, onMounted } from 'vue';
import CarouselService from '@/service/CarouselService';

const lasteds = ref();

const getContent = () => {
    CarouselService.getContent().then(async (resp) => {
        lasteds.value = resp.data.data;
    });
};

onMounted(() => {
    getContent();
});
</script>
<template>
    <div v-for="lasted in lasteds" class="md:flex">
        <Card style="overflow: hidden" class="max-w-1/2 md:max-w-full m-4">
            <template #header>
                <Image alt="user header" :src="lasted.main_image" imageStyle="width: 100%; border-radius: 10px; max-height: 100%; padding:1%" />
            </template>
            <template #title>{{ lasted.title }}</template>
            <template #subtitle>{{ lasted.sub_title }}</template>
            <template #content>
                <p class="m-0" v-html="lasted.description"></p>
            </template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                    <router-link :to="{ path: '/article', query: { slug: lasted.slug } }">
                        <Button label="Leer" severity="secondary" outlined class="w-full" />
                    </router-link>
                    <router-link :to="{ path: '/article', query: { slug: lasted.slug } }">
                        <Button label="Compartir" class="w-full" />
                    </router-link>
                </div>
            </template>
        </Card>
    </div>
    <Principal />
</template>
