<template>
    <div v-if="toggle"
         class="accordion-item">
        <h2 id="headingAdminCustomer"
            class="accordion-header">
            <button aria-controls="collapseAdminCustomer"
                    aria-expanded="false"
                    class="accordion-button collapsed"
                    data-bs-target="#collapseAdminCustomer"
                    data-bs-toggle="collapse"
                    type="button">
                                    <span class="pe-2">
                                        <font-awesome-icon :icon="['fas', 'users']"/>
                                    </span> Customer
            </button>
        </h2>

        <div id="collapseAdminCustomer"
             aria-labelledby="headingAdminCustomer"
             class="accordion-collapse collapse"
             data-bs-parent="#accordionSidebar">
            <div class="accordion-body list-group">
                <router-link v-if="hasPerm('admin_customer_account.view_account')"
                             :to="{ name: 'admin:customer:account:search' }"
                             class="list-group-item list-group-item-action border-0">
                    Account
                </router-link>

                <router-link v-if="hasPerm('admin_customer_billing.view_billingprofile')"
                             :to="{ name: 'dashboard' }"
                             class="list-group-item list-group-item-action border-0">
                    Billing Profile
                </router-link>

                <router-link v-if="hasPerm('admin_customer_order.view_order')"
                             :to="{ name: 'dashboard' }"
                             class="list-group-item list-group-item-action border-0">
                    Order
                </router-link>

                <router-link v-if="hasPerm('admin_customer_product.view_product')"
                             :to="{ name: 'dashboard' }"
                             class="list-group-item list-group-item-action border-0">
                    Product
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useAuth } from "@/composables";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: "TheSidebarAdminCustomer",
    setup() {
        const { hasPerm } = useAuth();

        const toggle = ref(true);

        onMounted(() => {
            toggle.value = document.querySelectorAll('#collapseAdminCustomer a').length > 0;
        });

        return {
            hasPerm,
            toggle
        };
    }
});
</script>