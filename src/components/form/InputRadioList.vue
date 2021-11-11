<template>
    <Field v-slot="{ field, meta, errorMessage, handleChange, handleBlur }"
           :name="name">
        <div :class="{ 'has-error': !!errorMessage, success: meta.valid, 'required': false }">
            <div :class="className">
                <input :id="forName"
                       v-model="field.value"
                       :checked="checked"
                       :disabled="disabled"
                       class="list-group-item-check"
                       type="radio"
                       :value="field.value = value"
                       v-bind="field"
                       @blur="handleBlur"
                       @input="handleChange">

                <label :for="forName"
                       class="list-group-item py-3">
                    {{ label }}

                    <span class="d-block small" v-if="label2">{{ label2 }}</span>
                </label>
            </div>

            <div v-if="helpText"
                 class="form-text">{{ helpText }}
            </div>

            <div v-if="errorMessage"
                 v-show="errorMessage || !meta.valid"
                 class="help-message text-danger">
                Must choose one option
            </div>
        </div>
    </Field>
</template>

<script lang="ts">
import { Field } from "vee-validate";
import { defineComponent } from "vue";

export default defineComponent({
    name: "InputRadioList",
    components: {
        Field
    },
    props: {
        checked: {
            type: Boolean,
            default: false
        },
        className: {
            type: String,
            required: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        forName: {
            type: String,
            required: true
        },
        helpText: {
            type: String,
            required: false
        },
        label: {
            type: String,
            required: true
        },
        label2: {
            type: String,
            required: false
        },
        name: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: false
        }
    }
});
</script>

<style lang="css">
.list-group {
    width: auto;
    max-width: 460px;
}

[contenteditable]:focus {
    outline: 0;
}

.list-group-checkable {
    display: grid;
    gap: .5rem;
    border: 0;
}

.list-group-checkable .list-group-item {
    cursor: pointer;
    border-radius: .5rem;
}

.list-group-item-check {
    position: absolute;
    clip: rect(0, 0, 0, 0);
    pointer-events: none;
}

.list-group-item-check:hover + .list-group-item {
    background-color: var(--bs-light);
}

.list-group-item-check:checked + .list-group-item {
    color: #fff;
    background-color: var(--bs-blue);
}

.list-group-item-check[disabled] + .list-group-item,
.list-group-item-check:disabled + .list-group-item {
    pointer-events: none;
    filter: none;
    opacity: .5;
}
</style>