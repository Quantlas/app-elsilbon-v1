<script setup>
import router from '../router';
import { defineProps } from 'vue';

const props = defineProps({
    to: String,
    button: String
});
const goTo = (route) => {
    router.push(route);
};
</script>
<template #default="{ to, button }">
    <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
        <div class="text-700 text-center">
            <div class="text-900 font-bold text-5xl mb-3">Aún no hay nada aquí</div>
            <div class="text-700 text-2xl mb-5">Inicia la gestión de tu comunidad con las mejores y más completas funcionalidades.</div>
            <Button @click="goTo(to)" :label="button" icon="pi pi-plus" class="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap"></Button>
        </div>
    </div>
</template>
