<template>
    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"/>
</template>

<script lang="ts">
import { SearchGrid } from "@/components";
import { useClientAccount, useSearchGrid } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheAccessLog",
    components: {
        SearchGrid
    },
    setup() {
        const { getAccessLog, localClientAccount } = useClientAccount();

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

        const formArr = computed(() => {
            return localClientAccount.formArr;
        });

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