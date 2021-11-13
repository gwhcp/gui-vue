<template>
    <Form :validation-schema="schema"
          @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <static-data :value="formObj.id"
                                 name="IP Address Setup ID"/>

                    <static-data :datetime="formObj.date_from"
                                 name="Created Date"/>

                    <static-data :value="formObj.ip_type"
                                 name="IP Address Type"/>

                    <static-data :value="formObj.network"
                                 name="Network IP Address"/>

                    <static-data :value="formObj.subnet"
                                 name="Subnet"/>

                    <static-data v-if="formObj.ip_type === 4"
                                 :value="formObj.netmask"
                                 name="Netmask"/>

                    <static-data v-if="formObj.ip_type === 4"
                                 :value="formObj.broadcast"
                                 name="Broadcast"/>

                    <static-data :value="formObj.ip_total"
                                 name="Total IP Addresses"/>

                    <static-data :value="formObj.ip_available"
                                 name="Available"/>

                    <input-text v-model="formObj.name"
                                :required="true"
                                label="Name"
                                name="name"/>

                    <input-select v-model="formObj.assigned"
                                  :options="choices"
                                  :required="true"
                                  label="Assigned"
                                  name="assigned"/>

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
import { InputSelect, InputSwitch, InputText, StaticData } from "@/components";
import { useAdminNetworkPool, useAuth } from "@/composables";
import { Form } from "vee-validate";
import { defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { boolean, object, string } from "yup";

export default defineComponent({
    name: "TheProfile",
    components: {
        Form,
        InputSelect,
        InputSwitch,
        InputText,
        StaticData
    },
    setup() {
        const {
            choices,
            formErrors,
            formObj,
            formSuccess,
            getChoices,
            getProfile,
            updateProfile
        } = useAdminNetworkPool();

        const { hasPermForm } = useAuth();

        const route = useRoute();

        const schema = object({
            assigned: string().required(),
            is_active: boolean(),
            name: string().required()
        });

        const setupId = route.params.id.toString();

        onMounted(() => {
            getChoices();

            getProfile(setupId);

            hasPermForm('admin_network_pool.change_ipaddresssetup');
        });

        return {
            choices,
            formErrors,
            formObj,
            formSuccess,
            schema,
            setupId,
            updateProfile
        };
    },
    methods: {
        async submitUpdate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.updateProfile(this.setupId, values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'IP Address pool has been updated.',
                    type: 'success'
                });
            }
        }
    }
});
</script>
