<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <router-link :to="{ name: 'admin:customer:billing:profile', params: { id: profileId } }"
                     class="nav-link">Profile
        </router-link>

        <router-link :to="{ name: 'admin:customer:billing:invoice:search', params: { id: profileId } }"
                     class="nav-link">Search Invoices
        </router-link>

        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Invoice Profile</a>
    </nav>


    <div class="row">
        <div class="col-lg-6 mb-3">
            <div class="card card-body">
                <static-data :value="profileId"
                             name="Billing Profile ID"/>

                <static-data :value="formObj.id"
                             name="Invoice ID"/>

                <static-data :datetime="formObj.date_from"
                             name="Created Date"/>
            </div>
        </div>

        <div class="col-lg-6 mb-3">
            <div class="card card-body">
                <static-data v-if="formObj.order"
                             :value="formObj.order.id"
                             name="Order ID"/>

                <static-data v-if="formObj.store_product"
                             :value="formObj.store_product.name"
                             name="Store Product Name"/>
            </div>
        </div>
    </div>

    <search-grid :column-defs="columnDefs"
                 :form-arr="formObj.items"/>
</template>

<script lang="ts">
import { SearchGrid, StaticData } from "@/components";
import { useAdminCustomerBilling, useSearchGrid } from "@/composables";
import { defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "TheProfile",
    components: {
        SearchGrid,
        StaticData
    },
    setup() {
        const { formObj, getProfileInvoice } = useAdminCustomerBilling();

        const route = useRoute();

        const {
            cellInvoiceType,
            cellTransactionType,
            filterDate,
            filterString,
            formatDate,
            formatInvoiceType,
            formatTransactionType
        } = useSearchGrid();

        const columnDefs = [
            {
                field: 'id',
                headerName: 'ID',
                filter: 'agNumberColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'amount',
                headerName: 'Amount',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'invoice_type',
                headerName: 'Type',
                filter: 'agTextColumnFilter',
                filterParams: filterString(),
                valueFormatter: formatInvoiceType,
                cellStyle: cellInvoiceType
            },
            {
                field: 'transaction_type',
                headerName: 'Transaction Type',
                filter: 'agTextColumnFilter',
                filterParams: filterString(),
                valueFormatter: formatTransactionType,
                cellStyle: cellTransactionType
            },
            {
                field: 'date_from',
                headerName: 'Date',
                filter: 'agDateColumnFilter',
                filterParams: filterDate(),
                valueFormatter: formatDate
            }
        ];

        const invoiceId = route.params.invoice_id.toString();

        const profileId = route.params.id.toString();

        onMounted(() => {
            getProfileInvoice(profileId, invoiceId);
        });

        return {
            columnDefs,
            formObj,
            invoiceId,
            profileId
        };
    }
});
</script>