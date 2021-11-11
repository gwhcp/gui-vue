<template>
    <div class="row mb-3">
        <div v-if="hasPerm('store_product.add_storeproduct')"
             class="col-auto">
            <router-link :to="{ name: 'admin:store:product:domain:create' }">
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
            <router-link :to="{ name: 'admin:store:product:domain:profile', params: { id: cellParams['id'] } }">
                <button class="btn btn-primary"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-edit']"/>
                    </span> Edit
                </button>
            </router-link>
        </div>

        <div v-if="selected && hasPerm('store_product.delete_storeproduct')"
             class="col-auto">
            <modal-open-delete :delete="deleteProduct"
                               :form-arr="formArr"
                               :params="{ id: cellParams['id'] }"
                               message-alert="Continuing will remove this domain hosting product."
                               message-success="Domain hosting product has been removed."/>
        </div>
    </div>

    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"/>
</template>

<script lang="ts">
import { ModalOpenDelete, SearchGrid } from "@/components";
import { useAuth, useSearchGrid, useAdminStoreProductDomain } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearch",
    components: {
        ModalOpenDelete,
        SearchGrid
    },
    setup() {
        const { hasPerm } = useAuth();

        const { deleteProduct, getSearch, localStoreProductDomain } = useAdminStoreProductDomain();

        const { cellStatus, filterString, formatStatus, globalGrid } = useSearchGrid();

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
                field: 'web_type_name',
                headerName: 'Web Type',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'company_name',
                headerName: 'Company',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'is_active',
                headerName: 'Status',
                filter: 'agTextColumnFilter',
                filterParams: filterString(),
                valueFormatter: formatStatus,
                cellStyle: cellStatus
            }
        ];

        const formArr = computed(() => {
            return localStoreProductDomain.formArr;
        });

        const formErrors = computed(() => {
            return localStoreProductDomain.formErrors;
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
            deleteProduct,
            formArr,
            formErrors,
            hasPerm,
            selected
        };
    }
});
</script>