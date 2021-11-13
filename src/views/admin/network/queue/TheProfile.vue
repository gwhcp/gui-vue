<template>
    <div class="row">
        <div class="col-lg-6">
            <div class="card card-body">
                <static-data :value="formObj.id"
                             name="Queue Status ID"/>

                <static-data :datetime="formObj.date_from"
                             name="Created Date"/>

                <static-data v-if="formObj.account"
                             :value="formObj.account"
                             ahref="#"
                             name="Account ID"
                             permission="client_account.view_account"/>

                <static-data v-if="formObj.order"
                             :value="formObj.order"
                             ahref="#"
                             name="Order ID"
                             permission="client_order.view_order"/>

                <static-data v-if="formObj.product_profile"
                             :value="formObj.product_profile"
                             ahref="#"
                             name="Product Profile ID"
                             permission="client_product_profile.view_product_profile"/>
            </div>
        </div>
    </div>

    <div class="row my-3">
        <div class="col-auto">
            <button class="btn btn-primary"
                    type="button"
                    @click="refresh">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'sync']"/>
                    </span> Refresh Page
            </button>
        </div>

        <div class="col-auto">
            <button class="btn btn-danger"
                    type="button"
                    @click="retry">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'redo']"/>
                    </span> Retry Failed Queue
            </button>
        </div>
    </div>

    <div class="row">
        <search-grid :column-defs="columnDefs"
                     :form-arr="formArr"/>
    </div>
</template>

<script lang="ts">
import { SearchGrid, StaticData } from "@/components";
import { useAuth, useAdminNetworkQueue, useSearchGrid } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "TheProfile",
    components: {
        SearchGrid,
        StaticData
    },
    setup() {
        const { hasPermForm } = useAuth();

        const { getProfile, localNetworkQueue, retryQueue } = useAdminNetworkQueue();

        const route = useRoute();

        const { cellParams, cellQueueType, filterString } = useSearchGrid();

        const columnDefs = [
            {
                field: 'order_id',
                headerName: 'Order ID',
                filter: 'agNumberColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'name',
                headerName: 'Name',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'ipaddress',
                headerName: 'IP Address',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'status_name',
                headerName: 'Status',
                filter: 'agTextColumnFilter',
                filterParams: filterString(),
                cellStyle: cellQueueType
            }
        ];

        const formErrors = computed(() => {
            return localNetworkQueue.formErrors;
        });

        const formArr = computed(() => {
            return localNetworkQueue.formArr;
        });

        const formObj = computed(() => {
            return localNetworkQueue.formObj;
        });

        const formSuccess = computed(() => {
            return localNetworkQueue.formSuccess;
        });

        const queueId = route.params.id.toString();

        onMounted(() => {
            getProfile(queueId);

            hasPermForm('admin_network_queue.change_queuestatus');
        });

        return {
            cellParams,
            columnDefs,
            formErrors,
            formArr,
            formObj,
            formSuccess,
            getProfile,
            queueId,
            retryQueue
        };
    },
    methods: {
        async refresh() {
            await this.getProfile(this.queueId);
        },
        async retry() {
            await this.retryQueue(this.queueId);

            if (!this.formSuccess) {
                this.$emitter.emit('alert', {
                    display: true,
                    message: this.formErrors.queue_status,
                    type: 'danger'
                });
            } else {
                this.$emitter.emit('alert', {
                    display: true,
                    message: 'Queue has been updated.',
                    type: 'success'
                });
            }
        }
    }
});
</script>
