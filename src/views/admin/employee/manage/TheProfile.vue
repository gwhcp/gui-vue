<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Profile</a>

        <router-link :to="{ name: 'admin:employee:manage:permission', params: { id: accountId } }"
                     class="nav-link">Permissions
        </router-link>

        <router-link :to="{ name: 'admin:employee:manage:accesslog', params: { id: accountId } }"
                     class="nav-link">Access Logs
        </router-link>
    </nav>

    <Form :validation-schema="schema"
          @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6">
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
import { InputSelectCountry, InputSelectState, InputText, StaticData } from "@/components";
import { useAdminEmployeeManage, useAuth } from "@/composables";
import { Form } from "vee-validate";
import { defineComponent, onMounted } from "vue";
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
        const { formErrors, formObj, formSuccess, getProfile, updateProfile } = useAdminEmployeeManage();

        const { hasPermForm } = useAuth();

        const route = useRoute();

        const accountId = route.params.id.toString();

        const schema = object({
            address: string().required(),
            city: string().required(),
            country: string().required(),
            email: string().required().email(),
            first_name: string().required(),
            last_name: string().required(),
            primary_phone: number().required().positive().integer(),
            secondary_phone: number().positive().integer().nullable(),
            state: string().required(),
            zipcode: string().required()
        });

        onMounted(() => {
            getProfile(accountId);

            hasPermForm('admin_employee_manage.change_account');
        });

        return {
            accountId,
            formErrors,
            formObj,
            formSuccess,
            schema,
            updateProfile
        };
    },
    methods: {
        async submitUpdate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.updateProfile(this.accountId, values);

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
