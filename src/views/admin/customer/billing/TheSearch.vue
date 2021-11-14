<template>
    <div class="row mb-3">
        <div v-if="cellSelected"
             class="col-auto">
            <router-link :to="{ name: 'admin:customer:billing:profile', params: { id: cellParams['id'] } }">
                <button class="btn btn-primary"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-edit']"/>
                    </span> Edit
                </button>
            </router-link>
        </div>
    </div>

    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"/>
</template>

<script lang="ts">
import { SearchGrid } from "@/components"
import { useAdminCustomerBilling, useAuth, useSearchGrid } from "@/composables";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearch",
    components: {
        SearchGrid
    },
    setup() {
        const { formArr, formErrors, getSearch } = useAdminCustomerBilling();

        const { hasPerm } = useAuth();

        const { cellParams, cellSelected, filterString, formatStatus } = useSearchGrid();

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
                field: 'is_active',
                headerName: 'Status',
                filter: 'agTextColumnFilter',
                filterParams: filterString(),
                valueFormatter: formatStatus,
                cellStyle: (params: { value: boolean; }) => {
                    return (params.value ? { color: '#198754' } : { color: '#DC3545' });
                }
            }
        ];

        onMounted(() => {
            getSearch();
        });

        return {
            cellParams,
            cellSelected,
            columnDefs,
            formArr,
            formErrors,
            hasPerm
        };
    }
});
</script>