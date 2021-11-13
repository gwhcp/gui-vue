<template>
    <nav class="nav nav-pills nav-justified mb-3">
        <a aria-current="page"
           class="nav-link active disabled"
           href="#">Profile</a>

        <router-link v-if="formObj.merchant"
                     :to="{ name: `admin:billing:payment:${formObj.merchant}:authentication`, params: { id: paymentId } }"
                     class="nav-link">Authentication
        </router-link>

        <router-link v-if="formObj.merchant"
                     :to="{ name: `admin:billing:payment:${formObj.merchant}:method`, params: { id: paymentId } }"
                     class="nav-link">Payment Method
        </router-link>
    </nav>

    <div class="row">
        <div class="col-lg-6">
            <div class="card card-body">
                <static-data :value="formObj.id"
                             name="Payment Gateway ID"/>

                <static-data :datetime="formObj.date_from"
                             name="Created Date"/>

                <static-data :value="formObj.company"
                             name="Company"/>

                <static-data :value="formObj.merchant_name"
                             name="Merchant"/>

                <static-data :value="formObj.payment_method_name"
                             name="Payment Method"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { StaticData } from "@/components";
import { useAdminBillingPayment } from "@/composables";
import { defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "TheProfile",
    components: {
        StaticData
    },
    setup() {
        const { formObj, getProfile } = useAdminBillingPayment();

        const route = useRoute();

        const paymentId = route.params.id.toString();

        onMounted(() => {
            getProfile(paymentId);
        });

        return {
            formObj,
            paymentId
        };
    }
});
</script>
