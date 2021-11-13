<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <router-link :to="{ name: 'client:billing:profile', params: { id: profileId } }"
                     class="nav-link">Profile
        </router-link>

        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Search Invoices</a>
    </nav>

    <div class="row mb-3">
        <div v-if="cellSelected"
             class="col-auto">
            <router-link :to="{ name: 'client:billing:invoice:profile', params: { id: profileId, invoice_id: cellParams['id'] } }">
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
import { useClientBilling, useSearchGrid } from "@/composables";
import { defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "TheSearch",
    components: {
        SearchGrid
    },
    setup() {
        const { formArr, getSearchInvoice } = useClientBilling();

        const { cellParams, cellSelected, filterDate, filterString, formatDate } = useSearchGrid();

        const route = useRoute();

        const profileId = route.params.id.toString();

        const columnDefs = [
            {
                field: 'id',
                checkboxSelection: true,
                headerName: 'ID',
                filter: 'agNumberColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'date_from',
                headerName: 'Date',
                filter: 'agDateColumnFilter',
                filterParams: filterDate(),
                valueFormatter: formatDate
            },
            {
                field: 'product_profile_name',
                headerName: 'Product Profile Name',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'store_product_name',
                headerName: 'Store Product Name',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            }
        ];

        onMounted(() => {
            getSearchInvoice(profileId);
        });

        return {
            cellParams,
            cellSelected,
            columnDefs,
            formArr,
            profileId
        };
    }
});
</script>