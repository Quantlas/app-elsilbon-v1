<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import ConfigServices from '../service/ConfigServices';
import router from '../router';

onMounted(() => {});

const goTo = (route) => {
    router.push(route);
};
</script>

<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 cursor-pointer" @click="goTo('carousel')">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-xl text-800 font-bold mb-3">Post</span>
                        <!-- <div class="text-900 font-medium text-xl">152</div> -->
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-home text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">Cree y gestione </span>
                <span class="text-500">los articulos para publicarlos en el site.</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 cursor-pointer" @click="goTo('empty')">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-xl text-800 font-bold mb-3">Registro de Clientes</span>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">Gestione y administre </span>
                <span class="text-500">las solicitudes de sus posibles clientes.</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 cursor-pointer" @click="goTo('empty')">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-xl text-800 font-bold mb-3">Catálogo</span>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">Gestione los productos </span>
                <span class="text-500">que serán mostrados en su sección de Catálogo</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 cursor-pointer" @click="goTo('empty')">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-xl text-800 font-bold mb-3">Ofertas y Promociones</span>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">Publique ofertas y promociones </span>
                <span class="text-500">es su página web para atraer a sus clientes.</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 cursor-pointer" @click="goTo('empty')">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-xl text-800 font-bold mb-3">Aliados</span>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-thumbs-up text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">Gestione </span>
                <span class="text-500">la lista de sus aliados principales.</span>
            </div>
        </div>
    </div>
</template>
