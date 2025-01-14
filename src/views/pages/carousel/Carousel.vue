<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import GlobalServices from '@/service/GlobalServices';
import Hero from '@/service/CarouselService';
import router from '../../../router';

const toast = useToast();

const neighbors = ref({});
const activeSlides = ref([]);
const citizen = ref({
    status: 'Draft'
});

const change_position = ref(true);

const countNeighbors = ref(undefined);
const myNeighbors = ref({});
const dropdownCommunityValues = ref([]);
const neighborsExistence = ref(false);

const autoFilteredValue = ref([]);
const autoValue = ref(null);

const file = ref(null);

const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
        alert('Por favor selecciona una imagen');
        return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
        alert('Solo se permiten archivos de imagen (jpeg, png, webp)');
        return;
    }

    file.value = selectedFile;
};

const getContent = () => {
    Hero.getContent().then(async (resp) => {
        myNeighbors.value = resp;
        neighbors.value = myNeighbors.value.data.data;
        if (myNeighbors.value.status != 204) {
            countNeighbors.value = myNeighbors.value.data.data.length;
            neighborsExistence.value = true;
        }
        activeSlides.value = [];
        neighbors.value.forEach((element) => {
            if (element.status == 'Active') {
                activeSlides.value.push(element);
            }
        });
        activeSlides.value.sort((a, b) => a.position - b.position);
    });
};

const citizenDialog = ref(false);
const deleteCitizenDialog = ref(false);
const deleteCitizensDialog = ref(false);
const selectedCitizens = ref(null);
const positionDialog = ref(false);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const dropdownValues = ref([
    { name: 'DNI', code: 'dni' },
    { name: 'Pasaporte', code: 'pasaporte' },
    { name: 'Cédula de extrajería', code: 'cedula_extrajero' }
]);
const dropdownStatusValues = ref([
    { name: 'Activo', code: 'Active' },
    { name: 'Borrador', code: 'Draft' },
    { name: 'Archivado', code: 'Archived' }
]);

const country = ref(null);

const openNew = () => {
    citizen.value = {};
    submitted.value = false;
    citizenDialog.value = true;
};

const hideDialog = () => {
    citizenDialog.value = false;
    submitted.value = false;
    positionDialog.value = false;
};

const inputImage = ref(null);
const showInputImage = () => {
    inputImage.value = !inputImage.value;
};

const saveCitizen = () => {
    submitted.value = true;
    const formData = new FormData();
    if (citizen.value.title && citizen.value.status) {
        formData.append('image', file.value);
        formData.append('title', citizen.value.title);
        formData.append('sub_title', citizen.value.sub_title);
        formData.append('description', citizen.value.description);
        formData.append('body', citizen.value.body);
        formData.append('status', citizen.value.status.code);
        citizen.value.status = citizen.value.status.code;
        if (citizen.value.id) {
            if (file.value) {
                Hero.updateContent(formData, citizen.value.id)
                    .then(async (resp) => {
                        if (resp.status == 201) {
                            toast.add({ severity: 'success', summary: 'Successful', detail: 'Content Updated', life: 3000 });
                        }
                        getContent();
                        hideDialog();
                    })
                    .catch((err) => {
                        console.log(err);
                        if (err.response.status == 409) {
                            toast.add({ severity: 'error', summary: 'Error', detail: err.response.data.message, life: 7000 });
                        } else {
                            toast.add({ severity: 'error', summary: 'Error', detail: err.response.data.message, life: 7000 });
                        }
                    });
            } else {
                Hero.updateContent(citizen.value, citizen.value.id)
                    .then(async (resp) => {
                        if (resp.status == 201) {
                            toast.add({ severity: 'success', summary: 'Successful', detail: 'Content Updated', life: 3000 });
                        }
                        getContent();
                        hideDialog();
                    })
                    .catch((err) => {
                        console.log(err);
                        if (err.response.status == 409) {
                            toast.add({ severity: 'error', summary: 'Error', detail: err.response.data.message, life: 7000 });
                        } else {
                            toast.add({ severity: 'error', summary: 'Error', detail: err.response.data.message, life: 7000 });
                        }
                    });
            }
        } else {
            if (file.value) {
                Hero.createContent(formData)
                    .then(async (resp) => {
                        console.log(resp);
                        if (resp.status == 201) {
                            toast.add({ severity: 'success', summary: 'Successful', detail: 'Citizen Created', life: 3000 });
                        }
                        getContent();
                        hideDialog();
                    })
                    .catch((err) => {
                        if (err.response.status == 409) {
                            console.log(err);
                            toast.add({ severity: 'error', summary: 'Error', detail: err.response.data.message, life: 7000 });
                        } else {
                            toast.add({ severity: 'error', summary: 'Error', detail: err.response.data.message, life: 7000 });
                        }
                    });
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Image is required', life: 7000 });
            }
        }
        citizenDialog.value = false;
        citizen.value = {};
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Some required fields are missing', life: 7000 });
    }
};

const editCitizen = (editCitizen) => {
    //console.log(editCitizen);
    citizen.value = { ...editCitizen };
    citizenDialog.value = true;
};

const changePosition = (editCitizen) => {
    //console.log(editCitizen);
    citizen.value = { ...editCitizen };
    positionDialog.value = true;
};

const confirmDeleteCitizen = (deleteCitizen) => {
    citizen.value = deleteCitizen;
    deleteCitizenDialog.value = true;
};

const deleteCitizen = () => {
    Hero.deleteContent(citizen.value).then(async (resp) => {
        getContent();
    });
    deleteCitizenDialog.value = false;
    citizen.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Ciudadano eliminado', life: 3000 });
};

const exportCSV = () => {
    //console.log(dt.value);
    //dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteCitizensDialog.value = true;
};
const deleteSelectedCitizens = () => {
    citizen.value = citizen.value.filter((val) => !selectedCitizens.value.includes(val));
    deleteCitizensDialog.value = false;
    selectedCitizens.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Ciudadanos emilinados', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const searchCountry = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            autoFilteredValue.value = [...autoValue.value];
        } else {
            autoFilteredValue.value = autoValue.value.filter((country) => {
                return country.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
};

const goTo = (route) => {
    router.push({ name: route });
};
const scopes = ref('');
onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    scopes.value = GlobalServices.getScopes();
    getContent();
});

const responsiveOptions = ref([
    {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
    }
]);
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card" v-if="!neighborsExistence">
                <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
                    <div class="text-700 text-center">
                        <div class="text-900 font-bold text-5xl mb-3">Aún no ha agregado ningún post</div>
                        <div class="text-700 text-2xl mb-5">Inicia la gestión de tu sitio con las mejores y más completas funcionalidades.</div>
                        <Button @click="openNew" label="Agregar post" icon="pi pi-plus" class="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap"></Button>
                    </div>
                </div>
            </div>

            <div class="card" v-else>
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Nuevo Post" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                        </div>
                    </template>
                </Toolbar>

                <div v-if="neighborsExistence">
                    <DataTable
                        ref="dt"
                        :value="neighbors"
                        v-model:selection="selectedCitizens"
                        dataKey="id"
                        :paginator="true"
                        :rows="10"
                        :filters="filters"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25, 50, 100]"
                        currentPageReportTemplate="Viendo {first} a {last} de {totalRecords} registros"
                        responsiveLayout="scroll"
                    >
                        <template #header>
                            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <h5 class="m-0">Post</h5>
                                <span class="block mt-2 md:mt-0 p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                                </span>
                            </div>
                        </template>

                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                        <Column field="id" header="Id" :sortable="true" headerStyle="width:10%">
                            <template #body="slotProps">
                                <span class="p-column-title">Id</span>
                                {{ slotProps.data.id }}
                            </template>
                        </Column>
                        <Column field="title" header="Título" :sortable="true" headerStyle="width:20%">
                            <template #body="slotProps">
                                <span class="p-column-title">Título</span>
                                {{ slotProps.data.title }}
                            </template>
                        </Column>
                        <Column field="status" header="Estado" :sortable="true" headerStyle="width:20%; min-width:5rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Estado</span>
                                {{ slotProps.data.status }}
                            </template>
                        </Column>
                        <Column field="created_at" header="Creado el" :sortable="true" headerStyle="width:30%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Creado el</span>
                                {{ slotProps.data.created_at }}
                            </template>
                        </Column>
                        <Column headerStyle="min-width:12rem;">
                            <template #body="slotProps">
                                <!-- <Button icon="pi pi-arrow-right-arrow-left" title="Cambiar Posición" class="p-button-rounded p-button-primary mr-2" @click="changePosition(slotProps.data)" /> -->
                                <Button icon="pi pi-pencil" title="Editar" class="p-button-rounded p-button-success mr-2" @click="editCitizen(slotProps.data)" />
                                <Button icon="pi pi-trash" title="Eliminar" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteCitizen(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <!-- MODAL CREATE EDIT -->
                <Dialog v-model:visible="citizenDialog" :style="{ width: '450px' }" :header="citizen.title ? 'Editar Contenido' : 'Nuevo Contenido'" :modal="true" class="p-fluid">
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="title"><b>Título *</b></label>
                            <InputText id="title" v-model.trim="citizen.title" required="true" :class="{ 'p-invalid': submitted && !citizen.title }" />
                            <small class="p-invalid" v-if="submitted && !citizen.title">Title is required.</small>
                        </div>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="sub_title">Sub Título</label>
                            <InputText id="sub_title" v-model.trim="citizen.sub_title" />
                        </div>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="description">Breve descripción</label>
                            <InputText id="description" v-model.trim="citizen.description" />
                        </div>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="image"><b>Imágen *</b></label>
                            <div v-if="citizen.title">
                                <img :src="citizen.image" alt="" class="w-full" />
                                <Button v-if="!inputImage" label="Cambiar imagen" icon="pi pi-image" class="p-button-text" @click="showInputImage()"></Button>
                                <input
                                    v-else
                                    type="file"
                                    @change="handleFileUpload"
                                    class="text-white bg-blue-700 p-2 w-full rounded hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                />
                            </div>

                            <input
                                v-else
                                type="file"
                                @change="handleFileUpload"
                                class="text-white bg-blue-700 p-2 w-full rounded hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            />
                        </div>
                    </div>

                    <div class="field">
                        <label for="body">Contenido</label>
                        <Editor v-model="citizen.body" editorStyle="height: 320px" />
                    </div>
                    <div class="col-6 md:col-6" v-if="scopes.rol == 'admin'">
                        <div class="field col">
                            <label for="name">Estatus</label>
                            <Dropdown v-model="citizen.status" :options="dropdownStatusValues" optionLabel="name" placeholder="Select" />
                        </div>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button type="submit" label="Save" icon="pi pi-check" class="p-button-text" @click.prevent.stop="saveCitizen" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteCitizenDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="citizen.title"
                            >¿Esta seguro que desea eliminar el banner <br />
                            <b class="text-2xl">{{ citizen.title }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteCitizenDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteCitizen()" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteCitizensDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="country">¿Está seguro que desea eliminar la seleción de ciudadanos?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteCitizensDialog = false" />
                        <Button type="submit" label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedCitizens" />
                    </template>
                </Dialog>

                <!-- MODAL CHANGE POSITION -->
                <Dialog v-model:visible="positionDialog" :style="{ width: '450px' }" header="Cambiar posición" :modal="true" class="p-fluid">
                    <h3>Posiciones ocupadas</h3>
                    <div v-for="position in neighbors" :key="position">
                        <Card class="m-4">
                            <template #title>Posición # {{ position.position }}</template>
                            <template #content>
                                <p class="m-0 text-2xl font-medium">
                                    {{ position.title }}
                                </p>
                                <p class="m-0">
                                    {{ position.description }}
                                </p>
                                <p class="mt-2">
                                    <Tag v-if="position.status == 'Active'" severity="success" :value="position.status"></Tag>
                                    <Tag v-if="position.status == 'Draft'" severity="secondary" :value="position.status"></Tag>
                                    <Tag v-if="position.status == 'Archived'" severity="info" :value="position.status"></Tag>
                                </p>
                            </template>
                            <template #footer>
                                <div v-if="position.id == citizen.id" class="p-4 font-medium text-2xl" style="background-color: chartreuse; border-radius: 10px">Contenido selecionado</div>
                            </template>
                        </Card>
                    </div>
                    <hr />
                    <h4>Nueva posición</h4>
                    <InputNumber v-model="citizen.position" />
                    <p class="m-4">Debe tener en cuenta, que si seleciona una posición ocupada, el nuevo contenido la sustituirá y el anterior se archivará.</p>
                    <span class="text-white">
                        {{ change_position ? (citizen.action = 'change-position') : '' }}
                    </span>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button type="submit" label="Save" icon="pi pi-check" class="p-button-text" @click.prevent.stop="saveCitizen" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
