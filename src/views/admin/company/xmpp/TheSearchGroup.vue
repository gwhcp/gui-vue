<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <router-link :to="{ name: 'admin:company:xmpp:search' }"
                     class="nav-link">Search Accounts
        </router-link>

        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Search Groups</a>
    </nav>

    <div v-if="nonFieldFormError"
         class="alert alert-info d-flex align-items-center"
         role="alert">
        <svg aria-label="Info:"
             class="bi flex-shrink-0 me-2"
             height="24"
             role="img"
             width="24">
            <use xlink:href="#info-fill"/>
        </svg>

        <div>
            {{ nonFieldFormMessage }}
        </div>
    </div>

    <div class="row mb-3">
        <div v-if="hasPerm('admin_company_xmpp.add_prosodyaccount')"
             class="col-auto">
            <router-link :to="{ name: 'admin:company:xmpp:create:group' }">
                <button class="btn btn-success"
                        type="button">
                    <span class="pe-2">
                        <font-awesome-icon :icon="['fas', 'user-plus']"/>
                    </span> Create
                </button>
            </router-link>
        </div>

        <div v-if="cellSelected && hasPerm('admin_company_xmpp.delete_prosodyaccount')"
             class="col-auto">
            <modal-open-delete :delete="deleteGroup"
                               :form-arr="formArr"
                               :params="{ id: cellParams['id'] }"
                               message-alert="Continuing will remove this xmpp group."
                               message-success="XMPP group has been removed."/>
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
    name: "TheSearchGroup",
    components: {
        ModalOpenDelete,
        SearchGrid
    },
    setup() {
        const { hasPerm } = useAuth();

        const { deleteGroup, getSearchGroup, localCompanyXmpp } = useAdminCompanyXmpp();

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

        const formArr = computed(() => {
            return localCompanyXmpp.formArr;
        });

        const nonFieldFormError = computed(() => {
            return localCompanyXmpp.nonFieldFormError;
        });

        const nonFieldFormMessage = computed(() => {
            return localCompanyXmpp.nonFieldFormMessage;
        });

        onMounted(() => {
            getSearchGroup();
        });

        return {
            cellParams,
            cellSelected,
            columnDefs,
            deleteGroup,
            formArr,
            hasPerm,
            nonFieldFormError,
            nonFieldFormMessage
        };
    }
});
</script>