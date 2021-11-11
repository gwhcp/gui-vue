<template>
    <div class="row g-5">
        <div class="col-md-5 col-lg-4 order-md-last">
            <h4 class="d-flex justify-content-between align-items-center mb-3">
                <span class="text-primary">Your cart</span>
            </h4>

            <ul class="list-group mb-3">
                <li class="list-group-item d-flex justify-content-between lh-sm bg-light">
                    <div>
                        <h6 class="my-0">Product name</h6>

                        <small class="text-muted">Brief description</small>
                    </div>
                </li>

                <li class="list-group-item d-flex justify-content-between">
                    <span>Base price (USD)</span>

                    <span class="text-muted">${{ cartPrice['base'] }}</span>
                </li>

                <li class="list-group-item d-flex justify-content-between">
                    <span>Setup fee (USD)</span>

                    <span class="text-muted">${{ cartPrice['setup'] }}</span>
                </li>

                <li class="list-group-item d-flex justify-content-between">
                    <div class="text-success">
                        <h6 class="my-0">Promo code</h6>

                        <small>EXAMPLECODE</small>
                    </div>

                    <span class="text-success">−${{ cartPrice['discount'] }}</span>
                </li>

                <li class="list-group-item d-flex justify-content-between bg-light">
                    <span>Total (USD)</span>

                    <strong>${{ cartPrice['total'] }}</strong>
                </li>
            </ul>

            <form class="card p-2">
                <div class="input-group">
                    <input class="form-control"
                           placeholder="Promo code"
                           type="text">

                    <button class="btn btn-secondary"
                            type="submit">Redeem
                    </button>
                </div>
            </form>
        </div>

        <div class="col-md-7 col-lg-8">
            <Form :validation-schema="schema"
                  @submit="submitCreate">
                <div class="row">
                    <div class="col-lg-6 mb-3">
                        <h4 class="mb-3">Choose a billing plan:</h4>

                        <div class="list-group list-group-checkable">
                            <div v-for="item in formArr"
                                 :key="item">
                                <input-radio-list v-model="formObj.store_product_price"
                                                  :checked=false
                                                  :for-name="`store_product_price${item['id']}`"
                                                  :label="`${item['billing_cycle']} days`"
                                                  :label2="getTotalPrice(item['base_price'], item['setup_price'])"
                                                  :value="`${item['id']}`"
                                                  name="store_product_price"
                                                  @input="setCart(item['base_price'], item['setup_price'])"/>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <h4 class="mb-3">Choose a payment method:</h4>

                        <div class="list-group list-group-checkable">
                            <div v-for="item in billing_profiles"
                                 :key="item">
                                <input-radio-list v-model="formObj.billing_profile"
                                                  :checked=false
                                                  :for-name="`billing_profile${item['id']}`"
                                                  :label="`${item['name']}`"
                                                  :value="`${item['id']}`"
                                                  name="billing_profile"/>
                            </div>
                        </div>
                    </div>
                </div>

                <hr class="my-4">

                <div v-if="nonFieldFormError"
                     class="text-danger mb-3">
                    {{ nonFieldFormMessage }}
                </div>

                <button class="w-100 btn btn-success btn-lg"
                        type="submit">Complete Order
                </button>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { InputRadioList } from "@/components";
import { useClientBilling, useClientStore } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { object, string } from "yup";

export default defineComponent({
    name: "TheCheckout",
    components: {
        Form,
        InputRadioList
    },
    setup() {
        const { getSearch, localClientBilling } = useClientBilling();

        const { createOrder, getProductPrices, localClientStore } = useClientStore();

        const cartPrice = ref({
            'base': '0.00',
            'discount': '0.00',
            'setup': '0.00',
            'total': '0.00'
        });

        const route = useRoute();

        const billing_profiles = computed(() => {
            return localClientBilling.formArr;
        });

        const formArr = computed(() => {
            return localClientStore.formArr;
        });

        const formErrors = computed(() => {
            return localClientStore.formErrors;
        });

        const formObj = computed(() => {
            return localClientStore.formObj;
        });

        const formSuccess = computed(() => {
            return localClientStore.formSuccess;
        });

        const nonFieldFormError = computed(() => {
            return localClientStore.nonFieldFormError;
        });

        const nonFieldFormMessage = computed(() => {
            return localClientStore.nonFieldFormMessage;
        });

        const productId = route.params.id.toString();

        const schema = object({
            billing_profile: string().required(),
            store_product_price: string().required()
        });

        onMounted(() => {
            getSearch();

            getProductPrices(productId);
        });

        return {
            billing_profiles,
            cartPrice,
            createOrder,
            formArr,
            formErrors,
            formObj,
            formSuccess,
            nonFieldFormError,
            nonFieldFormMessage,
            productId,
            schema
        };
    },
    methods: {
        async submitCreate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            values['store_product'] = this.productId;

            await this.createOrder(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Order has been submitted. You will receive an email confirmation once it has been processed',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'home'
                });
            }
        },
        getTotalPrice(base_price: number, setup_price: number) {
            if (setup_price > 0) {
                return `$${base_price} + $${setup_price} setup fee`;
            } else {
                return `$${base_price} with no setup fee`;
            }
        },
        setCart(base_price: string, setup_price: string) {
            const totalPrice = parseFloat(base_price) + parseFloat(setup_price);

            this.cartPrice['base'] = parseFloat(base_price).toFixed(2);
            this.cartPrice['setup'] = parseFloat(setup_price).toFixed(2);
            this.cartPrice['total'] = totalPrice.toFixed(2);
        }
    }
});
</script>

