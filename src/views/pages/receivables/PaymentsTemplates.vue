<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import GlobalServices from '@/service/GlobalServices';
import ReceivablesService from '@/service/ReceivablesService';

const toast = useToast();

const computedSubscription = ref({});
const templates = ref({});
const template = ref({});
const countTemplates = ref(undefined);
const myTemplates = ref({});
const permitted_communities = ref(null);

const autoFilteredValue = ref([]);
const autoValue = ref(null);

const visibleRight = ref(false);

const dropdownPaymentGatewayValues = ref([]);

const getTemplates = () => {
    ReceivablesService.getPaymentTemplates().then(async (resp) => {
        myTemplates.value = resp;
        templates.value = myTemplates.value.data.data.payment_templates;

        dropdownPaymentGatewayValues.value.push({ name: 'Efectivo', code: '1' });

        myTemplates.value.data.data.payment_gateway_users.forEach((element) => {
            dropdownPaymentGatewayValues.value.push({ name: element.name, code: element.payment_gateway_id });
        });

        if (myTemplates.value.data.data.payment_templates.length != undefined) {
            countTemplates.value = myTemplates.value.data.data.payment_templates.length;
        }
    });
};

const templateDialog = ref(false);
const deleteTemplateDialog = ref(false);
const deleteTemplatesDialog = ref(false);
const startOrPausedDialog = ref(false);
const selectedTemplates = ref(null);
const filters = ref({});
const submitted = ref(false);

const openNew = () => {
    template.value = {};
    submitted.value = false;
    templateDialog.value = true;
};

const hideDialog = () => {
    templateDialog.value = false;
    submitted.value = false;
};

const saveTemplate = () => {
    submitted.value = true;
    if (template.value.name) {
        if (template.value.id) {
            ReceivablesService.updateAutomation(template.value).then(async (resp) => {
                getTemplates();
            });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'template Updated', life: 3000 });
        } else {
            ReceivablesService.createAutomation(template.value).then(async (resp) => {
                getTemplates();
            });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'template Created', life: 3000 });
        }
        templateDialog.value = false;
        template.value = {};
    }
};

const startOrPaused = () => {
    submitted.value = true;
    ReceivablesService.startOrPaused(template.value).then(async (resp) => {
        console.log(resp);
        startOrPausedDialog.value = false;
        getTemplates();
    });
};

const editTemplate = (editTemplate) => {
    template.value = { ...editTemplate };
    templateDialog.value = true;
};

const confirmDeleteTemplate = (deleteTemplate) => {
    template.value = deleteTemplate;
    deleteTemplateDialog.value = true;
};

const confirmStartOrPausedDialog = (startOrPaused) => {
    template.value = startOrPaused;
    startOrPausedDialog.value = true;
};

const deleteTemplate = () => {
    ReceivablesService.deleteAutomation(template.value).then(async (resp) => {
        getTemplates();
    });
    deleteTemplateDialog.value = false;
    template.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Automatizacion eliminada', life: 3000 });
};

const confirmDeleteSelected = () => {
    deleteCitizensDialog.value = true;
};
const deleteSelectedTemplates = () => {
    template.value = template.value.filter((val) => !selectedTemplates.value.includes(val));
    deleteTemplatesDialog.value = false;
    selectedTemplates.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Ciudadanos emilinados', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const dropdownPaymentTypeValues = ref([
    { name: 'Pago único', code: 'single' },
    { name: 'Semanal', code: 'weekly' },
    { name: 'Quincenal', code: 'biweekly' },
    { name: 'Mensual', code: 'monthly' },
    { name: 'Trimestral', code: 'quarterly' },
    { name: 'Semestral', code: 'biannual' },
    { name: 'Anual', code: 'annual' }
]);

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    getTemplates();
    computedSubscription.data = GlobalServices.computedSubscription();
    permitted_communities.value = computedSubscription.data.permitted_communities;
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h1>Automatización de cobros</h1>
                <span class="text-sm text-gray-800">
                    En este módulo, usted puede
                    <span class="text-red-500 font-medium">automatizar</span>
                    sus <span class="text-green-500 font-medium">cobros</span>, permitiendole enviar facturas, recibos y formas de pago a sus vecinos por correo electrónico.
                </span>
            </div>
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Generar cobros" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedTemplates || !selectedTemplates.length" /> -->
                        </div>
                    </template>
                </Toolbar>
                <div v-if="countTemplates != undefined">
                    <DataTable
                        ref="dt"
                        :value="templates"
                        v-model:selection="selectedTemplates"
                        dataKey="id"
                        :paginator="true"
                        :rows="10"
                        :filters="filters"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25, 50, 100]"
                        currentPageReportTemplate="Viendo {first} a {last} de {totalRecords} plantillas"
                        responsiveLayout="scroll"
                    >
                        <template #header>
                            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <h5 class="m-0">Cobros</h5>
                                <span class="block mt-2 md:mt-0 p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                                </span>
                            </div>
                        </template>

                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

                        <Column field="name" header="Nombre" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Nombre</span>
                                {{ slotProps.data.name }}
                            </template>
                        </Column>
                        <Column field="description" header="Descripción" :sortable="true" headerStyle="width:40%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Descripción</span>
                                {{ slotProps.data.description }}
                            </template>
                        </Column>
                        <Column field="payment_gateway_name" header="Método" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Método</span>
                                {{ slotProps.data.payment_gateway_name }}
                            </template>
                        </Column>
                        <Column field="payment_type" header="Recurrencia" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Recurrencia</span>
                                {{ slotProps.data.payment_type }}
                            </template>
                        </Column>
                        <Column field="amount" header="Monto" :sortable="true" headerStyle="width:30%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Monto</span>
                                {{ slotProps.data.amount }}
                            </template>
                        </Column>
                        <Column field="status" header="Estado" :sortable="true" headerStyle="width:30%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Estado</span>
                                {{ slotProps.data.status }}
                            </template>
                        </Column>
                        <Column field="start_date" header="Cobrando desde" :sortable="true" headerStyle="width:30%;">
                            <template #body="slotProps">
                                <span class="p-column-title">Cobrando desde</span>
                                {{ slotProps.data.start_date }}
                            </template>
                        </Column>
                        <Column headerStyle="min-width:12rem;">
                            <template #body="slotProps">
                                <Button icon="pi pi-pencil" title="Editar" class="p-button-rounded p-button-success mr-2" @click="editTemplate(slotProps.data)" />

                                <Button v-if="slotProps.data.status == 'Active'" icon="pi pi-pause" title="Pausar" class="p-button-rounded p-button-warning mr-2" @click="confirmStartOrPausedDialog(slotProps.data)" />
                                <Button v-else="slotProps.data.status == 'Paused'" icon="pi pi-play" title="Iniciar" class="p-button-rounded p-button-primary mr-2" @click="confirmStartOrPausedDialog(slotProps.data)" />

                                <Button icon="pi pi-trash" title="Eliminar" class="p-button-rounded p-button-danger mt-2" @click="confirmDeleteTemplate(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <div v-else>
                    <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
                        <div class="text-700 text-center">
                            <div class="text-900 font-bold text-5xl mb-3">Aún no ha creado ninguna Automatización</div>
                            <div class="text-700 text-2xl mb-5">Inicia la gestión de tu comunidad con las mejores y más completas funcionalidades.</div>
                            <Button @click="openNew" label="Crear Automatización" icon="pi pi-plus" class="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap"></Button>
                        </div>
                    </div>
                </div>

                <Dialog v-model:visible="templateDialog" :header="template.name ? 'Editar Automatización' : 'Nueva Automatización de cobro'" :modal="true" class="p-fluid md:w-auto">
                    <span class="block mb-2">Antes de crear o editar una pantilla, tome en cuenta lo siguiente:</span>

                    <a href="javascript:void(0)" class="block mb-2 hover:text-gray-900" @click="visibleRight = true">¿Cómo crear una nueva Automatización?</a>

                    <hr class="mb-4" />
                    <div class="field">
                        <label for="name"><b>Nombre *</b></label>
                        <InputText id="name" v-model.trim="template.name" required="true" :class="{ 'p-invalid': submitted && !template.name }" />
                        <small class="p-invalid" v-if="submitted && !template.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="description"><b>Descripción</b></label>
                        <InputText id="description" v-model.trim="template.description" v-tooltip="'Si lo desea, agregue una breve descripción a la Automatización'" />
                    </div>

                    <div class="field">
                        <label for="payment_gateway_id"><b>Método de pago *</b> <i class="pi pi-question-circle" v-tooltip="'Selecione un método por medio del cual desee recibir el pago'"></i></label>
                        <Dropdown v-model="template.payment_gateway_id" :options="dropdownPaymentGatewayValues" optionLabel="name" placeholder="Select" required="true" :class="{ 'p-invalid': submitted && !template.payment_gateway_id }" />
                        <small class="p-invalid" v-if="submitted && !template.payment_gateway_id">Payment Gateway is required.</small>
                    </div>

                    <div class="field">
                        <label for="payment_type"><b>Tipo de cobro *</b> <i class="pi pi-question-circle" v-tooltip="'Acá debe selecionar cada cuanto tiempo desea recibir el pago'"></i></label>
                        <Dropdown v-model="template.payment_type" :options="dropdownPaymentTypeValues" optionLabel="name" placeholder="Select" required="true" :class="{ 'p-invalid': submitted && !template.payment_type }" />
                        <small class="p-invalid" v-if="submitted && !template.payment_type">Payment Type is required.</small>
                    </div>

                    <div class="field">
                        <label for="start_date">
                            <b> {{ template.payment_type?.name != 'Pago único' ? 'Fecha de inicio' : 'Fecha de cobro' }} * </b>
                        </label>
                        <Calendar :showIcon="true" :showButtonBar="true" v-model="template.start_date" :class="{ 'p-invalid': submitted && !template.start_date }"></Calendar>
                        <small class="p-invalid" v-if="submitted && !template.start_date">Payment Start is required.</small>
                    </div>

                    <div class="field" v-if="template.payment_type?.name != 'Pago único'">
                        <label for="end_date"
                            ><b>Cobrar hasta</b> <i class="pi pi-question-circle" v-tooltip="'Esta fecha determina cuando se dejará de realizar el cobro. Usted puedo no colocar una fecha y el cobro se hará de forma indefinida.'"></i
                        ></label>
                        <Calendar :showIcon="true" :showButtonBar="true" v-model="template.end_date"></Calendar>
                    </div>

                    <div class="field">
                        <label for="amount"><b>Monto a cobrar *</b></label>
                        <InputNumber id="amount" v-model.trim="template.amount" :class="{ 'p-invalid': submitted && !template.amount }" />
                        <small class="p-invalid" v-if="submitted && !template.amount">Amount is required.</small>
                    </div>

                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button type="submit" label="Guardar" icon="pi pi-check" class="p-button-text" @click.prevent.stop="saveTemplate" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteTemplateDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
                        <span v-if="template.name"
                            >¿Esta seguro que desea eliminar la plantilla <br />
                            <b class="text-2xl my-4">{{ template.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteTemplateDialog = false" />
                        <Button label="Si" icon="pi pi-check" class="p-button-text" @click="deleteTemplate()" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteTemplatesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>¿Está seguro que desea eliminar la seleción de plantillas?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteTemplatesDialog = false" />
                        <Button type="submit" label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedTemplates" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="startOrPausedDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
                        <span v-if="template.status"
                            >¿Esta seguro que desea <b>{{ template.status == 'Active' ? 'PAUSAR' : 'ACTIVAR' }}</b> la Automatización <br />
                            <b class="text-2xl my-4">{{ template.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="startOrPausedDialog = false" />
                        <Button label="Si" icon="pi pi-check" class="p-button-text" @click="startOrPaused()" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>

    <Sidebar v-model:visible="visibleRight" :baseZIndex="1000" position="right" class="w-full md:w-20rem lg:w-30rem">
        <h1 style="font-weight: normal">Variables de plantilla</h1>
        <p>
            El uso de variables permite la personalización máxima de sus documentos. Agregando correctamente las variables, usted podrá personalizar sus documentos y entregar a los ciudadanos una herramienta útil y certificada. Los documentos
            generados por nuestra aplicación, cuentan con certificación que los hace únicos e inalterables.
        </p>
        <p>
            Para usar las variables, debemos seguir unas reglas básicas; la principal es que deben escribirse dentro de llaves <b>“{ { variable } }”</b>. El sistema recibe variables predefinidas que no pueden ser alteradas y deben usarse de manera
            textual y estricta. Las variables disponibles son las siguientes:
        </p>
        <ul class="list-none">
            <li class="mb-4">
                <b><code v-text="`{{first_name}}`"></code></b>
                <p>
                    Imprime el primer nombre del ciudadano.<br />
                    <small>Ej. Juan</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{middle_name}}`"></code></b>
                <p>
                    Imprime el segundo nombre del ciudadano.<br />
                    <small>Ej. Ramón</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{last_name}}`"></code></b>
                <p>
                    Imprime el primer apellido del ciudadano.<br />
                    <small>Ej. Pérez</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{second_surname}}`"></code></b>
                <p>
                    Imprime el segundo apellido del ciudadano.<br />
                    <small>Ej. Contreras</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{full_name}}`"></code></b>
                <p>
                    Imprime ambos nombres y apellidos del ciudadano.<br />
                    <small>Ej. Juan Ramón Pérez Contreras</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{short_name}}`"></code></b>
                <p>
                    Imprime el primer nombre y apellido del ciudadano.<br />
                    <small>Ej. Juan Pérez</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{dob}}`"></code></b>
                <p>
                    Imprime la fecha de nacimiento del ciudadano usando el formato Año-mes-día.<br />
                    <small>Ej. 2024-01-01</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{document_type}}`"></code></b>
                <p>
                    Imprime tipo de documento del ciudadano.<br />
                    <small>Ej. Pasaporte</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{dni}}`"></code></b>
                <p>
                    Imprime numero de identificación del ciudadano.<br />
                    <small>Ej. 12345678</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{nationality}}`"></code></b>
                <p>
                    Imprime la nacionalidad del ciudadano.<br />
                    <small>Ej. Venezolano</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{sex}}`"></code></b>
                <p>
                    Imprime el sexo del ciudadano.<br />
                    <small>Ej. M</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{civil_status}}`"></code></b>
                <p>
                    Imprime estado civil del ciudadano.<br />
                    <small>Ej. Soltero</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{mobile_phone}}`"></code></b>
                <p>
                    Imprime el número celular del ciudadano.<br />
                    <small>Ej. +581234567890</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{home_phone}}`"></code></b>
                <p>
                    Imprime número local del ciudadano.<br />
                    <small>Ej. +581234567890</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{email}}`"></code></b>
                <p>
                    Imprime el correo electrónico del ciudadano.<br />
                    <small>Ej. email@correo.com</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{address}}`"></code></b>
                <p>
                    Imprime la dirección principal del ciudadano.<br />
                    <small>Ej. Urb Villas del Pilar</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{full_address}}`"></code></b>
                <p>
                    Imprime la dirección completa del ciudadano.<br />
                    <small>Ej. Urb Villas del Pilar, calle 1, segunda etapa, #444</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{city}}`"></code></b>
                <p>
                    Imprime la ciudad de residencia del ciudadano.<br />
                    <small>Ej. Araure</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{municipality}}`"></code></b>
                <p>
                    Imprime el municipio o localidad del ciudadano.<br />
                    <small>Ej. Capital Araure</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{state}}`"></code></b>
                <p>
                    Imprime estado o provincia del ciudadano.<br />
                    <small>Ej. Portuguesa</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{profession}}`"></code></b>
                <p>
                    Imprime la profesión del ciudadano.<br />
                    <small>Ej. Educador</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{level_of_instruction}}`"></code></b>
                <p>
                    Imprime nivel de instrucción del ciudadano.<br />
                    <small>Ej. Ingeniero</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{number_of_children}}`"></code></b>
                <p>
                    Imprime cantidad de hijos del ciudadano.<br />
                    <small>Ej. 3</small>
                </p>
            </li>
            <li class="mb-4">
                <b><code v-text="`{{age}}`"></code></b>
                <p>
                    Imprime la edad del ciudadano.<br />
                    <small>Ej. 42</small>
                </p>
            </li>
        </ul>
    </Sidebar>
</template>

<style scoped lang="scss"></style>
