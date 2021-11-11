/* eslint-disable */
// noinspection JSUnusedGlobalSymbols

declare module '*.vue' {
    import type { DefineComponent } from 'vue';

    const component: DefineComponent<{}, {}, any>;

    export default component;

    declare module '@vue/runtime-core' {
        import type { Emitter } from "mitt";

        export interface ComponentCustomProperties {
            $emitter: Emitter;
        }
    }
}

declare module '@ckeditor/ckeditor5-build-classic';
declare module '@ckeditor/ckeditor5-vue';
declare module 'vue-multiselect';
declare module 'vue3-country-region-select';
