<template>
    <button class="btn btn-info"
            data-bs-target="#installModal"
            data-bs-toggle="modal"
            type="button">
        <span class="pe-2">
            <font-awesome-icon :icon="['fas', 'hammer']"/>
        </span> Install
    </button>

    <div id="installModal"
         aria-hidden="true"
         aria-labelledby="installModalLabel"
         class="modal fade"
         tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="installModalLabel"
                        class="modal-title">
                        <span class="pe-2">
                            <font-awesome-icon :icon="['fas', 'exclamation-triangle']"
                                               class="text-danger"/>
                        </span> Warning
                    </h5>

                    <button aria-label="Close"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            type="button"/>
                </div>

                <div class="modal-body">
                    {{ messageAlert }}
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary"
                            data-bs-dismiss="modal"
                            type="button">
                        <span class="pe-2">
                            <font-awesome-icon :icon="['fas', 'window-close']"/>
                        </span> Cancel
                    </button>

                    <button class="btn btn-info"
                            data-bs-dismiss="modal"
                            type="button"
                            @click="modalInstall();">
                        <span class="pe-2">
                            <font-awesome-icon :icon="['fas', 'hammer']"/>
                        </span> Install
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "ModalOpenInstall",
    props: {
        install: {
            type: Function,
            required: true
        },
        messageAlert: {
            type: String,
            required: true
        },
        messageError: {
            type: String,
            required: false,
        },
        messageSuccess: {
            type: String,
            required: true
        },
        params: {
            type: Object,
            required: false
        }
    },
    methods: {
        modalInstall() {
            this.install(this.params)
                .then(() => {
                    //if (this.installSuccess === true) {
                        this.$emitter.emit('alert', {
                            display: true,
                            message: this.messageSuccess,
                            type: 'success'
                        });
                    //}
                },)
                .then(() => {
                    //if (this.installWarning === true) {
                        this.$emitter.emit('alert', {
                            display: true,
                            message: this.messageError,
                            type: 'info'
                        });
                    //}
                });
        }
    }
});
</script>