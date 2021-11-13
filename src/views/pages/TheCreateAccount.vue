<template>
    <div class="container-fluid mx-auto py-3">
        <main>
            <div class="col-md-7">
                <h4 class="mb-3">Create Account</h4>

                <Form :validation-schema="schema"
                      @submit="submitCreate">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <input-text v-model="formObj.first_name"
                                        :required="true"
                                        label="First Name"
                                        name="first_name"/>
                        </div>

                        <div class="col-md-6">
                            <input-text v-model="formObj.last_name"
                                        :required="true"
                                        label="Last Name"
                                        name="last_name"/>
                        </div>

                        <div class="col-md-12">
                            <input-text v-model="formObj.address"
                                        :required="true"
                                        label="Address"
                                        name="address"/>
                        </div>

                        <div class="col-md-12">
                            <input-text v-model="formObj.city"
                                        :required="true"
                                        label="City"
                                        name="city"/>
                        </div>

                        <div class="col-md-4">
                            <input-select-country v-model="formObj.country"
                                                  :required="true"
                                                  label="Country"
                                                  name="country"/>
                        </div>

                        <div class="col-md-4">
                            <input-select-state v-model="formObj.state"
                                                v-model:region="formObj.state"
                                                :country="formObj.country"
                                                :required="true"
                                                label="State"
                                                name="state"/>
                        </div>

                        <div class="col-md-4">
                            <input-text v-model="formObj.zipcode"
                                        :required="true"
                                        label="Zipcode"
                                        name="zipcode"/>
                        </div>

                        <div class="col-md-6">
                            <input-text v-model="formObj.primary_phone"
                                        :required="true"
                                        label="Primary Phone"
                                        name="primary_phone"/>
                        </div>

                        <div class="col-md-6">
                            <input-text v-model="formObj.secondary_phone"
                                        :required="false"
                                        label="Secondary Phone"
                                        name="secondary_phone"/>
                        </div>

                        <div class="col-md-6">
                            <input-text v-model="formObj.email"
                                        :required="true"
                                        label="Email"
                                        name="email"/>
                        </div>

                        <div class="col-md-6">
                            <input-text v-model="formObj.password"
                                        :required="true"
                                        label="Password"
                                        name="password"
                                        type="password"/>
                        </div>

                        <button class="btn btn-outline-success"
                                type="submit">Create
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </div>
</template>

<script lang="ts">
import { InputSelectCountry, InputSelectState, InputText } from "@/components";
import { useClientAccount } from "@/composables";
import { Form } from "vee-validate";
import { defineComponent } from "vue";
import { number, object, string } from "yup";

export default defineComponent({
    name: "TheCreateAccount",
    components: {
        Form,
        InputSelectCountry,
        InputSelectState,
        InputText
    },
    setup() {
        const { createAccount, formErrors, formObj, formSuccess } = useClientAccount();

        const schema = object({
            address: string().required(),
            city: string().required(),
            country: string().required(),
            email: string().required().email(),
            first_name: string().required(),
            last_name: string().required(),
            password: string().required().min(5),
            primary_phone: number().required().positive().integer(),
            secondary_phone: number().positive().integer().nullable(),
            state: string().required(),
            zipcode: string().required()
        });

        return {
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
                    message: 'Account has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'pages:account:login'
                });
            }
        }
    }
});
</script>