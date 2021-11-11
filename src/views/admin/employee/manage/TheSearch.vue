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

        <div v-if="selected"
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

        <div v-if="selected && hasPerm('admin_employee_manage.delete_account')"
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
import { useAuth, useAdminEmployeeManage, useSearchGrid } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearch",
    components: {
        ModalOpenDelete,
        SearchGrid
    },
    setup() {
        const { hasPerm } = useAuth();

        const { deleteAccount, getAccounts, localEmployeeManage } = useAdminEmployeeManage();

        const { cellStatus, filterString, formatStatus, globalGrid } = useSearchGrid();

        const cellParams = computed(() => {
            return globalGrid.cellParams;
        });

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

        const formArr = computed(() => {
            return localEmployeeManage.formArr;
        });

        const selected = computed(() => {
            return globalGrid.selected;
        });

        onMounted(() => {
            getAccounts();
        });

        return {
            cellParams,
            columnDefs,
            deleteAccount,
            formArr,
            hasPerm,
            selected
        };
    }
});
</script>