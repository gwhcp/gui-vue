<template>
    <Form :validation-schema="schema"
          @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <static-data :value="formObj.id"
                                 name="XMPP ID"/>

                    <static-data :value="formObj.account_id"
                                 name="Account ID"/>

                    <static-data :value="formObj.account_name"
                                 name="Employee Name"/>

                    <static-data :value="`${formObj.account_id}@localhost`"
                                 name="Username"/>

                    <static-data :value="formObj.group_name"
                                 name="Group"/>

                    <static-data :value="formObj.server_name"
                                 name="Server"/>

                    <input-text v-model="formObj.password"
                                :required="true"
                                label="Password"
                                name="password"
                                type="password"/>

                    <input-text v-model="formObj.confirmed_password"
                                :required="true"
                                label="Confirm Password"
                                name="confirmed_password"
                                type="password"/>

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
import { InputText, StaticData } from "@/components";
import { useAuth, useAdminEmployeeXmpp } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted } from "vue";
import { object, ref, string } from "yup";

export default defineComponent({
    name: "TheProfile",
    components: {
        Form,
        InputText,
        StaticData
    },
    setup() {
        const { hasPermForm } = useAuth();

        const { getProfile, localEmployeeXmpp, updateProfile } = useAdminEmployeeXmpp();

        const formErrors = computed(() => {
            return localEmployeeXmpp.formErrors;
        });

        const formObj = computed(() => {
            return localEmployeeXmpp.formObj;
        });

        const formSuccess = computed(() => {
            return localEmployeeXmpp.formSuccess;
        });

        const schema = object({
            password: string().required().min(5),
            confirmed_password: string().required().min(5).oneOf([ref('password'), null], 'Password must match')
        });

        onMounted(() => {
            getProfile();

            hasPermForm('admin_employee_xmpp.change_prosodyaccount');
        });

        return {
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
                    message: 'XMPP password has been updated.',
                    type: 'success'
                });
            }
        }
    }
});
</script>
