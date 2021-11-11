<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <router-link :to="{ name: 'admin:employee:manage:profile', params: { id: accountId } }"
                     class="nav-link">Profile
        </router-link>

        <router-link :to="{ name: 'admin:employee:manage:permission', params: { id: accountId } }"
                     class="nav-link">Permissions
        </router-link>

        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Access Logs</a>
    </nav>

    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"/>
</template>

<script lang="ts">
import { SearchGrid } from "@/components";
import { useAdminEmployeeManage, useSearchGrid } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "TheAccessLog",
    components: {
        SearchGrid
    },
    setup() {
        const { getAccessLog, localEmployeeManage } = useAdminEmployeeManage();

        const route = useRoute();

        const { filterDate, filterString, formatDate, globalGrid } = useSearchGrid();

        const cellParams = computed(() => {
            return globalGrid.cellParams;
        });

        const accountId = route.params.id.toString();

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
            return localEmployeeManage.formArr;
        });

        const selected = computed(() => {
            return globalGrid.selected;
        });

        onMounted(() => {
            getAccessLog(accountId);
        });

        return {
            accountId,
            cellParams,
            columnDefs,
            formArr,
            selected
        };
    }
});
</script>