<template>
    <div class="row mb-3">
        <div v-if="hasPerm('admin_setting_email.add_emailtemplate')"
             class="col-auto">
            <router-link :to="{ name: 'admin:setting:email:create' }">
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
            <router-link :to="{ name: 'admin:setting:email:profile', params: { id: cellParams['id'] } }">
                <button class="btn btn-primary"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-edit']"/>
                    </span> Edit
                </button>
            </router-link>
        </div>

        <div v-if="selected && hasPerm('admin_setting_email.delete_emailtemplate')"
             class="col-auto">
            <modal-open-delete :delete="deleteEmailTemplate"
                               :form-arr="formArr"
                               :params="{ id: cellParams['id'] }"
                               message-alert="Continuing will remove this email template."
                               message-success="Email template has been removed."/>
        </div>
    </div>

    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"/>
</template>

<script lang="ts">
import { ModalOpenDelete, SearchGrid } from "@/components";
import { useAuth, useSearchGrid, useAdminSettingEmail } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearch",
    components: {
        ModalOpenDelete,
        SearchGrid
    },
    setup() {
        const { hasPerm } = useAuth();

        const { deleteEmailTemplate, getSearch, localSettingEmail } = useAdminSettingEmail();

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
                field: 'subject',
                headerName: 'Subject',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'template_name',
                headerName: 'Template',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            }
        ];

        const formArr = computed(() => {
            return localSettingEmail.formArr;
        });

        const formErrors = computed(() => {
            return localSettingEmail.formErrors;
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
            deleteEmailTemplate,
            formArr,
            formErrors,
            hasPerm,
            selected
        };
    }
});
</script>