<template>
    <Form :validation-schema="schema"
          @submit="submitCreate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <input-text v-model="formObj.name"
                                :required="true"
                                label="Name"
                                name="name"/>

                    <input-text v-model="formObj.network"
                                :required="true"
                                label="Network"
                                name="network"/>

                    <input-text v-model="formObj.subnet"
                                :required="true"
                                label="Subnet"
                                name="subnet"/>

                    <input-select v-model="formObj.assigned"
                                  :options="choices"
                                  :required="true"
                                  label="Assigned"
                                  name="assigned"/>

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
import { useAdminNetworkPool } from "@/composables";
import { Form } from "vee-validate";
import { defineComponent, onMounted } from "vue";
import { number, object, string } from "yup";

export default defineComponent({
    name: "TheCreate",
    components: {
        Form,
        InputSelect,
        InputText
    },
    setup() {
        const { choices, createPool, formErrors, formObj, formSuccess, getChoices } = useAdminNetworkPool();

        const schema = object({
            assigned: string().required(),
            name: string().required(),
            network: string().required(),
            subnet: number().required().positive().integer()
        });

        onMounted(() => {
            getChoices();
        });

        return {
            choices,
            createPool,
            formErrors,
            formObj,
            formSuccess,
            schema
        };
    },
    methods: {
        async submitCreate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.createPool(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'IP Address pool has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'admin:network:pool:search'
                });
            }
        }
    }
});
</script>
