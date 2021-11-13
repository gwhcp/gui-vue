<template>
    <Form :validation-schema="schema"
          @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6 mb-3">
                <div class="card card-body">
                    <static-data :value="formObj.id"
                                 name="Account ID"/>

                    <static-data :datetime="formObj.date_from"
                                 name="Created Date"/>

                    <input-text v-model="formObj.first_name"
                                :required="true"
                                label="First Name"
                                name="first_name"/>

                    <input-text v-model="formObj.last_name"
                                :required="true"
                                label="Last Name"
                                name="last_name"/>

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

                    <input-text v-model="formObj.secondary_phone"
                                :required="false"
                                label="Secondary Phone"
                                name="secondary_phone"/>

                    <input-text v-model="formObj.email"
                                :required="true"
                                label="Email"
                                name="email"/>
                </div>
            </div>

            <div class="col-lg-6">
                <div class="card card-body">
                    <input-select v-model="formObj.comment_order"
                                  :options="choices.comment"
                                  :required="true"
                                  label="Comment Order"
                                  name="comment_order"/>

                    <input-select v-model="formObj.time_format"
                                  :options="choices.timeformat"
                                  :required="true"
                                  label="Time Format"
                                  name="time_format"/>

                    <input-select v-model="formObj.time_zone"
                                  :options="choices.timezone"
                                  :required="true"
                                  label="Time Zone"
                                  name="time_zone"/>

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
import { InputSelect, InputSelectCountry, InputSelectState, InputText, StaticData } from "@/components";
import { useAuth, useClientAccount } from "@/composables";
import { Form } from "vee-validate";
import { defineComponent, onMounted } from "vue";
import { number, object, string } from "yup";

export default defineComponent({
    name: "TheProfile",
    components: {
        Form,
        InputSelect,
        InputSelectCountry,
        InputSelectState,
        InputText,
        StaticData
    },
    setup() {
        const { hasPermForm } = useAuth();

        const { choices, formErrors, formObj, formSuccess, getChoices, getProfile, updateProfile } = useClientAccount();

        const schema = object({
            address: string().required(),
            city: string().required(),
            comment_order: string().required(),
            country: string().required(),
            email: string().required().email(),
            first_name: string().required(),
            last_name: string().required(),
            primary_phone: number().required().positive().integer(),
            secondary_phone: number().positive().integer().nullable(),
            state: string().required(),
            time_format: number().positive().integer().required(),
            time_zone: string().required(),
            zipcode: string().required()
        });

        onMounted(() => {
            getChoices();

            getProfile();

            hasPermForm('client_account.change_account');
        });

        return {
            choices,
            formErrors,
            formObj,
            formSuccess,
            schema,
            updateProfile
        };
    },
    methods: {
        async submitUpdate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.updateProfile(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Account profile has been updated.',
                    type: 'success'
                });
            }
        }
    }
});
</script>