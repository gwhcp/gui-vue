<template>
    <h2 class="display-6 text-center mb-4">Compare plans</h2>

    <div class="table-responsive">
        <table class="table text-center">
            <thead>
            <tr>
                <th style="width: 20%;"></th>

                <th v-for="item in formArr"
                    :key="item"
                    :style="columnSpace()">{{ item['name'] }}
                </th>
            </tr>
            </thead>

            <tbody>
            <tr>
                <th class="text-start"
                    scope="row">Bandwidth
                </th>

                <td v-for="item in formArr"
                    :key="item">{{ item['bandwidth'] }} MB
                </td>
            </tr>

            <tr>
                <th class="text-start"
                    scope="row">Disk space
                </th>

                <td v-for="item in formArr"
                    :key="item">{{ item['diskspace'] }} MB
                </td>
            </tr>
            </tbody>

            <tbody>
            <tr>
                <th class="text-start"
                    scope="row">Cron Supported
                </th>

                <td v-for="item in formArr"
                    :key="item">
                    <font-awesome-icon v-if="item['cron_tab']"
                                       :icon="['fas', 'check']"
                                       class="text-success"/>

                    <font-awesome-icon v-else
                                       :icon="['fas', 'times']"
                                       class="text-danger"/>
                </td>
            </tr>

            <tr>
                <th class="text-start"
                    scope="row">Domains
                </th>

                <td v-for="item in formArr"
                    :key="item">{{ item['domain'] }}
                </td>
            </tr>

            <tr>
                <th class="text-start"
                    scope="row">Sub.Domains
                </th>

                <td v-for="item in formArr"
                    :key="item">{{ item['sub_domain'] }}
                </td>
            </tr>

            <tr>
                <th class="text-start"
                    scope="row">Web Server
                </th>

                <td v-for="item in formArr"
                    :key="item">{{ capitalize(item['web_type']) }}
                </td>
            </tr>
            </tbody>

            <tbody>
            <tr>
                <th class="text-start"
                    scope="row">IP Address
                </th>

                <td v-for="item in formArr"
                    :key="item">{{ item['ipaddress'] }}
                </td>
            </tr>

            <tr>
                <th class="text-start"
                    scope="row">IP Address Type
                </th>

                <td v-for="item in formArr"
                    :key="item">{{ capitalize(item['ipaddress_type']) }}
                </td>
            </tr>
            </tbody>

            <tbody>
            <tr>
                <th class="text-start"
                    scope="row">Mail Accounts
                </th>

                <td v-for="item in formArr"
                    :key="item">{{ item['mail_account'] }}
                </td>
            </tr>

            <tr>
                <th class="text-start"
                    scope="row">Mailing Lists
                </th>

                <td v-for="item in formArr"
                    :key="item">{{ item['mail_list'] }}
                </td>
            </tr>
            </tbody>

            <tbody>
            <tr>
                <th class="text-start"
                    scope="row">MySQL Databases
                </th>

                <td v-for="item in formArr"
                    :key="item">{{ item['mysql_database'] }}
                </td>
            </tr>

            <tr>
                <th class="text-start"
                    scope="row">MySQL Users
                </th>

                <td v-for="item in formArr"
                    :key="item">{{ item['mysql_user'] }}
                </td>
            </tr>
            </tbody>

            <tbody>
            <tr>
                <th class="text-start"
                    scope="row">PostgreSQL Databases
                </th>

                <td v-for="item in formArr"
                    :key="item">{{ item['postgresql_database'] }}
                </td>
            </tr>

            <tr>
                <th class="text-start"
                    scope="row">PostgreSQL Users
                </th>

                <td v-for="item in formArr"
                    :key="item">{{ item['postgresql_user'] }}
                </td>
            </tr>
            </tbody>

            <tbody>
            <tr>
                <th scope="row"></th>

                <td v-for="item in formArr"
                    :key="item">
                    <router-link :to="{ name: 'client:store:checkout', params: { id: item['id'] } }">
                        <button class="btn btn-lg btn-outline-success"
                                type="button">Select
                        </button>
                    </router-link>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { useClientStore } from "@/composables";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheProductDomain",
    setup() {
        const { formArr, getProductDomain } = useClientStore();

        onMounted(() => {
            getProductDomain();
        });

        return {
            formArr
        };
    },
    methods: {
        capitalize(word: string) {
            return word.toLowerCase().replace(/\w/, fL => fL.toUpperCase());
        },
        columnSpace() {
            return `width: ${80 / this.formArr.length}%`;
        }
    }
});
</script>