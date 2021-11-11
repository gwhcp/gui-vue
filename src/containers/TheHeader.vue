<template>
    <div class="flex-shrink-1 p-1 border-bottom">
        <nav class="navbar navbar-expand-lg navbar-light">
            <button class="btn d-print-none"
                    type="button"
                    v-on:click="toggleSidebar">
                <font-awesome-icon v-if="globalSidebar.toggle"
                                   :icon="['fas', 'angle-double-left']"
                                   size="lg"/>

                <font-awesome-icon v-if="!globalSidebar.toggle"
                                   :icon="['fas', 'angle-double-right']"
                                   size="lg"/>
            </button>

            <router-link :to="{ name: 'home' }"
                         class="navbar-brand">
                <img alt="GWHCP"
                     height="48"
                     src="img/gwhcp_header.svg"/>
            </router-link>

            <button aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    class="navbar-toggler ms-auto d-print-none"
                    data-bs-target="#navbarSupportedContent"
                    data-bs-toggle="collapse"
                    type="button">
                <span class="navbar-toggler-icon"/>
            </button>

            <div id="navbarSupportedContent"
                 class="collapse navbar-collapse d-print-none">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0 d-none d-lg-block">
                    <li class="nav-item dropdown">
                        <a id="navbarDropdown"
                           aria-expanded="false"
                           class="nav-link dropdown-toggle"
                           data-bs-toggle="dropdown"
                           href="#"
                           role="button">
                            <font-awesome-icon :icon="['fas', 'user-cog']"
                                               size="lg"/>
                        </a>

                        <ul aria-labelledby="navbarDropdown"
                            class="dropdown-menu dropdown-menu-lg-end p-0">
                            <li class="bg-light">
                                <h6 class="dropdown-header">Account</h6>
                            </li>

                            <li v-for="link in links"
                                v-bind:key="link">
                                <router-link :to="{ name: link.name }"
                                             class="dropdown-item">
                                    <font-awesome-icon :icon="link.icon"/>
                                    {{ link.title }}
                                </router-link>
                            </li>
                        </ul>
                    </li>
                </ul>

                <div class="list-group d-lg-none">
                    <router-link v-for="link in links"
                                 v-bind:key="link"
                                 :to="{ name: link.name }"
                                 class="list-group-item list-group-item-action">
                        <font-awesome-icon :icon="link.icon"/>
                        {{ link.title }}
                    </router-link>
                </div>
            </div>
        </nav>
    </div>
</template>

<script lang="ts">
import { useAuth, useSidebar } from "@/composables";
import { computed, defineComponent } from "vue";

export default defineComponent({
    name: "TheHeader",
    setup() {
        const { globalAuth } = useAuth();

        const { globalSidebar, toggleSidebar } = useSidebar();

        const accountProfile = computed(() => {
            return JSON.parse(globalAuth.accountProfile);
        });

        const links = [
            {
                icon: ['fas', 'user-circle'],
                name: accountProfile.value.is_staff ? 'admin:employee:account:profile' : 'client:account:profile',
                title: 'Profile'
            },
            {
                icon: ['fas', 'dungeon'],
                name: accountProfile.value.is_staff ? 'admin:employee:account:accesslog' : 'client:account:accesslog',
                title: 'Access Logs'
            },
            {
                icon: ['fas', 'unlock-alt'],
                name: accountProfile.value.is_staff ? 'admin:employee:account:password' : 'client:account:password',
                title: 'Change Password'
            },
            {
                icon: ['fas', 'sign-out-alt'],
                name: 'logout',
                title: 'Logout'
            }
        ];

        return {
            globalSidebar,
            links,
            toggleSidebar
        };
    }
});
</script>