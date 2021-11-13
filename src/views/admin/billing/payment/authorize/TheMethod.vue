<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <router-link v-if="formObj.merchant"
                     :to="{ name: 'admin:billing:payment:profile', params: { id: paymentId } }"
                     class="nav-link">Profile
        </router-link>

        <router-link v-if="formObj.merchant"
                     :to="{ name: `admin:billing:payment:${formObj.merchant}:authentication`, params: { id: paymentId } }"
                     class="nav-link">Authentication
        </router-link>

        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Payment Method</a>
    </nav>

    <Form :validation-schema="schema"
          @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <input-switch v-model="formObj.has_amex"
                                  label="American Express"
                                  name="has_amex"/>

                    <input-switch v-model="formObj.has_discover"
                                  label="Discover"
                                  name="has_discover"/>

                    <input-switch v-model="formObj.has_mastercard"
                                  label="Mastercard"
                                  name="has_mastercard"/>

                    <input-switch v-model="formObj.has_visa"
                                  label="Visa"
                                  name="has_visa"/>

                    <div class="col-6 mt-3">
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
import { InputSwitch } from "@/components"
import { useAdminBillingPayment, useAuth } from "@/composables";
import { Form } from "vee-validate";
import { defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { boolean, object } from "yup";

export default defineComponent({
    name: "TheProfile",
    components: {
        Form,
        InputSwitch
    },
    setup() {
        const {
            formErrors,
            formObj,
            formSuccess,
            getMethod,
            nonFieldFormError,
            nonFieldFormMessage,
            updateMethod
        } = useAdminBillingPayment();

        const { hasPermForm } = useAuth();

        const route = useRoute();

        const paymentId = route.params.id.toString();

        const schema = object({
            has_amex: boolean(),
            has_discover: boolean(),
            has_mastercard: boolean(),
            has_visa: boolean()
        });

        onMounted(() => {
            getMethod(paymentId, 'authorize');

            hasPermForm('admin_billing_payment.change_paymentgateway');
        });

        return {
            formErrors,
            formObj,
            formSuccess,
            nonFieldFormError,
            nonFieldFormMessage,
            paymentId,
            schema,
            updateMethod
        };
    },
    methods: {
        async submitUpdate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.updateMethod(this.paymentId, 'authorize', values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            }

            if (!this.nonFieldFormError) {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Methods have been updated.',
                    type: 'success'
                });
            } else {
                this.$emitter.emit('alert', {
                    display: this.formErrors,
                    message: this.nonFieldFormMessage,
                    type: 'info'
                });
            }
        }
    }
});
</script>
