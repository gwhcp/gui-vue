<template>
    <div class="row">
        <div class="col-lg-6">
            <div class="card card-body">
                <static-data :value="formObj.id"
                             name="Domain ID"/>

                <static-data :datetime="formObj.date_from"
                             name="Created Date"/>

                <static-data v-if="formObj.company"
                             :ahref="{ name: 'admin:company:company:profile', params: { id: formObj.company } }"
                             :value="formObj.company_name"
                             name="Company"
                             permission="admin_company_company.view_company"/>

                <static-data :value="formObj.name"
                             name="Domain"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { StaticData } from "@/components";
import { useAdminCompanyDns } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "TheProfile",
    components: {
        StaticData
    },
    setup() {
        const { getProfile, localCompanyDns } = useAdminCompanyDns();

        const route = useRoute();

        const domainId = route.params.id.toString();

        const formObj = computed(() => {
            return localCompanyDns.formObj;
        });

        onMounted(() => {
            getProfile(domainId);
        });

        return {
            domainId,
            formObj
        };
    }
});
</script>
