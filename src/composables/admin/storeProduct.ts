import { client } from "@/composables";
import { reactive } from "vue";

interface UseAdminStoreProductInterface {
    getChoices: () => Promise<void>;
    getProductUrl: (value: string, route: string) => string;
    localStoreProduct: {
        choices: Record<string, unknown>;
    };
}

export const useAdminStoreProduct = (): UseAdminStoreProductInterface => {
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
        choices: {}
    });

    return {
        getChoices,
        getProductUrl,
        localStoreProduct
    };
};