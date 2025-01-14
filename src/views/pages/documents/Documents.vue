<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import GlobalServices from '@/service/GlobalServices';
import Templates from '@/service/TemplatesService';
import Documents from '@/service/DocumentsService';
import router from '../../../router';

const toast = useToast();

const computedSubscription = ref({});
const templates = ref({});
const template = ref({});
const countTemplates = ref(undefined);
const myTemplates = ref({});
const permitted_communities = ref(null);

const search = ref(null);
const searchCitizens = ref(null);
const searchCitizensStatus = ref(null);

const autoFilteredValue = ref([]);
const autoValue = ref(null);

const getTemplates = () => {
    Templates.getTemplates().then(async (resp) => {
        myTemplates.value = resp;
        templates.value = myTemplates.value.data.data;
        if (myTemplates.value.data.data.length != undefined) {
            countTemplates.value = myTemplates.value.data.data.length;
        }
    });
};

const getCitizens = (search) => {
    searchCitizensStatus.value = null;
    GlobalServices.searchCitizens(search).then((resp) => {
        searchCitizens.value = resp.data.data;
        searchCitizensStatus.value = resp.status;
    });
};

const documentDialog = ref(false);
const deletedocumentDialog = ref(false);
const confirmDocumentDialog = ref(false);
const selectedTemplates = ref(null);
const filters = ref({});
const submitted = ref(false);

const citizenDialog = ref(false);
const citizen = ref({});

const documentGenerated = ref(false);
const countDocuments = ref(undefined);
const documents = ref({});
const selectedDocuments = ref(null);

const openNew = () => {
    template.value = {};
    submitted.value = false;
    documentDialog.value = true;
};

const hideDialog = () => {
    documentDialog.value = false;
    submitted.value = false;
};

const hideViewCitizen = () => {
    citizenDialog.value = false;
};

const hideViewDocument = () => {
    documentGenerated.value = false;
};

const editTemplate = (editTemplate) => {
    template.value = { ...editTemplate };
    documentDialog.value = true;
};

const viewCitizen = (citizenData) => {
    citizen.value = citizenData;
    citizenDialog.value = true;
};

const confirmDocument = (templateData, citizenData) => {
    template.value = templateData;
    citizen.value = citizenData;
    confirmDocumentDialog.value = true;
};

const urlFile = ref('');

const generateDocument = (citizen_id, template_id, community_id) => {
    Documents.generateDocument(citizen_id, template_id, community_id).then(async (resp) => {
        documentGenerated.value = true;
        urlFile.value = resp.data.data;
    });
    confirmDocumentDialog.value = false;
    documentDialog.value = false;
    getDocuments();
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Documento generado', life: 3000 });
};

const getDocuments = () => {
    Documents.getDocuments().then(async (resp) => {
        documents.value = resp.data.data;
        if (resp.status == 200) {
            countDocuments.value = resp.data.data.length;
        }
    });
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

const goTo = (route) => {
    router.push(route);
};

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    getTemplates();
    getDocuments();
    computedSubscription.data = GlobalServices.computedSubscription();
    permitted_communities.value = computedSubscription.data.permitted_communities;
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h1>Documentos</h1>
                <span class="text-sm text-gray-800"
                    >Actualmente usted tiene <span class="text-red-500 font-medium">{{ countDocuments > 0 ? countDocuments : 0 }}</span> de <span class="text-green-500 font-medium">500</span> documentos generados. Para aumentar su límite,
                    <a href="#">amplíe su Plan.</a></span
                >
            </div>
            <div class="card" v-if="documentGenerated">
                <h1>Documento generado</h1>
                <iframe :src="`https://geco-documents.s3.amazonaws.com/documents/${urlFile}`" class="w-full" height="800px"></iframe>
                <div class="flex align-items-center sm:align-items-end gap-3 sm:gap-2">
                    <Button label="Cerrar" icon="pi pi-times" class="p-button-text" @click="hideViewDocument()" />
                </div>
            </div>
            <div class="card">
                <Toast />

                <div v-if="countTemplates != undefined">
                    <div class="grid">
                        <div class="col-12 lg:col-6 xl:col-3" v-for="index in templates">
                            <span class="cursor-pointer" @click="editTemplate(index)">
                                <div class="card mb-0">
                                    <div class="flex justify-content-between">
                                        <div>
                                            <span class="block text-2xl text-800 font-bold mb-3">{{ index.name }}</span>
                                            <div class="text-500 font-medium text-sm">{{ index.description }}</div>
                                        </div>
                                        <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                            <i class="pi pi-file-pdf text-blue-500 text-2xl"></i>
                                        </div>
                                    </div>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>

                <div v-else>
                    <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
                        <div class="text-700 text-center">
                            <div class="text-900 font-bold text-5xl mb-3">Aún no ha creado ninguna plantilla</div>
                            <div class="text-700 text-2xl mb-5">Inicia la gestión de tu comunidad con las mejores y más completas funcionalidades.</div>
                            <Button @click="goTo('templates')" label="Crear plantilla" icon="pi pi-plus" class="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap"></Button>
                        </div>
                    </div>
                </div>

                <Dialog v-model:visible="documentDialog" header="Nuevo Documento" :modal="true" class="p-fluid md:w-4">
                    <div class="field">
                        <span class="text-2xl font-bold">
                            {{ template.name }}
                        </span>
                    </div>

                    <div class="field">
                        <label for="search"><b>Buscar ciudadano</b></label>
                        <br />
                        <InputText id="search" v-model.trim="search" class="w-10 mr-4" />
                        <Button :disabled="!search" icon="pi pi-search" title="Buscar" class="p-button-rounded p-button-Info mr-2" @click="getCitizens(search)" />
                    </div>
                    <div class="field">
                        <div v-if="!searchCitizens">Ingrese nombre no número de documento para buscar.</div>
                        <div v-if="searchCitizensStatus == 204" class="mt-4">
                            <span class="text-xl text-orange-500 font-bold"> <i class="pi pi-exclamation-circle text-2xl"></i> No hay coincidencias con su busqueda </span>
                        </div>
                        <template v-else>
                            <div class="grid grid-nogutter">
                                <div v-for="index in searchCitizens" :key="index" class="col-12">
                                    <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4" :class="{ 'border-top-1 surface-border': index !== 0 }">
                                        <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                                            <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                                <div class="text-2xl font-bold text-900">{{ index.first_name }} {{ index.last_name }}</div>
                                                <div class="text-md font-bold">{{ index.document_number }}</div>
                                            </div>
                                            <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                                <div class="text-sm">{{ index.address.address }}, # {{ index.address.house_number }}</div>
                                                <div class="text-sm">{{ index.community_name }}</div>
                                            </div>
                                            <div class="align-items-center sm:align-items-end gap-3 sm:gap-2">
                                                <Button class="ml-2" icon="pi pi-eye" rounded severity="info" @click="viewCitizen(index)"></Button>
                                                <Button class="ml-2" icon="pi pi-file-export" rounded severity="secondary" @click="confirmDocument(template, index)"></Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>

                    <template #footer>
                        <Button label="Cerrar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="citizenDialog" header="Ciudadano" :modal="true" class="p-fluid md:w-4">
                    <div class="field">
                        <span class="text-2xl font-bold"> {{ citizen.first_name }} {{ citizen.last_name }} </span>
                        <div class="grid grid-nogutter">
                            <div class="col-12">
                                <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                                    <img class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src="/images/user-profile-default.svg" />
                                    <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                                        <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                            <div class="flex align-items-center gap-3">
                                                <div class="text-2xl font-bold text-900">{{ citizen.first_name }} {{ citizen.middle_name }} {{ citizen.last_name }} {{ citizen.second_surname }}</div>
                                            </div>
                                            <div class="flex align-items-center gap-3">
                                                {{ citizen.document_type.name }}
                                                <div class="text-xl text-500 font-bold">{{ citizen.document_number }}</div>
                                            </div>
                                            <div class="flex align-items-center gap-3">
                                                Fecha de nacimiento
                                                <div class="text-xl text-500 font-bold">{{ GlobalServices.formatDate(citizen.dob) }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-column xl:flex-row xl:align-items-start mt-2 gap-4">
                                    Dirección
                                    <div class="text-xl text-500 font-bold">{{ citizen.address.address }}{{ `, calle ` + citizen.address?.street }}{{ `, # ` + citizen.address?.house_number }}{{ `, ` + citizen.address?.sector }}</div>
                                </div>
                                <div class="flex flex-column xl:flex-row xl:align-items-start mt-2 gap-4">
                                    Comunidad
                                    <div class="text-xl text-500 font-bold">{{ citizen.community_name }}</div>
                                </div>
                                <div class="flex flex-column xl:flex-row xl:align-items-start mt-2 gap-4">
                                    Email
                                    <div class="text-xl text-500 font-bold">{{ citizen.email }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <template #footer>
                        <Button label="Cerrar" icon="pi pi-times" class="p-button-text" @click="hideViewCitizen" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="confirmDocumentDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3 text-orange-500" style="font-size: 2rem" />
                        <span class="text-xl"
                            >¿Está seguro que desea generar el documento <b>{{ template.name }}</b> al ciudadano <b>{{ citizen.first_name }} {{ citizen.last_name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="confirmDocumentDialog = false" />
                        <Button type="submit" label="Yes" icon="pi pi-check" class="p-button-text" @click="generateDocument(citizen.id, template.id, citizen.community_id)" />
                    </template>
                </Dialog>
            </div>

            <!-- DOCUMENT LIST -->
            <div v-if="countDocuments != undefined">
                <DataTable
                    ref="dt"
                    :value="documents"
                    v-model:selection="selectedDocuments"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    sortField="created_at"
                    :sortOrder="-1"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25, 50, 100]"
                    currentPageReportTemplate="Viendo {first} a {last} de {totalRecords} documentos"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Documentos</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="id" header="# Número de documento" :sortable="true" headerStyle="width:15%; min-width:20rem;">
                        <template #body="slotProps">
                            <span class="p-column-title"># Número de documento</span>
                            {{ slotProps.data.id }}
                        </template>
                    </Column>
                    <Column field="template_name" header="Tipo de documento" :sortable="true" headerStyle="width:10%; min-width:20rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Tipo de documento</span>
                            {{ slotProps.data.template_name }}
                        </template>
                    </Column>
                    <Column field="citizen_name" header="Ciudadano" :sortable="true" headerStyle="width:10%; min-width:20rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Ciudadano</span>
                            {{ slotProps.data.citizen_name }}
                        </template>
                    </Column>
                    <Column field="citizen_document_number" header="DNI" :sortable="true" headerStyle="width:15%; min-width:20rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">DNI</span>
                            {{ slotProps.data.citizen_document_number }}
                        </template>
                    </Column>
                    <Column field="created_at" header="Creado el" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Creado el</span>
                            {{ slotProps.data.created_at }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:5rem;">
                        <template #body="slotProps">
                            <a
                                :href="`https://geco-documents.s3.amazonaws.com/documents/${slotProps.data.document_name}`"
                                target="_blank"
                                title="Ver documento"
                                rel="noopener noreferrer"
                                class="p-button p-button-rounded p-button-Info"
                                icon="pi pi-eye"
                            >
                                <i class="pi pi-eye"></i>
                            </a>
                        </template>
                    </Column>
                </DataTable>
            </div>

            <div v-if="countDocuments == undefined">
                <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
                    <div class="text-700 text-center">
                        <div class="text-900 font-bold text-5xl mb-3">Aún no ha generado ningún documento</div>
                        <div class="text-700 text-2xl mb-5">Inicia la gestión de tu comunidad con las mejores y más completas funcionalidades.</div>

                        <Button v-if="countTemplates == undefined" @click="goTo('templates')" label="Crear plantilla" icon="pi pi-plus" class="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap"></Button>
                        <Button v-else @click="openNew" label="Generar documento" icon="pi pi-plus" class="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
