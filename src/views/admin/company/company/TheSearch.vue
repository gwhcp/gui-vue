<template>
    <div class="row mb-3">
        <div v-if="hasPerm('admin_company_company.add_company')"
             class="col-auto">
            <router-link :to="{ name: 'admin:company:company:create' }">
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
            <router-link :to="{ name: 'admin:company:company:profile', params: { id: cellParams['id'] } }">
                <button class="btn btn-primary"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-edit']"/>
                    </span> Edit
                </button>
            </router-link>
        </div>

        <div v-if="selected && hasPerm('admin_company_company.delete_company')"
             class="col-auto">
            <modal-open-delete :delete="deleteCompany"
                               :form-arr="formArr"
                               :params="{ id: cellParams['id'] }"
                               message-alert="Continuing will remove this company."
                               message-success="Company has been removed."/>
        </div>
    </div>

    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"/>
</template>

<script lang="ts">
import { ModalOpenDelete, SearchGrid } from "@/components";
import { useAuth, useAdminCompanyCompany, useSearchGrid } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearch",
    components: {
        ModalOpenDelete,
        SearchGrid
    },
    setup() {
        const { hasPerm } = useAuth();

        const { deleteCompany, getSearch, localCompanyCompany } = useAdminCompanyCompany();

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
            return localCompanyCompany.formArr;
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
            deleteCompany,
            formArr,
            hasPerm,
            selected
        };
    }
});
</script>