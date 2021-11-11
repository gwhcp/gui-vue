<template>
    <div class="row">
        <div class="d-flex flex-wrap gap-3">
            <div>
                <router-link :to="{ name: 'admin:store:product:domain:search' }">
                    <button class="btn btn-success position-relative"
                            style="width: 15rem;"
                            type="button">
                        <font-awesome-icon :icon="['fas', 'globe']"
                                           size="3x"/>

                        <br>Domain Hosting
                    </button>
                </router-link>
            </div>

            <div>
                <button class="btn btn-success position-relative disabled"
                        style="width: 15rem;"
                        type="button">
                    <font-awesome-icon :icon="['fas', 'at']"
                                       size="3x"/>

                    <br>Mail Hosting
                </button>
            </div>

            <div>
                <button class="btn btn-success position-relative disabled"
                        style="width: 15rem;"
                        type="button">
                    <font-awesome-icon :icon="['fas', 'database']"
                                       size="3x"/>

                    <br>MySQL Hosting
                </button>
            </div>

            <div>
                <button class="btn btn-success position-relative disabled"
                        style="width: 15rem;"
                        type="button">
                    <font-awesome-icon :icon="['fas', 'database']"
                                       size="3x"/>

                    <br>PostgreSQL Hosting
                </button>
            </div>
        </div>
    </div>

    <div class="row mt-3">
        <div class="d-flex flex-wrap gap-3">
            <div>
                <button class="btn btn-success position-relative disabled"
                        style="width: 15rem;"
                        type="button">
                    <font-awesome-icon :icon="['fas', 'server']"
                                       size="3x"/>

                    <br>Dedicated / Private Server
                </button>
            </div>

            <div>
                <button class="btn btn-success position-relative disabled"
                        style="width: 15rem;"
                        type="button">
                    <font-awesome-icon :icon="['fas', 'code']"
                                       size="3x"/>

                    <br>Domain Registration
                </button>
            </div>
        </div>
    </div>

    <div class="row mt-3">
        <div class="d-flex flex-wrap gap-3">
            <div>
                <button class="btn btn-success position-relative disabled"
                        style="width: 15rem;"
                        type="button">
                    <font-awesome-icon :icon="['fas', 'cart-plus']"
                                       size="3x"/>

                    <br>Add-ons
                </button>
            </div>

            <div>
                <button class="btn btn-success position-relative disabled"
                        style="width: 15rem;"
                        type="button">
                    <font-awesome-icon :icon="['fas', 'barcode']"
                                       size="3x"/>

                    <br>Promo Codes
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "TheIndex"
});
</script>
