<template>
    <div class="row mb-3">
        <div v-if="hasPerm('admin_hardware_company.add_server')"
             class="col-auto">
            <router-link :to="{ name: 'admin:hardware:company:create' }">
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
            <router-link :to="{ name: 'admin:hardware:company:profile', params: { id: cellParams['id'] } }">
                <button class="btn btn-primary"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-edit']"/>
                    </span> Edit
                </button>
            </router-link>
        </div>

        <div v-if="selected && hasPerm('admin_hardware_company.delete_server') && !cellParams['in_queue']"
             class="col-auto">
            <modal-open-delete :delete="deleteHardware"
                               :form-arr="formArr"
                               :message-error="formErrors"
                               :params="{ id: cellParams['id'] }"
                               message-alert="Continuing will remove this company hardware."
                               message-success="Company hardware has been removed."/>
        </div>
    </div>

    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"/>
</template>

<script lang="ts">
import { ModalOpenDelete, SearchGrid } from "@/components";
import { useAuth, useAdminHardwareCompany, useSearchGrid } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearch",
    components: {
        ModalOpenDelete,
        SearchGrid
    },
    setup() {
        const { hasPerm } = useAuth();

        const { deleteHardware, getSearch, localHardwareCompany } = useAdminHardwareCompany();

        const { cellQueueStatus, filterString, formatQueueStatus, globalGrid } = useSearchGrid();

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
                field: 'domain_name',
                headerName: 'Domain',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'ipaddress',
                headerName: 'IP Address',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'is_active',
                headerName: 'Status',
                filter: 'agTextColumnFilter',
                filterParams: filterString(),
                valueFormatter: formatQueueStatus,
                cellStyle: cellQueueStatus
            }
        ];

        const formArr = computed(() => {
            return localHardwareCompany.formArr;
        });

        const formErrors = computed(() => {
            return localHardwareCompany.formErrors;
        });

        const selected = computed(() => {
            return globalGrid.selected;
        });

        onMounted(() => {
            getSearch();
        });

        return {
            cellParams,
            columnDefs,
            deleteHardware,
            formArr,
            formErrors,
            hasPerm,
            selected
        };
    }
});
</script>