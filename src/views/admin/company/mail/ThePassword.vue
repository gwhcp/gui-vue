<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <router-link :to="{ name: 'admin:company:mail:profile', params: { id: mailId } }"
                     class="nav-link">Profile
        </router-link>

        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Password</a>
    </nav>

    <Form :validation-schema="schema"
          @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
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
import { useAdminCompanyMail } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { object, ref, string } from "yup";

export default defineComponent({
    name: "ThePassword",
    components: {
        Form,
        InputText
    },
    setup() {
        const { getProfile, localCompanyMail, updatePassword } = useAdminCompanyMail();

        const route = useRoute();

        const formErrors = computed(() => {
            return localCompanyMail.formErrors;
        });

        const formObj = computed(() => {
            return localCompanyMail.formObj;
        });

        const formSuccess = computed(() => {
            return localCompanyMail.formSuccess;
        });

        const mailId = route.params.id.toString();

        const schema = object({
            password: string().required().min(5),
            confirmed_password: string().required().min(5).oneOf([ref('password'), null], 'Password must match')
        });

        onMounted(() => {
            getProfile(mailId);
        });

        return {
            formErrors,
            formObj,
            formSuccess,
            mailId,
            schema,
            updatePassword
        };
    },
    methods: {
        async submitUpdate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.updatePassword(this.mailId, values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Mail account has been updated.',
                    type: 'success'
                });
            }
        }
    }
});
</script>
