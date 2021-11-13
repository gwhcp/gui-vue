<template>
    <div v-if="!formObj.is_installed && !formObj.in_queue && !installSuccess"
         class="alert alert-info d-flex align-items-center"
         role="alert">
        <svg aria-label="Info:"
             class="bi flex-shrink-0 me-2"
             height="24"
             role="img"
             width="24">
            <use xlink:href="#info-fill"/>
        </svg>

        <div>
            Hardware is not installed.
        </div>
    </div>

    <div v-if="!formObj.is_installed && !formObj.in_queue && !installSuccess"
         class="mb-3">
        <modal-open-install :install="installHardware"
                            :params="{ id: formObj.id }"
                            message-alert="Continuing will install this hardware."
                            message-error="Hardware installation failed."
                            message-success="Hardware has been scheduled for installation."/>
    </div>

    <Form :validation-schema="schema"
          @submit="submitUpdate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <static-data :value="formObj.id"
                                 name="Server ID"/>

                    <static-data :datetime="formObj.date_from"
                                 name="Created Date"/>

                    <static-data v-if="formObj.company"
                                 :ahref="{ name: 'admin:company:company:profile', params: { id: formObj.company } }"
                                 :value="formObj.company_name"
                                 name="Company"
                                 permission="admin_company_company.view_company"/>

                    <static-data :value="formObj.hardware_type_name"
                                 name="Hardware"/>

                    <static-data :value="formObj.domain_name"
                                 name="Domain"/>

                    <static-data :value="formObj.ipaddress"
                                 name="IP Address"/>

                    <input-switch v-if="formObj.is_installed && !formObj.in_queue"
                                  v-model="formObj.is_active"
                                  label="Status"
                                  name="is_active"/>

                    <div v-if="formObj.is_installed && !formObj.in_queue"
                         class="col-6 mt-3">
                        <button class="btn btn-outline-primary px-4"
                                type="submit">Update
                        </button>
                    </div>
                </div>
            </div>

            <div class="col-lg-6">
                <div class="card card-body">
                    <div class="mb-2">
                        <h6 class="font-weight-bold">Domain</h6>

                        <span :class="getColor(formObj.is_domain)">
                            {{ formObj.is_domain ? 'Yes' : 'No' }}
                        </span>

                        <span v-if="formObj.is_domain">&nbsp;( {{ formObj.web_type_name }} )</span>
                    </div>

                    <div class="mb-2">
                        <h6 class="font-weight-bold">Mail</h6>

                        <span :class="getColor(formObj.is_mail)">
                            {{ formObj.is_mail ? 'Yes' : 'No' }}
                        </span>
                    </div>

                    <div class="mb-2">
                        <h6 class="font-weight-bold">MySQL</h6>

                        <span :class="getColor(formObj.is_mysql)">
                            {{ formObj.is_mysql ? 'Yes' : 'No' }}
                        </span>
                    </div>

                    <div>
                        <h6 class="font-weight-bold">PostgreSQL</h6>

                        <span :class="getColor(formObj.is_postgresql)">
                            {{ formObj.is_postgresql ? 'Yes' : 'No' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </Form>
</template>

<script lang="ts">
import { InputSwitch, ModalOpenInstall, StaticData } from "@/components";
import { useAdminHardwareClient, useAuth } from "@/composables";
import { Form } from "vee-validate";
import { defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { boolean, object } from "yup";

export default defineComponent({
    name: "TheProfile",
    components: {
        Form,
        InputSwitch,
        ModalOpenInstall,
        StaticData
    },
    setup() {
        const {
            formErrors,
            formObj,
            formSuccess,
            getProfile,
            installHardware,
            installSuccess,
            updateProfile
        } = useAdminHardwareClient();

        const { hasPermForm } = useAuth();

        const route = useRoute();

        const schema = object({
            is_active: boolean()
        });

        const serverId = route.params.id.toString();

        onMounted(() => {
            getProfile(serverId);

            hasPermForm('admin_hardware_company.change_server');
        });

        return {
            formErrors,
            formObj,
            formSuccess,
            installHardware,
            installSuccess,
            schema,
            serverId,
            updateProfile
        };
    },
    methods: {
        getColor(value: boolean) {
            return (value ? 'text-success' : 'text-danger');
        },
        async submitUpdate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.updateProfile(this.serverId, values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Client hardware has been updated.',
                    type: 'success'
                });
            }
        }
    }
});
</script>
