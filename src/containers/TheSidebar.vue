<template>
    <aside v-if="globalSidebar.toggle"
           id="sidebar"
           class="sidebar d-flex flex-column border-end d-print-none">
        <div class="p-0 overflow-auto">
            <div id="accordionSidebar"
                 class="accordion-flush">
                <the-sidebar-admin-billing v-if="accountProfile['is_staff']"/>

                <the-sidebar-admin-client v-if="accountProfile['is_staff']"/>

                <the-sidebar-admin-company v-if="accountProfile['is_staff']"/>

                <the-sidebar-admin-employee v-if="accountProfile['is_staff']"/>

                <the-sidebar-admin-hardware v-if="accountProfile['is_staff']"/>

                <the-sidebar-admin-network v-if="accountProfile['is_staff']"/>

                <the-sidebar-admin-setting v-if="accountProfile['is_staff']"/>

                <the-sidebar-admin-store v-if="accountProfile['is_staff']"/>

                <the-sidebar-client-account v-if="!accountProfile['is_staff']"/>

                <the-sidebar-client-billing v-if="!accountProfile['is_staff']"/>

                <the-sidebar-client-store v-if="!accountProfile['is_staff']"/>
            </div>
        </div>
    </aside>
</template>

<script lang="ts">
import { useAuth, useSidebar } from "@/composables";
import {
    TheSidebarAdminBilling,
    TheSidebarAdminClient,
    TheSidebarAdminCompany,
    TheSidebarAdminEmployee,
    TheSidebarAdminHardware,
    TheSidebarAdminNetwork,
    TheSidebarAdminSetting,
    TheSidebarAdminStore
} from "@/containers/sidebar/admin";
import { TheSidebarClientAccount, TheSidebarClientBilling, TheSidebarClientStore } from "@/containers/sidebar/client";
import { computed, defineComponent } from "vue";

export default defineComponent({
    name: "TheSidebar",
    components: {
        TheSidebarAdminBilling,
        TheSidebarAdminClient,
        TheSidebarAdminCompany,
        TheSidebarAdminEmployee,
        TheSidebarAdminHardware,
        TheSidebarAdminNetwork,
        TheSidebarAdminSetting,
        TheSidebarAdminStore,
        TheSidebarClientAccount,
        TheSidebarClientBilling,
        TheSidebarClientStore
    },
    setup() {
        const { globalAuth } = useAuth();

        const { globalSidebar } = useSidebar();

        const accountProfile = computed(() => {
            return JSON.parse(globalAuth.accountProfile);
        });

        return {
            accountProfile,
            globalSidebar
        };
    }
});
</script>

<style lang="css">
.accordion-body {
    padding: 0;
}

.accordion-button {
    background-color: #3C4B64;
    color: #FFFFFF;
}

.accordion-button.collapsed::after {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23FFF'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
}

.accordion-button:hover {
    background-color: #42b983 !important;
    color: #FFFFFF;
}

.accordion-button:not(.collapsed) {
    background-color: #3C4B64;
    color: #FFFFFF;
    box-shadow: 0 0 0 0;
}

.accordion-button:not(.collapsed)::after {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23FFF'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
}

.accordion-item {
    border-bottom: 0;
}

.sidebar {
    flex: 0 0 20%;
    min-width: 16rem;
    max-width: 16rem;
    background-color: #3C4B64;
}
</style>