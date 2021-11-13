<template>
    <div class="row mb-3">
        <div v-if="hasPerm('admin_billing_payment.add_paymentgateway')"
             class="col-auto">
            <router-link :to="{ name: 'admin:billing:payment:create' }">
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
            <router-link :to="{ name: 'admin:billing:payment:profile', params: { id: cellParams['id'] } }">
                <button class="btn btn-primary"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-edit']"/>
                    </span> Edit
                </button>
            </router-link>
        </div>

        <div v-if="cellSelected && hasPerm('admin_billing_payment.delete_paymentgateway')"
             class="col-auto">
            <modal-open-delete :delete="deletePaymentGateway"
                               :form-arr="formArr"
                               :message-error="formErrors"
                               :params="{ id: cellParams['id'] }"
                               message-alert="Continuing will remove this payment gateway."
                               message-success="Payment gateway has been removed."/>
        </div>
    </div>

    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"/>
</template>

<script lang="ts">
import { ModalOpenDelete, SearchGrid } from "@/components"
import { useAdminBillingPayment, useAuth, useSearchGrid } from "@/composables";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearch",
    components: {
        ModalOpenDelete,
        SearchGrid
    },
    setup() {
        const { deletePaymentGateway, formArr, formErrors, getSearch } = useAdminBillingPayment();

        const { hasPerm } = useAuth();

        const { cellParams, cellSelected, filterString } = useSearchGrid();

        const columnDefs = [
            {
                field: 'id',
                checkboxSelection: true,
                headerName: 'ID',
                filter: 'agNumberColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'company',
                headerName: 'Company',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'merchant_name',
                headerName: 'Merchant',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'payment_method_name',
                headerName: 'Method',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            }
        ];

        onMounted(() => {
            getSearch();
        });

        return {
            cellParams,
            cellSelected,
            columnDefs,
            deletePaymentGateway,
            formArr,
            formErrors,
            hasPerm
        };
    }
});
</script>