<template>
    <Form :validation-schema="schema"
          @submit="submitCreate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <input-text v-model="formObj.name"
                                :required="true"
                                label="Name"
                                name="name"/>

                    <input-select v-model="formObj.fraud_type"
                                  :options="choices"
                                  :required="true"
                                  label="Type"
                                  name="fraud_type"/>

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
import { useAdminStoreFraud } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted } from "vue";
import { object, string } from "yup";

export default defineComponent({
    name: "TheCreate",
    components: {
        Form,
        InputSelect,
        InputText
    },
    setup() {
        const { createFraudString, getChoices, localStoreFraud } = useAdminStoreFraud();

        const choices = computed(() => {
            return localStoreFraud.choices;
        });

        const formErrors = computed(() => {
            return localStoreFraud.formErrors;
        });

        const formObj = computed(() => {
            return localStoreFraud.formObj;
        });

        const formSuccess = computed(() => {
            return localStoreFraud.formSuccess;
        });

        const schema = object({
            name: string().required(),
            fraud_type: string().required()
        });

        onMounted(() => {
            getChoices();
        });

        return {
            choices,
            createFraudString,
            formErrors,
            formObj,
            formSuccess,
            schema
        };
    },
    methods: {
        async submitCreate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.createFraudString(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Fraud string has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'admin:store:fraud:search'
                });
            }
        }
    }
});
</script>
