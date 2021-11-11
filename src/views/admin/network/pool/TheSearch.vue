<template>
    <div class="row mb-3">
        <div v-if="hasPerm('admin_network_pool.add_ipaddresssetup')"
             class="col-auto">
            <router-link :to="{ name: 'admin:network:pool:create' }">
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
            <router-link :to="{ name: 'admin:network:pool:profile', params: { id: cellParams['id'] } }">
                <button class="btn btn-primary"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-edit']"/>
                    </span> Edit
                </button>
            </router-link>
        </div>

        <div v-if="selected && hasPerm('admin_network_pool.delete_ipaddresssetup')"
             class="col-auto">
            <modal-open-delete :delete="deletePool"
                               :form-arr="formArr"
                               :message-error="formErrors"
                               :params="{ id: cellParams['id'] }"
                               message-alert="Continuing will remove this IP Address pool."
                               message-success="IP Address pool has been removed."/>
        </div>
    </div>

    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"/>
</template>

<script lang="ts">
import { ModalOpenDelete, SearchGrid } from "@/components";
import { useAuth, useAdminNetworkPool, useSearchGrid } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearch",
    components: {
        ModalOpenDelete,
        SearchGrid
    },
    setup() {
        const { hasPerm } = useAuth();

        const { deletePool, getSearch, localNetworkPool } = useAdminNetworkPool();

        const { filterString, globalGrid } = useSearchGrid();

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
                filterParams: filterString()
            },
            {
                field: 'network',
                headerName: 'Network',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'assigned_name',
                headerName: 'Assigned',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            }
        ];

        const formArr = computed(() => {
            return localNetworkPool.formArr;
        });

        const formErrors = computed(() => {
            return localNetworkPool.formErrors;
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
            deletePool,
            formArr,
            formErrors,
            hasPerm,
            selected
        };
    }
});
</script>