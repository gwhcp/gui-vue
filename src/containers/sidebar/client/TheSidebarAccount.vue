<template>
    <div v-if="toggle"
         class="accordion-item">
        <h2 id="headingClientAccount"
            class="accordion-header">
            <button aria-controls="collapseClientAccount"
                    aria-expanded="false"
                    class="accordion-button collapsed"
                    data-bs-target="#collapseClientAccount"
                    data-bs-toggle="collapse"
                    type="button">
                        <span class="pe-2">
                            <font-awesome-icon :icon="['fas', 'user-alt']"/>
                        </span> Account
            </button>
        </h2>

        <div id="collapseClientAccount"
             aria-labelledby="headingClientAccount"
             class="accordion-collapse collapse"
             data-bs-parent="#accordionSidebar">
            <div class="accordion-body list-group">
                <router-link v-if="hasPerm('client_account.view_accesslog')"
                             :to="{ name: 'client:account:accesslog' }"
                             class="list-group-item list-group-item-action border-0">
                    Access Logs
                </router-link>

                <router-link v-if="hasPerm('client_account.view_account')"
                             :to="{ name: 'client:account:profile' }"
                             class="list-group-item list-group-item-action border-0">
                    Profile
                </router-link>

                <router-link v-if="hasPerm('client_account.view_account')"
                             :to="{ name: 'client:account:password' }"
                             class="list-group-item list-group-item-action border-0">
                    Change Password
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useAuth } from "@/composables";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: "TheSidebarClientAccount",
    setup() {
        const { hasPerm } = useAuth();

        const toggle = ref(true);

        onMounted(() => {
            toggle.value = document.querySelectorAll('#collapseClientAccount a').length > 0;
        });

        return {
            hasPerm,
            toggle
        };
    }
});
</script>