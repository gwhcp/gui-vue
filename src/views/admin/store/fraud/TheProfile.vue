<template>
    <div class="row">
        <div class="col-lg-6">
            <div class="card card-body">
                <static-data :value="formObj.id"
                             name="Fraud String ID"/>

                <static-data :datetime="formObj.date_from"
                             name="Created Date"/>

                <static-data :value="formObj.name"
                             name="Name"/>

                <static-data :value="formObj.fraud_type_name"
                             name="Type"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { StaticData } from "@/components";
import { useAdminStoreFraud } from "@/composables";
import { defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "TheProfile",
    components: {
        StaticData
    },
    setup() {
        const { formObj, getProfile } = useAdminStoreFraud();

        const route = useRoute();

        const fraudId = route.params.id.toString();

        onMounted(() => {
            getProfile(fraudId);
        });

        return {
            formObj,
            fraudId
        };
    }
});
</script>
