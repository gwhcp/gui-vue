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
import { InputText } from "@/components";
import { useAdminCompanyXmpp } from "@/composables";
import { Form } from "vee-validate";
import { computed, defineComponent } from "vue";
import { object, string } from "yup";

export default defineComponent({
    name: "TheCreateGroup",
    components: {
        Form,
        InputText
    },
    setup() {
        const { createGroup, localCompanyXmpp } = useAdminCompanyXmpp();

        const formErrors = computed(() => {
            return localCompanyXmpp.formErrors;
        });

        const formObj = computed(() => {
            return localCompanyXmpp.formObj;
        });

        const formSuccess = computed(() => {
            return localCompanyXmpp.formSuccess;
        });

        const schema = object({
            name: string().required()
        });

        return {
            createGroup,
            formErrors,
            formObj,
            formSuccess,
            schema
        };
    },
    methods: {
        async submitCreate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.createGroup(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'XMPP group has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'admin:company:xmpp:search:group'
                });
            }
        }
    }
});
</script>
