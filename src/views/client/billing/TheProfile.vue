<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Profile</a>

        <router-link :to="{ name: 'client:billing:invoice:search', params: { id: profileId } }"
                     class="nav-link">Search Invoices
        </router-link>
    </nav>

    <Form :validation-schema="schema"
          @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6 mb-3">
                <div class="card card-body">
                    <static-data :value="formObj.id"
                                 name="Billing Profile ID"/>

                    <static-data :datetime="formObj.date_from"
                                 name="Created Date"/>

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

            <div class="col-lg-6">
                <div class="card card-body">
                    <static-data :value="formObj.credit_card_name"
                                 name="Name on Credit Card"/>

                    <static-data :value="formObj.credit_card_number"
                                 name="Credit Card Number"/>

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
import { InputSelectCountry, InputSelectState, InputText, StaticData } from "@/components";
import { useAuth, useClientBilling } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { number, object, string } from "yup";

export default defineComponent({
    name: "TheProfile",
    components: {
        Form,
        InputSelectCountry,
        InputSelectState,
        InputText,
        StaticData
    },
    setup() {
        const { hasPermForm } = useAuth();

        const { getProfile, localClientBilling, updateProfile } = useClientBilling();

        const route = useRoute();

        const profileId = route.params.id.toString();

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
            credit_card_month: string().required().length(2),
            credit_card_year: string().required().length(4),
            credit_card_cvv2: string().required().min(3).max(4)
        });

        onMounted(() => {
            getProfile(profileId);

            hasPermForm('client_billing.change_billingprofile');
        });

        return {
            formErrors,
            formObj,
            formSuccess,
            nonFieldFormError,
            nonFieldFormMessage,
            profileId,
            schema,
            updateProfile
        };
    },
    methods: {
        async submitUpdate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.updateProfile(this.profileId, values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Billing profile has been updated.',
                    type: 'success'
                });
            }
        }
    }
});
</script>