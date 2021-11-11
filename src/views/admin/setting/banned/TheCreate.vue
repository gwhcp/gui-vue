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

                    <input-select v-model="formObj.banned_type"
                                  :options="choices"
                                  :required="true"
                                  label="Type"
                                  name="banned_type"/>

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
import { useAdminSettingBanned } from "@/composables";
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
        const { createBanned, getChoices, localSettingBanned } = useAdminSettingBanned();

        const choices = computed(() => {
            return localSettingBanned.choices;
        });

        const formErrors = computed(() => {
            return localSettingBanned.formErrors;
        });

        const formObj = computed(() => {
            return localSettingBanned.formObj;
        });

        const formSuccess = computed(() => {
            return localSettingBanned.formSuccess;
        });

        const schema = object({
            name: string().required(),
            banned_type: string().required()
        });

        onMounted(() => {
            getChoices();
        });

        return {
            choices,
            createBanned,
            formErrors,
            formObj,
            formSuccess,
            schema
        };
    },
    methods: {
        async submitCreate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.createBanned(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Banned item has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'admin:setting:banned:search'
                });
            }
        }
    }
});
</script>
