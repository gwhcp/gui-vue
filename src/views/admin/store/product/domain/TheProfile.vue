<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Profile</a>

        <router-link :to="{ name: 'admin:store:product:domain:resource', params: { id: productId } }"
                     class="nav-link">Resources
        </router-link>

        <router-link v-if="hasPerm('admin_store_product_price.view_storeproductprice')"
                     :to="{ name: 'admin:store:product:price:search', params: { productId: productId, type: 'domain' } }"
                     class="nav-link">Prices
        </router-link>
    </nav>

    <Form :validation-schema="schema"
          @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <static-data :value="formObj.id"
                                 name="Product ID"/>

                    <static-data :datetime="formObj.date_from"
                                 name="Created Date"/>

                    <static-data v-if="formObj.company"
                                 :ahref="{ name: 'admin:company:company:profile', params: { id: formObj.company } }"
                                 :value="formObj.company_name"
                                 name="Company"
                                 permission="admin_company_company.view_company"/>

                    <static-data :value="formObj.name"
                                 name="Name"/>

                    <static-data :value="formObj.hardware_type_name"
                                 name="Hardware Type"/>

                    <static-data :value="formObj.product_type_name"
                                 name="Product Type"/>

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
import { InputSwitch, StaticData } from "@/components";
import { useAuth, useAdminStoreProductDomain } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { boolean, object } from "yup";

export default defineComponent({
    name: "TheProfile",
    components: {
        Form,
        InputSwitch,
        StaticData
    },
    setup() {
        const { hasPerm, hasPermForm } = useAuth();

        const { getProfile, localStoreProductDomain, updateProfile } = useAdminStoreProductDomain();

        const route = useRoute();

        const formErrors = computed(() => {
            return localStoreProductDomain.formErrors;
        });

        const formObj = computed(() => {
            return localStoreProductDomain.formObj;
        });

        const formSuccess = computed(() => {
            return localStoreProductDomain.formSuccess;
        });

        const productId = route.params.id.toString();

        const schema = object({
            is_active: boolean()
        });

        onMounted(() => {
            getProfile(productId);

            hasPermForm('store_product.change_storeproduct');
        });

        return {
            formErrors,
            formObj,
            formSuccess,
            hasPerm,
            productId,
            schema,
            updateProfile
        };
    },
    methods: {
        async submitUpdate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.updateProfile(this.productId, values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Domain hosting product has been updated.',
                    type: 'success'
                });
            }
        }
    }
});
</script>
