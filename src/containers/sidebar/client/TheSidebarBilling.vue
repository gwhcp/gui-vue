<template>
    <div v-if="toggle"
         class="accordion-item">
        <h2 id="headingClientBilling"
            class="accordion-header">
            <button aria-controls="collapseClientBilling"
                    aria-expanded="false"
                    class="accordion-button collapsed"
                    data-bs-target="#collapseClientBilling"
                    data-bs-toggle="collapse"
                    type="button">
                        <span class="pe-2">
                            <font-awesome-icon :icon="['fas', 'hand-holding-usd']"/>
                        </span> Billing Profile
            </button>
        </h2>

        <div id="collapseClientBilling"
             aria-labelledby="headingClientBilling"
             class="accordion-collapse collapse"
             data-bs-parent="#accordionSidebar">
            <div class="accordion-body list-group">
                <router-link v-if="hasPerm('client_billing.view_billingprofile')"
                             :to="{ name: 'client:billing:search' }"
                             class="list-group-item list-group-item-action border-0">
                    Search
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useAuth } from "@/composables";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: "TheSidebarClientBilling",
    setup() {
        const { hasPerm } = useAuth();

        const toggle = ref(true);

        onMounted(() => {
            toggle.value = document.querySelectorAll('#collapseClientBilling a').length > 0;
        });

        return {
            hasPerm,
            toggle
        };
    }
});
</script>