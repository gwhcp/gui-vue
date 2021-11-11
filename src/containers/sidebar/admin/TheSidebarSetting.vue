<template>
    <div v-if="toggle"
         class="accordion-item">
        <h2 id="headingAdminSetting"
            class="accordion-header">
            <button aria-controls="collapseAdminSetting"
                    aria-expanded="false"
                    class="accordion-button collapsed"
                    data-bs-target="#collapseAdminSetting"
                    data-bs-toggle="collapse"
                    type="button">
                                    <span class="pe-2">
                                        <font-awesome-icon :icon="['fas', 'cog']"/>
                                    </span> Settings
            </button>
        </h2>

        <div id="collapseAdminSetting"
             aria-labelledby="headingAdminSetting"
             class="accordion-collapse collapse"
             data-bs-parent="#accordionSidebar">
            <div class="accordion-body list-group">
                <router-link v-if="hasPerm('admin_setting_banned.view_banned')"
                             :to="{ name: 'admin:setting:banned:search' }"
                             class="list-group-item list-group-item-action border-0">
                    Banned Item
                </router-link>

                <router-link v-if="hasPerm('admin_setting_email.view_emailtemplate')"
                             :to="{ name: 'admin:setting:email:search' }"
                             class="list-group-item list-group-item-action border-0">
                    Email Template
                </router-link>

                <router-link v-if="hasPerm('')"
                             :to="{ name: 'dashboard' }"
                             class="list-group-item list-group-item-action border-0">
                    Permissions
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useAuth } from "@/composables";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: "TheSidebarAdminSetting",
    setup() {
        const { hasPerm } = useAuth();

        const toggle = ref(true);

        onMounted(() => {
            toggle.value = document.querySelectorAll('#collapseAdminSetting a').length > 0;
        });

        return {
            hasPerm,
            toggle
        };
    }
});
</script>