<template>
    <div class="row">
        <div class="col-lg-6">
            <div class="card card-body">
                <static-data :value="formObj.id"
                             name="Banned ID"/>

                <static-data :datetime="formObj.date_from"
                             name="Created Date"/>

                <static-data :value="formObj.name"
                             name="Name"/>

                <static-data :value="formObj.banned_type_name"
                             name="Type"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { StaticData } from "@/components";
import { useAdminSettingBanned } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "TheProfile",
    components: {
        StaticData
    },
    setup() {
        const { getProfile, localSettingBanned } = useAdminSettingBanned();

        const route = useRoute();

        const bannedId = route.params.id.toString();

        const formObj = computed(() => {
            return localSettingBanned.formObj;
        });

        onMounted(() => {
            getProfile(bannedId);
        });

        return {
            bannedId,
            formObj
        };
    }
});
</script>
