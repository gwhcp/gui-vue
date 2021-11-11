<template>
    <Form :validation-schema="schema"
          @submit="submitCreate">
        <div class="row">
            <div class="col-lg-6">
                <div class="card card-body">
                    <input-select v-model="formObj.company"
                                  :options="choices"
                                  :required="true"
                                  label="Company"
                                  name="company"/>

                    <input-text v-model="formObj.name"
                                :required="true"
                                label="Name"
                                name="name"/>

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
import { useAdminCompanyDomain } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted } from "vue";
import { number, object, string } from "yup";

export default defineComponent({
    name: "TheCreate",
    components: {
        Form,
        InputSelect,
        InputText
    },
    setup() {
        const { createDomain, getChoices, localCompanyDomain } = useAdminCompanyDomain();

        const choices = computed(() => {
            return localCompanyDomain.choices;
        });

        const formErrors = computed(() => {
            return localCompanyDomain.formErrors;
        });

        const formObj = computed(() => {
            return localCompanyDomain.formObj;
        });

        const formSuccess = computed(() => {
            return localCompanyDomain.formSuccess;
        });

        const schema = object({
            company: number().required().positive().integer(),
            name: string().required()
        });

        onMounted(() => {
            getChoices();
        });

        return {
            choices,
            createDomain,
            formErrors,
            formObj,
            formSuccess,
            schema
        };
    },
    methods: {
        async submitCreate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.createDomain(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Domain has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'admin:company:domain:search'
                });
            }
        }
    }
});
</script>
