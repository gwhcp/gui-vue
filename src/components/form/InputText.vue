<template>
    <Field v-slot="{ field, meta, errorMessage, handleChange, handleBlur }"
           :name="name">
        <div :class="{ 'has-error': !!errorMessage, success: meta.valid, 'required': required }"
             class="TextInput">
            <label :for="name"
                   class="font-weight-bold form-label">{{ label }}</label>

            <input :id="name"
                   v-model="field.value"
                   :placeholder="label"
                   :type="type"
                   class="form-control"
                   v-bind="field"
                   @blur="handleBlur"
                   @input="handleChange">

            <div v-if="helpText"
                 class="form-text">{{ helpText }}
            </div>

            <div v-if="errorMessage"
                 v-show="errorMessage || !meta.valid"
                 class="help-message">
                {{ errorMessage.replace(name, label) }}
            </div>
        </div>
    </Field>
</template>

<script lang="ts">
import { Field } from "vee-validate";
import { defineComponent } from "vue";

export default defineComponent({
    name: "InputText",
    components: {
        Field
    },
    props: {
        helpText: {
            type: String,
            required: false
        },
        label: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        required: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'text'
        }
    }
});
</script>

<style lang="scss">
@import "../../assets/scss/form";
</style>