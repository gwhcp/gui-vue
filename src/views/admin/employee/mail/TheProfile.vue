<template>
    <nav v-if="formObj.mail_type === 'mailbox'"
         class="nav nav-pills nav-justified mb-3">
        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Profile</a>

        <router-link :to="{ name: 'admin:employee:mail:password', params: { id: mailId } }"
                     class="nav-link">Password
        </router-link>
    </nav>

    <div class="row">
        <div class="col-lg-6">
            <div class="card card-body">
                <static-data :value="formObj.id"
                             name="Mail ID"/>

                <static-data :datetime="formObj.date_from"
                             name="Created Date"/>

                <static-data v-if="formObj.company"
                             :ahref="{ name: 'admin:company:company:profile', params: { id: formObj.company } }"
                             :value="formObj.company_name"
                             name="Company"
                             permission="admin_company_company.view_company"/>

                <static-data :value="formObj.domain_name"
                             name="Domain"/>

                <static-data :value="formObj.mail_type_name"
                             name="Type"/>

                <static-data :value="formObj.name"
                             name="Name"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { StaticData } from "@/components";
import { useAdminEmployeeMail } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "TheProfile",
    components: {
        StaticData
    },
    setup() {
        const { getProfile, localEmployeeMail } = useAdminEmployeeMail();

        const route = useRoute();

        const formObj = computed(() => {
            return localEmployeeMail.formObj;
        });

        const mailId = route.params.id.toString();

        onMounted(() => {
            getProfile(mailId);
        });

        return {
            formObj,
            mailId
        };
    }
});
</script>
