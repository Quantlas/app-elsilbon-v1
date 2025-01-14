<script setup>
import { ref, onMounted } from 'vue';
import CarouselService from '@/service/CarouselService';

const posts = ref();

const responsiveOptions = ref([
    {
        breakpoint: '991px',
        numVisible: 4
    },
    {
        breakpoint: '767px',
        numVisible: 3
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);

const getContent = () => {
    CarouselService.getContent().then(async (resp) => {
        posts.value = resp.data.data;
    });
};

onMounted(() => {
    getContent();
});
</script>
<template>
    <div class="">
        <Galleria :value="posts" :responsiveOptions="responsiveOptions" :numVisible="5" :circular="true" containerStyle="max-width: 100%" :showItemNavigators="true" :showThumbnails="false">
            <template #item="slotProps">
                <img :src="slotProps.item.main_image" :alt="slotProps.item.alt" style="width: 100%; display: block" />
            </template>
            <template #thumbnail="slotProps">
                <img :src="slotProps.item.main_image" :alt="slotProps.item.alt" style="display: block" />
            </template>

            <template #caption="slotProps">
                <router-link :to="{ path: '/article', query: { slug: slotProps.item.slug } }">
                    <div class="text-white text-xl mb-2 font-bold">{{ slotProps.item.title }}</div>
                    <p class="text-white">{{ slotProps.item.sub_title }}</p>
                </router-link>
            </template>
        </Galleria>
    </div>
</template>
