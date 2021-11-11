<template>
    <div v-if="toggle"
         class="accordion-item">
        <h2 id="headingAdminBilling"
            class="accordion-header">
            <button aria-controls="collapseAdminBilling"
                    aria-expanded="false"
                    class="accordion-button collapsed"
                    data-bs-target="#collapseAdminBilling"
                    data-bs-toggle="collapse"
                    type="button">
                        <span class="pe-2">
                            <font-awesome-icon :icon="['fas', 'hand-holding-usd']"/>
                        </span> Billing
            </button>
        </h2>

        <div id="collapseAdminBilling"
             aria-labelledby="headingAdminBilling"
             class="accordion-collapse collapse"
             data-bs-parent="#accordionSidebar">
            <div class="accordion-body list-group">
                <router-link v-if="hasPerm('admin_billing_payment.view_paymentgateway')"
                             :to="{ name: 'admin:billing:payment:search' }"
                             class="list-group-item list-group-item-action border-0">
                    Payment Gateway
                </router-link>

                <router-link v-if="hasPerm('admin_billing_reason.view_reason')"
                             :to="{ name: 'admin:billing:reason:search' }"
                             class="list-group-item list-group-item-action border-0">
                    Reason
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useAuth } from "@/composables";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: "TheSidebarAdminBilling",
    setup() {
        const { hasPerm } = useAuth();

        const toggle = ref(true);

        onMounted(() => {
            toggle.value = document.querySelectorAll('#collapseAdminBilling a').length > 0;
        });

        return {
            hasPerm,
            toggle
        };
    }
});
</script>