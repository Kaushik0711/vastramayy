/**
 * Client-Side Demonstration Payment Adapter
 * 
 * IMPORTANT ARCHITECTURAL NOTICE:
 * This is an explicit client-side demonstration adapter for development, prototyping,
 * and design system validation. It simulates standard Indian payment methods:
 * - UPI (VPA & Dynamic QR code)
 * - Credit/Debit Cards with simulated 3D-Secure OTP
 * - NetBanking across major Indian scheduled banks
 * - Cash on Delivery (COD) with order value threshold validation
 * 
 * In production, this module is replaced with server-mediated Razorpay, Cashfree,
 * or Pine Labs SDKs. Real card details or financial secrets are never collected,
 * processed, or transmitted by this frontend application.
 */

import { PaymentMethod } from '../types';

export interface SimulatedPaymentRequest {
  orderId: string;
  amountInRupees: number;
  paymentMethod: PaymentMethod;
  upiId?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardHolderName?: string;
  bankCode?: string;
}

export interface SimulatedPaymentResponse {
  success: boolean;
  transactionId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: 'INR';
  timestamp: string;
  message: string;
  gatewayReference: string;
}

export const POPULAR_INDIAN_BANKS = [
  { code: 'HDFC', name: 'HDFC Bank', logo: '🏛️' },
  { code: 'SBI', name: 'State Bank of India', logo: '🏦' },
  { code: 'ICICI', name: 'ICICI Bank', logo: '💳' },
  { code: 'AXIS', name: 'Axis Bank', logo: '🏢' },
  { code: 'KOTAK', name: 'Kotak Mahindra Bank', logo: '🪙' },
  { code: 'PNB', name: 'Punjab National Bank', logo: '🏛️' },
  { code: 'BOB', name: 'Bank of Baroda', logo: '🏦' },
  { code: 'INDUS', name: 'IndusInd Bank', logo: '🏢' },
];

export const DEMO_TEST_CARDS = [
  { brand: 'RuPay Platinum', number: '6075 1234 5678 9010', expiry: '12/28', cvv: '123' },
  { brand: 'Visa Infinite', number: '4111 2222 3333 4444', expiry: '08/29', cvv: '456' },
  { brand: 'Mastercard World', number: '5555 4444 3333 2222', expiry: '10/27', cvv: '789' },
];

export const paymentAdapter = {
  /**
   * Validate if order is eligible for Cash on Delivery
   * (Standard luxury Indian couture policy: COD capped at ₹25,000)
   */
  isEligibleForCOD(amountInRupees: number): { eligible: boolean; reason?: string } {
    const MAX_COD_LIMIT = 25000;
    if (amountInRupees > MAX_COD_LIMIT) {
      return {
        eligible: false,
        reason: `Cash on Delivery is limited to orders up to ₹${MAX_COD_LIMIT.toLocaleString('en-IN')}. For high-value atelier pieces, please use UPI, NetBanking, or Card.`,
      };
    }
    return { eligible: true };
  },

  /**
   * Simulate payment processing with a realistic async latency
   */
  async processSimulatedPayment(
    request: SimulatedPaymentRequest
  ): Promise<SimulatedPaymentResponse> {
    // Artificial 1200ms latency to simulate payment gateway handshake
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Handle COD separately
    if (request.paymentMethod === 'cod') {
      const eligibility = this.isEligibleForCOD(request.amountInRupees);
      if (!eligibility.eligible) {
        throw new Error(eligibility.reason);
      }
      return {
        success: true,
        transactionId: `COD-VERIFIED-${Date.now().toString(36).toUpperCase()}`,
        paymentMethod: 'cod',
        amount: request.amountInRupees,
        currency: 'INR',
        timestamp: new Date().toISOString(),
        message: 'Order confirmed with Cash on Delivery. Verification code dispatched via SMS.',
        gatewayReference: `ATELIER-COD-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    }

    // Validation for UPI
    if (request.paymentMethod === 'upi') {
      if (request.upiId && !/^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,49}$/.test(request.upiId.trim())) {
        throw new Error('Please enter a valid UPI Virtual Payment Address (e.g. name@okhdfcbank)');
      }
    }

    // Validation for Card
    if (request.paymentMethod === 'credit_card') {
      const cleaned = (request.cardNumber || '').replace(/\s/g, '');
      if (cleaned.length < 15 || cleaned.length > 19) {
        throw new Error('Please enter a valid 16-digit card number.');
      }
      if (!request.cardExpiry || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(request.cardExpiry.trim())) {
        throw new Error('Please enter a valid expiry date (MM/YY).');
      }
      if (!request.cardCvv || request.cardCvv.length < 3) {
        throw new Error('Please enter a valid 3-digit CVV.');
      }
    }

    // Generate simulated banking transaction reference
    const txId = `TXN-DEMO-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      success: true,
      transactionId: txId,
      paymentMethod: request.paymentMethod,
      amount: request.amountInRupees,
      currency: 'INR',
      timestamp: new Date().toISOString(),
      message: 'Simulated payment authorized successfully.',
      gatewayReference: `GATEWAY-MOCK-${Math.floor(100000 + Math.random() * 900000)}`,
    };
  },
};
