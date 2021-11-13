<template>

    <div class="row row-cols-1 row-cols-md-4 mb-3 text-center">
        <div v-if="formObj.domain"
             class="col">
            <div class="card mb-4 rounded-3 shadow-sm h-100">
                <div class="card-header py-3">
                    <h4 class="my-0 fw-normal">Domain Hosting</h4>
                </div>

                <div class="card-body mt-5">
                    <ul class="list-unstyled">
                        <li>As little as</li>
                    </ul>

                    <h1 class="card-title">
                        $1<small class="text-muted fw-light">/day</small>
                    </h1>

                    <ul class="list-unstyled mt-3 mb-4">
                        <li>Get all the features you'll need to host your domain(s) content</li>
                    </ul>
                </div>

                <div class="p-3">
                    <router-link :to="{ name: 'client:store:product:domain' }">
                        <button class="w-100 btn btn-lg btn-outline-primary"
                                type="button">Get Started
                        </button>
                    </router-link>
                </div>
            </div>
        </div>

        <div v-if="formObj.mail"
             class="col">
            <div class="card mb-4 rounded-3 shadow-sm h-100">
                <div class="card-header py-3">
                    <h4 class="my-0 fw-normal">Mailing Hosting</h4>
                </div>

                <div class="card-body mt-5">
                    <h1 class="card-title">
                        $15<small class="text-muted fw-light">/mo</small>
                    </h1>

                    <ul class="list-unstyled mt-3 mb-4">
                        <li>Email hosting only</li>
                    </ul>
                </div>

                <div class="p-3">
                    <button class="w-100 btn btn-lg btn-outline-primary"
                            type="button">Get Started
                    </button>
                </div>
            </div>
        </div>

        <div v-if="formObj.mysql"
             class="col">
            <div class="card mb-4 rounded-3 shadow-sm h-100">
                <div class="card-header py-3">
                    <h4 class="my-0 fw-normal">MySQL Hosting</h4>
                </div>

                <div class="card-body mt-5">
                    <h1 class="card-title">
                        $29<small class="text-muted fw-light">/mo</small>
                    </h1>

                    <ul class="list-unstyled mt-3 mb-4">
                        <li>MySQL database hosting only</li>
                    </ul>
                </div>

                <div class="p-3">
                    <button class="w-100 btn btn-lg btn-outline-primary"
                            type="button">Get Started
                    </button>
                </div>
            </div>
        </div>

        <div v-if="formObj.postgresql"
             class="col">
            <div class="card mb-4 rounded-3 shadow-sm h-100">
                <div class="card-header py-3">
                    <h4 class="my-0 fw-normal">PostgreSQL Hosting</h4>
                </div>

                <div class="card-body mt-5">
                    <h1 class="card-title">
                        $29<small class="text-muted fw-light">/mo</small>
                    </h1>

                    <ul class="list-unstyled mt-3 mb-4">
                        <li>PostgreSQL database hosting only</li>
                    </ul>
                </div>

                <div class="p-3">
                    <button class="w-100 btn btn-lg btn-outline-primary"
                            type="button">Get Started
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="!formObj.domain && !formObj.mail && !formObj.mysql && !formObj.postgresql"
         class="row text-center">
        <div class="alert alert-warning"
             role="alert">
            There are currently no available products. Please check back later!
        </div>
    </div>
</template>

<script lang="ts">
import { useClientStore } from "@/composables";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheIndex",
    setup() {
        const { formObj, getProductTypes } = useClientStore();

        onMounted(() => {
            getProductTypes();
        });

        return {
            formObj
        };
    }
});
</script>