import crypto from 'crypto';

export interface PaymentInitRequest {
  orderNumber: string;
  amountLkr: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
}

export interface PaymentInitResponse {
  mode: 'OFFLINE' | 'REDIRECT_GATEWAY' | 'NOT_CONFIGURED';
  message: string;
  gatewayUrl?: string;
  formFields?: Record<string, string>;
}

/**
 * Provider abstraction for Sri Lankan payment gateways (e.g., PayHere).
 * Never claims successful payment without verified gateway webhook confirmation.
 */
export function preparePayHereCheckout(req: PaymentInitRequest): PaymentInitResponse {
  const merchantId = process.env.PAYHERE_MERCHANT_ID;
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!merchantId || !merchantSecret) {
    return {
      mode: 'NOT_CONFIGURED',
      message:
        'Online card payment gateway is awaiting merchant credential activation. Your order has been saved securely; you may complete payment via Bank Transfer or Cash on Delivery.',
    };
  }

  const formattedAmount = req.amountLkr.toFixed(2);
  const currency = 'LKR';
  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();

  const hash = crypto
    .createHash('md5')
    .update(`${merchantId}${req.orderNumber}${formattedAmount}${currency}${hashedSecret}`)
    .digest('hex')
    .toUpperCase();

  const [firstName, ...rest] = req.customerName.trim().split(' ');
  const lastName = rest.join(' ') || 'Customer';

  const gatewayUrl =
    process.env.PAYHERE_SANDBOX === 'true'
      ? 'https://sandbox.payhere.lk/pay/checkout'
      : 'https://www.payhere.lk/pay/checkout';

  return {
    mode: 'REDIRECT_GATEWAY',
    message: 'Redirecting to PayHere Sri Lanka secure checkout...',
    gatewayUrl,
    formFields: {
      merchant_id: merchantId,
      return_url: `${siteUrl}/checkout/success?order=${req.orderNumber}`,
      cancel_url: `${siteUrl}/checkout?cancelled=1`,
      notify_url: `${siteUrl}/api/payments/payhere/webhook`,
      order_id: req.orderNumber,
      items: `Yasithma Products Order ${req.orderNumber}`,
      currency,
      amount: formattedAmount,
      first_name: firstName,
      last_name: lastName,
      email: req.customerEmail,
      phone: req.customerPhone,
      address: req.address,
      city: req.city,
      country: 'Sri Lanka',
      hash,
    },
  };
}

export function verifyPayHereWebhookSignature(params: {
  merchantId: string;
  orderId: string;
  payhereAmount: string;
  payhereCurrency: string;
  statusCode: string;
  md5sig: string;
}): boolean {
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  if (!merchantSecret) return false;

  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();

  const localSig = crypto
    .createHash('md5')
    .update(
      `${params.merchantId}${params.orderId}${params.payhereAmount}${params.payhereCurrency}${params.statusCode}${hashedSecret}`
    )
    .digest('hex')
    .toUpperCase();

  return localSig === params.md5sig.toUpperCase();
}
