<template>
    <Form :validation-schema="schema"
          @submit="submitCreate">
        <div class="row">
            <div class="col-lg-6 mb-3">
                <div class="card card-body">
                    <input-text v-model="formObj.name"
                                :required="true"
                                help-text="Can be any name to help identify this profile"
                                label="Name"
                                name="name"/>

                    <input-text v-model="formObj.address"
                                :required="true"
                                label="Address"
                                name="address"/>

                    <input-text v-model="formObj.city"
                                :required="true"
                                label="City"
                                name="city"/>

                    <input-select-country v-model="formObj.country"
                                          :required="true"
                                          label="Country"
                                          name="country"/>

                    <input-select-state v-model="formObj.state"
                                        v-model:region="formObj.state"
                                        :country="formObj.country"
                                        :required="true"
                                        label="State"
                                        name="state"/>

                    <input-text v-model="formObj.zipcode"
                                :required="true"
                                label="Zipcode"
                                name="zipcode"/>

                    <input-text v-model="formObj.primary_phone"
                                :required="true"
                                label="Primary Phone"
                                name="primary_phone"/>
                </div>
            </div>

            <div class="col-lg-6 mb-3">
                <div class="card card-body">
                    <input-text v-model="formObj.credit_card_name"
                                :required="true"
                                label="Name on Credit Card"
                                name="credit_card_name"/>

                    <input-text v-model="formObj.credit_card_number"
                                :required="true"
                                label="Credit Card Number"
                                name="credit_card_number"/>

                    <div class="row">
                        <div class="col-lg-6">
                            <input-text v-model="formObj.credit_card_month"
                                        :required="true"
                                        label="Expiration Month"
                                        name="credit_card_month"/>
                        </div>

                        <div class="col-lg-6">
                            <input-text v-model="formObj.credit_card_year"
                                        :required="true"
                                        label="Expiration Year"
                                        name="credit_card_year"/>
                        </div>
                    </div>

                    <input-text v-model="formObj.credit_card_cvv2"
                                :required="true"
                                label="CVV2"
                                name="credit_card_cvv2"/>

                    <div class="col-6">
                        <div v-if="nonFieldFormError"
                             class="text-danger mb-3">
                            {{ nonFieldFormMessage }}
                        </div>

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
import { InputSelectCountry, InputSelectState, InputText } from "@/components";
import { useClientBilling } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent } from "vue";
import { number, object, string } from "yup";

export default defineComponent({
    name: "TheCreate",
    components: {
        Form,
        InputSelectCountry,
        InputSelectState,
        InputText
    },
    setup() {
        const { createBillingProfile, localClientBilling } = useClientBilling();

        const formErrors = computed(() => {
            return localClientBilling.formErrors;
        });

        const formObj = computed(() => {
            return localClientBilling.formObj;
        });

        const formSuccess = computed(() => {
            return localClientBilling.formSuccess;
        });

        const nonFieldFormError = computed(() => {
            return localClientBilling.nonFieldFormError;
        });

        const nonFieldFormMessage = computed(() => {
            return localClientBilling.nonFieldFormMessage;
        });

        const schema = object({
            name: string().required(),
            address: string().required(),
            city: string().required(),
            country: string().required(),
            state: string().required(),
            zipcode: string().required(),
            primary_phone: number().required().positive().integer(),
            credit_card_name: string().required(),
            credit_card_number: string().required().min(15).max(16),
            credit_card_month: string().required().length(2),
            credit_card_year: string().required().length(4),
            credit_card_cvv2: string().required().min(3).max(4)
        });

        return {
            createBillingProfile,
            formErrors,
            formObj,
            formSuccess,
            nonFieldFormError,
            nonFieldFormMessage,
            schema
        };
    },
    methods: {
        async submitCreate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.createBillingProfile(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Billing profile has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'client:billing:search'
                });
            }
        }
    }
});
</script>
