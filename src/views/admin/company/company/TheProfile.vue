<template>
    <Form :validation-schema="schema"
          @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <static-data :value="formObj.id"
                                 name="Company ID"/>

                    <static-data :datetime="formObj.date_from"
                                 name="Created Date"/>

                    <input-text v-model="formObj.name"
                                :required="true"
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

                    <input-text v-model="formObj.secondary_phone"
                                :required="false"
                                label="Secondary Phone"
                                name="secondary_phone"/>

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
import { StaticData } from "@/components";
import { InputSelectCountry, InputSelectState, InputText } from "@/components/form"
import { useAdminCompanyCompany, useAuth } from "@/composables";
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
        const { formErrors, formObj, formSuccess, getProfile, updateProfile } = useAdminCompanyCompany();

        const { hasPermForm } = useAuth();

        const route = useRoute();

        const companyId = route.params.id.toString();

        const schema = object({
            address: string().required(),
            city: string().required(),
            country: string().required(),
            name: string().required(),
            primary_phone: number().required().positive().integer(),
            secondary_phone: number().positive().integer().nullable(),
            state: string().required(),
            zipcode: string().required()
        });

        onMounted(() => {
            getProfile(companyId);

            hasPermForm('admin_company_company.change_company');
        });

        return {
            companyId,
            formErrors,
            formObj,
            formSuccess,
            schema,
            updateProfile
        };
    },
    methods: {
        async submitUpdate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.updateProfile(this.companyId, values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Company profile has been updated.',
                    type: 'success'
                });
            }
        }
    }
});
</script>
