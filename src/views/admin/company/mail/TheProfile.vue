<template>
    <nav v-if="formObj.mail_type === 'mailbox'"
         class="nav nav-pills nav-justified mb-3">
        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Profile</a>

        <router-link :to="{ name: 'admin:company:mail:password', params: { id: mailId } }"
                     class="nav-link">Password
        </router-link>
    </nav>

    <Form :validation-schema="schema"
          @submit="submitUpdate">
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

                    <input-select v-model="formObj.account"
                                  :options="choices.account"
                                  :required="true"
                                  label="Account"
                                  name="account"/>

                    <input-text v-if="formObj.mail_type === 'forward'"
                                v-model="formObj.forward_to"
                                :required="true"
                                label="Forward To"
                                name="forward_to"/>

                    <input-text v-if="formObj.mail_type === 'mailbox'"
                                v-model="formObj.quota"
                                :required="true"
                                label="Quota"
                                name="quota"/>

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
import { InputSelect, InputText, StaticData } from "@/components";
import { useAuth, useAdminCompanyMail } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { number, object, string } from "yup";

export default defineComponent({
    name: "TheProfile",
    components: {
        Form,
        InputSelect,
        InputText,
        StaticData
    },
    setup() {
        const { hasPermForm } = useAuth();

        const { getChoices, getProfile, localCompanyMail, updateProfile } = useAdminCompanyMail();

        const route = useRoute();

        const choices = computed(() => {
            return localCompanyMail.choices;
        });

        const formErrors = computed(() => {
            return localCompanyMail.formErrors;
        });

        const formObj = computed(() => {
            return localCompanyMail.formObj;
        });

        const formSuccess = computed(() => {
            return localCompanyMail.formSuccess;
        });

        const mailId = route.params.id.toString();

        const schema = object({
            account: number().required(),
            forward_to: string().email(),
            quota: number().positive().integer()
        });

        onMounted(() => {
            getChoices();

            getProfile(mailId);

            hasPermForm('admin_company_mail.change_mail');
        });

        return {
            choices,
            formErrors,
            formObj,
            formSuccess,
            mailId,
            schema,
            updateProfile
        };
    },
    methods: {
        async submitUpdate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.updateProfile(this.mailId, values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Mail account has been updated.',
                    type: 'success'
                });
            }
        }
    }
});
</script>
