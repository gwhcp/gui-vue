<template>
    <Form :validation-schema="schema"
          @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <static-data :value="formObj.id"
                                 name="Email Template ID"/>

                    <static-data :datetime="formObj.date_from"
                                 name="Created Date"/>

                    <static-data :value="formObj.template_name"
                                 name="Template"/>

                    <input-text v-model="formObj.sender"
                                :required="true"
                                label="Sender"
                                name="sender"/>

                    <input-text v-model="formObj.subject"
                                :required="true"
                                label="Subject"
                                name="subject"/>

                    <input-wysiwyg v-model="formObj.body"
                                   :required="true"
                                   label="Body"
                                   name="body"/>

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
import { InputText, InputWysiwyg, StaticData } from "@/components";
import { useAuth, useAdminSettingEmail } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { object, string } from "yup";

export default defineComponent({
    name: "TheProfile",
    components: {
        Form,
        InputText,
        InputWysiwyg,
        StaticData
    },
    setup() {
        const { hasPermForm } = useAuth();

        const { getProfile, localSettingEmail, updateProfile } = useAdminSettingEmail();

        const route = useRoute();

        const formErrors = computed(() => {
            return localSettingEmail.formErrors;
        });

        const formObj = computed(() => {
            return localSettingEmail.formObj;
        });

        const formSuccess = computed(() => {
            return localSettingEmail.formSuccess;
        });

        const schema = object({
            body: string().required(),
            sender: string().required().email(),
            subject: string().required()
        });

        const templateId = route.params.id.toString();

        onMounted(() => {
            getProfile(templateId);

            hasPermForm('admin_setting_email.change_emailtemplate');
        });

        return {
            formErrors,
            formObj,
            formSuccess,
            schema,
            templateId,
            updateProfile
        };
    },
    methods: {
        async submitUpdate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.updateProfile(this.templateId, values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Email template has been updated.',
                    type: 'success'
                });
            }
        }
    }
});
</script>
