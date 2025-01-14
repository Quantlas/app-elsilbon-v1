<script setup>
import { ref, onMounted, computed } from 'vue';

import Register from '@/service/auth/register.js';
import Auth from '@/service/auth/auth.js';
import router from '@/router';

let logged = false;

let subscription = '';

if (localStorage?.token) {
    logged = true;
    subscription = JSON.parse(localStorage?.scopes);
    subscription = subscription?.subscription;
}

const smoothScroll = (id) => {
    document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
    });
};

const loginForm = ref(false);
const registerForm = ref(false);
const forgotForm = ref(false);
const submitted = ref(false);
const checked = ref(false);

const openLogin = () => {
    registerForm.value = false;
    submitted.value = false;
    forgotForm.value = false;
    loginForm.value = true;
};

const openRegister = () => {
    submitted.value = false;
    loginForm.value = false;
    forgotForm.value = false;
    registerForm.value = true;
};

const openForgot = () => {
    submitted.value = false;
    loginForm.value = false;
    registerForm.value = false;
    forgotForm.value = true;
};

const name = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');

const hideDialog = () => {
    registerForm.value = false;
    loginForm.value = false;
    submitted.value = false;
};

const messages = ref([]);
let count = ref(0);

const addMessages = (type, message) => {
    messages.value = [];
    messages.value = [{ severity: type, content: message, id: count.value++ }];
};

const clearMessages = () => {
    messages.value = [];
};

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const register = () => {
    clearMessages();
    const RegisterData = {
        name: name.value,
        email: email.value,
        password: password.value,
        password_confirmation: password_confirmation.value
    };
    if (checked.value && name.value && email.value && password.value && password_confirmation.value) {
        Register.register(RegisterData).then(async (resp) => {
            if (resp.data != undefined) {
                addMessages('success', 'Usuario creado. Ahora puede iniciar sesión.');
                await sleep(2000);
                location.reload();
                await sleep(1000);
                router.push({ name: 'dashboard' });
            } else {
                addMessages('success', resp);
            }
        });
    } else {
        addMessages('error', 'Debe llenar todos los campos');
    }
};

const login = () => {
    clearMessages();
    const LoginData = {
        email: email.value,
        password: password.value
    };
    Auth.login(LoginData).then(async (resp) => {
        await sleep(2000);
        location.reload();
    });
};

const toDash = () => {
    router.push({ name: 'dashboard' });
};

const logout = () => {
    Auth.unauthenticate();
};

const logoUrl = computed(() => {
    return `IcoElSilbon.svg`;
});

onMounted(() => {
    if (localStorage.token) {
        const scopesString = localStorage.getItem('scopes');
        const scopes = JSON.parse(scopesString);
        switch (scopes.rol) {
            case 'customer':
                router.push({ name: 'home' });
                break;

            default:
                router.push({ name: 'dashboard' });
                break;
        }
    }
});

const items = ref([
    {
        label: 'Home',
        icon: 'pi pi-home',
        to: '/'
    },
    {
        label: 'Destacados',
        icon: 'pi pi-star',
        to: '/'
    },
    {
        label: 'Categorías',
        icon: 'pi pi-search',
        items: [
            {
                label: 'Sucesos',
                icon: 'pi pi-bolt',
                to: '/'
            },
            {
                label: 'Actualidad',
                icon: 'pi pi-server',
                to: '/'
            },
            {
                label: 'Arte y Cultura',
                icon: 'pi pi-pencil',
                to: '/'
            },
            {
                separator: true
            },
            {
                label: 'Servicios',
                icon: 'pi pi-palette',
                items: [
                    {
                        label: 'Desarrollo Web',
                        icon: 'pi pi-palette',
                        badge: 2,
                        to: '/'
                    },
                    {
                        label: 'Marketing',
                        icon: 'pi pi-palette',
                        badge: 3,
                        to: '/'
                    }
                ]
            }
        ]
    },
    {
        label: 'Favoritos',
        icon: 'pi pi-heart',
        badge: 3,
        to: '/'
    }
]);
</script>
<template>
    <div>
        <Menubar :model="items">
            <template #start>
                <router-link to="/">
                    <h1 class="p-2 mb-0">El Silbón</h1>
                </router-link>
            </template>
            <template #item="{ item, props, hasSubmenu, root }">
                <a v-ripple class="flex items-center" v-bind="props.action">
                    <span :class="item.icon" />
                    <router-link :to="item.to">
                        <span class="ml-2">{{ item.label }}</span>
                    </router-link>
                    <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
                    <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
                    <i v-if="hasSubmenu" :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i>
                </a>
            </template>

            <template #end>
                <Button @click="openLogin()">Ingresar</Button>
                <!-- <div class="flex items-center gap-2">
                    <InputText placeholder="Busca la verdad..." type="text" class="w-32 hidden md:block" />
                    <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
                </div> -->
            </template>
        </Menubar>
        <!-- <div class="p-2">
            <InputText placeholder="Busca la verdad..." type="text" class="w-full block md:hidden" />
        </div> -->
    </div>

    <Dialog v-model:visible="loginForm" :modal="true" class="p-fluid m-4">
        <div class="text-center">
            <router-link to="/">
                <img :src="logoUrl" alt="El Silbon" class="mb-1 mt-3" style="max-width: 30%" />
            </router-link>
        </div>
        <router-link to="/">
            <div class="text-900 text-4xl font-medium mb-1 mt-1 text-center">El Silbón</div>
        </router-link>
        <div style="border-radius: 56px; padding: 0.3rem">
            <div class="w-full surface-card py-3 px-3 sm:px-8" style="border-radius: 53px">
                <div class="text-center mb-5">
                    <div class="text-900 text-2xl font-medium mb-3">Inicie sesión</div>
                </div>
                <div>
                    <label for="email" class="block text-900 text-xl font-medium mb-2">Email</label>
                    <InputText id="email" v-model="email" type="text" placeholder="ejemplo@correo.com" class="w-full md:w-30rem mb-5" style="padding: 1rem" />

                    <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                    <input type="password" id="password1" class="p-inputtext p-component p-password-input w-full mb-4" v-model="password" placeholder="Password" />

                    <Button @click="login($event)" label="Ingresar" class="w-full p-3 text-xl"></Button>
                </div>
            </div>
        </div>
        <!-- <a @click="openRegister" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Registrarse</a> -->
    </Dialog>

    <!------------------------------ 
        Formulario de Register
------------------------------->
    <Dialog v-model:visible="registerForm" :modal="true" class="p-fluid">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="GeCo Logo" class="w-6rem flex-shrink-0" />
            <div class="text-900 text-4xl font-medium">El Silbón</div>
            <div style="border-radius: 56px; padding: 0.3rem">
                <div class="w-full surface-card py-3 px-3 sm:px-8" style="border-radius: 53px">
                    <div class="text-center">
                        <div class="text-900 text-2xl font-medium mb-3">Registrarse</div>
                    </div>
                    <div>
                        <label for="name" class="block text-900 text-xl font-medium mb-2">Nombres</label>
                        <InputText id="name" placeholder="Su nombre" type="text" class="w-full md:w-30rem mb-3" style="padding: 1rem" v-model="name" />

                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="ejemplo@correo.com" class="w-full md:w-30rem mb-3" style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <label for="password_confirmation" class="block text-900 font-medium text-xl mb-2">Repita Password</label>
                        <Password id="password_confirmation" v-model="password_confirmation" placeholder="Repita Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                        <transition-group name="p-message" tag="div">
                            <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
                        </transition-group>
                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2" :required="required"></Checkbox>
                                <label for="rememberme1">Acepto los Términos y condiciones</label>
                            </div>
                            <a @click="openLogin" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Ya tengo cuenta</a>
                        </div>
                        <Button @click="register($event)" label="Registrar" class="w-full p-3 text-xl"></Button>
                    </div>
                </div>
            </div>
        </div>
    </Dialog>
</template>
