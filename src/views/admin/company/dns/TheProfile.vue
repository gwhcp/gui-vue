<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Profile</a>

        <router-link :to="{ name: 'admin:company:dns:records', params: { id: domainId } }"
                     class="nav-link">Records
        </router-link>

        <router-link :to="{ name: 'admin:company:dns:ns', params: { id: domainId } }"
                     class="nav-link">Nameserver
        </router-link>
    </nav>

    <Form :validation-schema="schema"
          @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <static-data :value="formObj.id"
                                 name="Domain ID"/>

                    <static-data v-if="formObj.company"
                                 :ahref="{ name: 'admin:company:company:profile', params: { id: formObj.company } }"
                                 :value="formObj.company_name"
                                 name="Company"
                                 permission="admin_company_company.view_company"/>

                    <static-data :value="formObj.name"
                                 name="Domain"/>

                    <input-switch v-model="formObj.manage_dns"
                                  label="Managed DNS"
                                  name="manage_dns"/>

                    <div class="col-6 mt-3">
                        <button class="btn btn-outline-primary px-4"
                                type="submit">Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Form>
</template>

<script lang="ts">
import { InputSwitch, StaticData } from "@/components";
import { useAuth, useAdminCompanyDns } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { boolean, object } from "yup";

export default defineComponent({
    name: "TheProfile",
    components: {
        Form,
        InputSwitch,
        StaticData
    },
    setup() {
        const { hasPermForm } = useAuth();

        const { getProfile, localCompanyDns, updateProfile } = useAdminCompanyDns();

        const route = useRoute();

        const domainId = route.params.id.toString();

        const formErrors = computed(() => {
            return localCompanyDns.formErrors;
        });

        const formObj = computed(() => {
            return localCompanyDns.formObj;
        });

        const formSuccess = computed(() => {
            return localCompanyDns.formSuccess;
        });

        const schema = object({
            manage_dns: boolean()
        });

        onMounted(() => {
            getProfile(domainId);

            hasPermForm('admin_company_dns.change_dnszone');
        });

        return {
            domainId,
            formErrors,
            formObj,
            formSuccess,
            schema,
            updateProfile
        };
    },
    methods: {
        async submitUpdate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.updateProfile(this.domainId, values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'DNS profile has been updated.',
                    type: 'success'
                });
            }
        }
    }
});
</script>
