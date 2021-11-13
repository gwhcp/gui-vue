<template>
    <Form :validation-schema="schema"
          @submit="submitCreate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <input-select v-model="formObj.merchant"
                                  :options="choices.merchant"
                                  :required="true"
                                  label="Merchant"
                                  name="merchant"
                                  @input="setMethod(formObj.merchant)"/>

                    <input-select v-if="method"
                                  v-model="formObj.payment_method"
                                  :options="methods"
                                  :required="true"
                                  label="Method"
                                  name="payment_method"/>

                    <input-select v-model="formObj.company"
                                  :options="choices.company"
                                  :required="true"
                                  label="Company"
                                  name="company"/>

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
import { InputSelect } from "@/components"
import { useAdminBillingPayment } from "@/composables";
import { Form } from "vee-validate";
import { defineComponent, onMounted, reactive, ref } from "vue";
import { number, object, string } from "yup";

export default defineComponent({
    name: "TheCreate",
    components: {
        Form,
        InputSelect
    },
    setup() {
        const {
            choices,
            createPaymentGateway,
            formErrors,
            formObj,
            formSuccess,
            getChoices
        } = useAdminBillingPayment();

        const method = ref(false);

        const methods: any = reactive({});

        const schema = object({
            company: number().required().positive().integer(),
            merchant: string().required(),
            payment_method: string().required()
        });

        onMounted(() => {
            getChoices();
        });

        return {
            choices,
            createPaymentGateway,
            formErrors,
            formObj,
            formSuccess,
            method,
            methods,
            schema
        };
    },
    methods: {
        setMethod(value: string) {
            switch (value) {
                case 'authorize':
                    this.method = true;

                    this.methods = this.choices['method'];
                    break;

                default:
                    this.method = false;
                    break;

            }
        },
        async submitCreate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.createPaymentGateway(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Payment Gateway has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'admin:billing:payment:search'
                });
            }
        }
    }
});
</script>
