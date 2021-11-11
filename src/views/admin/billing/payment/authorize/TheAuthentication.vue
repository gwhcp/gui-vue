<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <router-link v-if="formObj.merchant"
                     :to="{ name: 'admin:billing:payment:profile', params: { id: paymentId } }"
                     class="nav-link">Profile
        </router-link>

        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Authentication</a>

        <router-link v-if="formObj.merchant"
                     :to="{ name: `admin:billing:payment:${formObj.merchant}:method`, params: { id: paymentId } }"
                     class="nav-link">Payment Method
        </router-link>
    </nav>

    <Form :validation-schema="schema"
          @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <input-text v-model="formObj.login_id"
                                :required="true"
                                label="Login ID"
                                name="login_id"/>

                    <input-text v-model="formObj.transaction_key"
                                :required="true"
                                label="Transaction Key"
                                name="transaction_key"/>

                    <input-switch v-model="formObj.in_test_mode"
                                  label="Test Mode"
                                  name="in_test_mode"/>

                    <input-switch v-model="formObj.is_active"
                                  label="Status"
                                  name="is_active"/>

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
import { InputSwitch, InputText } from "@/components"
import { useAuth, useAdminBillingPayment } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted } from "vue";
import { boolean, object, string } from "yup";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "TheProfile",
    components: {
        Form,
        InputSwitch,
        InputText
    },
    setup() {
        const { hasPermForm } = useAuth();

        const { getAuthentication, localBillingPayment, updateAuthentication } = useAdminBillingPayment();

        const route = useRoute();

        const formErrors = computed(() => {
            return localBillingPayment.formErrors;
        });

        const formObj = computed(() => {
            return localBillingPayment.formObj;
        });

        const formSuccess = computed(() => {
            return localBillingPayment.formSuccess;
        });

        const paymentId = route.params.id.toString();

        const schema = object({
            login_id: string().required().nullable(),
            transaction_key: string().required().nullable(),
            in_test_mode: boolean(),
            is_active: boolean()
        });

        onMounted(() => {
            getAuthentication(paymentId, 'authorize');

            hasPermForm('admin_billing_payment.change_paymentgateway');
        });

        return {
            formErrors,
            formObj,
            formSuccess,
            hasPermForm,
            paymentId,
            schema,
            updateAuthentication
        };
    },
    methods: {
        async submitUpdate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.updateAuthentication(this.paymentId, 'authorize', values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Authentication has been updated.',
                    type: 'success'
                });
            }
        }
    }
});
</script>
