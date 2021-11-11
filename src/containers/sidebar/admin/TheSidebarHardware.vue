<template>
    <div v-if="toggle"
         class="accordion-item">
        <h2 id="headingAdminHardware"
            class="accordion-header">
            <button aria-controls="collapseAdminHardware"
                    aria-expanded="false"
                    class="accordion-button collapsed"
                    data-bs-target="#collapseAdminHardware"
                    data-bs-toggle="collapse"
                    type="button">
                                    <span class="pe-2">
                                        <font-awesome-icon :icon="['fas', 'wrench']"/>
                                    </span> Hardware
            </button>
        </h2>

        <div id="collapseAdminHardware"
             aria-labelledby="headingAdminHardware"
             class="accordion-collapse collapse"
             data-bs-parent="#accordionSidebar">
            <div class="accordion-body list-group">
                <router-link v-if="hasPerm('admin_hardware_client.view_server')"
                             :to="{ name: 'admin:hardware:client:search' }"
                             class="list-group-item list-group-item-action border-0">
                    Client
                </router-link>

                <router-link v-if="hasPerm('admin_hardware_company.view_server')"
                             :to="{ name: 'admin:hardware:company:search' }"
                             class="list-group-item list-group-item-action border-0">
                    Company
                </router-link>

                <router-link v-if="hasPerm('admin_hardware_ssl.view_ssl')"
                             :to="{ name: 'dashboard' }"
                             class="list-group-item list-group-item-action border-0">
                    SSL
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useAuth } from "@/composables";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: "TheSidebarAdminHardware",
    setup() {
        const { hasPerm } = useAuth();

        const toggle = ref(true);

        onMounted(() => {
            toggle.value = document.querySelectorAll('#collapseAdminHardware a').length > 0;
        });

        return {
            hasPerm,
            toggle
        };
    }
});
</script>