<template>
    <Form :validation-schema="schema"
          @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <input-text v-model="formObj.old_password"
                                :required="true"
                                label="Old Password"
                                name="old_password"
                                type="password"/>

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
import { InputText } from "@/components";
import { useAdminEmployeeAccount } from "@/composables";
import { Form } from "vee-validate";
import { defineComponent } from "vue";
import { object, ref, string } from "yup";

export default defineComponent({
    name: "ThePassword",
    components: {
        Form,
        InputText
    },
    setup() {
        const { formErrors, formObj, formSuccess, updatePassword } = useAdminEmployeeAccount();

        const schema = object({
            confirmed_password: string().required().min(5).oneOf([ref('password'), null], 'Password must match'),
            old_password: string().required().min(5),
            password: string().required().min(5)
        });

        return {
            formErrors,
            formObj,
            formSuccess,
            schema,
            updatePassword
        };
    },
    methods: {
        async submitUpdate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.updatePassword(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Account password has been updated.',
                    type: 'success'
                });
            }
        }
    }
});
</script>
