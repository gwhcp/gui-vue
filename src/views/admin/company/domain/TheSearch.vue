<template>
    <div class="row mb-3">
        <div v-if="hasPerm('admin_company_domain.add_domain')"
             class="col-auto">
            <router-link :to="{ name: 'admin:company:domain:create' }">
                <button class="btn btn-success"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-plus']"/>
                    </span> Create
                </button>
            </router-link>
        </div>

        <div v-if="cellSelected"
             class="col-auto">
            <router-link :to="{ name: 'admin:company:domain:profile', params: { id: cellParams['id'] } }">
                <button class="btn btn-primary"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-edit']"/>
                    </span> Edit
                </button>
            </router-link>
        </div>

        <div v-if="cellSelected && hasPerm('admin_company_domain.delete_domain')"
             class="col-auto">
            <modal-open-delete :delete="deleteDomain"
                               :form-arr="formArr"
                               :params="{ id: cellParams['id'] }"
                               message-alert="Continuing will remove this domain."
                               message-success="Domain has been removed."/>
        </div>
    </div>

    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"/>
</template>

<script lang="ts">
import { ModalOpenDelete, SearchGrid } from "@/components"
import { useAdminCompanyDomain, useAuth, useSearchGrid } from "@/composables";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearch",
    components: {
        ModalOpenDelete,
        SearchGrid
    },
    setup() {
        const { deleteDomain, formArr, getSearch } = useAdminCompanyDomain();

        const { hasPerm } = useAuth();

        const { cellParams, cellSelected, filterString } = useSearchGrid();

        const columnDefs = [
            {
                field: 'id',
                checkboxSelection: true,
                headerName: 'ID',
                filter: 'agNumberColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'name',
                headerName: 'Name',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            }
        ];

        onMounted(() => {
            getSearch();
        });

        return {
            cellParams,
            cellSelected,
            columnDefs,
            deleteDomain,
            formArr,
            hasPerm
        };
    }
});
</script>