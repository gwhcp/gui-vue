<template>
    <div v-if="toggle"
         class="accordion-item">
        <h2 id="headingClientStore"
            class="accordion-header">
            <button aria-controls="collapseClientStore"
                    aria-expanded="false"
                    class="accordion-button collapsed"
                    data-bs-target="#collapseClientStore"
                    data-bs-toggle="collapse"
                    type="button">
                        <span class="pe-2">
                            <font-awesome-icon :icon="['fas', 'store-alt']"/>
                        </span> Store
            </button>
        </h2>

        <div id="collapseClientStore"
             aria-labelledby="headingClientStore"
             class="accordion-collapse collapse"
             data-bs-parent="#accordionSidebar">
            <div class="accordion-body list-group">
                <router-link v-if="hasPerm('client_store.view_storeproduct')"
                             :to="{ name: 'client:store:index' }"
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
    name: "TheSidebarClientStore",
    setup() {
        const { hasPerm } = useAuth();

        const toggle = ref(true);

        onMounted(() => {
            toggle.value = document.querySelectorAll('#collapseClientStore a').length > 0;
        });

        return {
            hasPerm,
            toggle
        };
    }
});
</script>