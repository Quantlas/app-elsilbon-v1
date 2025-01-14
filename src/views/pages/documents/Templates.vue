<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import GlobalServices from '@/service/GlobalServices';
import Templates from '@/service/TemplatesService';
import Editor from 'primevue/editor';

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

const getTemplates = () => {
    Templates.getTemplates().then(async (resp) => {
        myTemplates.value = resp;
        templates.value = myTemplates.value.data.data;
        if (myTemplates.value.data.data.length != undefined) {
            countTemplates.value = myTemplates.value.data.data.length;
        }
    });
};

const templateDialog = ref(false);
const deleteTemplateDialog = ref(false);
const deleteTemplatesDialog = ref(false);
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
    if (template.value.name && template.value.body.trim()) {
        if (template.value.id) {
            Templates.updateTemplate(template.value).then(async (resp) => {
                getTemplates();
            });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'template Updated', life: 3000 });
        } else {
            Templates.createTemplate(template.value).then(async (resp) => {
                getTemplates();
            });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'template Created', life: 3000 });
        }
        templateDialog.value = false;
        template.value = {};
    }
};

const editTemplate = (editTemplate) => {
    console.log(editTemplate);
    template.value = { ...editTemplate };
    templateDialog.value = true;
};

const confirmDeleteTemplate = (deleteTemplate) => {
    template.value = deleteTemplate;
    deleteTemplateDialog.value = true;
};

const deleteTemplate = () => {
    Templates.deleteTemplate(template.value).then(async (resp) => {
        getTemplates();
    });
    deleteTemplateDialog.value = false;
    template.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Template eliminado', life: 3000 });
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
                <h1><span class="text-gray-500 text-xl">Documentos /</span> Mis Plantillas</h1>
            </div>
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Crear Plantilla" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
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
                                <h5 class="m-0">Plantillas</h5>
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
                        <Column field="descripcion" header="Descripción" :sortable="true" headerStyle="width:40%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Descripción</span>
                                {{ slotProps.data.description }}
                            </template>
                        </Column>
                        <Column field="date" header="Creado" :sortable="true" headerStyle="width:20%; min-width:5rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Creado</span>
                                {{ slotProps.data.created_at }}
                            </template>
                        </Column>
                        <Column headerStyle="min-width:12rem;">
                            <template #body="slotProps">
                                <Button icon="pi pi-pencil" title="Editar" class="p-button-rounded p-button-success mr-2" @click="editTemplate(slotProps.data)" />
                                <Button icon="pi pi-trash" title="Eliminar" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteTemplate(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <div v-else>
                    <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
                        <div class="text-700 text-center">
                            <div class="text-900 font-bold text-5xl mb-3">Aún no ha creado ninguna plantilla</div>
                            <div class="text-700 text-2xl mb-5">Inicia la gestión de tu comunidad con las mejores y más completas funcionalidades.</div>
                            <Button @click="openNew" label="Crear plantilla" icon="pi pi-plus" class="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap"></Button>
                        </div>
                    </div>
                </div>

                <Dialog v-model:visible="templateDialog" :header="template.name ? 'Editar Plantilla' : 'Nueva Plantilla'" :modal="true" class="p-fluid md:w-auto">
                    <span class="block mb-2">Antes de crear o editar una pantilla, tome en cuenta lo siguiente:</span>

                    <!-- <a href="#" target="_blank" class="block mb-2 hover:text-gray-900">¿Cómo crear una nueva plantilla?</a> -->

                    <a href="javascript:void(0)" class="block mb-2 hover:text-gray-900" @click="visibleRight = true">¿Qué variables puedo usar en mi plantilla?</a>

                    <!-- <a href="#" target="_blank" class="block mb-2 hover:text-gray-900">Uso de plantillas predeterminadas</a> -->
                    <hr class="mb-4" />
                    <div class="field">
                        <label for="name"><b>Nombre *</b></label>
                        <InputText id="name" v-model.trim="template.name" required="true" :class="{ 'p-invalid': submitted && !template.name }" />
                        <small class="p-invalid" v-if="submitted && !template.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="description"><b>Descripción *</b></label>
                        <InputText id="description" v-model.trim="template.description" required="true" :class="{ 'p-invalid': submitted && !template.description }" />
                        <small class="p-invalid" v-if="submitted && !template.description">Description is required.</small>
                    </div>
                    <div class="field">
                        <label for="body"><b>Plantilla *</b></label>
                        <Editor v-model.trim="template.body" editorStyle="height: 320px" :modelValue="template.body" />
                        <small class="p-invalid" v-if="submitted && !template.body">Template is required.</small>
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
