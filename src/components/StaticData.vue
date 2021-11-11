<template>
    <div class="mb-2">
        <h6 class="font-weight-bold">{{ name }}</h6>

        <div v-if="value && !ahref">
            {{ text_left }} {{ value }} {{ text_right }}
        </div>

        <div v-if="ahref">
            <router-link v-if="hasPerm(permission)"
                         :to="ahref">
                {{ value }}
            </router-link>

            <div v-else>
                {{ value }}
            </div>
        </div>

        <div v-if="datetime">
            {{ convertDate(datetime) }}
        </div>
    </div>
</template>

<script lang="ts">
import { useAuth } from "@/composables";
import moment from "moment-timezone";
import { computed, defineComponent } from "vue";

export default defineComponent({
    name: "StaticData",
    props: {
        ahref: {
            type: Object,
            required: false
        },
        datetime: {
            type: String,
            required: false
        },
        name: {
            type: String,
            required: false
        },
        permission: {
            type: String,
            required: false
        },
        text_left: {
            type: null,
            required: false
        },
        text_right: {
            type: null,
            required: false
        },
        value: {
            type: null,
            required: false
        }
    },
    setup() {
        const { globalAuth, hasPerm } = useAuth();

        const accountProfile = computed(() => {
            return JSON.parse(globalAuth.accountProfile);
        });

        return {
            accountProfile,
            hasPerm
        };
    },
    methods: {
        convertDate(value: string) {
            if (this.accountProfile.time_format === 12) {
                return moment
                    .tz(value, this.accountProfile.time_zone)
                    .format('YYYY-MM-DD h:mm:ss A');
            } else {
                return moment
                    .tz(value, this.accountProfile.time_zone)
                    .format('YYYY-MM-DD H:mm:ss');
            }
        }
    }
});
</script>