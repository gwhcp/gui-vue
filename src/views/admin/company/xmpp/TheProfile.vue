<template>
    <Form :validation-schema="schema"
          @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6 mb-3">
                <div class="card card-body">
                    <static-data :value="formObj.id"
                                 name="XMPP ID"/>

                    <static-data :value="formObj.account_id"
                                 name="Account ID"/>

                    <static-data :value="formObj.account_name"
                                 name="Employee Name"/>

                    <static-data :value="`${formObj.account_id}@localhost`"
                                 name="Username"/>

                    <static-data :value="formObj.server_name"
                                 name="Server"/>

                    <input-select v-model="formObj.group"
                                  :options="choices.group"
                                  :required="true"
                                  label="Group"
                                  name="group"/>

                    <div class="col-6">
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
import { InputSelect, StaticData } from "@/components";
import { useAuth, useAdminCompanyXmpp } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { number, object } from "yup";

export default defineComponent({
    name: "TheProfile",
    components: {
        Form,
        InputSelect,
        StaticData
    },
    setup() {
        const { hasPermForm } = useAuth();

        const { getChoices, getProfile, localCompanyXmpp, updateProfile } = useAdminCompanyXmpp();

        const route = useRoute();

        const choices = computed(() => {
            return localCompanyXmpp.choices;
        });

        const formErrors = computed(() => {
            return localCompanyXmpp.formErrors;
        });

        const formObj = computed(() => {
            return localCompanyXmpp.formObj;
        });

        const formSuccess = computed(() => {
            return localCompanyXmpp.formSuccess;
        });

        const schema = object({
            time_zone: number().required()
        });

        const xmppId = route.params.id.toString();

        onMounted(() => {
            getChoices();

            getProfile(xmppId);

            hasPermForm('admin_company_xmpp.change_prosodyaccount');
        });

        return {
            choices,
            formErrors,
            formObj,
            formSuccess,
            schema,
            updateProfile,
            xmppId
        };
    },
    methods: {
        async submitUpdate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.updateProfile(this.xmppId, values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'XMPP account has been updated.',
                    type: 'success'
                });
            }
        }
    }
});
</script>