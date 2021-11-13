<template>
    <ag-grid-vue :columnDefs="columnDefs"
                 :defaultColDef="defaultColDef"
                 :gridOptions="gridOptions"
                 :rowData="formArr"
                 class="ag-theme-alpine"
                 rowSelection="single"
                 style="width: 100%; height: 500px;"
                 @selection-changed="onSelectionChanged"/>
</template>

<script lang="ts">
import { useSearchGrid } from "@/composables";
import { AgGridVue } from "ag-grid-vue3";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "SearchGrid",
    props: {
        columnDefs: {
            type: Array,
            required: true
        },
        formArr: {
            type: Array,
            required: true
        }
    },
    components: {
        AgGridVue
    },
    setup() {
        const { selectionClear, selectionUpdate } = useSearchGrid();

        const defaultColDef = {
            editable: false,
            resizable: true,
            sortable: true,
            filter: true
        };

        const gridOptions = {
            pagination: true,
            paginationPageSize: 20
        };

        onMounted(() => {
            selectionClear();
        });

        return {
            defaultColDef,
            gridOptions,
            selectionClear,
            selectionUpdate
        }
    },
    created() {
        window.addEventListener('resize', this.resizeColumns);
    },
    mounted() {
        this.resizeColumns();
    },
    methods: {
        onSelectionChanged() {
            // @ts-ignore
            const selectedRows = this.gridOptions.api.getSelectedRows();

            this.selectionUpdate(selectedRows);
        },
        resizeColumns() {
            // @ts-ignore
            this.gridOptions.api.sizeColumnsToFit();
        }
    }
});
</script>

<style lang="scss">
@import "~ag-grid-community/dist/styles/ag-grid.css";
@import "~ag-grid-community/dist/styles/ag-theme-alpine.css";
</style>