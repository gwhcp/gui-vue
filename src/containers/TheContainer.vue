<template>
    <page-loading :is-active="loadingState.isActive"/>

    <div class="vh-100 d-flex flex-column overflow-hidden">
        <TheHeader/>

        <div class="flex-fill d-flex flex-row overflow-auto">
            <TheSidebar/>

            <main id="main"
                  class="flex-fill overflow-auto bg-light">
                <TheBreadcrumb/>

                <div class="px-3">
                    <alert-banner/>

                    <router-view/>

                    <TheFooter/>
                </div>
            </main>
        </div>
    </div>
</template>

<script lang="ts">
import { AlertBanner, PageLoading } from "@/components";
import { usePageLoading, useSidebar } from "@/composables";
import { TheBreadcrumb, TheFooter, TheHeader, TheSidebar } from "@/containers";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheContainer",
    components: {
        AlertBanner,
        PageLoading,
        TheBreadcrumb,
        TheHeader,
        TheFooter,
        TheSidebar
    },
    setup() {
        const { loadingState } = usePageLoading();

        const { resizeSidebar } = useSidebar();

        onMounted(() => {
            resizeSidebar(document.documentElement.clientWidth > 768);
        });

        window.addEventListener('resize', () => {
            resizeSidebar(document.documentElement.clientWidth > 768);
        });

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