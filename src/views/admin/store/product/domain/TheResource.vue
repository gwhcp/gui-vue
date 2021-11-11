<template>
    <div class="alert alert-info d-flex align-items-center"
         role="alert">
        <svg aria-label="Info:"
             class="bi flex-shrink-0 me-2"
             height="24"
             role="img"
             width="24">
            <use xlink:href="#info-fill"/>
        </svg>

        <div>
            If a customer product is associated to this store product then resources can only be upgraded.
        </div>
    </div>

    <nav class="nav nav-pills nav-justified mb-3">
        <router-link :to="{ name: 'admin:store:product:domain:profile', params: { id: productId } }"
                     class="nav-link">Profile
        </router-link>

        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Resources</a>

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
                    <input-text v-model="formObj.bandwidth"
                                :required="true"
                                label="Bandwidth"
                                name="bandwidth"/>

                    <input-text v-model="formObj.diskspace"
                                :required="true"
                                label="Diskspace"
                                name="diskspace"/>

                    <input-text v-model="formObj.domain"
                                :required="true"
                                label="Domain"
                                name="domain"/>

                    <input-text v-model="formObj.sub_domain"
                                :required="true"
                                label="Sub.Domain"
                                name="sub_domain"/>

                    <input-text v-model="formObj.ftp_user"
                                :required="true"
                                label="FTP User"
                                name="ftp_user"/>

                    <input-text v-if="formObj.has_cron"
                                v-model="formObj.cron_tab"
                                :required="true"
                                label="Cron Tab"
                                name="cron_tab"/>

                    <input-text v-if="formObj.ipaddress_type === 'dedicated'"
                                v-model="formObj.ipaddress"
                                :required="true"
                                label="IP Address"
                                name="ipaddress"/>

                    <input-text v-if="formObj.has_mail"
                                v-model="formObj.mail_account"
                                :required="true"
                                label="Mail Account"
                                name="mail_account"/>

                    <input-text v-if="formObj.has_mail"
                                v-model="formObj.mail_list"
                                :required="true"
                                label="Mailing List"
                                name="mail_list"/>

                    <input-text v-if="formObj.has_mysql"
                                v-model="formObj.mysql_database"
                                :required="true"
                                label="MySQL Database"
                                name="mysql_database"/>

                    <input-text v-if="formObj.has_mysql"
                                v-model="formObj.mysql_user"
                                :required="true"
                                label="MySQL User"
                                name="mysql_user"/>

                    <input-text v-if="formObj.has_postgresql"
                                v-model="formObj.postgresql_database"
                                :required="true"
                                label="PostgreSQL Database"
                                name="postgresql_database"/>

                    <input-text v-if="formObj.has_postgresql"
                                v-model="formObj.postgresql_user"
                                :required="true"
                                label="PostgreSQL User"
                                name="postgresql_user"/>

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
import { useAuth, useAdminStoreProductDomain } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { number, object } from "yup";

export default defineComponent({
    name: "TheProfile",
    components: {
        Form,
        InputText
    },
    setup() {
        const { hasPerm, hasPermForm } = useAuth();

        const { getResource, localStoreProductDomain, updateResource } = useAdminStoreProductDomain();

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
            bandwidth: number().required().integer(),
            diskspace: number().required().integer(),
            domain: number().required().integer(),
            sub_domain: number().required().integer(),
            ftp_user: number().required().integer(),
            cron_tab: number().required().integer(),
            ipaddress: number().required().integer(),
            mail_account: number().required().integer(),
            mail_list: number().required().integer(),
            mysql_database: number().required().integer(),
            mysql_user: number().required().integer(),
            postgresql_database: number().required().integer(),
            postgresql_user: number().required().integer()
        });

        onMounted(() => {
            getResource(productId);

            hasPermForm('store_product.change_storeproduct');
        });

        return {
            formErrors,
            formObj,
            formSuccess,
            hasPerm,
            productId,
            schema,
            updateResource
        };
    },
    methods: {
        async submitUpdate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.updateResource(this.productId, values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Domain product resources have been updated.',
                    type: 'success'
                });
            }
        }
    }
});
</script>
