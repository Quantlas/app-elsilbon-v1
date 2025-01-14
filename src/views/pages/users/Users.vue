<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import Users from '../../../service/UsersService';
import GlobalServices from '@/service/GlobalServices';

const toast = useToast();

const users = ref({});
const countUsers = ref(0);
const myUsers = ref({});

const getUsers = () => {
    Users.getUsers().then(async (resp) => {
        myUsers.value = resp.data;
        users.value = myUsers.value.data;
        if (myUsers.value.data != undefined) {
            countUsers.value = myUsers.value.data.length;
        }
    });
};

const userDialog = ref(false);
const deleteUserDialog = ref(false);
const user = ref({});
const selectedUsers = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const openNew = () => {
    //users.value = {};
    submitted.value = false;
    userDialog.value = true;
};

const hideDialog = () => {
    userDialog.value = false;
    submitted.value = false;
};

const saveUser = () => {
    submitted.value = true;
    console.log(user.value);

    if (user.value.name && user.value.name.trim()) {
        if (user.value.id) {
            Users.updateUser(user.value).then(async (resp) => {
                getUsers();
            });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
        } else {
            Users.createUser(user.value).then(async (resp) => {
                getUsers();
            });
            toast.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
        }
        userDialog.value = false;
        user.value = {};
    }
};

const editUser = (editUser) => {
    user.value = { ...editUser };
    userDialog.value = true;
};

const confirmDeleteUser = (editUser) => {
    user.value = editUser;
    deleteUserDialog.value = true;
};

const deleteUser = () => {
    Users.deleteUser(user.value).then(async (resp) => {
        getUsers();
        countUsers.value = 0;
    });
    deleteUserDialog.value = false;
    user.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Usuario eliminado', life: 3000 });
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteUserDialog.value = true;
};
const deleteSelectedUsers = () => {
    users.value = users.value.filter((val) => !selectedUsers.value.includes(val));
    deleteUserDialog.value = false;
    selectedUsers.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
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
    getUsers();
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h1>Usuarios</h1>
                <span class="text-sm text-gray-800">Administre los usauarios que pueden administrar el sistema.</span>
            </div>
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <span>
                                <Button label="Nuevo Usuario" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            </span>
                        </div>
                    </template>

                    <template v-slot:end>
                        <!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" /> -->
                        <!-- <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" /> -->
                    </template>
                </Toolbar>
                <div v-if="countUsers != 0">
                    <DataTable
                        ref="dt"
                        :value="users"
                        v-model:selection="selectedUsers"
                        dataKey="id"
                        :paginator="true"
                        :rows="10"
                        :filters="filters"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25]"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                        responsiveLayout="scroll"
                    >
                        <template #header>
                            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <h5 class="m-0">Usuarios</h5>
                                <span class="block mt-2 md:mt-0 p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                                </span>
                            </div>
                        </template>

                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                        <Column field="id" header="Id" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Id</span>
                                {{ slotProps.data.id }}
                            </template>
                        </Column>
                        <Column field="name" header="Nombre" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Nombre</span>
                                {{ slotProps.data.name }}
                            </template>
                        </Column>
                        <Column field="email" header="Email" :sortable="true" headerStyle="width:30%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Email</span>
                                {{ slotProps.data.email }}
                            </template>
                        </Column>
                        <Column field="rol" header="Rol" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Rol</span>
                                {{ slotProps.data.rol }}
                            </template>
                        </Column>
                        <Column headerStyle="min-width:10rem;">
                            <template #body="slotProps">
                                <Button icon="pi pi-pencil" title="Editar" class="p-button-rounded p-button-success mr-2" @click="editUser(slotProps.data)" />
                                <Button icon="pi pi-trash" title="Eliminar" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteUser(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <Dialog v-model:visible="userDialog" :style="{ width: '450px' }" :header="user.id ? 'Editar Usuario' : 'Nuevo Usuario'" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name"><b>Nombre *</b></label>
                        <InputText id="name" v-model.trim="user.name" required="true" :class="{ 'p-invalid': submitted && !user.name }" />
                        <small class="p-invalid" v-if="submitted && !user.name">Name is required.</small>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="email"><b>Email *</b></label>
                            <InputText id="email" v-model="user.email" :class="{ 'p-invalid': submitted && !user.email }" :required="true" />
                            <small class="p-invalid" v-if="submitted && !user.email">Email is required.</small>
                        </div>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="password"><b>Password *</b></label>
                            <InputText id="password" v-model="user.password" :class="{ 'p-invalid': submitted && !user.password }" :required="true" />
                            <small class="p-invalid" v-if="submitted && !user.password">Password is required.</small>
                        </div>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="c_password"><b>RePassword *</b></label>
                            <InputText id="c_password" v-model="user.c_password" :class="{ 'p-invalid': submitted && !user.c_password }" :required="true" />
                            <small class="p-invalid" v-if="submitted && !user.c_password">RePassword is required.</small>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button type="submit" label="Save" icon="pi pi-check" class="p-button-text" @click.prevent.stop="saveUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="user.name"
                            >¿Esta seguro que desea eliminar al usuario <br />
                            <b class="text-2xl">{{ user.name }} </b>
                            ?
                        </span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUserDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="user">Are you sure you want to delete the selected users?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUserDialog = false" />
                        <Button type="submit" label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteUser" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
