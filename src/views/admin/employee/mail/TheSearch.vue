<template>
    <div v-if="cellSelected"
         class="row mb-3 col-auto">
        <router-link :to="{ name: 'admin:employee:mail:profile', params: { id: cellParams['id'] } }">
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
import { useAdminEmployeeMail, useSearchGrid } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearch",
    components: {
        SearchGrid
    },
    setup() {
        const { getSearch, localEmployeeMail } = useAdminEmployeeMail();

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
                field: 'mail_type_name',
                headerName: 'Type',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            }
        ];

        const formArr = computed(() => {
            return localEmployeeMail.formArr;
        });

        onMounted(() => {
            getSearch();
        });

        return {
            cellParams,
            cellSelected,
            columnDefs,
            formArr
        };
    }
});
</script>