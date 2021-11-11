<template>
    <div v-if="toggle"
         class="accordion-item">
        <h2 id="headingAdminEmployee"
            class="accordion-header">
            <button aria-controls="collapseAdminEmployee"
                    aria-expanded="false"
                    class="accordion-button collapsed"
                    data-bs-target="#collapseAdminEmployee"
                    data-bs-toggle="collapse"
                    type="button">
                                    <span class="pe-2">
                                        <font-awesome-icon :icon="['fas', 'user-tie']"/>
                                    </span> Employee
            </button>
        </h2>

        <div id="collapseAdminEmployee"
             aria-labelledby="headingAdminEmployee"
             class="accordion-collapse collapse"
             data-bs-parent="#accordionSidebar">
            <div class="accordion-body list-group">
                <router-link v-if="hasPerm('admin_employee_manage.view_account')"
                             :to="{ name: 'admin:employee:manage:search' }"
                             class="list-group-item list-group-item-action border-0">
                    Account
                </router-link>

                <router-link v-if="hasPerm('admin_employee_mail.view_mail')"
                             :to="{ name: 'admin:employee:mail:search' }"
                             class="list-group-item list-group-item-action border-0">
                    Mail
                </router-link>

                <router-link v-if="hasPerm('admin_employee_xmpp.view_prosodyaccount')"
                             :to="{ name: 'admin:employee:xmpp:profile' }"
                             class="list-group-item list-group-item-action border-0">
                    XMPP
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useAuth } from "@/composables";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: "TheSidebarAdminEmployee",
    setup() {
        const { hasPerm } = useAuth();

        const toggle = ref(true);

        onMounted(() => {
            toggle.value = document.querySelectorAll('#collapseAdminEmployee a').length > 0;
        });

        return {
            hasPerm,
            toggle
        };
    }
});
</script>