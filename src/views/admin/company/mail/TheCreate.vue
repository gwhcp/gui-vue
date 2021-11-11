<template>
    <Form :validation-schema="schema"
          @submit="submitCreate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <input-select v-model="formObj.account"
                                  :options="choices.account"
                                  :required="true"
                                  label="Account"
                                  name="account"/>

                    <input-select v-model="formObj.company"
                                  :options="choices.company"
                                  :required="true"
                                  label="Company"
                                  name="company"/>

                    <input-select v-model="formObj.domain"
                                  :options="choices.domain"
                                  :required="true"
                                  label="Domain"
                                  name="domain"/>

                    <input-select v-model="formObj.mail_type"
                                  :options="choices.type"
                                  :required="true"
                                  label="Type"
                                  name="mail_type"
                                  @input="typeChange(formObj.mail_type)"/>

                    <input-text v-model="formObj.name"
                                :required="true"
                                label="Name"
                                name="name"/>

                    <input-text v-if="is_forward"
                                v-model="formObj.forward_to"
                                :required="true"
                                label="Forward To"
                                name="forward_to"/>

                    <input-text v-if="is_mailbox"
                                v-model="formObj.password"
                                :required="true"
                                label="Password"
                                name="password"
                                type="password"/>

                    <input-text v-if="is_mailbox"
                                v-model="formObj.quota"
                                :required="true"
                                label="Quota"
                                name="quota"/>

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
import { InputSelect, InputText } from "@/components";
import { useAdminCompanyMail } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted, ref } from "vue";
import { number, object, string } from "yup";

export default defineComponent({
    name: "TheCreate",
    components: {
        Form,
        InputSelect,
        InputText
    },
    setup() {
        const { createMail, getChoices, localCompanyMail } = useAdminCompanyMail();

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

        const is_forward = ref(false);

        const is_mailbox = ref(false);

        const schema = object({
            account: number().required(),
            company: number().required(),
            domain: number().required(),
            mail_type: string().required(),
            name: string().required(),
            forward_to: string().when('mail_type', {
                is: 'forward',
                then: string().required().email()
            }),
            password: string().when('mail_type', {
                is: 'mailbox',
                then: string().required().min(5)
            }),
            quota: string().when('mail_type', {
                is: 'mailbox',
                then: number().required()
            })
        });

        onMounted(() => {
            getChoices();
        });

        return {
            choices,
            createMail,
            formErrors,
            formObj,
            formSuccess,
            is_forward,
            is_mailbox,
            schema
        };
    },
    methods: {
        async submitCreate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.createMail(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Mail account has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'admin:company:mail:search'
                });
            }
        },
        typeChange(value: string) {
            switch (value) {
                case 'forward':
                    this.is_forward = true;
                    this.is_mailbox = false;

                    break;

                case 'mailbox':
                    this.is_forward = false;
                    this.is_mailbox = true;

                    break;
            }
        }
    }
});
</script>
