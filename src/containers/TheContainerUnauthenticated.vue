<template>
    <page-loading :is-active="loadingState.isActive"/>

    <alert-banner/>

    <router-view/>
</template>

<script lang="ts">
import { AlertBanner, PageLoading } from "@/components";
import { usePageLoading } from "@/composables";
import { defineComponent } from "vue";

export default defineComponent({
    name: "TheContainerUnauthenticated",
    components: {
        AlertBanner,
        PageLoading
    },
    setup() {
        const { loadingState } = usePageLoading();

        return {
            loadingState
        };
    }
});
</script>

<style lang="css">
::-webkit-scrollbar {
    width: 0;
    background: transparent; /* make scrollbar transparent */
}
</style>