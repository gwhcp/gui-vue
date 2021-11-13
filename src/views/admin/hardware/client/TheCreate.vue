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

                    <input-select v-model="formObj.hardware_type"
                                  :options="choices.hardware_type"
                                  :required="true"
                                  label="Hardware"
                                  name="hardware_type"
                                  @input="hardwareChange(formObj.hardware_type)"/>

                    <input-select v-model="formObj.target_type"
                                  :options="choices.hardware_target"
                                  :required="true"
                                  label="Target"
                                  name="target_type"
                                  @input="targetChange(formObj.target_type)"/>

                    <input-switch v-if="has_domain"
                                  v-model="formObj.is_domain"
                                  :disabled="disable_domain"
                                  label="Domain"
                                  name="is_domain"/>

                    <input-select v-if="formObj.is_domain && has_web_type"
                                  v-model="formObj.web_type"
                                  :options="choices.web"
                                  label="Web Type"
                                  name="web_type"
                                  rules="required"/>

                    <input-switch v-if="has_mail"
                                  v-model="formObj.is_mail"
                                  label="Mail"
                                  name="is_mail"/>

                    <input-switch v-if="has_mysql"
                                  v-model="formObj.is_mysql"
                                  label="MySQL"
                                  name="is_mysql"/>

                    <input-switch v-if="has_postgresql"
                                  v-model="formObj.is_postgresql"
                                  label="PostgreSQL"
                                  name="is_postgresql"/>

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
import { InputSelect, InputSwitch, InputText } from "@/components";
import { useAdminHardwareClient } from "@/composables";
import { Form } from "vee-validate";
import { defineComponent, onMounted, ref } from "vue";
import { boolean, object, string } from "yup";

export default defineComponent({
    name: "TheCreate",
    components: {
        Form,
        InputSelect,
        InputSwitch,
        InputText
    },
    setup() {
        const { choices, createHardware, formErrors, formObj, formSuccess, getChoices } = useAdminHardwareClient();

        const disable_domain = ref(false);

        const has_domain = ref(false);

        const has_mail = ref(false);

        const has_mysql = ref(false);

        const has_postgresql = ref(false);

        const has_web_type = ref(false);

        const schema = object({
            domain: string().required(),
            hardware_type: string().required(),
            ip: string().required(),
            is_domain: boolean(),
            is_mail: boolean(),
            is_mysql: boolean(),
            is_postgresql: boolean(),
            target_type: string().required(),
            web_type: string()
        });

        onMounted(() => {
            getChoices();
        });

        return {
            choices,
            createHardware,
            disable_domain,
            formErrors,
            formObj,
            formSuccess,
            has_domain,
            has_mail,
            has_mysql,
            has_postgresql,
            has_web_type,
            schema
        };
    },
    methods: {
        checkedQuerySelector(parent: Element | Document, selector: string): Element {
            const el = parent.querySelector(selector);

            if (!el) {
                throw new Error(`Selector ${selector} didn't match any elements.`);
            }

            return el;
        },
        hardwareChange(value: string) {
            const options = (this.checkedQuerySelector(document, '#target_type') as HTMLSelectElement).options;

            const target_type = document.getElementById('target_type') as Element;

            switch (value) {
                case 'dedicated':
                    (this.checkedQuerySelector(target_type, 'option[value="domain"]') as HTMLSelectElement).style.display = "block";
                    (this.checkedQuerySelector(target_type, 'option[value="mail"]') as HTMLSelectElement).style.display = "block";
                    (this.checkedQuerySelector(target_type, 'option[value="mysql"]') as HTMLSelectElement).style.display = "block";
                    (this.checkedQuerySelector(target_type, 'option[value="postgresql"]') as HTMLSelectElement).style.display = "block";
                    (this.checkedQuerySelector(target_type, 'option[value="managed"]') as HTMLSelectElement).style.display = "none";
                    (this.checkedQuerySelector(target_type, 'option[value="unmanaged"]') as HTMLSelectElement).style.display = "none";

                    this.formObj.target_type = 'domain';
                    this.formObj.is_domain = true;
                    this.has_domain = true;
                    this.has_web_type = true;
                    this.disable_domain = true;

                    this.has_mail = false;
                    this.has_mysql = false;
                    this.has_postgresql = false;

                    break;

                case 'private':
                    (this.checkedQuerySelector(target_type, 'option[value="domain"]') as HTMLSelectElement).style.display = "none";
                    (this.checkedQuerySelector(target_type, 'option[value="mail"]') as HTMLSelectElement).style.display = "none";
                    (this.checkedQuerySelector(target_type, 'option[value="mysql"]') as HTMLSelectElement).style.display = "none";
                    (this.checkedQuerySelector(target_type, 'option[value="postgresql"]') as HTMLSelectElement).style.display = "none";
                    (this.checkedQuerySelector(target_type, 'option[value="managed"]') as HTMLSelectElement).style.display = "block";
                    (this.checkedQuerySelector(target_type, 'option[value="unmanaged"]') as HTMLSelectElement).style.display = "block";

                    this.formObj.target_type = 'managed';

                    this.has_domain = false;
                    this.has_mail = false;
                    this.has_mysql = false;
                    this.has_postgresql = false;
                    this.has_web_type = false;
                    this.disable_domain = false;

                    break;

                default:
                    Array.from(options).forEach((option_element) => {
                        option_element.style.display = "none";
                    });
            }
        },
        targetChange(value: string) {
            switch (value) {
                case 'domain':
                    this.formObj.is_domain = true;
                    this.has_domain = true;
                    this.disable_domain = true;
                    this.has_web_type = true;

                    break;

                case 'mail':
                case 'mysql':
                case 'postgresql':
                    this.formObj.is_domain = false;
                    this.has_domain = false;
                    this.has_web_type = false;

                    break;

                case 'managed':
                    this.has_domain = false;
                    this.has_mail = false;
                    this.has_mysql = false;
                    this.has_postgresql = false;
                    this.has_web_type = false;

                    break;

                case 'unmanaged':
                    this.has_domain = true;
                    this.has_mail = true;
                    this.has_mysql = true;
                    this.has_postgresql = true;
                    this.has_web_type = true;

                    break;
            }
        },
        async submitCreate(values: Record<string, unknown>, actions: { setErrors: (arg0: Record<string, unknown>) => void; }) {
            await this.createHardware(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                this.$emitter.emit('alert', {
                    display: this.formSuccess,
                    message: 'Client hardware has been created.',
                    type: 'success'
                });

                await this.$router.push({
                    name: 'admin:hardware:client:search'
                });
            }
        }
    }
});
</script>
