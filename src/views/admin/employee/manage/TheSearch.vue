<template>
    <div class="row mb-3">
        <div v-if="hasPerm('admin_employee_manage.add_account')"
             class="col-auto">
            <router-link :to="{ name: 'admin:employee:manage:create' }">
                <button class="btn btn-success"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-plus']"/>
                    </span> Create
                </button>
            </router-link>
        </div>

        <div v-if="cellSelected"
             class="col-auto">
            <router-link :to="{ name: 'admin:employee:manage:profile', params: { id: cellParams['id'] } }">
                <button class="btn btn-primary"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-edit']"/>
                    </span> Edit
                </button>
            </router-link>
        </div>

        <div v-if="cellSelected && hasPerm('admin_employee_manage.delete_account')"
             class="col-auto">
            <modal-open-delete :delete="deleteAccount"
                               :form-arr="formArr"
                               :params="{ id: cellParams['id'] }"
                               message-alert="Continuing will remove this employee account."
                               message-success="Account has been removed."/>
        </div>
    </div>

    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"/>
</template>

<script lang="ts">
import { ModalOpenDelete, SearchGrid } from "@/components";
import { useAdminEmployeeManage, useAuth, useSearchGrid } from "@/composables";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearch",
    components: {
        ModalOpenDelete,
        SearchGrid
    },
    setup() {
        const { deleteAccount, formArr, getAccounts } = useAdminEmployeeManage();

        const { hasPerm } = useAuth();

        const { cellParams, cellSelected, cellStatus, filterString, formatStatus } = useSearchGrid();

        const columnDefs = [
            {
                field: 'id',
                checkboxSelection: true,
                headerName: 'ID',
                filter: 'agNumberColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'name',
                headerName: 'Name',
                filter: 'agTextColumnFilter',
                filterParams: filterString(),
                valueGetter: function (params: { data: { first_name: string; last_name: string; }; }) {
                    return params.data.first_name + ' ' + params.data.last_name
                }
            },
            {
                field: 'email',
                headerName: 'Email',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'is_active',
                headerName: 'Status',
                filter: 'agTextColumnFilter',
                filterParams: filterString(),
                valueFormatter: formatStatus,
                cellStyle: cellStatus
            }
        ];

        onMounted(() => {
            getAccounts();
        });

        return {
            cellParams,
            cellSelected,
            columnDefs,
            deleteAccount,
            formArr,
            hasPerm
        };
    }
});
</script>