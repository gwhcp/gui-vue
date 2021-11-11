<template>
    <div class="row">
        <div class="col-lg-6">
            <div class="card card-body">
                <static-data :value="formObj.id"
                             name="Reason ID"/>

                <static-data :datetime="formObj.date_from"
                             name="Created Date"/>

                <static-data :value="formObj.name"
                             name="Name"/>

                <static-data :value="formObj.reason_type_name"
                             name="Type"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { StaticData } from "@/components";
import { useAdminBillingReason } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "TheProfile",
    components: {
        StaticData
    },
    setup() {
        const { getProfile, localBillingReason } = useAdminBillingReason();

        const route = useRoute();

        const formObj = computed(() => {
            return localBillingReason.formObj;
        });

        const reasonId = route.params.id.toString();

        onMounted(() => {
            getProfile(reasonId);
        });

        return {
            formObj,
            reasonId
        };
    }
});
</script>
