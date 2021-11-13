<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <router-link :to="{ name: getProductUrl(productType, 'profile'), params: { id: productId } }"
                     class="nav-link">Profile
        </router-link>

        <router-link :to="{ name: getProductUrl(productType, 'resource'), params: { id: productId } }"
                     class="nav-link">Resources
        </router-link>

        <router-link :to="{ name: 'admin:store:product:price:search', params: { productId: productId, type: productType } }"
                     class="nav-link">Prices
        </router-link>
    </nav>

    <Form :validation-schema="schema"
          @submit="submitCreate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <static-data :value="productId"
                                 name="Product ID"/>

                    <input-text v-model="formObj.billing_cycle"
                                :required="true"
                                label="Billing Cycle"
                                name="billing_cycle"/>

                    <input-text v-model="formObj.base_price"
                                :required="true"
                                label="Base Price"
                                name="base_price"/>

                    <input-text v-model="formObj.setup_price"
                                :required="true"
                                label="Setup Price"
                                name="setup_price"/>

                    <static-data v-if="parseFloat(formObj.base_price) || parseFloat(formObj.setup_price)"
                                 :value="parseFloat(formObj.base_price) + parseFloat(formObj.setup_price)"
                                 name="Total"/>

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
import { InputText, StaticData } from "@/components";
import { useAdminStoreProduct, useAdminStoreProductPrice } from "@/composables";
import { Form } from "vee-validate";
import { defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { number, object } from "yup";

export default defineComponent({
    name: "TheCreate",
    components: {
        Form,
        InputText,
        StaticData
    },
    setup() {
        const { getProductUrl } = useAdminStoreProduct();

        const { createPrice, formErrors, formObj, formSuccess } = useAdminStoreProductPrice();

        const route = useRoute();

        const productId = route.params.productId.toString();

        const productType = route.params.type.toString();

        const schema = object({
            base_price: number().required(),
            billing_cycle: number().required().integer().positive(),
            setup_price: number().required()
        });

        onMounted(() => {
            formObj.value.billing_cycle = 0;

            formObj.value.base_price = '0.00';

            formObj.value.setup_price = '0.00';
        });

        return {
            createPrice,
            formErrors,
            formObj,
            formSuccess,
            getProductUrl,
            productId,
            productType,
            schema
        };
    },
    methods: {
        async submitCreate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            values['store_product'] = this.productId;

            await this.createPrice(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Product price has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'admin:store:product:price:search',
                    params: {
                        productId: this.productId,
                        type: this.productType
                    }
                });
            }
        }
    }
});
</script>
