<template>
    <Form :validation-schema="schema"
          @submit="submitCreate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <input-select v-model="formObj.domain"
                                  :options="choices.domain"
                                  :required="true"
                                  label="Domain"
                                  name="domain"/>

                    <input-text v-model="formObj.ip"
                                :required="true"
                                label="IP Address"
                                name="ip"/>

                    <input-select v-model="formObj.target_type"
                                  :options="choices.hardware_target"
                                  :required="true"
                                  label="Target"
                                  name="target_type"/>

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
import { useAdminHardwareCompany } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted } from "vue";
import { object, string } from "yup";

export default defineComponent({
    name: "TheCreate",
    components: {
        Form,
        InputSelect,
        InputText
    },
    setup() {
        const { createHardware, getChoices, localHardwareCompany } = useAdminHardwareCompany();

        const choices = computed(() => {
            return localHardwareCompany.choices;
        });

        const formErrors = computed(() => {
            return localHardwareCompany.formErrors;
        });

        const formObj = computed(() => {
            return localHardwareCompany.formObj;
        });

        const formSuccess = computed(() => {
            return localHardwareCompany.formSuccess;
        });

        const schema = object({
            domain: string().required(),
            ip: string().required(),
            target_type: string().required()
        });

        onMounted(() => {
            getChoices();
        });

        return {
            choices,
            createHardware,
            formErrors,
            formObj,
            formSuccess,
            schema
        };
    },
    methods: {
        async submitCreate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.createHardware(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Company hardware has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'admin:hardware:company:search'
                });
            }
        }
    }
});
</script>
