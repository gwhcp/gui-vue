<template>
    <div v-if="toggle"
         class="accordion-item">
        <h2 id="headingAdminCompany"
            class="accordion-header">
            <button aria-controls="collapseAdminCompany"
                    aria-expanded="false"
                    class="accordion-button collapsed"
                    data-bs-target="#collapseAdminCompany"
                    data-bs-toggle="collapse"
                    type="button">
                                    <span class="pe-2">
                                        <font-awesome-icon :icon="['fas', 'building']"/>
                                    </span> Company
            </button>
        </h2>

        <div id="collapseAdminCompany"
             aria-labelledby="headingAdminCompany"
             class="accordion-collapse collapse"
             data-bs-parent="#accordionSidebar">
            <div class="accordion-body list-group">
                <router-link v-if="hasPerm('admin_company_company.view_company')"
                             :to="{ name: 'admin:company:company:search' }"
                             class="list-group-item list-group-item-action border-0">
                    Company
                </router-link>

                <router-link v-if="hasPerm('admin_company_dns.view_dnszone')"
                             :to="{ name: 'admin:company:dns:search' }"
                             class="list-group-item list-group-item-action border-0">
                    DNS
                </router-link>

                <router-link v-if="hasPerm('admin_company_domain.view_domain')"
                             :to="{ name: 'admin:company:domain:search' }"
                             class="list-group-item list-group-item-action border-0">
                    Domain
                </router-link>

                <router-link v-if="hasPerm('admin_company_mail.view_mail')"
                             :to="{ name: 'admin:company:mail:search' }"
                             class="list-group-item list-group-item-action border-0">
                    Mail
                </router-link>

                <router-link v-if="hasPerm('admin_company_xmpp.view_prosodyaccount')"
                             :to="{ name: 'admin:company:xmpp:search' }"
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
    name: "TheSidebarAdminCompany",
    setup() {
        const { hasPerm } = useAuth();

        const toggle = ref(true);

        onMounted(() => {
            toggle.value = document.querySelectorAll('#collapseAdminCompany a').length > 0;
        });

        return {
            hasPerm,
            toggle
        };
    }
});
</script>