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

        <div v-if="selected"
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

        <div v-if="selected && hasPerm('admin_company_domain.delete_domain')"
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
import { useAuth, useAdminCompanyDomain, useSearchGrid } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearch",
    components: {
        ModalOpenDelete,
        SearchGrid
    },
    setup() {
        const { hasPerm } = useAuth();

        const { deleteDomain, getSearch, localCompanyDomain } = useAdminCompanyDomain();

        const { filterString, globalGrid } = useSearchGrid();

        const cellParams = computed(() => {
            return globalGrid.cellParams;
        });

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

        const formArr = computed(() => {
            return localCompanyDomain.formArr;
        });

        const selected = computed(() => {
            return globalGrid.selected;
        });

        onMounted(() => {
            getSearch();
        });

        return {
            cellParams,
            columnDefs,
            deleteDomain,
            formArr,
            hasPerm,
            selected
        };
    }
});
</script>