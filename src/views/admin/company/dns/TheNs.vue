<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <router-link :to="{ name: 'admin:company:dns:profile', params: { id: domainId } }"
                     class="nav-link">Profile
        </router-link>

        <router-link :to="{ name: 'admin:company:dns:records', params: { id: domainId } }"
                     class="nav-link">Records
        </router-link>

        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Nameserver</a>
    </nav>

    <Form @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <VueMultiselect v-model="selected"
                                    :clear-on-select="false"
                                    :close-on-select="false"
                                    :multiple="true"
                                    :options="nameserverBase"
                                    label="label"
                                    placeholder="Select Name Server(s)"
                                    track-by="value">
                        <template v-slot:selection="params">
                            <span class="multiselect__single">
                                {{ params.values.length }} servers selected out of {{ nameserverBase.length }}
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
import { useAuth, useAdminCompanyDns } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import VueMultiselect from "vue-multiselect";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "ThePermission",
    components: {
        Form,
        VueMultiselect
    },
    setup() {
        const { hasPermForm } = useAuth();

        const { getNameserverBase, getNameserverDomain, localCompanyDns, updateNameserver } = useAdminCompanyDns();

        const route = useRoute();

        const domainId = route.params.id.toString();

        const formSuccess = computed(() => {
            return localCompanyDns.formSuccess;
        });

        const nameserverBase = computed(() => {
            return localCompanyDns.nameserverBase;
        });

        const nameserverDomain = computed(() => {
            return localCompanyDns.nameserverDomain;
        });

        const selected: any = ref([]);

        watch([nameserverBase, nameserverDomain], () => {
            nameserverDomain.value.forEach((user) => {
                nameserverBase.value.forEach((base) => {
                    if (base['value'] === user) {
                        selected.value.push({
                            value: base['value'],
                            label: base['label']
                        });
                    }
                });
            });
        });

        onMounted(() => {
            getNameserverBase();

            getNameserverDomain(domainId);

            hasPermForm('admin_company_dns.change_dnszone');
        });

        return {
            domainId,
            formSuccess,
            nameserverBase,
            selected,
            updateNameserver
        };
    },
    methods: {
        async submitUpdate() {
            await this.updateNameserver(this.domainId, this.selected);

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