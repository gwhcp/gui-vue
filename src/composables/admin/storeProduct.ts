import { client } from "@/composables";
import { computed, ComputedRef, reactive } from "vue";

interface UseAdminStoreProductInterface {
    choices: ComputedRef<{
        company: Record<string, string>;
        ip_type: Record<string, string>;
        web: Record<string, string>;
    }>;
    getChoices: () => Promise<void>;
    getProductUrl: (value: string, route: string) => string;
}

export const useAdminStoreProduct = (): UseAdminStoreProductInterface => {
    const choices = computed(() => {
        return localStoreProduct.choices;
    });

    const getChoices = async () => {
        localStoreProduct.choices = await client.get(
            'admin/store/product/choices'
        );
    };

    const getProductUrl = (value: string, route: string) => {
        switch (value) {
            case 'domain':
                return `admin:store:product:${value}:${route}`;

            default:
                return 'home';
        }
    };

    const localStoreProduct = reactive({
        choices: {
            company: {},
            ip_type: {},
            web: {}
        }
    });

    return {
        choices,
        getChoices,
        getProductUrl
    };
};