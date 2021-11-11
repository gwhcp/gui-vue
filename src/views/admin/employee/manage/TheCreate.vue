<template>
    <Form :validation-schema="schema"
          @submit="submitCreate">
        <div class="row">
            <div class="col-lg-6 mb-3">
                <div class="card card-body">
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
                </div>
            </div>

            <div class="col-lg-6">
                <div class="card card-body">
                    <input-text v-model="formObj.email"
                                :required="true"
                                label="Email"
                                name="email"/>

                    <input-text v-model="formObj.password"
                                :required="true"
                                label="Password"
                                name="password"
                                type="password"/>

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
import { InputSelectCountry, InputSelectState, InputText } from "@/components";
import { useAdminEmployeeManage } from "@/composables";
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
        const { createAccount, localEmployeeManage } = useAdminEmployeeManage();

        const formErrors = computed(() => {
            return localEmployeeManage.formErrors;
        });

        const formObj = computed(() => {
            return localEmployeeManage.formObj;
        });

        const formSuccess = computed(() => {
            return localEmployeeManage.formSuccess;
        });

        const schema = object({
            first_name: string().required(),
            last_name: string().required(),
            address: string().required(),
            city: string().required(),
            country: string().required(),
            state: string().required(),
            zipcode: string().required(),
            primary_phone: number().required().positive().integer(),
            secondary_phone: number().positive().integer().nullable(),
            email: string().required().email(),
            password: string().required().min(5)
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
                    message: 'Employee profile has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'admin:employee:manage:search'
                });
            }
        }
    }
});
</script>
