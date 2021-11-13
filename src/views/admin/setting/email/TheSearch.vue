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

        <div v-if="cellSelected"
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

        <div v-if="cellSelected && hasPerm('admin_setting_email.delete_emailtemplate')"
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
import { useAdminSettingEmail, useAuth, useSearchGrid } from "@/composables";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearch",
    components: {
        ModalOpenDelete,
        SearchGrid
    },
    setup() {
        const { deleteEmailTemplate, formArr, formErrors, getSearch } = useAdminSettingEmail();

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

        onMounted(() => {
            getSearch();
        });

        return {
            cellParams,
            cellSelected,
            columnDefs,
            deleteEmailTemplate,
            formArr,
            formErrors,
            hasPerm
        };
    }
});
</script>