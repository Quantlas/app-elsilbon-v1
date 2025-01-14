<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import ReceivablesService from '../../../service/ReceivablesService';
import router from '../../../router';
import IcoEpayco from '@/assets/img/IcoEpayco.webp';
import LogoPaypal from '@/assets/img/paypal-logo.png';
import LogoEpayco from '@/assets/img/epayco-logo.png';

const { isDarkTheme } = useLayout();

const usDialog = ref(false);
const paypalDialog = ref(false);
const epaycoDialog = ref(false);
const gateway = ref({});
const submitted = ref(false);

const openDefault = () => {
    gateway.value = {};
    submitted.value = false;
    usDialog.value = true;
};

const openPaypalModal = () => {
    gateway.value = {};
    submitted.value = false;
    paypalDialog.value = true;
};

const openEpaycoModal = () => {
    gateway.value = {};
    submitted.value = false;
    epaycoDialog.value = true;
};

const dropdownPaymentGatewayValues = ref([
    { name: 'Paypal', code: 1 },
    { name: 'ePayco', code: 2 }
]);

const dropdownBankValues = ref([
    { name: 'Bancolombia', code: 1 },
    { name: 'DaviPlata', code: 2 },
    { name: 'Nequi', code: 3 },
    { name: 'Banco AV Villas', code: 4 },
    { name: 'Banco Caja Social', code: 5 },
    { name: 'Banco Popular', code: 6 },
    { name: 'Davivienda', code: 7 },
    { name: 'BBVA', code: 8 },
    { name: 'Banco de Occidente', code: 9 },
    { name: 'Scotiabank Colpatria', code: 10 }
]);

const hideUsDialog = () => {
    usDialog.value = false;
    submitted.value = false;
};

const hidePaypalModal = () => {
    paypalDialog.value = false;
    submitted.value = false;
};

const hideEpaycoModal = () => {
    epaycoDialog.value = false;
    submitted.value = false;
};

const radioValue = ref(null);

const lineData = reactive({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
});
const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-minus' }
]);
const lineOptions = ref(null);

onMounted(() => {});

const goTo = (route) => {
    router.push(route);
};
</script>

<template>
    <NoContent :to="'#config'" :button="'Configurar'" />
    <div class="grid mt-4">
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 cursor-pointer shadow-2" @click="openDefault()">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-3xl font-medium text-900 mb-3">Déjanoslo a nosotros</span>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-verified text-blue-600 text-xl"></i>
                    </div>
                </div>
                <span class="text-500">Utiliza nuestros métodos de cobro y nosotros lo gestionaremos por ti. Al final de mes haremos un balance de todos cobros generados y lo depositaremos en tu cuenta bancaria.</span>
                <Button label="Configurar" icon="pi pi-plus" class="block p-button-success mr-2 mt-4" />
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 cursor-pointer shadow-2" @click="openPaypalModal()">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-xl text-800 font-bold mb-3">Integra Paypal</span>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-paypal text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">Integra </span>
                <span class="text-500">tu propia pasarela de pagos usando tu cuenta de <span class="text-blue-500 font-medium">Paypal</span> y enviaremos las formas de pago a tus vecinos para que lo hagan directamente a ti.</span>
                <Button label="Configurar" icon="pi pi-plus" class="block p-button-success mr-2 mt-4" />
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 cursor-pointer shadow-2" @click="openEpaycoModal()">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-xl text-800 font-bold mb-3">Integra ePayco</span>
                    </div>
                    <div class="flex align-items-center justify-content-center">
                        <img :src="IcoEpayco" alt="" style="width: 2.5rem; height: 2.5rem" />
                    </div>
                </div>
                <span class="text-green-500 font-medium">Integra </span>
                <span class="text-500">tu propia pasarela de pagos usando tu cuenta de <span class="text-blue-500 font-medium">ePayco</span> y enviaremos las formas de pago a tus vecinos para que lo hagan directamente a ti.</span>
                <Button label="Configurar" icon="pi pi-plus" class="block p-button-success mr-2 mt-4" />
            </div>
        </div>

        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="flex align-items-center justify-content-between mb-4">
                    <h5>Noticias</h5>
                </div>

                <ul class="p-0 mx-0 mt-0 mb-4 list-none">
                    <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                        <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                            <i class="pi pi-dollar text-xl text-blue-500"></i>
                        </div>
                        <span class="text-900 line-height-3"> Paga solo el <span class="text-blue-500 font-medium">2.3%</span> de comisión utilizando nuestros métodos de pago. <a :href="'/'">Actualízate</a> </span>
                    </li>
                    <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                        <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                            <i class="pi pi-dollar text-xl text-blue-500"></i>
                        </div>
                        <span class="text-900 line-height-3"> 50% de descuento por 3 meses al ampliar tu plan actual. <a :href="'/'">Ampliar Plan</a> </span>
                    </li>
                    <li class="flex align-items-center py-2 border-bottom-1 surface-border">
                        <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                            <i class="pi pi-info-circle text-xl text-yellow-500"></i>
                        </div>
                        <span class="text-900 line-height-3">
                            Estamos trabajando para mejorar la experiencia. Por ahora solo podrán disfrutar del Paln Básico Gratis; pero muy pronto tendrán la posibilidad de expandirlo. Para más información, puede ingresar a nuestro canal de soporte
                            en Discord: <a href="https://discord.gg/pbEMpVGTHT" target="_blank"> <i class="pi pi-discord text-xl text-blue-500"></i> Soporte</a>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <!-- DEJANOSLO -->

    <Dialog v-model:visible="usDialog" :header="gateway.name ? 'Editar Método de Cobro' : 'Método de Cobro Interno'" :modal="true" class="p-fluid md:w-auto">
        <p class="block mb-2">
            Utiliza nuestros métodos de cobro y nosotros lo gestionaremos por ti. <br />
            Al final de mes haremos un balance de todos cobros generados <br />
            y lo depositaremos en tu cuenta bancaria. <br />
            Para más información, puedes leer toda la <a href="">documentación</a> sobre este método.
        </p>

        <hr class="mb-4" />

        <div class="field">
            <label for="option" class="block"><b>¿Dónde desea que le entreguemos su dinero? *</b> <i class="pi pi-question-circle" v-tooltip="'Seleccione la manera en que le depositaremos lo recolectado'"></i></label>
            <div class="col-12 md:col-4">
                <div class="field-radiobutton mb-0">
                    <RadioButton id="option1" name="option" value="bank" v-model="gateway.radioValue" />
                    <label for="option1">Cuenta bancaria</label>
                </div>
            </div>
            <div class="col-12 md:col-4">
                <div class="field-radiobutton mb-0">
                    <RadioButton id="option2" name="option" value="paypal" v-model="gateway.radioValue" />
                    <label for="option2">Paypal</label>
                </div>
            </div>
        </div>

        <div v-if="gateway?.radioValue == 'bank'">
            <div class="field">
                <label for="name"><b>Seleccione un Banco *</b> <i class="pi pi-question-circle" v-tooltip="'Seleccione su entidad bancaria'"></i></label>
                <Dropdown v-model="gateway.bank" :options="dropdownBankValues" optionLabel="name" placeholder="Select" required="true" :class="{ 'p-invalid': submitted && !gateway.bank }" />
                <small class="p-invalid" v-if="submitted && !gateway.bank">Bank is required.</small>
            </div>
            <div class="field">
                <label for="account_number"><b>Número de la cuenta *</b></label>
                <InputText id="account_number" v-model.trim="gateway.account_number" required="true" :class="{ 'p-invalid': submitted && !gateway.account_number }" />
                <small class="p-invalid" v-if="submitted && !gateway.account_number">Account Number is required.</small>
            </div>
            <div class="field">
                <label for="account_owner"><b>Titular de cuenta *</b></label>
                <InputText id="account_owner" v-model.trim="gateway.account_owner" required="true" :class="{ 'p-invalid': submitted && !gateway.account_owner }" />
                <small class="p-invalid" v-if="submitted && !gateway.account_owner">Account Number is required.</small>
            </div>
            <div class="field">
                <label for="dni_owner"><b>Documento del Titular de la cuenta</b></label>
                <InputText id="dni_owner" v-model.trim="gateway.dni_owner" required="true" />
            </div>
        </div>

        <div v-if="gateway?.radioValue == 'paypal'">
            <div class="field">
                <label for="account_email"><b>Correo asociado *</b></label>
                <InputText id="account_email" v-model.trim="gateway.account_email" required="true" :class="{ 'p-invalid': submitted && !gateway.account_email }" />
                <small class="p-invalid" v-if="submitted && !gateway.account_email">Account Number is required.</small>
            </div>
            <div class="field">
                <label for="account_owner"><b>Titular de la cuenta *</b></label>
                <InputText id="account_owner" v-model.trim="gateway.account_owner" required="true" :class="{ 'p-invalid': submitted && !gateway.account_owner }" />
                <small class="p-invalid" v-if="submitted && !gateway.account_owner">Account Number is required.</small>
            </div>
        </div>

        <hr class="mb-4" />

        <div class="field">
            <label for="name"><b>¿Cual medio prefiere para recaudar? *</b> <i class="pi pi-question-circle" v-tooltip="'Esta es la plataforma que usaremos para pedirle a sus vecinos que paguen'"></i></label>
            <Dropdown v-model="gateway.paymentGateway" :options="dropdownPaymentGatewayValues" optionLabel="name" placeholder="Select" required="true" :class="{ 'p-invalid': submitted && !gateway.paymentGateway }" />
            <small class="p-invalid" v-if="submitted && !gateway.paymentGateway">Payment Gateway is required.</small>
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideUsDialog" />
            <Button type="submit" label="Guardar" icon="pi pi-check" class="p-button-text" @click.prevent.stop="saveGateway" />
        </template>
    </Dialog>

    <!-- PAYPAL -->

    <Dialog v-model:visible="paypalDialog" :header="gateway.name ? 'Editar Método de Cobro' : 'Integración con Paypal'" :modal="true" class="p-fluid md:w-auto">
        <div class="flex align-items-center justify-content-center mb-4">
            <img :src="LogoPaypal" alt="" style="height: 6rem" />
        </div>
        <p class="block mb-2">
            Integra tu propia pasarela de pagos usando tu cuenta de Paypal <br />
            y enviaremos las formas de pago a tus vecinos para que lo hagan directamente a ti. <br />
            Para más información, puedes leer toda la <a href="">documentación</a> sobre este método.
        </p>

        <hr class="mb-4" />

        <h1 class="flex align-items-center justify-content-center">Muy pronto</h1>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hidePaypalModal" />
            <Button type="submit" label="Guardar" icon="pi pi-check" class="p-button-text" @click.prevent.stop="saveGateway" />
        </template>
    </Dialog>

    <!-- EPAYCO -->

    <Dialog v-model:visible="epaycoDialog" :header="gateway.name ? 'Editar Método de Cobro' : 'Integración con Paypal'" :modal="true" class="p-fluid md:w-auto">
        <div class="flex align-items-center justify-content-center mb-4">
            <img :src="LogoEpayco" alt="" style="height: 6rem" />
        </div>
        <p class="block mb-2">
            Integra tu propia pasarela de pagos usando tu cuenta de Paypal <br />
            y enviaremos las formas de pago a tus vecinos para que lo hagan directamente a ti. <br />
            Para más información, puedes leer toda la <a href="">documentación</a> sobre este método.
        </p>

        <hr class="mb-4" />

        <h1 class="flex align-items-center justify-content-center">Muy pronto</h1>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideEpaycoModal" />
            <Button type="submit" label="Guardar" icon="pi pi-check" class="p-button-text" @click.prevent.stop="saveGateway" />
        </template>
    </Dialog>
</template>
