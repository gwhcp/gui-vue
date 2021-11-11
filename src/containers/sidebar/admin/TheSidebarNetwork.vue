<template>
    <div v-if="toggle"
         class="accordion-item">
        <h2 id="headingAdminNetwork"
            class="accordion-header">
            <button aria-controls="collapseAdminNetwork"
                    aria-expanded="false"
                    class="accordion-button collapsed"
                    data-bs-target="#collapseAdminNetwork"
                    data-bs-toggle="collapse"
                    type="button">
                                    <span class="pe-2">
                                        <font-awesome-icon :icon="['fas', 'laptop']"/>
                                    </span> Network
            </button>
        </h2>

        <div id="collapseAdminNetwork"
             aria-labelledby="headingAdminNetwork"
             class="accordion-collapse collapse"
             data-bs-parent="#accordionSidebar">
            <div class="accordion-body list-group">
                <router-link v-if="hasPerm('admin_network_pool.view_ipaddresssetup')"
                             :to="{ name: 'admin:network:pool:search' }"
                             class="list-group-item list-group-item-action border-0">
                    IP Address Pool
                </router-link>

                <router-link v-if="hasPerm('admin_network_queue.view_queuestatus')"
                             :to="{ name: 'admin:network:queue:search' }"
                             class="list-group-item list-group-item-action border-0">
                    Queue
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useAuth } from "@/composables";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: "TheSidebarAdminNetwork",
    setup() {
        const { hasPerm } = useAuth();

        const toggle = ref(true);

        onMounted(() => {
            toggle.value = document.querySelectorAll('#collapseAdminNetwork a').length > 0;
        });

        return {
            hasPerm,
            toggle
        };
    }
});
</script>