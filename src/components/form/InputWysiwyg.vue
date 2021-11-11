<template>
    <Field v-slot="{ field, meta, errorMessage, handleChange, handleBlur }"
           :name="name">
        <div :class="{ 'has-error': !!errorMessage, success: meta.valid, 'required': required }"
             class="TextInput">
            <label :for="name"
                   class="font-weight-bold form-label">{{ label }}</label>

            <ckeditor :id="name"
                      v-model="field.value"
                      v-bind="field"
                      :config="editorConfig"
                      :editor="editor"
                      @blur="handleBlur"
                      @input="handleChange"/>

            <div v-if="errorMessage"
                 v-show="errorMessage || !meta.valid"
                 class="help-message">
                {{ errorMessage.replace(name, label) }}
            </div>
        </div>
    </Field>
</template>

<script lang="ts">
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Field } from "vee-validate";
import { defineComponent } from "vue";

export default defineComponent({
    name: "InputWysiwyg",
    components: {
        ckeditor: ClassicEditor.component,
        Field
    },
    props: {
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
        }
    },
    data() {
        return {
            editor: ClassicEditor,
            editorConfig: {
                // The configuration of the editor.
            }
        }
    }
});
</script>

<style lang="scss">
@import "../../assets/scss/form";
</style>