<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <router-link :to="{ name: 'admin:employee:manage:profile', params: { id: accountId } }"
                     class="nav-link">Profile
        </router-link>

        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Permissions</a>

        <router-link :to="{ name: 'admin:employee:manage:accesslog', params: { id: accountId } }"
                     class="nav-link">Access Logs
        </router-link>
    </nav>

    <Form @submit="submitPermission">
        <div class="row">
            <div class="col-lg-12">
                <div class="card card-body">
                    <VueMultiselect v-model="selected"
                                    :clear-on-select="false"
                                    :close-on-select="false"
                                    :multiple="true"
                                    :options="permissionsBase"
                                    label="label"
                                    placeholder="Select Permissions"
                                    track-by="value">
                        <template v-slot:selection="params">
                            <span class="multiselect__single">
                                {{ params.values.length }} permissions selected out of {{ permissionsBase.length }}
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
import { useAdminEmployeeManage, useAuth } from "@/composables";
import { Form } from "vee-validate";
import { defineComponent, onMounted, ref, watch } from "vue";
import VueMultiselect from "vue-multiselect";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "ThePermission",
    components: {
        Form,
        VueMultiselect
    },
    setup() {
        const {
            formSuccess,
            getPermissionsBase,
            getPermissionsUser,
            permissionsBase,
            permissionsUser,
            updatePermissions
        } = useAdminEmployeeManage();

        const { hasPermForm } = useAuth();

        const route = useRoute();

        const accountId = route.params.id.toString();

        const selected: any = ref([]);

        watch([permissionsBase, permissionsUser], () => {
            permissionsUser.value.forEach((user) => {
                permissionsBase.value.forEach((base) => {
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
            getPermissionsBase();

            getPermissionsUser(accountId);

            hasPermForm('auth.change_permission');
        });

        return {
            accountId,
            formSuccess,
            permissionsBase,
            selected,
            updatePermissions
        };
    },
    methods: {
        async submitPermission() {
            await this.updatePermissions(this.accountId, this.selected);

            this.$emitter.emit('alert', {
                display: this.formSuccess,
                message: 'Account permissions have been updated.',
                type: 'success'
            });
        }
    }
});
</script>

<style lang="scss">
@import "~vue-multiselect/dist/vue-multiselect.css";
</style>