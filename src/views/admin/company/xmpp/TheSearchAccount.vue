<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Search Accounts</a>

        <router-link :to="{ name: 'admin:company:xmpp:search:group' }"
                     class="nav-link">Search Groups
        </router-link>
    </nav>

    <div class="row mb-3">
        <div v-if="hasPerm('admin_company_xmpp.add_prosodyaccount')"
             class="col-auto">
            <router-link :to="{ name: 'admin:company:xmpp:create' }">
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
            <router-link :to="{ name: 'admin:company:xmpp:profile', params: { id: cellParams['id'] } }">
                <button class="btn btn-primary"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-edit']"/>
                    </span> Edit
                </button>
            </router-link>
        </div>

        <div v-if="selected && hasPerm('admin_company_xmpp.delete_prosodyaccount')"
             class="col-auto">
            <modal-open-delete :delete="deleteAccount"
                               :form-arr="formArr"
                               :params="{ id: cellParams['id'] }"
                               message-alert="Continuing will remove this xmpp account."
                               message-success="XMPP account has been removed."/>
        </div>
    </div>

    <search-grid :column-defs="columnDefs"
                 :form-arr="formArr"/>
</template>

<script lang="ts">
import { ModalOpenDelete, SearchGrid } from "@/components";
import { useAuth, useAdminCompanyXmpp, useSearchGrid } from "@/composables";
import { computed, defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "TheSearchAccount",
    components: {
        ModalOpenDelete,
        SearchGrid
    },
    setup() {
        const { hasPerm } = useAuth();

        const { deleteAccount, getSearchAccount, localCompanyXmpp } = useAdminCompanyXmpp();

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
                field: 'group_name',
                headerName: 'Group',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            },
            {
                field: 'server_name',
                headerName: 'Server',
                filter: 'agTextColumnFilter',
                filterParams: filterString()
            }
        ];

        const formArr = computed(() => {
            return localCompanyXmpp.formArr;
        });

        const selected = computed(() => {
            return globalGrid.selected;
        });

        onMounted(() => {
            getSearchAccount();
        });

        return {
            cellParams,
            columnDefs,
            deleteAccount,
            formArr,
            hasPerm,
            selected
        };
    }
});
</script>