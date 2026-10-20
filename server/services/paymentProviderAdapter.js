// Provider-neutral contract. Never accept or log PAN, CVV, or raw wallet tokens here.
// Implement with a PCI-compliant provider SDK, hosted fields, verified callbacks,
// webhook signature validation, idempotency keys, and secure token storage.
export class PaymentProviderNotConfigured extends Error {
 constructor(){super('Payment provider not configured. No payment was processed.');this.status=503;}
}
export const paymentProvider = {
 async createCardSession(_args){throw new PaymentProviderNotConfigured();},
 async createWalletSession(_args){throw new PaymentProviderNotConfigured();},
 async verifyPayment(_args){throw new PaymentProviderNotConfigured();},
 async cancelRecurring(_args){throw new PaymentProviderNotConfigured();},
 async changeRecurringPlan(_args){throw new PaymentProviderNotConfigured();},
 async refund(_args){throw new PaymentProviderNotConfigured();},
};
