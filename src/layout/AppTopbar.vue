<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import auth from '@/service/auth/auth.js';
import GlobalServices from '../service/GlobalServices';

const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

const companyName = ref(import.meta.env.VITE_COMPANY_NAME);

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `IcoElSilbon.svg`;
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
    topbarMenuActive.value = false;
    //router.push('/documentation');
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const logout = () => {
    auth.unauthenticate().then(async (resp) => {
        await sleep(2000);
        location.reload();
    });
};
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <img :src="logoUrl" :alt="companyName + ' logo'" />
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <a
                href="https://api.whatsapp.com/send?phone=573204825390&text=Hola%2C%20mi%20nombre%20es%20F%C3%A9lix%20Le%C3%B3n%2C%20CEO%20en%20Quantlas.tech.%20Dime%20en%20que%20te%20puedo%20ayudar."
                target="_blank"
                title="Soporte"
                class="p-link layout-topbar-button"
            >
                <i class="pi pi-whatsapp"></i>
                <span>Soporte</span>
            </a>
            <a href="https://discord.gg/twgfANkvfS" target="_blank" title="Soporte" class="p-link layout-topbar-button">
                <i class="pi pi-discord"></i>
                <span>Soporte</span>
            </a>

            <button @click="logout()" class="p-link layout-topbar-button">
                <i class="pi pi-sign-out"></i>
                <span>Logout</span>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
