<template>
    <div class="row mb-3">
        <div v-if="hasPerm('admin_hardware_client.add_server')"
             class="col-auto">
            <router-link :to="{ name: 'admin:hardware:client:create' }">
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
            <router-link :to="{ name: 'admin:hardware:client:profile', params: { id: cellParams['id'] } }">
                <button class="btn btn-primary"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-edit']"/>
                    </span> Edit
                </button>
            </router-link>
        </div>

        <div v-if="cellSelected && hasPerm('admin_hardware_client.delete_server') && !cellParams['in_queue']"
             class="col-auto">
            <modal-open-delete :delete="deleteHardware"
                               :form-arr="formArr"
                               :message-error="formErrors"
                               :params="{ id: cellParams['id'] }"
                               message-alert="Continuing will remove this company hardware."
                               message-success="Client hardware has been removed."/>
        </div>
    </div>

    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"/>
</template>

<script lang="ts">
import { ModalOpenDelete, SearchGrid } from "@/components";
import { useAdminHardwareClient, useAuth, useSearchGrid } from "@/composables";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearch",
    components: {
        ModalOpenDelete,
        SearchGrid
    },
    setup() {
        const { deleteHardware, formArr, formErrors, getSearch } = useAdminHardwareClient();

        const { hasPerm } = useAuth();

        const { cellParams, cellSelected, cellQueueStatus, filterString, formatQueueStatus } = useSearchGrid();

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

        onMounted(() => {
            getSearch();
        });

        return {
            cellParams,
            cellSelected,
            columnDefs,
            deleteHardware,
            formArr,
            formErrors,
            hasPerm
        };
    }
});
</script>