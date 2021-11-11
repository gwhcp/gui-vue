<template>
    <Form :validation-schema="schema"
          @submit="submitCreate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <input-select v-model="formObj.account_id"
                                  :options="choices.account"
                                  :required="true"
                                  label="Account"
                                  name="account_id"/>

                    <input-select v-model="formObj.group"
                                  :options="choices.group"
                                  :required="true"
                                  label="Group"
                                  name="group"/>

                    <input-text v-model="formObj.password"
                                :required="true"
                                label="Password"
                                name="password"
                                type="password"/>

                    <input-select v-model="formObj.server_id"
                                  :options="choices.server"
                                  :required="true"
                                  label="Server"
                                  name="server_id"/>

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
import { useAdminCompanyXmpp } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted } from "vue";
import { number, object, string } from "yup";

export default defineComponent({
    name: "TheCreateAccount",
    components: {
        Form,
        InputSelect,
        InputText
    },
    setup() {
        const { createAccount, getChoices, localCompanyXmpp } = useAdminCompanyXmpp();

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
            account_id: number().required(),
            group: number().required(),
            password: string().required().min(5),
            server_id: number().required()
        });

        onMounted(() => {
            getChoices();
        });

        return {
            choices,
            createAccount,
            formErrors,
            formObj,
            formSuccess,
            schema
        };
    },
    methods: {
        async submitCreate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.createAccount(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'XMPP account has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'admin:company:xmpp:search'
                });
            }
        }
    }
});
</script>
