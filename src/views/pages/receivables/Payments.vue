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
const countPayments = ref(undefined);
const payments = ref({});
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
    payments.value = [
        {
            id: '1f3cb315-8922-4da6-a30f-f172a28e56a2',
            citizen_name: 'Felix Leon',
            template_name: 'Cuota administrativa',
            amount: '300.000',
            status: 'Pagado',
            created_at: '05-05-2024',
            paid_at: '05-05-2024'
        },
        {
            id: '1f3cb315-8922-4da6-a30f-f172a28e56a2',
            citizen_name: 'Felix Leon',
            template_name: 'Cuota administrativa',
            amount: '300.000',
            status: 'Pendiente',
            created_at: '05-05-2024',
            paid_at: ''
        },
        {
            id: '1f3cb315-8922-4da6-a30f-f172a28e56a2',
            citizen_name: 'Felix Leon',
            template_name: 'Cuota administrativa',
            amount: '300.000',
            status: 'Pagado',
            created_at: '05-05-2024',
            paid_at: '05-05-2024'
        }
    ];

    countPayments.value = payments.value.length;
    /*  Documents.getDocuments().then(async (resp) => {
        documents.value = resp.data.data;
        if (resp.status == 200) {
            countDocuments.value = resp.data.data.length;
        }
    }); */
};

const barData = ref({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Cobrado',
            backgroundColor: 'green',
            borderColor: 'black',
            data: [1300000, 3000000, 300000, 600000, 2000000, 300000, 600000]
        },
        {
            label: 'Pendiente',
            backgroundColor: 'red',
            borderColor: 'black',
            data: [300000, 300000, 30000, 600000, 300000, 300000, 300000]
        }
    ]
});
const barOptions = ref({
    plugins: {
        legend: {
            labels: {
                fontColor: 'gray'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: 'gray',
                font: {
                    weight: 500
                }
            },
            grid: {
                display: false,
                drawBorder: false
            }
        },
        y: {
            ticks: {
                color: 'gray'
            },
            grid: {
                color: 'gray',
                drawBorder: false
            }
        }
    }
});

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
                <h1>Cobranzas</h1>
                <span class="text-sm text-gray-800"> Aquí puede ver el movimiento, seguimiento, facturación y recuperación de los pagos adeudados de sus vecinos. </span>
            </div>

            <div v-if="countPayments == undefined">
                <NoContent :to="'payments-templates'" :button="'Generar Cobros'"></NoContent>
            </div>

            <div class="card grid" v-if="countPayments != undefined">
                <Toast />
                <div class="col-12 lg:col-6 xl:col-3">
                    <div class="card mb-0">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <span class="block text-500 font-medium mb-3">Pagados</span>
                                <div class="text-900 font-medium text-xl">$600.000</div>
                            </div>
                            <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-dollar text-orange-500 text-xl"></i>
                            </div>
                        </div>
                        <span class="text-500">Cobrado el <span class="text-green-500 font-medium">último mes </span></span>
                    </div>
                </div>
                <div class="col-12 lg:col-6 xl:col-3">
                    <div class="card mb-0">
                        <div class="flex justify-content-between mb-3">
                            <div>
                                <span class="block text-500 font-medium mb-3">Pendientes</span>
                                <div class="text-900 font-medium text-xl">$300.000</div>
                            </div>
                            <div class="flex align-items-center justify-content-center bg-red-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-exclamation-triangle text-red-500 text-xl"></i>
                            </div>
                        </div>
                        <span class="text-500">Total cobros <span class="text-green-500 font-medium">pendientes </span></span>
                    </div>
                </div>

                <div class="col-12 xl:col-6">
                    <div class="card">
                        <h5>Cobranzas</h5>
                        <Chart type="bar" :data="barData" :options="barOptions"></Chart>
                    </div>
                </div>
            </div>

            <!-- DOCUMENT LIST -->
            <div v-if="countPayments != undefined">
                <DataTable
                    ref="dt"
                    :value="payments"
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
                            <h5 class="m-0">Lista de cobros</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="id" header="# Código" :sortable="true" headerStyle="width:15%;">
                        <template #body="slotProps">
                            <span class="p-column-title"># Código</span>
                            {{ slotProps.data.id }}
                        </template>
                    </Column>
                    <Column field="citizen_name" header="Ciudadano" :sortable="true" headerStyle="width:20%;">
                        <template #body="slotProps">
                            <span class="p-column-title">Ciudadano</span>
                            {{ slotProps.data.citizen_name }}
                        </template>
                    </Column>
                    <Column field="template_name" header="Plantilla" :sortable="true" headerStyle="width:20%;">
                        <template #body="slotProps">
                            <span class="p-column-title">Plantilla</span>
                            {{ slotProps.data.template_name }}
                        </template>
                    </Column>
                    <Column field="amount" header="Monto" :sortable="true" headerStyle="width:10%;">
                        <template #body="slotProps">
                            <span class="p-column-title">Monto</span>
                            {{ slotProps.data.amount }}
                        </template>
                    </Column>
                    <Column field="status" header="Estado" :sortable="true" headerStyle="width:5%;">
                        <template #body="slotProps">
                            <span class="p-column-title">Estado</span>
                            {{ slotProps.data.status }}
                        </template>
                    </Column>
                    <Column field="created_at" header="Emitido el" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Emitido el</span>
                            {{ slotProps.data.created_at }}
                        </template>
                    </Column>
                    <Column field="paid_at" header="Pagado el" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Pagado el</span>
                            {{ slotProps.data.paid_at }}
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
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
