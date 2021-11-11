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

                    <input-select v-model="formObj.reason_type"
                                  :options="choices"
                                  :required="true"
                                  label="Type"
                                  name="reason_type"/>

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
import { InputSelect, InputText } from "@/components"
import { useAdminBillingReason } from "@/composables";
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
        const { createReason, getChoices, localBillingReason } = useAdminBillingReason();

        const choices = computed(() => {
            return localBillingReason.choices;
        });

        const formErrors = computed(() => {
            return localBillingReason.formErrors;
        });

        const formObj = computed(() => {
            return localBillingReason.formObj;
        });

        const formSuccess = computed(() => {
            return localBillingReason.formSuccess;
        });

        const schema = object({
            name: string().required(),
            reason_type: string().required()
        });

        onMounted(() => {
            getChoices();
        });

        return {
            choices,
            createReason,
            formErrors,
            formObj,
            formSuccess,
            schema
        };
    },
    methods: {
        async submitCreate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.createReason(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Reason has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'admin:billing:reason:search'
                });
            }
        }
    }
});
</script>
