<template>
    <div class="row mb-3">
        <div v-if="cellSelected"
             class="col-auto">
            <router-link :to="{ name: 'client:order:profile', params: { id: cellParams['id'] } }">
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
import { useAdminBillingReason, useAuth, useSearchGrid } from "@/composables";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearch",
    components: {
        SearchGrid
    },
    setup() {
        const { hasPerm } = useAuth();

        const { formArr, formErrors, getSearch } = useAdminBillingReason();

        const { cellParams, cellSelected, filterString } = useSearchGrid();

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
                field: 'reason_type_name',
                headerName: 'Type',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
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