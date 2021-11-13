import { computed, ComputedRef, reactive } from "vue";
import { useAuth } from "@/composables/auth";
import moment from "moment-timezone";

interface UseSearchGridInterface {
    cellInvoiceType: (params: string) => object;
    cellParams: ComputedRef<Record<string, unknown>>;
    cellSelected: ComputedRef<boolean>;
    cellQueueStatus: (params: string) => object;
    cellQueueType: (params: string) => object;
    cellStatus: (params: string) => object;
    cellTransactionType: (params: string) => object;
    filterDate: () => {
        comparator: (filterLocalDateAtMidnight: never, cellValue: never) => (number | unknown);
        buttons: string[];
    };
    filterDnsResults: (params: string[]) => string[];
    filterString: () => {
        buttons: string[];
    };
    formatDate: (params: string) => string;
    formatInvoiceType: (params: string) => string;
    formatQueueStatus: (params: string) => string;
    formatStatus: (params: string) => string;
    formatTransactionType: (params: string) => string;
    selectionClear: () => void;
    selectionUpdate: (selectedRow: string[]) => void;
}

const globalSearchGrid = reactive({
    cellParams: {},
    cellSelected: false
});

export const useSearchGrid = (): UseSearchGridInterface => {
    const cellInvoiceType = (params: any) => {
        if (params.value == 'charge') {
            return { color: '#198754' };
        } else if (params.value == 'debit') {
            return { color: '#DC3545' };
        } else if (params.value == 'refund') {
            return { color: '#0D6EFD' };
        } else {
            return { color: '#FFC107' };
        }
    };

    const cellParams = computed(() => {
        return globalSearchGrid.cellParams;
    });

    const cellSelected = computed(() => {
        return globalSearchGrid.cellSelected;
    });

    const cellQueueStatus = (params: any) => {
        if (!params.data.in_queue) {
            return (params.value ? { color: '#198754' } : { color: '#DC3545' });
        } else {
            return { color: '#FFA500' };
        }
    };

    const cellQueueType = (params: any) => {
        switch (params.value.toLowerCase()) {
            case 'active':
                return { color: '#198754' };
            case 'failed':
                return { color: '#DC3545' };
            case 'pending':
                return { color: '#0dcaf0' };
            case 'pending_failed':
                return { color: '#ffc107' };
            case 'working':
                return { color: '#6c757d' };
            default:
                return { color: '#000000' };
        }
    };

    const cellStatus = (params: any) => {
        return (params.value ? { color: '#198754' } : { color: '#DC3545' });
    };

    const cellTransactionType = (params: any) => {
        if (params.value == 'auth_capture') {
            return { color: '#198754' };
        } else if (params.value == 'auth_only') {
            return { color: '#DC3545' };
        } else if (params.value == 'refund') {
            return { color: '#0D6EFD' };
        } else {
            return { color: '#FFC107' };
        }
    };

    const filterDate = () => {
        return {
            comparator: function (filterLocalDateAtMidnight: any, cellValue: any) {
                const dateAsString = cellValue.substring(0, 10);

                if (dateAsString == null) return -1;

                const dateParts = dateAsString.split('-');

                const cellDate = new Date(
                    Number(dateParts[0]),
                    Number(dateParts[1]) - 1,
                    Number(dateParts[2])
                );

                if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                    return 0;
                }

                if (cellDate < filterLocalDateAtMidnight) {
                    return -1;
                }

                if (cellDate > filterLocalDateAtMidnight) {
                    return 1;
                }
            },
            buttons: [
                'apply',
                'reset'
            ]
        };
    };

    const filterString = () => {
        return {
            buttons: [
                'apply',
                'reset'
            ]
        }
    };

    const formatDate = (params: any) => {
        const { globalAuth } = useAuth();

        const accountProfile = computed(() => {
            return JSON.parse(globalAuth.accountProfile);
        });

        function convertDate(value: string) {
            if (accountProfile.value.time_format === 12) {
                return moment
                    .tz(value, accountProfile.value.time_zone)
                    .format('YYYY-MM-DD h:mm:ss A');
            } else {
                return moment
                    .tz(value, accountProfile.value.time_zone)
                    .format('YYYY-MM-DD H:mm:ss');
            }
        }

        return convertDate(params.value);
    };

    const filterDnsResults = (params: string[]) => {
        return params.filter(function (element: any) {
            return element['is_custom'] === true;
        });
    };

    const formatInvoiceType = (params: any) => {
        if (params.value === 'charge') {
            return 'Charge';
        } else if (params.value == 'debit') {
            return 'Debit';
        } else if (params.value == 'refund') {
            return 'Refund';
        } else {
            return 'Void';
        }
    };

    const formatQueueStatus = (params: any) => {
        if (!params.data.in_queue) {
            return (params.value ? 'Enabled' : 'Disabled');
        } else {
            return 'Pending Queue';
        }
    };

    const formatStatus = (params: any) => {
        return (params.value ? 'Active' : 'Suspended');
    };

    const formatTransactionType = (params: any) => {
        if (params.value === 'auth_capture') {
            return 'Authorize & Capture';
        } else if (params.value == 'auth_only') {
            return 'Authorize Only';
        } else if (params.value == 'refund') {
            return 'Refund';
        } else {
            return 'Void';
        }
    };

    const selectionClear = () => {
        globalSearchGrid.cellParams = [];

        globalSearchGrid.cellSelected = false;
    }

    const selectionUpdate = (selectedRow: string[]) => {
        if (selectedRow.length === 1) {
            globalSearchGrid.cellSelected = true;

            globalSearchGrid.cellParams = selectedRow[0];
        } else {
            globalSearchGrid.cellParams = [];

            globalSearchGrid.cellSelected = false;
        }
    }

    return {
        cellInvoiceType,
        cellParams,
        cellSelected,
        cellQueueStatus,
        cellQueueType,
        cellStatus,
        cellTransactionType,
        filterDate,
        filterDnsResults,
        filterString,
        formatDate,
        formatInvoiceType,
        formatQueueStatus,
        formatStatus,
        formatTransactionType,
        selectionClear,
        selectionUpdate
    };
};