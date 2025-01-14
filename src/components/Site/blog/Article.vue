<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import RelateNews from './RelateNews.vue';
import CarouselService from '../../../service/CarouselService';
import Principal from '../../sponsors/Principal.vue';

const route = useRoute();
const slug = route.query.slug;
const post = ref({});

const getBySlug = (slug) => {
    console.log(slug);
    CarouselService.getBySlug(slug).then(async (resp) => {
        post.value = resp.data.data;
    });
};

onMounted(() => {
    getBySlug(slug);
});
</script>
<template>
    <div class="w-full md:w-2/5 mx-auto">
        <div class="mx-5 my-3 text-sm">
            <a href="" class="text-blue-900 font-bold tracking-widest">{{ post.sub_title }}</a>
        </div>
        <div class="w-full text-gray-800 text-4xl px-5 font-bold leading-none">{{ post.title }}</div>

        <div class="w-full text-gray-500 px-5 pb-5 pt-2">{{ post.description }}</div>

        <div class="mx-5">
            <Image :src="post.main_image" imageStyle="width: 100%" />
        </div>

        <div class="max-w-full text-gray-600 text-normal mx-5">
            <p class="py-3">{{ post.short_description }}</p>
        </div>

        <Panel>
            <template #header>
                <div class="items-center justify-between gap-4">
                    <div class="flex items-center gap-2">
                        <Button icon="pi pi-heart" rounded text></Button>
                        <Button icon="pi pi-bookmark" severity="secondary" rounded text></Button>
                    </div>
                    <span class="text-surface-500 dark:text-surface-400">Actualizado en {{ post.updated_at }}</span>
                </div>
            </template>
        </Panel>
        <Principal />
        <div class="p-4 w-full mx-auto" v-html="post.body"></div>
    </div>
</template>
