<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <router-link :to="{ name: 'admin:company:dns:profile', params: { id: domainId } }"
                     class="nav-link">Profile
        </router-link>

        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Records</a>

        <router-link :to="{ name: 'admin:company:dns:ns', params: { id: domainId } }"
                     class="nav-link">Nameserver
        </router-link>
    </nav>

    <div class="row mb-3">
        <div class="col-auto">
            <router-link :to="{ name: 'admin:company:dns:create' }">
                <button class="btn btn-success"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-plus']"/>
                    </span> Create
                </button>
            </router-link>
        </div>

        <div v-if="cellSelected && hasPerm('admin_company_dns.delete_dnszone')"
             class="col-auto">
            <modal-open-delete :delete="deleteRecord"
                               :form-arr="formArr"
                               :params="{ id: cellParams['id'], domain: domainId }"
                               message-alert="Continuing will remove this record."
                               message-success="DNS record has been removed."/>
        </div>
    </div>

    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"
                 :rowData="filterDnsResults(formArr)"/>
</template>

<script lang="ts">
import { ModalOpenDelete, SearchGrid } from "@/components";
import { useAdminCompanyDns, useAuth, useSearchGrid } from "@/composables";
import { defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "TheSearch",
    components: {
        ModalOpenDelete,
        SearchGrid
    },
    setup() {
        const { deleteRecord, formArr, getSearchRecord } = useAdminCompanyDns();

        const { hasPerm } = useAuth();

        const { cellParams, cellSelected, filterDnsResults, filterString } = useSearchGrid();

        const route = useRoute();

        const domainId = route.params.id.toString();

        const columnDefs = [
            {
                field: 'host',
                checkboxSelection: true,
                headerName: 'Host',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'record_type',
                headerName: 'Type',
                filter: 'agTextColumnFilter',
                filterParams: filterString(),
                valueGetter: function (params: { data: { record_type: string; mx_priority: string; }; }) {
                    return (params.data.record_type === 'MX' ? params.data.record_type + ' ' + params.data.mx_priority : params.data.record_type)
                }
            },
            {
                field: 'data',
                headerName: 'Data',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            }
        ];

        onMounted(() => {
            getSearchRecord(domainId);
        });

        return {
            cellParams,
            cellSelected,
            columnDefs,
            deleteRecord,
            domainId,
            filterDnsResults,
            formArr,
            hasPerm
        };
    }
});
</script>