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
        <div v-if="selected"
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
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "TheSearch",
    components: {
        SearchGrid
    },
    setup() {
        const { getSearchInvoice, localClientBilling } = useClientBilling();

        const { filterDate, filterString, formatDate, globalGrid } = useSearchGrid();

        const route = useRoute();

        const cellParams = computed(() => {
            return globalGrid.cellParams;
        });

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

        const formArr = computed(() => {
            return localClientBilling.formArr;
        });

        const selected = computed(() => {
            return globalGrid.selected;
        });

        onMounted(() => {
            getSearchInvoice(profileId);
        });

        return {
            cellParams,
            columnDefs,
            formArr,
            profileId,
            selected
        };
    }
});
</script>