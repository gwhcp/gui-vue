<template>
    <div class="row mb-3 d-print-none">
        <div v-if="hasPerm('admin_setting_banned.add_banned')"
             class="col-auto">
            <router-link :to="{ name: 'admin:setting:banned:create' }">
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
            <router-link :to="{ name: 'admin:setting:banned:profile', params: { id: cellParams['id'] } }">
                <button class="btn btn-primary"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-edit']"/>
                    </span> Edit
                </button>
            </router-link>
        </div>

        <div v-if="selected && hasPerm('admin_setting_banned.delete_banned')"
             class="col-auto">
            <modal-open-delete :delete="deleteBanned"
                               :form-arr="formArr"
                               :params="{ id: cellParams['id'] }"
                               message-alert="Continuing will remove this banned item."
                               message-success="Banned item has been removed."/>
        </div>
    </div>

    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"/>
</template>

<script lang="ts">
import { ModalOpenDelete, SearchGrid } from "@/components";
import { useAuth, useSearchGrid, useAdminSettingBanned } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearch",
    components: {
        ModalOpenDelete,
        SearchGrid
    },
    setup() {
        const { hasPerm } = useAuth();

        const { deleteBanned, getSearch, localSettingBanned } = useAdminSettingBanned();

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
            },
            {
                field: 'banned_type_name',
                headerName: 'Type',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            }
        ];

        const formArr = computed(() => {
            return localSettingBanned.formArr;
        });

        const formErrors = computed(() => {
            return localSettingBanned.formErrors;
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
            deleteBanned,
            formArr,
            formErrors,
            hasPerm,
            selected
        };
    }
});
</script>