<template>
    <Form :validation-schema="schema"
          @submit="submitCreate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <input-select v-model="formObj.company"
                                  :options="choices.company"
                                  :required="true"
                                  label="Company"
                                  name="company"/>

                    <input-text v-model="formObj.name"
                                :required="true"
                                label="Name"
                                name="name"/>

                    <input-switch v-model="formObj.has_cron"
                                  label="Cron"
                                  name="has_cron"/>

                    <input-switch v-model="formObj.has_mail"
                                  label="Mail"
                                  name="has_mail"/>

                    <input-switch v-model="formObj.has_mysql"
                                  label="MySQL"
                                  name="has_mysql"/>

                    <input-switch v-model="formObj.has_postgresql"
                                  class-name="mb-3"
                                  label="PostgreSQL"
                                  name="has_postgresql"/>

                    <input-select v-model="formObj.ipaddress_type"
                                  :options="choices.ip_type"
                                  :required="true"
                                  label="IP Address Type"
                                  name="ipaddress_type"/>

                    <input-select v-model="formObj.web_type"
                                  :options="choices.web"
                                  :required="true"
                                  label="Web Type"
                                  name="web_type"/>

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
import { InputSelect, InputSwitch, InputText } from "@/components";
import { useAdminStoreProduct, useAdminStoreProductDomain } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted } from "vue";
import { boolean, number, object, string } from "yup";

export default defineComponent({
    name: "TheCreate",
    components: {
        Form,
        InputSelect,
        InputSwitch,
        InputText
    },
    setup() {
        const { getChoices, localStoreProduct } = useAdminStoreProduct();

        const { createProduct, localStoreProductDomain } = useAdminStoreProductDomain();

        const choices = computed(() => {
            return localStoreProduct.choices;
        });

        const formErrors = computed(() => {
            return localStoreProductDomain.formErrors;
        });

        const formObj = computed(() => {
            return localStoreProductDomain.formObj;
        });

        const formSuccess = computed(() => {
            return localStoreProductDomain.formSuccess;
        });

        const schema = object({
            company: number().required(),
            name: string().required(),
            has_cron: boolean(),
            has_mail: boolean(),
            has_mysql: boolean(),
            has_postgresql: boolean(),
            ipaddress_type: string().required(),
            web_type: string().required()
        });

        onMounted(() => {
            getChoices();
        });

        return {
            choices,
            createProduct,
            formErrors,
            formObj,
            formSuccess,
            schema
        };
    },
    methods: {
        async submitCreate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.createProduct(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Domain hosting product has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'admin:store:product:domain:search'
                });
            }
        }
    }
});
</script>
