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
import { defineComponent } from "vue";

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
        const { globalGrid } = useSearchGrid();

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

        return {
            defaultColDef,
            globalGrid,
            gridOptions
        }
    },
    created() {
        window.addEventListener('resize', this.resizeColumns);
    },
    mounted() {
        this.resizeColumns();
    },
    watch: {
        formArr: function () {
            this.globalGrid.selected = false;
        }
    },
    methods: {
        onSelectionChanged() {
            // @ts-ignore
            const selectedRows = this.gridOptions.api.getSelectedRows();

            if (selectedRows.length === 1) {
                this.globalGrid.selected = true;

                this.globalGrid.cellParams = selectedRows[0];
            } else {
                this.globalGrid.cellParams = '';

                this.globalGrid.selected = false;
            }
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