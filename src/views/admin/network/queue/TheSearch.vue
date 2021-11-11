<template>
    <div v-if="selected"
         class="row mb-3 col-auto">
        <router-link :to="{ name: 'admin:network:queue:profile', params: { id: cellParams['queue_status']['id'] } }">
            <button class="btn btn-primary"
                    type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-edit']"/>
                    </span> Edit
            </button>
        </router-link>
    </div>

    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"/>
</template>

<script lang="ts">
import { SearchGrid } from "@/components";
import { useAdminNetworkQueue, useSearchGrid } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearch",
    components: {
        SearchGrid
    },
    setup() {
        const { getSearch, localNetworkQueue } = useAdminNetworkQueue();

        const { cellQueueType, filterString, globalGrid } = useSearchGrid();

        const cellParams = computed(() => {
            return globalGrid.cellParams;
        });

        const columnDefs = [
            {
                field: 'id',
                checkboxSelection: true,
                headerName: 'ID',
                filter: 'agTextColumnFilter',
                filterParams: filterString(),
                valueGetter: function (params: { data: { queue_status: { id: string; }; order_id: string; }; }) {
                    return params.data.queue_status.id + ' - ' + params.data.order_id
                }
            },
            {
                field: 'name',
                headerName: 'Name',
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
                field: 'status_name',
                headerName: 'Status',
                filter: 'agTextColumnFilter',
                filterParams: filterString(),
                cellStyle: cellQueueType
            }
        ];

        const formArr = computed(() => {
            return localNetworkQueue.formArr;
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
            formArr,
            selected
        };
    }
});
</script>