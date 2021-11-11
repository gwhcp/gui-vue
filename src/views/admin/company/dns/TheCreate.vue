<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <router-link :to="{ name: 'admin:company:dns:profile', params: { id: domainId } }"
                     class="nav-link">Profile
        </router-link>

        <router-link :to="{ name: 'admin:company:dns:records', params: { id: domainId } }"
                     class="nav-link">Records
        </router-link>

        <router-link :to="{ name: 'admin:company:dns:ns', params: { id: domainId } }"
                     class="nav-link">Nameserver
        </router-link>
    </nav>

    <Form :validation-schema="schema"
          @submit="submitCreate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <input-text v-model="formObj.host"
                                :required="false"
                                label="Host"
                                name="host"/>

                    <input-select v-model="formObj.record_type"
                                  :options="choices.zone"
                                  :required="true"
                                  label="Type"
                                  name="record_type"/>

                    <input-text v-if="formObj.record_type === 'MX'"
                                v-model="formObj.mx_priority"
                                :required="true"
                                label="MX Priority"
                                name="mx_priority"/>

                    <input-text v-model="formObj.data"
                                :required="true"
                                label="Data"
                                name="data"/>

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
import { InputSelect, InputText } from "@/components";
import { useAdminCompanyDns } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { number, object, string } from "yup";

export default defineComponent({
    name: "TheCreate",
    components: {
        Form,
        InputSelect,
        InputText
    },
    setup() {
        const { createRecord, getChoices, localCompanyDns } = useAdminCompanyDns();

        const route = useRoute();

        const choices = computed(() => {
            return localCompanyDns.choices;
        });

        const domainId = route.params.id.toString();

        const formErrors = computed(() => {
            return localCompanyDns.formErrors;
        });

        const formObj = computed(() => {
            return localCompanyDns.formObj;
        });

        const formSuccess = computed(() => {
            return localCompanyDns.formSuccess;
        });

        const schema = object({
            host: string(),
            record_type: string().required(),
            mx_priority: number().when('record_type', {
                is: 'MX',
                then: number().positive().integer().required()
            }),
            data: string().required()
        });

        onMounted(() => {
            getChoices();
        });

        return {
            choices,
            createRecord,
            domainId,
            formErrors,
            formObj,
            formSuccess,
            schema
        };
    },
    methods: {
        async submitCreate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            values['domain'] = this.domainId;

            await this.createRecord(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'DNS record has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'admin:company:dns:records',
                    params: {
                        id: this.domainId
                    }
                });
            }
        }
    }
});
</script>
