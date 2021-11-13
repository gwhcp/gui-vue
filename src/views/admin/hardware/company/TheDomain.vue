<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <router-link :to="{ name: 'admin:hardware:company:profile', params: { id: serverId } }"
                     class="nav-link">Profile
        </router-link>

        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Domains</a>
    </nav>

    <Form @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <VueMultiselect v-model="selected"
                                    :clear-on-select="false"
                                    :close-on-select="false"
                                    :multiple="true"
                                    :options="domainsBase"
                                    label="label"
                                    placeholder="Select Domain(s)"
                                    track-by="value">
                        <template v-slot:selection="params">
                            <span class="multiselect__single">
                                {{ params.values.length }} domains selected out of {{ domainsBase.length }}
                            </span>
                        </template>
                    </VueMultiselect>

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
import { useAdminHardwareCompany, useAuth } from "@/composables";
import { Form } from "vee-validate";
import { defineComponent, onMounted, ref } from "vue";
import VueMultiselect from "vue-multiselect";
import { useRoute } from "vue-router";
import { boolean, object } from "yup";

export default defineComponent({
    name: "TheDomain",
    components: {
        Form,
        VueMultiselect
    },
    setup() {
        const { domainsBase, formSuccess, getBaseDomain, getDomain, updateDomain } = useAdminHardwareCompany();

        const { hasPermForm } = useAuth();

        const route = useRoute();

        const schema = object({
            is_active: boolean()
        });

        const selected: any = ref([]);

        const serverId = route.params.id.toString();

        onMounted(() => {
            getBaseDomain();

            getDomain(serverId);

            hasPermForm('admin_hardware_company.change_server');
        });

        return {
            domainsBase,
            formSuccess,
            schema,
            selected,
            serverId,
            updateDomain
        };
    },
    methods: {
        async submitUpdate() {
            await this.updateDomain(this.serverId, this.selected);

            this.$emitter.emit('alert', {
                display: this.formSuccess,
                message: 'Nameservers have been updated.',
                type: 'success'
            });
        }
    }
});
</script>

<style lang="scss">
@import "~vue-multiselect/dist/vue-multiselect.css";
</style>