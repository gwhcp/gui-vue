<template>
    <nav aria-label="breadcrumb"
         class="bg-white mb-3 border-bottom">
        <ol class="breadcrumb ps-3 pt-3">
            <li class="breadcrumb-item">
                <router-link :to="{ name: 'dashboard' }"
                             class="text-decoration-none">
                    <font-awesome-icon :icon="['fas', 'home']"
                                       class="text-black-50 me-1"/>
                    Home
                </router-link>
            </li>

            <li v-if="route.meta['section']"
                aria-current="page"
                class="breadcrumb-item active">{{ route.meta['section'] }}
            </li>

            <li aria-current="page"
                class="breadcrumb-item active">{{ route.meta['label'] }}
            </li>
        </ol>
    </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "TheBreadcrumb",
    setup() {
        const route = useRoute();

        return {
            route
        };
    }
});
</script>