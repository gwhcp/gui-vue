<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <router-link :to="{ name: getProductUrl(productType, 'profile'), params: { id: productId } }"
                     class="nav-link">Profile
        </router-link>

        <router-link :to="{ name: getProductUrl(productType, 'resource'), params: { id: productId } }"
                     class="nav-link">Resources
        </router-link>

        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Prices</a>
    </nav>

    <div class="row mb-3">
        <div v-if="hasPerm('admin_store_product_price.add_storeproductprice')"
             class="col-auto">
            <router-link :to="{ name: 'admin:store:product:price:create', params: { productId: productId, type: productType } }">
                <button class="btn btn-success"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-plus']"/>
                    </span> Create
                </button>
            </router-link>
        </div>

        <div v-if="cellSelected"
             class="col-auto">
            <router-link :to="{ name: 'admin:store:product:price:profile', params: { id: cellParams['id'], productId: cellParams['store_product'] } }">
                <button class="btn btn-primary"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-edit']"/>
                    </span> Edit
                </button>
            </router-link>
        </div>

        <div v-if="cellSelected && hasPerm('admin_store_product_price.delete_storeproductprice')"
             class="col-auto">
            <modal-open-delete :delete="deletePrice"
                               :form-arr="formArr"
                               :params="{ id: cellParams['id'], productId: cellParams['store_product'] }"
                               message-alert="Continuing will remove this product price."
                               message-success="Product price has been removed."/>
        </div>
    </div>

    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"/>
</template>

<script lang="ts">
import { ModalOpenDelete, SearchGrid } from "@/components";
import { useAdminStoreProduct, useAdminStoreProductPrice, useAuth, useSearchGrid } from "@/composables";
import { defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "TheSearch",
    components: {
        ModalOpenDelete,
        SearchGrid
    },
    setup() {
        const { getProductUrl } = useAdminStoreProduct();

        const { deletePrice, formArr, formErrors, getSearch } = useAdminStoreProductPrice();

        const { hasPerm } = useAuth();

        const route = useRoute();

        const { cellParams, cellSelected, cellStatus, filterString, formatStatus } = useSearchGrid();

        const columnDefs = [
            {
                field: 'id',
                checkboxSelection: true,
                headerName: 'ID',
                filter: 'agNumberColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'billing_cycle',
                headerName: 'Billing Cycle',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'base_price',
                headerName: 'Base Price',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'setup_price',
                headerName: 'Setup Price',
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

        const productId = route.params.productId.toString();

        const productType = route.params.type.toString();

        onMounted(() => {
            getSearch(productId);
        });

        return {
            cellParams,
            cellSelected,
            columnDefs,
            deletePrice,
            formArr,
            formErrors,
            getProductUrl,
            hasPerm,
            productId,
            productType
        };
    }
});
</script>