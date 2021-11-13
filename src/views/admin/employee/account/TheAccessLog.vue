<template>
    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"/>
</template>

<script lang="ts">
import { SearchGrid } from "@/components";
import { useAdminEmployeeAccount, useSearchGrid } from "@/composables";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheAccessLog",
    components: {
        SearchGrid
    },
    setup() {
        const { formArr, getAccessLog } = useAdminEmployeeAccount();

        const { filterDate, filterString, formatDate } = useSearchGrid();

        const columnDefs = [
            {
                field: 'date_from',
                headerName: 'Login Date',
                filter: 'agDateColumnFilter',
                filterParams: filterDate(),
                valueFormatter: formatDate
            },
            {
                field: 'ipaddress',
                headerName: 'IP Address',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'reverse_ipaddress',
                headerName: 'Reverse IP Address',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            }
        ];

        onMounted(() => {
            getAccessLog();
        });

        return {
            columnDefs,
            formArr
        };
    }
});
</script>