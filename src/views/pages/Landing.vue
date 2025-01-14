<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed, onMounted, ref } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import Register from '@/service/auth/register.js';
import Auth from '@/service/auth/auth.js';
import router from '../../router';

let logged = false;

let subscription = '';

if (localStorage?.token) {
    logged = true;
    subscription = JSON.parse(localStorage?.scopes);
    subscription = subscription?.subscription;
}

const { layoutConfig } = useLayout();

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
        await sleep(1000);
        router.push({ name: 'dashboard' });
    });
};

const toDash = () => {
    router.push({ name: 'dashboard' });
};

const logout = () => {
    Auth.unauthenticate();
};

const logoUrl = computed(() => {
    return `logo.png`;
});

onMounted(() => {
    if (localStorage.token) {
        router.push({ name: 'dashboard' });
    }
});
</script>

<template>
    <div class="flex flex-column align-items-center justify-content-center mt-8">
        <img :src="logoUrl" alt="Yonlui Logo" class="mb-5 w-1/2 flex-shrink-0" />
        <div class="text-900 text-4xl font-medium mb-3">Gestor Web</div>
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
    </div>

    <!------------------------------ 
        Formulario de Register
------------------------------->
    <Dialog v-model:visible="registerForm" :modal="true" class="p-fluid">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="GeCo Logo" class="w-6rem flex-shrink-0" />
            <div class="text-900 text-4xl font-medium">Gestor Comunitario</div>
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

    <!------------------------------ 
        Formulario de Recuperar cuenta
------------------------------->
    <Dialog v-model:visible="forgotForm" :modal="true" class="p-fluid">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="GeCo Logo" class="w-6rem flex-shrink-0" />
            <div class="text-900 text-4xl font-medium">Gestor Comunitario</div>
            <div style="border-radius: 56px; padding: 0.3rem">
                <div class="w-full surface-card py-3 px-3 sm:px-8" style="border-radius: 53px">
                    <div class="text-center">
                        <div class="text-900 text-2xl font-medium mb-3">Recuperar cuenta</div>
                    </div>
                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="ejemplo@correo.com" class="w-full md:w-30rem mb-3" style="padding: 1rem" v-model="email" />

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <span class="text-600 font-medium">Enviaremos un correo con las instrucciones para recuperar su cuneta</span>
                        </div>
                        <Button label="Enviar" class="w-full p-3 text-xl"></Button>
                    </div>
                </div>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
#hero {
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #eeefaf 0%, #c3e3fa 100%);
    height: 700px;
    overflow: hidden;
}

@media screen and (min-width: 768px) {
    #hero {
        -webkit-clip-path: ellipse(150% 87% at 93% 13%);
        clip-path: ellipse(150% 87% at 93% 13%);
        height: 530px;
    }
}

@media screen and (min-width: 1300px) {
    #hero > img {
        position: absolute;
    }

    #hero > div > p {
        max-width: 450px;
    }
}

@media screen and (max-width: 1300px) {
    #hero {
        height: 600px;
    }

    #hero > img {
        position: static;
        transform: scale(1);
        margin-left: auto;
    }

    #hero > div {
        width: 100%;
    }

    #hero > div > p {
        width: 100%;
        max-width: 100%;
    }
}
</style>
