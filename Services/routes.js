// Define base URLs for different environments
const BASE_URLS = {
    production: 'https://api.safaricom.co.ke',
    sandbox: 'https://sandbox.safaricom.co.ke'
};

// Define various API endpoints
const ENDPOINTS = {
    oauth: '/oauth/v1/generate?grant_type=client_credentials',
    b2c: '/mpesa/b2c/v1/paymentrequest',
    b2b: '/mpesa/b2b/v1/paymentrequest',
    c2bRegister: '/mpesa/c2b/v1/registerurl',
    c2bSimulate: '/mpesa/c2b/v1/simulate',
    accountBalance: '/mpesa/accountbalance/v1/query',
    transactionStatus: '/mpesa/transactionstatus/v1/query',
    reversal: '/mpesa/reversal/v1/request',
    stkPush: '/mpesa/stkpush/v1/processrequest',
    stkQuery: '/mpesa/stkpushquery/v1/query',
    billManagerOnboarding:"/v1/billmanager-invoice/optin",
    billManagerOnboardingUpdate:"/v1/billmanager-invoice/change-optin-details",
    billManagerSingleInvoice:"/v1/billmanager-invoice/single-invoicing",
    billManagerReconciliation:"/v1/billmanager-invoice/reconciliation",
    billManagerBulkInvoice:"/v1/billmanager-invoice/bulk-invoicing",
    cancelSingleInvoice:"/v1/billmanager-invoice/cancel-single-invoice",
    cancelBulkInvoices:"/v1/billmanager-invoice/reconciliation"
};

// Export the combined routes
export const routes = {
    ...BASE_URLS,
    ...ENDPOINTS
};
