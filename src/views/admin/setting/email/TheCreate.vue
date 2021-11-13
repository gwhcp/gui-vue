<template>
    <Form :validation-schema="schema"
          @submit="submitCreate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <input-text v-model="formObj.sender"
                                :required="true"
                                label="Sender"
                                name="sender"/>

                    <input-select v-model="formObj.template"
                                  :options="choices"
                                  :required="true"
                                  label="Template"
                                  name="template"/>

                    <input-text v-model="formObj.subject"
                                :required="true"
                                label="Subject"
                                name="subject"/>

                    <input-wysiwyg v-model="formObj.body"
                                   :required="true"
                                   label="Body"
                                   name="body"/>

                    <div class="col-6">
                        <button class="btn btn-outline-success px-4"
                                type="submit">Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Form>
</template>

<script lang="ts">
import { InputSelect, InputText, InputWysiwyg } from "@/components";
import { useAdminSettingEmail } from "@/composables";
import { Form } from "vee-validate";
import { defineComponent, onMounted } from "vue";
import { object, string } from "yup";

export default defineComponent({
    name: "TheCreate",
    components: {
        Form,
        InputSelect,
        InputText,
        InputWysiwyg
    },
    setup() {
        const { choices, createEmailTemplate, formErrors, formObj, formSuccess, getChoices } = useAdminSettingEmail();

        const schema = object({
            body: string().required(),
            sender: string().required().email(),
            subject: string().required(),
            template: string().required()
        });

        onMounted(() => {
            getChoices();
        });

        return {
            choices,
            createEmailTemplate,
            formErrors,
            formObj,
            formSuccess,
            schema
        };
    },
    methods: {
        async submitCreate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.createEmailTemplate(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Email template has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'admin:setting:email:search'
                });
            }
        }
    }
});
</script>
