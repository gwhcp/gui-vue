import client from "@/composables/client";
import session from "@/composables/session";
import { useAuth } from "@/composables/auth";
import {
    useAdminBillingPayment,
    useAdminBillingReason,
    useAdminCompanyCompany,
    useAdminCompanyDns,
    useAdminCompanyDomain,
    useAdminCompanyMail,
    useAdminCompanyXmpp,
    useAdminCustomerAccount,
    useAdminEmployeeAccount,
    useAdminEmployeeMail,
    useAdminEmployeeManage,
    useAdminEmployeeXmpp,
    useAdminHardwareClient,
    useAdminHardwareCompany,
    useAdminNetworkPool,
    useAdminNetworkQueue,
    useAdminSettingBanned,
    useAdminSettingEmail,
    useAdminStoreFraud,
    useAdminStoreProduct,
    useAdminStoreProductDomain,
    useAdminStoreProductPrice
} from "@/composables/admin";
import { useClientAccount, useClientBilling, useClientStore } from "@/composables/client/index";
import { usePageLoading } from "@/composables/pageLoading";
import { useSearchGrid } from "@/composables/searchGrid";
import { useSidebar } from "@/composables/sidebar";

export {
    client,
    session,
    useAdminBillingPayment,
    useAdminBillingReason,
    useAdminCompanyCompany,
    useAdminCompanyDns,
    useAdminCompanyDomain,
    useAdminCompanyMail,
    useAdminCompanyXmpp,
    useAdminCustomerAccount,
    useAdminEmployeeAccount,
    useAdminEmployeeMail,
    useAdminEmployeeManage,
    useAdminEmployeeXmpp,
    useAdminHardwareClient,
    useAdminHardwareCompany,
    useAdminNetworkPool,
    useAdminNetworkQueue,
    useAdminSettingBanned,
    useAdminSettingEmail,
    useAdminStoreFraud,
    useAdminStoreProduct,
    useAdminStoreProductDomain,
    useAdminStoreProductPrice,
    useAuth,
    useClientAccount,
    useClientBilling,
    useClientStore,
    usePageLoading,
    useSearchGrid,
    useSidebar
};