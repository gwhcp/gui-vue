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
          @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <static-data :value="formObj.store_product"
                                 name="Product ID"/>

                    <static-data :value="formObj.id"
                                 name="Price ID"/>

                    <static-data :datetime="formObj.date_from"
                                 name="Created Date"/>

                    <static-data :text_right="'Month(s)'"
                                 :value="formObj.billing_cycle"
                                 name="Billing Cycle"/>

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

                    <input-switch v-model="formObj.is_active"
                                  label="Status"
                                  name="is_active"/>

                    <input-switch v-model="formObj.is_hidden"
                                  label="Hidden"
                                  name="is_hidden"/>

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
import { InputSwitch, InputText, StaticData } from "@/components";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted } from "vue";
import { boolean, number, object } from "yup";
import { useAuth, useAdminStoreProduct, useAdminStoreProductPrice } from "@/composables";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "TheProfile",
    components: {
        Form,
        InputSwitch,
        InputText,
        StaticData
    },
    setup() {
        const { hasPermForm } = useAuth();

        const route = useRoute();

        const { getProductUrl } = useAdminStoreProduct();

        const { getProfile, localStoreProductPrice, updateProfile } = useAdminStoreProductPrice();

        const formErrors = computed(() => {
            return localStoreProductPrice.formErrors;
        });

        const formObj = computed(() => {
            return localStoreProductPrice.formObj;
        });

        const formSuccess = computed(() => {
            return localStoreProductPrice.formSuccess;
        });

        const priceId = route.params.id.toString();

        const productId = route.params.productId.toString();

        const productType = route.params.type.toString();

        const schema = object({
            base_price: number().required(),
            setup_price: number().required(),
            is_active: boolean(),
            is_hidden: boolean()
        });

        onMounted(() => {
            getProfile(priceId, productId);

            hasPermForm('admin_store_product_price.change_storeproductprice');
        });

        return {
            formErrors,
            formObj,
            formSuccess,
            getProductUrl,
            priceId,
            productId,
            productType,
            schema,
            updateProfile
        };
    },
    methods: {
        async submitUpdate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.updateProfile(this.priceId, this.productId, values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Product price has been updated.',
                    type: 'success'
                });
            }
        }
    }
});
</script>
