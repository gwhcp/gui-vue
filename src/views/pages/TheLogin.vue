<template>
    <div class="back">
        <div class="div-center border border-dark">
            <div class="content">
                <img alt="Login"
                     class="mb-3"
                     src="/img/gwhcp_header.svg"/>

                <div v-if="nonFieldFormError"
                     class="text-danger mb-3">
                    {{ nonFieldFormMessage }}
                </div>

                <router-link :to="{ name: 'pages:account:create' }">
                    <button class="btn btn-outline-success w-100 mt-2 mb-3"
                            type="submit">Create Account
                    </button>
                </router-link>

                <Form :validation-schema="schema"
                      @submit="submitLogin">
                    <input-text label="Email Address"
                                name="email"
                                type="email"/>

                    <input-text label="Password"
                                name="password"
                                type="password"/>

                    <button class="btn btn-outline-primary w-100 mt-2"
                            type="submit">Login
                    </button>
                </form>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { InputText } from "@/components";
import { useAuth } from "@/composables";
import { Form } from "vee-validate";
import { defineComponent } from "vue";
import { object, string } from "yup";

export default defineComponent({
    name: "TheLogin",
    components: {
        Form,
        InputText
    },
    setup() {
        const { formErrors, formSuccess, login, nonFieldFormError, nonFieldFormMessage } = useAuth();

        const schema = object({
            email: string().required().min(5).email(),
            password: string().required().min(5)
        });

        return {
            formErrors,
            formSuccess,
            login,
            nonFieldFormError,
            nonFieldFormMessage,
            schema
        };
    },
    methods: {
        async submitLogin(values: { email: string; password: string; }, actions: { setErrors: (arg0: string) => void; }) {
            await this.login(values);

            if (!this.formSuccess) {
                actions.setErrors(this.formErrors);
            } else {
                await this.$router.push({
                    name: 'dashboard'
                });
            }
        }
    }
});
</script>

<style lang="css">
.back {
    background: #e2e2e2;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
}

.div-center {
    width: 400px;
    height: 400px;
    background-color: #fff;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
    padding: 1em 2em;
    border-bottom: 2px solid #ccc;
    display: table;
}

div.content {
    display: table-cell;
    vertical-align: middle;
}
</style>